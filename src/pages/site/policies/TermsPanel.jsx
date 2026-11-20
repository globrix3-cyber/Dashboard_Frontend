import { useState } from 'react';
import RichText from './RichText';

// Numbered policy sections; the first one starts open, as in the reference.
export default function TermsPanel({ items }) {
  const [open, setOpen] = useState(() => items.map(i => i.open));

  return (
    <div className="policy-terms-accordion">
      {items.map((item, i) => (
        <details
          key={item.q}
          className="policy-terms-item"
          open={open[i]}
          data-expanded={open[i] ? 'true' : 'false'}
          onToggle={e => {
            const isOpen = e.currentTarget.open;
            setOpen(prev => (prev[i] === isOpen ? prev : prev.map((v, j) => (j === i ? isOpen : v))));
          }}
        >
          <summary aria-expanded={open[i] ? 'true' : 'false'}>
            <span>{item.q}</span>
            <span className="policy-chevron" aria-hidden="true" />
          </summary>
          <div className="policy-terms-answer">
            <p><RichText segments={item.a} /></p>
          </div>
        </details>
      ))}
    </div>
  );
}
