// utils/imageUpload.js
// Browser-side helpers for direct-to-Cloudinary uploads:
//   compressImage(file)                     → Promise<File>  (shrinks big photos before upload)
//   uploadToCloudinary(file, sig, onProgress) → { promise: Promise<secure_url>, abort() }

const MAX_SIDE      = 2000;
const JPEG_QUALITY  = 0.82;
const SMALL_ENOUGH  = 300 * 1024;
const UPLOAD_TIMEOUT_MS = 60_000;

/* Decode a file into something drawable. Returns null if the browser can't decode it (e.g. HEIC). */
async function decode(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { source: bmp, width: bmp.width, height: bmp.height, release: () => bmp.close?.() };
    } catch {
      // fall through to <img>
    }
  }
  return new Promise(resolve => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    // <img> applies EXIF orientation by default in modern browsers.
    img.onload  = () => resolve({ source: img, width: img.naturalWidth, height: img.naturalHeight, release: () => URL.revokeObjectURL(url) });
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

const toBlob = (canvas) => new Promise(resolve => {
  if (canvas.toBlob) canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY);
  else resolve(null);
});

/**
 * Downscale (longest side ≤ 2000px) and re-encode as JPEG q0.82.
 * Returns the original file untouched when decoding fails, when it's already
 * small (≤ 300 KB and ≤ 2000px), or when the result wouldn't be smaller.
 */
export async function compressImage(file) {
  let decoded = null;
  try {
    decoded = await decode(file);
    if (!decoded || !decoded.width || !decoded.height) return file;

    const { width, height } = decoded;
    const longest = Math.max(width, height);
    if (file.size <= SMALL_ENOUGH && longest <= MAX_SIDE) return file;

    const scale  = Math.min(1, MAX_SIDE / longest);
    const canvas = document.createElement('canvas');
    canvas.width  = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    // JPEG has no alpha — paint white so transparent PNG areas don't turn black.
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(decoded.source, 0, 0, canvas.width, canvas.height);

    const blob = await toBlob(canvas);
    if (!blob || blob.size >= file.size) return file;

    const base = (file.name || 'image').replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${base}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  } finally {
    decoded?.release?.();
  }
}

/**
 * Upload one file straight to Cloudinary using a server-issued signature.
 * The form fields must match exactly what the signature covers.
 */
export function uploadToCloudinary(file, sig, onProgress) {
  const xhr = new XMLHttpRequest();

  const promise = new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', sig.api_key);
    form.append('timestamp', sig.timestamp);
    form.append('signature', sig.signature);
    form.append('folder', sig.folder);
    form.append('allowed_formats', sig.allowed_formats);
    form.append('transformation', sig.transformation);
    form.append('public_id', sig.public_id);
    form.append('overwrite', sig.overwrite);

    xhr.open('POST', sig.upload_url);
    xhr.timeout = UPLOAD_TIMEOUT_MS;
    xhr.withCredentials = false;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.min(100, Math.round((e.loaded / e.total) * 100)));
    };

    xhr.onload = () => {
      let body = null;
      try { body = JSON.parse(xhr.responseText); } catch { /* non-JSON */ }
      if (xhr.status >= 200 && xhr.status < 300 && body?.secure_url) {
        resolve(body.secure_url);
      } else {
        reject(new Error(body?.error?.message || `Upload failed (HTTP ${xhr.status || 'error'})`));
      }
    };
    xhr.onerror   = () => reject(new Error('Network error — check your connection'));
    xhr.ontimeout = () => reject(new Error('Upload timed out — please retry'));
    xhr.onabort   = () => {
      const err = new Error('Upload cancelled');
      err.aborted = true;
      reject(err);
    };

    xhr.send(form);
  });

  return { promise, abort: () => xhr.abort() };
}
