import { useMemo, useState } from 'react';
import RichText from './RichText';

const plain = segs => segs.map(s => (typeof s === 'string' ? s : s.text || s.strong || '')).join('');

// Searchable FAQ list (questions and answers), all closed by default.
export default function FaqPanel({ items, empty }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(() => items.map(() => false));

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () => items.map(item => !q || `${item.q} ${plain(item.a)}`.toLowerCase().includes(q)),
    [items, q],
  );
  const count = visible.filter(Boolean).length;
  const status = q ? `${count} question${count === 1 ? '' : 's'} found` : `${items.length} questions`;

  return (
    <>
      <div className="policy-faq-search">
        <label htmlFor="policy-faq-search">Find an answer</label>
        <div>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
          <input
            id="policy-faq-search"
            type="search"
            placeholder="Try samples, shipping or customisation"
            autoComplete="off"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <p id="policy-faq-count" role="status" aria-live="polite">{status}</p>
      </div>
      <div className="policy-faq-list">
        {items.map((item, i) => (
          <details
            key={item.q}
            className="policy-faq-item"
            hidden={!visible[i]}
            open={open[i]}
            data-expanded={open[i] ? 'true' : 'false'}
            onToggle={e => {
              const isOpen = e.currentTarget.open;
              setOpen(prev => (prev[i] === isOpen ? prev : prev.map((v, j) => (j === i ? isOpen : v))));
            }}
          >
            <summary id={`policy-faq-question-${i + 1}`} aria-controls={`policy-faq-answer-${i + 1}`} aria-expanded={open[i] ? 'true' : 'false'}>
              <span>{item.q}</span>
              <span className="policy-faq-plus" aria-hidden="true" />
            </summary>
            <div id={`policy-faq-answer-${i + 1}`} className="policy-faq-answer" role="region" aria-labelledby={`policy-faq-question-${i + 1}`}>
              <p><RichText segments={item.a} /></p>
            </div>
          </details>
        ))}
      </div>
      {empty && (
        <p id="policy-faq-empty" className="policy-faq-empty" hidden={count > 0}>
          <RichText segments={empty.content} />
        </p>
      )}
    </>
  );
}
