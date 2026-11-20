import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SiteLayout from './SiteLayout';
import usePageMeta from '../../hooks/usePageMeta';
import { POLICY_TABS, POLICY_CONTENT } from './policies/policyContent';
import { POLICY_CSS } from './policies/policyStyles';
import RichText from './policies/RichText';
import TermsPanel from './policies/TermsPanel';
import FaqPanel from './policies/FaqPanel';

const DESCRIPTION = 'Globrixa’s terms, shipping information, privacy notice and answers to common wholesale sourcing questions.';
const KEYS = POLICY_TABS.map(t => t.key);

// /policies?tab=terms|shipping|privacy|faqs — layout, copy and breakpoints
// follow the client's reference page.
export default function PoliciesPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('tab');
  const active = KEYS.includes(requested) ? requested : 'terms';
  const tab = POLICY_TABS.find(t => t.key === active);
  const content = POLICY_CONTENT[active];
  const tabRefs = useRef({});
  // Roving tabindex: arrow keys move focus (and selection) between tabs.
  const [focusKey, setFocusKey] = useState(null);

  usePageMeta({ title: tab.label, description: DESCRIPTION, path: `/policies?tab=${active}` });

  const select = (key, { focus = false } = {}) => {
    if (key !== active) setParams({ tab: key });
    if (focus) {
      setFocusKey(key);
      tabRefs.current[key]?.focus();
    }
  };

  const onTabKeyDown = (e, index) => {
    const last = POLICY_TABS.length - 1;
    const next = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const wrapped = (next + POLICY_TABS.length) % POLICY_TABS.length;
    select(POLICY_TABS[wrapped].key, { focus: true });
  };

  return (
    <SiteLayout>
      <style>{POLICY_CSS}</style>
      <div id="policies-main" className="policy-hub">
        <div className="policy-breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Policies</span>
          <span aria-hidden="true">/</span>
          <span>{tab.label}</span>
        </div>
        <div className="policy-layout">
          <aside className="policy-sidebar">
            <p className="policy-sidebar-label">POLICIES</p>
            <nav className="policy-tabs" role="tablist" aria-label="Policies and help" aria-orientation="vertical">
              {POLICY_TABS.map((t, i) => {
                const selected = t.key === active;
                return (
                  <a
                    key={t.key}
                    ref={el => { tabRefs.current[t.key] = el; }}
                    id={`policy-tab-${t.key}`}
                    role="tab"
                    href={`/policies?tab=${t.key}`}
                    aria-controls={`policy-panel-${t.key}`}
                    aria-selected={selected}
                    tabIndex={(focusKey ?? active) === t.key ? 0 : -1}
                    onClick={e => { e.preventDefault(); select(t.key); }}
                    onKeyDown={e => onTabKeyDown(e, i)}
                  >
                    <span>{t.label}</span>
                  </a>
                );
              })}
            </nav>
          </aside>
          <div className="policy-content">
            <section
              key={active}
              id={`policy-panel-${active}`}
              className="policy-panel"
              role="tabpanel"
              aria-labelledby={`policy-tab-${active}`}
              tabIndex={0}
            >
              <div className="policy-panel-heading">
                {content.eyebrow && <span>{content.eyebrow}</span>}
                {content.headingTag === 'h2' ? <h2>{content.title}</h2> : <h1>{content.title}</h1>}
                {content.headUpdated && <p className="policy-updated">{content.headUpdated}</p>}
              </div>
              <p className="policy-lead"><RichText segments={content.lead} /></p>
              {content.kind === 'faq'
                ? <FaqPanel items={content.items} empty={content.after.find(a => a.cls === 'policy-faq-empty')} />
                : <TermsPanel items={content.items} />}
              {content.after.filter(a => a.cls !== 'policy-faq-empty').map(a => {
                const Tag = a.cls === 'policy-business-note' ? 'div' : 'p';
                // The reference gives the closing "Last updated" line a 24px top margin.
                const cls = a.cls === 'policy-updated' ? 'policy-updated policy-updated-after' : a.cls;
                return (
                  <Tag key={a.cls} className={cls} role={a.cls === 'policy-draft-notice' ? 'note' : undefined}>
                    <RichText segments={a.content} />
                  </Tag>
                );
              })}
            </section>
            <div className="policy-help-note">
              <p>Looking for something specific?</p>
              <a href="mailto:support@globrixa.com">support@globrixa.com</a>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
