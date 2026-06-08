import { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';

const ACCENT = '#C4773A';

const BUYER_ONBOARDING_QUESTIONS = [
  {
    id:       'business_type',
    type:     'single',
    question: 'What best describes your business?',
    options:  ['Retail store', 'Online store / e-commerce', 'Distributor or wholesaler', 'Hotel, restaurant or café', 'Manufacturer', 'Other'],
  },
  {
    id:       'years_in_business',
    type:     'single',
    question: 'How long have you been in business?',
    options:  ['Less than 1 year', '1–3 years', '3–10 years', '10+ years', 'Other'],
  },
  {
    id:       'sell_where',
    type:     'single',
    question: 'Where do you currently sell or operate?',
    options:  ['A single physical location', 'Multiple physical locations', 'Online only', 'Both online and in-store', 'Other'],
  },
  {
    id:       'team_size',
    type:     'single',
    question: 'How many people work at your company?',
    options:  ['Just me', '2–10', '11–50', '51–200', '200+', 'Other'],
  },
  {
    id:       'categories',
    type:     'multi',
    question: 'Which categories are you looking to source? Select all that apply.',
    options:  ['Apparel & textiles', 'Home & kitchen', 'Beauty & personal care', 'Food & beverages', 'Electronics & accessories', 'Industrial & office supplies', 'Other'],
  },
  {
    id:       'order_frequency',
    type:     'single',
    question: 'How often do you plan to place wholesale orders?',
    options:  ['Weekly', 'Monthly', 'Every few months', 'A few times a year', 'This will be my first order', 'Other'],
  },
  {
    id:       'budget',
    type:     'single',
    question: "What's your typical monthly purchase budget?",
    options:  ['Under ₹50,000', '₹50,000 – ₹2,00,000', '₹2,00,000 – ₹10,00,000', 'Over ₹10,00,000', 'Other'],
  },
  {
    id:       'priorities',
    type:     'multi',
    question: 'What matters most to you when choosing a supplier? Select all that apply.',
    options:  ['Competitive pricing', 'Product quality', 'Fast shipping & fulfilment', 'Low minimum order quantities', 'Sustainable / ethical sourcing', 'Certifications & compliance', 'Other'],
  },
  {
    id:       'heard_from',
    type:     'single',
    question: 'How did you hear about Globrixa?',
    options:  ['Search engine', 'Social media', 'Recommended by a friend or colleague', 'Trade show or event', 'Other'],
  },
];

const SUPPLIER_ONBOARDING_QUESTIONS = [
  {
    id:       'brand_category',
    type:     'single',
    question: 'What best describes what your business makes or sells?',
    options:  ['Apparel & textiles', 'Home & kitchen', 'Beauty & personal care', 'Food & beverages', 'Electronics & accessories', 'Industrial & office supplies', 'Handicrafts & artisan goods', 'Other'],
  },
  {
    id:       'years_in_business',
    type:     'single',
    question: 'How long has your business been operating?',
    options:  ['Less than 1 year', '1–3 years', '3–10 years', '10+ years', 'Other'],
  },
  {
    id:       'team_size',
    type:     'single',
    question: 'How many people work at your company?',
    options:  ['Just me', '2–10', '11–50', '51–200', '200+', 'Other'],
  },
  {
    id:       'production',
    type:     'single',
    question: 'Where are your products made?',
    options:  ['In-house, at our own facility', 'Through manufacturing partners in India', 'Through manufacturing partners abroad', 'A mix of in-house and partners', 'Other'],
  },
  {
    id:       'current_channels',
    type:     'multi',
    question: 'Where do you currently sell? Select all that apply.',
    options:  ['Our own retail store(s)', 'Our own website / D2C', 'Other online marketplaces', 'Wholesale to retailers', 'Export markets', "We haven't started selling yet", 'Other'],
  },
  {
    id:       'price_range',
    type:     'single',
    question: "What's your typical wholesale price per unit?",
    options:  ['Under ₹500', '₹500 – ₹2,000', '₹2,000 – ₹10,000', 'Over ₹10,000', 'It varies by product', 'Other'],
  },
  {
    id:       'moq',
    type:     'single',
    question: "What's your typical minimum order quantity (MOQ)?",
    options:  ['No minimum', '1–50 units', '51–200 units', '201–1,000 units', '1,000+ units', 'Other'],
  },
  {
    id:       'export_ready',
    type:     'single',
    question: 'Are you set up to export internationally?',
    options:  ['Yes, fully export-ready with documentation', "We're working on it", 'Domestic sales only for now', "Not sure — I'd like guidance", 'Other'],
  },
  {
    id:       'heard_from',
    type:     'single',
    question: 'How did you hear about Globrixa?',
    options:  ['Search engine', 'Social media', 'Recommended by a friend or colleague', 'Trade show or event', 'Other'],
  },
];

function OptionRow({ label, selected, multi, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%',
        padding: '13px 16px', borderRadius: 12,
        border: `1.5px solid ${selected ? ACCENT : '#E0DAD0'}`,
        background: selected ? '#FDF3EB' : '#fff',
        cursor: 'pointer', textAlign: 'left',
        fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 600, color: '#1C1815',
        transition: 'border-color .15s, background .15s',
      }}
    >
      <span style={{
        width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: multi ? 6 : '50%',
        border: `2px solid ${selected ? ACCENT : '#D5CCC0'}`,
        background: selected ? ACCENT : 'transparent',
        transition: 'border-color .15s, background .15s',
      }}>
        {selected && <Check size={12} color="#fff" strokeWidth={3} />}
      </span>
      {label}
    </button>
  );
}

export default function OnboardingQuiz({ role, onComplete, onSkip, onBack }) {
  const questions = role === 'supplier' ? SUPPLIER_ONBOARDING_QUESTIONS : BUYER_ONBOARDING_QUESTIONS;
  const [step, setStep]           = useState(0);
  const [answers, setAnswers]     = useState({});
  const [otherTexts, setOtherTexts] = useState({});

  const q        = questions[step];
  const isLast   = step === questions.length - 1;
  const current  = answers[q.id];
  const otherText = otherTexts[q.id] || '';

  const hasAnswer = q.type === 'multi'
    ? Array.isArray(current) && current.length > 0
    : current !== undefined && current !== null && current !== '';

  const isSelected = (option) =>
    q.type === 'multi' ? (Array.isArray(current) && current.includes(option)) : current === option;

  const choose = (option) => {
    if (q.type === 'multi') {
      setAnswers(a => {
        const list = Array.isArray(a[q.id]) ? a[q.id] : [];
        const nextList = list.includes(option) ? list.filter(o => o !== option) : [...list, option];
        return { ...a, [q.id]: nextList };
      });
    } else {
      setAnswers(a => ({ ...a, [q.id]: option }));
    }
  };

  const buildFinalAnswers = () => {
    const out = {};
    for (const question of questions) {
      const val = answers[question.id];
      if (val === undefined) continue;
      const otherTxt = (otherTexts[question.id] || '').trim();
      const resolve = (v) => (v === 'Other' && otherTxt ? `Other: ${otherTxt}` : v);
      out[question.id] = question.type === 'multi' ? val.map(resolve) : resolve(val);
    }
    return out;
  };

  const next = () => (isLast ? onComplete(buildFinalAnswers()) : setStep(s => s + 1));
  const back = () => (step === 0 ? onBack?.() : setStep(s => s - 1));

  return (
    <div>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        {(step > 0 || onBack) && (
          <button type="button" onClick={back} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, marginLeft: -4, color: '#8A8178' }}>
            <ChevronLeft size={20} />
          </button>
        )}
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#F0E8DA', overflow: 'hidden' }}>
          <div style={{ width: `${((step + 1) / questions.length) * 100}%`, height: '100%', background: ACCENT, borderRadius: 3, transition: 'width .25s ease' }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#8A8178', whiteSpace: 'nowrap' }}>{step + 1} / {questions.length}</span>
      </div>

      <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 21, fontWeight: 800, color: '#1C1815', lineHeight: 1.35, marginBottom: 18 }}>
        {q.question}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, maxHeight: 320, overflowY: 'auto', paddingRight: 2 }}>
        {q.options.map(opt => (
          <div key={opt}>
            <OptionRow label={opt} selected={isSelected(opt)} multi={q.type === 'multi'} onClick={() => choose(opt)} />
            {opt === 'Other' && isSelected('Other') && (
              <input
                value={otherText}
                onChange={e => setOtherTexts(t => ({ ...t, [q.id]: e.target.value }))}
                placeholder="Tell us more…"
                style={{ marginTop: 8, width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${ACCENT}`, background: '#FDF3EB', fontSize: 14, color: '#1C1815', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                autoFocus
              />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
        <button type="button" onClick={onSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A8178', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', textDecoration: 'underline' }}>
          Skip for now
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!hasAnswer}
          style={{ padding: '13px 30px', borderRadius: 10, border: 'none', background: hasAnswer ? '#1C1815' : '#C8C0B4', color: '#fff', fontSize: 14.5, fontWeight: 700, cursor: hasAnswer ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'background .18s' }}
          onMouseEnter={e => { if (hasAnswer) e.currentTarget.style.background = '#3D3730'; }}
          onMouseLeave={e => { if (hasAnswer) e.currentTarget.style.background = '#1C1815'; }}
        >
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
