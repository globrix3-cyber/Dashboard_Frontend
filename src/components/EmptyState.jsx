import { PackageSearch } from 'lucide-react';

const SERIF = "'Canela', 'Cormorant Garamond', Georgia, serif";

export default function EmptyState({
  title = "No products found",
  description = "We couldn't find any products matching your search or filters.",
  icon: Icon = PackageSearch,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: 72, height: 72, borderRadius: 4, background: '#F8F2E9', border: '1px solid #E3D5C1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
        <Icon size={32} color="#5B4632" strokeWidth={1.6} />
      </div>
      <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 300, letterSpacing: '-0.4px', color: '#5B4632', margin: '0 0 10px' }}>{title}</h3>
      <p style={{ color: '#79634E', maxWidth: 420, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{description}</p>
    </div>
  );
}
