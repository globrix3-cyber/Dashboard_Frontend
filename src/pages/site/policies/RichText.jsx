import { Link } from 'react-router-dom';

// Renders policy copy segments: a string, { href, text } or { strong }.
export default function RichText({ segments }) {
  return segments.map((s, i) => {
    if (typeof s === 'string') return s;
    if (s.strong) return <strong key={i}>{s.strong}</strong>;
    if (s.href.startsWith('/')) return <Link key={i} to={s.href}>{s.text}</Link>;
    return <a key={i} href={s.href}>{s.text}</a>;
  });
}
