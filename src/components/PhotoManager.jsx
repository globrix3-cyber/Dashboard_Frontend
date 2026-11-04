/* ─────────────────────────────────────────────────────────────────────────────
   PhotoManager — product photo gallery for the listing form.
   Photos are shrunk in the browser, uploaded straight to Cloudinary with a
   single-use signature from our API (3 at a time), and can be reordered,
   set as main, retried or removed. The parent only sees finished photos:
   onChange([{ image_url, alt_text }]) in display order; onBusyChange(bool).
───────────────────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, RotateCw, Star, X, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { imageProps } from '../utils/helpers';
import { compressImage, uploadToCloudinary } from '../utils/imageUpload';

const MAX_PHOTOS     = 10;
const MAX_BYTES      = 8 * 1024 * 1024;        // checked on the original, before compression
const MAX_PARALLEL   = 3;
const SIG_MAX_AGE_MS = 50 * 60 * 1000;
const ACCEPT         = 'image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif';
const BUSY           = new Set(['queued', 'compressing', 'uploading']);

const isImage = f => /^image\/(jpeg|png|webp|heic|heif)$/.test(f.type) || /\.(heic|heif)$/i.test(f.name || '');
const isHeic  = f => /^image\/hei[cf]$/i.test(f.type) || /\.hei[cf]$/i.test(f.name || '');

let seq = 0;
const newKey = () => `p${++seq}`;

export default function PhotoManager({ value = [], onChange, onBusyChange }) {
  const [items, setItems]       = useState([]);   // [{ key, url, thumb, alt, status, progress, error, broken }]
  const [dragOver, setDragOver] = useState(false);
  const [dragKey, setDragKey]   = useState(null);
  const inputRef = useRef(null);
  const jobs     = useRef(new Map());              // key → { file, abort, sig: { promise, at } }
  const itemsRef = useRef(items);
  const seeded   = useRef(false);
  itemsRef.current = items;

  // Seed once from saved photos (edit mode loads them asynchronously).
  useEffect(() => {
    if (seeded.current) return;
    const saved = (value || []).filter(v => v.image_url);
    if (!saved.length) return;
    seeded.current = true;
    setItems(saved.map(v => ({ key: newKey(), url: v.image_url, alt: v.alt_text || '', status: 'done', progress: 100 })));
  }, [value]);

  // Report finished photos (in order) and whether anything is still uploading.
  const onChangeRef = useRef(onChange);
  const onBusyRef   = useRef(onBusyChange);
  useEffect(() => { onChangeRef.current = onChange; onBusyRef.current = onBusyChange; });
  useEffect(() => {
    if (!seeded.current && !items.length) return;
    onChangeRef.current?.(items.filter(i => i.status === 'done' && i.url).map(i => ({ image_url: i.url, alt_text: i.alt || '' })));
    onBusyRef.current?.(items.some(i => BUSY.has(i.status)));
  }, [items]);

  const patch = (key, p) => setItems(list => list.map(i => (i.key === key ? { ...i, ...p } : i)));

  const signature = (key) => {
    const job = jobs.current.get(key);
    if (job.sig && Date.now() - job.sig.at < SIG_MAX_AGE_MS) return job.sig.promise;
    const sig = { promise: api.getUploadSignature(isHeic(job.file) ? { heic: true } : {}), at: Date.now() };
    sig.promise.catch(() => { if (job.sig === sig) job.sig = null; });
    job.sig = sig;
    return sig.promise;
  };

  const pump = () => {
    const list = itemsRef.current;
    let active = list.filter(i => i.status === 'compressing' || i.status === 'uploading').length;
    for (const it of list) {
      if (active >= MAX_PARALLEL) break;
      if (it.status === 'queued' && jobs.current.has(it.key)) { active += 1; run(it.key); }
    }
  };

  const run = async (key) => {
    const job = jobs.current.get(key);
    if (!job) return;
    itemsRef.current = itemsRef.current.map(i => (i.key === key ? { ...i, status: 'compressing' } : i)); // counted by pump() at once
    patch(key, { status: 'compressing', progress: 0, error: '' });
    try {
      const [sig, file] = await Promise.all([signature(key), compressImage(job.file)]);
      if (!jobs.current.has(key)) return;
      patch(key, { status: 'uploading' });
      const { promise, abort } = uploadToCloudinary(file, sig, p => patch(key, { progress: p }));
      job.abort = abort;
      const url = await promise;
      job.abort = null;
      if (!jobs.current.has(key)) return;
      jobs.current.delete(key);
      setItems(list => list.map(i => {
        if (i.key !== key) return i;
        if (i.thumb) URL.revokeObjectURL(i.thumb);
        return { ...i, url, thumb: null, status: 'done', progress: 100 };
      }));
    } catch (err) {
      job.abort = null;
      if (jobs.current.has(key) && !err?.aborted) patch(key, { status: 'failed', error: err?.message || 'Upload failed' });
    } finally {
      setTimeout(pump, 0);
    }
  };

  useEffect(() => { pump(); }); // start queued uploads after each render

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (inputRef.current) inputRef.current.value = '';
    if (!files.length) return;
    const bad  = files.filter(f => !isImage(f));
    const big  = files.filter(f => isImage(f) && f.size > MAX_BYTES);
    if (bad.length) toast.error(`${bad.length} file(s) skipped: only JPG, PNG, WEBP or HEIC photos`);
    if (big.length) toast.error(`${big.length} file(s) skipped: each photo must be 8 MB or smaller`);
    const room = MAX_PHOTOS - itemsRef.current.length;
    const good = files.filter(f => isImage(f) && f.size <= MAX_BYTES);
    if (good.length > room) toast.info(room > 0 ? `Only ${room} more photo${room === 1 ? '' : 's'} fit (max ${MAX_PHOTOS}).` : `You can add up to ${MAX_PHOTOS} photos.`);
    const take = good.slice(0, Math.max(0, room));
    if (!take.length) return;
    seeded.current = true;
    const added = take.map(file => {
      const key = newKey();
      jobs.current.set(key, { file, abort: null, sig: null });
      return { key, url: '', thumb: isHeic(file) ? null : URL.createObjectURL(file), alt: '', name: file.name, status: 'queued', progress: 0 };
    });
    setItems(list => [...list, ...added]);
  };

  const remove = (key) => {
    const job = jobs.current.get(key);
    job?.abort?.();
    jobs.current.delete(key);
    setItems(list => list.filter(i => {
      if (i.key === key && i.thumb) URL.revokeObjectURL(i.thumb);
      return i.key !== key;
    }));
  };
  const retry  = (key) => { if (jobs.current.has(key)) patch(key, { status: 'queued', progress: 0, error: '' }); };
  const move   = (from, to) => setItems(list => {
    if (to < 0 || to >= list.length || from === to) return list;
    const next = [...list];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    return next;
  });

  // Paste photos with Ctrl/Cmd+V anywhere on the page while this step is open.
  useEffect(() => {
    const onPaste = (e) => {
      const files = [...(e.clipboardData?.files || [])].filter(f => f.type.startsWith('image/'));
      if (files.length) { e.preventDefault(); addFiles(files); }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  });

  // Abort uploads and free previews when leaving the form.
  useEffect(() => () => {
    jobs.current.forEach(j => j.abort?.());
    jobs.current.clear();
    itemsRef.current.forEach(i => i.thumb && URL.revokeObjectURL(i.thumb));
  }, []);

  const full = items.length >= MAX_PHOTOS;

  return (
    <div
      onDragOver={e => { if (e.dataTransfer?.types?.includes('Files')) { e.preventDefault(); setDragOver(true); } }}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false); }}
      onDrop={e => { if (e.dataTransfer?.files?.length) { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); } }}
      style={{ borderRadius: 14, padding: 12, margin: -12, outline: dragOver ? '2px dashed #C8792C' : 'none', background: dragOver ? '#F0DCC0' : 'transparent', transition: 'background .15s' }}
    >
      <input ref={inputRef} type="file" accept={ACCEPT} multiple hidden onChange={e => addFiles(e.target.files)} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        {items.map((it, i) => (
          <PhotoTile key={it.key} item={it} index={i} count={items.length}
            dragging={dragKey === it.key}
            onDragStart={() => setDragKey(it.key)}
            onDragEnd={() => setDragKey(null)}
            onDropOn={() => { const from = items.findIndex(x => x.key === dragKey); if (from !== -1) move(from, i); setDragKey(null); }}
            onMove={to => move(i, to)} onMain={() => move(i, 0)}
            onRemove={() => remove(it.key)} onRetry={() => retry(it.key)}
            onBroken={() => patch(it.key, { broken: true })} />
        ))}

        {!full && (
          <button type="button" onClick={() => inputRef.current?.click()}
            style={{
              aspectRatio: '1 / 1', borderRadius: 12, border: '2px dashed #E3D5C1', background: '#FDF9F1', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10,
              color: '#5B4632', fontFamily: 'inherit', textAlign: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8792C'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E3D5C1'; }}>
            <ImagePlus size={28} color="#C8792C" />
            <span style={{ fontSize: 14, fontWeight: 700 }}>{items.length ? 'Add more photos' : 'Add photos'}</span>
            <span style={{ fontSize: 11, color: '#79634E' }}>Click, drag here or paste</span>
          </button>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: '#79634E', lineHeight: 1.6 }}>
        {items.length}/{MAX_PHOTOS} photos · JPG, PNG, WEBP or iPhone HEIC up to 8 MB · The first photo is the main one — drag photos or use the arrows to reorder.
      </div>
    </div>
  );
}

function PhotoTile({ item, index, count, dragging, onDragStart, onDragEnd, onDropOn, onMove, onMain, onRemove, onRetry, onBroken }) {
  const busy   = BUSY.has(item.status);
  const failed = item.status === 'failed';
  const img    = item.thumb ? { src: item.thumb } : item.url ? imageProps(item.url, 240) : {};
  const src    = img.src;
  const iconBtn = { width: 28, height: 28, borderRadius: 8, border: 'none', background: 'rgba(253,249,241,.94)', color: '#2B2016', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 };

  return (
    <div
      draggable={!busy}
      onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', item.key); onDragStart(); }}
      onDragEnd={onDragEnd}
      onDragOver={e => { if (!e.dataTransfer?.types?.includes('Files')) e.preventDefault(); }}
      onDrop={e => { if (!e.dataTransfer?.files?.length) { e.preventDefault(); e.stopPropagation(); onDropOn(); } }}
      style={{
        position: 'relative', aspectRatio: '1 / 1', borderRadius: 12, overflow: 'hidden',
        border: `2px solid ${index === 0 ? '#C8792C' : failed ? '#DC2626' : '#E3D5C1'}`,
        background: '#F0DCC0', opacity: dragging ? 0.4 : 1, cursor: busy ? 'default' : 'grab',
      }}>
      {src && !item.broken ? (
        <img {...img} alt={item.alt || `Product photo ${index + 1}`} onError={onBroken}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: busy ? 'brightness(.75)' : 'none' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#79634E', fontSize: 11, padding: 8, textAlign: 'center' }}>
          {item.broken ? <><AlertCircle size={20} /> Photo unavailable — remove and re-upload</> : <><ImagePlus size={20} /> {item.name || 'Photo'}</>}
        </div>
      )}

      {index === 0 && (
        <span style={{ position: 'absolute', top: 8, left: 8, background: '#C8792C', color: '#2B2016', fontSize: 10, fontWeight: 800, letterSpacing: '.06em', padding: '3px 8px', borderRadius: 6 }}>MAIN</span>
      )}
      <button type="button" onClick={onRemove} aria-label={busy ? 'Cancel upload' : 'Remove photo'} title={busy ? 'Cancel upload' : 'Remove'} style={{ ...iconBtn, position: 'absolute', top: 6, right: 6 }}>
        <X size={15} />
      </button>

      {busy && (
        <div style={{ position: 'absolute', left: 8, right: 8, bottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#FDF9F1', marginBottom: 5, textShadow: '0 1px 2px rgba(43,32,22,.6)' }}>
            <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
            {item.status === 'queued' ? 'Waiting…' : item.status === 'compressing' ? 'Preparing…' : `Uploading ${item.progress || 0}%`}
          </div>
          <div style={{ height: 4, borderRadius: 4, background: 'rgba(253,249,241,.5)', overflow: 'hidden' }}>
            <div style={{ width: `${item.status === 'uploading' ? item.progress || 0 : 4}%`, height: '100%', background: '#C8792C', transition: 'width .2s' }} />
          </div>
        </div>
      )}

      {failed && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(43,32,22,.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10, textAlign: 'center' }}>
          <span style={{ fontSize: 11, color: '#FDF9F1', lineHeight: 1.4 }}>{item.error}</span>
          <button type="button" onClick={onRetry} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#C8792C', color: '#2B2016', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            <RotateCw size={12} /> Retry
          </button>
        </div>
      )}

      {item.status === 'done' && count > 1 && (
        <div style={{ position: 'absolute', left: 6, right: 6, bottom: 6, display: 'flex', justifyContent: 'space-between', gap: 4 }}>
          <button type="button" onClick={() => onMove(index - 1)} disabled={index === 0} aria-label="Move left" style={{ ...iconBtn, opacity: index === 0 ? 0.4 : 1 }}><ChevronLeft size={15} /></button>
          {index !== 0 && (
            <button type="button" onClick={onMain} style={{ ...iconBtn, width: 'auto', padding: '0 8px', gap: 4, fontSize: 11, fontWeight: 700, fontFamily: 'inherit' }}>
              <Star size={12} /> Set main
            </button>
          )}
          <button type="button" onClick={() => onMove(index + 1)} disabled={index === count - 1} aria-label="Move right" style={{ ...iconBtn, opacity: index === count - 1 ? 0.4 : 1 }}><ChevronRight size={15} /></button>
        </div>
      )}
    </div>
  );
}
