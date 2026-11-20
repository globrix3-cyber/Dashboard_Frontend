import SiteLayout from './SiteLayout';
import usePageMeta from '../../hooks/usePageMeta';

// About page, built to the client's reference (/about/).
// Styles are the reference's final cascade, scoped to .gx-about, so every
// breakpoint (1100 / 1050 / 760) behaves exactly as it does there.
const CSS = `
.gx-about{--cream:#FDF9F1;--mocha:#5B4632;--gold:#F4D9A0;--muted:#79634E;--canela:'Canela','Cormorant Garamond',Georgia,serif;--corm:'Cormorant Garamond',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif;background:var(--cream);color:var(--mocha);font:14px var(--sans);line-height:normal}
.gx-about h1,.gx-about h2,.gx-about h3{color:var(--mocha);font-style:normal}

/* Opening banner: one photograph, title centred over it. */
.gx-about .ab-banner{position:relative;isolation:isolate;display:grid;grid-template-columns:1fr;place-items:center;width:100%;aspect-ratio:1793/877;overflow:hidden;background:var(--mocha)}
.gx-about .ab-banner>img{position:absolute;inset:0;z-index:-2;display:block;width:100%;height:100%;object-fit:contain;object-position:center}
.gx-about .ab-banner>h1{font-family:var(--corm);font-weight:600;font-size:clamp(46px,6vw,88px);line-height:1.05;letter-spacing:.12em;text-align:center;color:var(--cream);text-shadow:0 2px 18px #2b201666;margin:0;padding:20px 5% 20px calc(5% + .12em)}

/* Our story */
.gx-about .ab-story{padding:clamp(75px,8vw,132px) 9%;background:var(--cream);text-align:center}
.gx-about .ab-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
.gx-about .ab-story-statement{max-width:1120px;margin:0 auto;font-family:var(--sans);font-size:clamp(15.4224px,1.48512vw,22.848px);font-weight:400;line-height:1.65;letter-spacing:0;color:var(--mocha);text-wrap:pretty}
.gx-about .ab-story-statement>p{font:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0 0 1.15em}
.gx-about .ab-story-statement>p:last-child{margin-bottom:0;font-weight:500}

/* Brand note */
.gx-about .ab-note{padding:60px 4.3%;background:var(--cream)}
.gx-about .ab-note-card{display:grid;grid-template-columns:1.12fr 1fr;overflow:hidden;border-radius:20px;background:#f5ecdc}
.gx-about .ab-note-copy{padding:clamp(35px,5vw,84px);align-self:center}
.gx-about .ab-note-copy h2{font-family:var(--canela);font-weight:300;font-synthesis:none;font-size:clamp(32px,3vw,46px);line-height:1.15;letter-spacing:-.5px;margin:0 0 26px}
.gx-about .ab-note-copy>p{font-family:var(--sans);font-weight:400;font-size:15px;line-height:1.85;letter-spacing:0;margin:18px 0;color:var(--mocha)}
.gx-about .ab-note-copy>.ab-note-sign{font-size:13px;font-weight:500;line-height:1.7;margin:28px 0 0}
.gx-about .ab-note-image{aspect-ratio:4/5;min-width:0;align-self:stretch}
.gx-about .ab-note-image>img{display:block;width:100%;height:100%;object-fit:cover;object-position:center}

/* Our values */
.gx-about .ab-values{padding:72px 6% 78px;background:#E3D5C1;text-align:center;border-top:1px solid #5b46321a;border-bottom:1px solid #5b46321a}
.gx-about .ab-values>h2{font-family:var(--canela);font-weight:300;font-synthesis:none;font-size:clamp(40px,4vw,58px);line-height:1.1;letter-spacing:-.6px;text-transform:uppercase;margin:0 0 54px}
.gx-about .ab-values-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));max-width:1260px;margin:0 auto}
.gx-about .ab-values-grid>article{display:flex;flex-direction:column;align-items:center;padding:0 clamp(22px,3vw,48px);border-right:1px solid #5b46322e}
.gx-about .ab-values-grid>article:last-child{border-right:0}
.gx-about .ab-value-icon{display:block;width:88px;height:88px;object-fit:contain;margin-bottom:21px;flex-shrink:0}
.gx-about .ab-values-grid h3{font-family:var(--canela);font-size:12.6px;font-weight:300;font-synthesis:none;line-height:1.4;letter-spacing:1.6px;text-transform:uppercase;margin:0 0 17px}
.gx-about .ab-values-grid p{font-family:var(--sans);font-size:14px;line-height:1.85;color:var(--mocha);max-width:310px;margin:0}

/* Mission & vision */
.gx-about .ab-purpose{--ratio:1.9;display:grid;grid-template-columns:1fr}
.gx-about .ab-feature{display:grid;align-items:center;gap:5%;padding:52px 4.3%;background:var(--cream)}
.gx-about .ab-mission{grid-template-columns:1.08fr 1fr}
.gx-about .ab-vision{grid-template-columns:1fr 1.08fr}
.gx-about .ab-visual{position:relative;aspect-ratio:var(--ratio);min-width:0;min-height:0;overflow:hidden;border-radius:16px;background:#eee0cc}
.gx-about .ab-visual img{position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;object-position:center}
.gx-about .ab-mission .ab-visual img{object-position:center 80%}
.gx-about .ab-feature h2{font-family:var(--canela);font-weight:300;font-synthesis:none;font-size:clamp(42px,4vw,64px);line-height:1.1;letter-spacing:-.8px;margin:0 0 35px}
.gx-about .ab-feature p{font-size:15px;line-height:1.85;margin:0 0 20px;color:var(--mocha)}
.gx-about .ab-feature p:last-child{margin-bottom:0}

/* Numbers strip */
.gx-about .ab-stats{background:var(--mocha);color:var(--gold);padding:32px 4.3% 35px}
.gx-about .ab-stats dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;margin:0 auto;max-width:1280px;text-align:center}
.gx-about .ab-stats dl>div{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:10px;min-width:0;padding:0 26px}
.gx-about .ab-stats dl>div+div{border-left:1px solid #f4d9a045}
.gx-about .ab-stats dt{font-family:var(--canela);font-weight:300;font-synthesis:none;font-size:clamp(33px,3.5vw,52px);line-height:1;letter-spacing:-.7px;color:var(--gold)}
.gx-about .ab-stats dd{font-family:var(--canela);font-weight:300;font-size:clamp(12px,.8vw,14px);line-height:1.4;letter-spacing:.4px;text-transform:uppercase;color:var(--cream);margin:0}

/* Making process timeline */
.gx-about .ab-making{background:var(--cream);padding:66px 5% 72px}
.gx-about .ab-timeline{position:relative;list-style:none;max-width:980px;margin:0 auto;padding:14px 0}
.gx-about .ab-timeline::before{content:"";position:absolute;left:50%;top:0;bottom:0;width:1.5px;transform:translateX(-50%);background:var(--mocha)}
.gx-about .ab-timeline>li{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 64px minmax(0,1fr);padding:0 0 36px;min-height:112px}
.gx-about .ab-timeline>li:last-child{padding-bottom:0}
.gx-about .ab-timeline>li::before{content:"";position:absolute;left:50%;top:12px;width:9px;height:9px;transform:translateX(-50%);border-radius:50%;background:var(--mocha);box-shadow:0 0 0 5px var(--cream)}
.gx-about .ab-step{grid-column:1;min-width:0;text-align:right;font-family:var(--sans)}
.gx-about .ab-timeline>li:nth-child(even) .ab-step{grid-column:3;text-align:left}
.gx-about .ab-step h3{font-family:var(--canela);font-weight:300;font-synthesis:none;font-size:28px;line-height:1.2;letter-spacing:-.1px;margin:0 0 12px}
.gx-about .ab-step>p{font-size:13px;line-height:1.85;color:var(--muted);margin:0}

/* Closing collage */
.gx-about .ab-collage{display:block;width:100%;margin:0;padding:0;line-height:0;background:var(--cream)}
.gx-about .ab-collage>img{display:block;width:100%;height:auto}

/* Reference caps the whole page at 1700px on very wide screens. */
@media(min-width:1550px){.gx-about{max-width:1700px;margin:0 auto}}
@media(max-width:1100px){
  .gx-about .ab-values{padding:56px 4.3% 60px}
  .gx-about .ab-values>h2{font-size:45px;margin-bottom:42px}
  .gx-about .ab-values-grid>article{padding:0 24px}
  .gx-about .ab-values-grid p{font-size:13px;line-height:1.8}
  .gx-about .ab-value-icon{width:78px;height:78px}
  .gx-about .ab-purpose{--ratio:1.65}
  .gx-about .ab-feature{gap:4%;padding:40px 4.3%}
  .gx-about .ab-feature h2{font-size:43px;margin-bottom:25px}
  .gx-about .ab-feature p{font-size:14px;line-height:1.8}
  .gx-about .ab-stats{padding-top:26px;padding-bottom:28px}
  .gx-about .ab-stats dt{font-size:clamp(31px,3.5vw,40px)}
  .gx-about .ab-stats dd{font-size:12px}
}
@media(max-width:1050px){
  .gx-about .ab-note-copy h2{font-size:32px}
  .gx-about .ab-note-copy>p{font-size:14px;line-height:1.85}
  .gx-about .ab-timeline{max-width:850px}
  .gx-about .ab-timeline>li{grid-template-columns:minmax(0,1fr) 52px minmax(0,1fr)}
  .gx-about .ab-step h3{font-size:26px}
}
@media(min-width:761px) and (max-width:1050px){
  .gx-about .ab-note-copy{padding:34px}
}
@media(max-width:760px){
  .gx-about .ab-story{padding:58px 7%}
  .gx-about .ab-story-statement{font-size:clamp(13.1376px,3.1416vw,17.136px)}
  .gx-about .ab-note{padding:36px 5%}
  .gx-about .ab-note-card{grid-template-columns:1fr;border-radius:15px}
  .gx-about .ab-note-copy{padding:32px 7%}
  .gx-about .ab-note-copy h2{font-size:34px}
  .gx-about .ab-note-copy>p{font-size:14px;line-height:1.9}
  .gx-about .ab-note-image{aspect-ratio:1}
  .gx-about .ab-values{padding:43px 6% 46px}
  .gx-about .ab-values>h2{font-size:43px;margin-bottom:34px}
  .gx-about .ab-values-grid{grid-template-columns:1fr;max-width:440px}
  .gx-about .ab-values-grid>article{padding:27px 12px;border-right:0;border-bottom:1px solid #5b46322e}
  .gx-about .ab-values-grid>article:first-child{padding-top:0}
  .gx-about .ab-values-grid>article:last-child{border-bottom:0;padding-bottom:0}
  .gx-about .ab-values-grid p{font-size:14px;max-width:340px}
  .gx-about .ab-value-icon{margin-bottom:17px}
  .gx-about .ab-values-grid h3{margin-bottom:12px}
  .gx-about .ab-purpose{--ratio:1.9}
  .gx-about .ab-mission,.gx-about .ab-vision{grid-template-columns:1fr;gap:28px;padding:34px 6% 40px}
  .gx-about .ab-visual{border-radius:12px}
  .gx-about .ab-feature h2{font-size:43px;margin-bottom:23px}
  .gx-about .ab-feature p{font-size:14px;line-height:1.9}
  .gx-about .ab-stats{padding:21px 6% 24px}
  .gx-about .ab-stats dl{grid-template-columns:1fr;max-width:420px;gap:14px}
  .gx-about .ab-stats dl>div{padding:0 14px 14px;gap:8px}
  .gx-about .ab-stats dl>div+div{border-left:0}
  .gx-about .ab-stats dl>div:not(:last-child){border-bottom:1px solid #f4d9a045}
  .gx-about .ab-stats dl>div:last-child{padding-bottom:0}
  .gx-about .ab-stats dt{font-size:clamp(26px,5.5vw,36px);letter-spacing:-.4px}
  .gx-about .ab-stats dd{font-size:12px;line-height:1.3}
  .gx-about .ab-making{padding:43px 6% 48px}
  .gx-about .ab-timeline{padding:5px 0}
  .gx-about .ab-timeline::before{left:7px}
  .gx-about .ab-timeline>li{display:block;padding:0 0 30px 38px;min-height:0}
  .gx-about .ab-timeline>li::before{left:7px;top:11px;width:8px;height:8px;box-shadow:0 0 0 4px var(--cream)}
  .gx-about .ab-step,.gx-about .ab-timeline>li:nth-child(even) .ab-step{text-align:left}
  .gx-about .ab-step h3{font-size:26px;margin-bottom:10px}
  .gx-about .ab-step>p{font-size:13px;line-height:1.8}
}
`;

const VALUES = [
  { icon: 'value-quality.png',        title: 'Quality',        body: 'Skilled craftsmanship. Refined details. Quality your customers can feel.' },
  { icon: 'value-sustainability.png', title: 'Sustainability', body: 'Considered materials. Thoughtful sourcing. Products chosen to last.' },
  { icon: 'value-affordability.png',  title: 'Affordability',  body: 'Distinctive products. Considered pricing. Value for your business.' },
];

const STATS = [
  { n: '200+', label: 'Products available' },
  { n: '12',   label: 'Manufacturing partners' },
  { n: '10+',  label: 'Materials offered' },
];

const STEPS = [
  { title: 'Design & sampling',      body: 'An idea becomes a sketch, pattern or sample. Proportions, function and details are explored for a chair, a necklace or a leather bag.' },
  { title: 'Choosing the materials', body: 'Wood, metals, stones, leather or textiles are selected to suit the design. Texture, strength and appearance help guide the choice for each piece.' },
  { title: 'Preparing & shaping',    body: 'Materials are measured and prepared. Wood may be cut and shaped, metal formed, stones sized, or leather panels cut to a pattern.' },
  { title: 'Crafting & assembly',    body: 'The individual parts come together through skilled work: joining furniture, setting jewellery, weaving textiles or stitching bags. Each craft calls for its own tools and techniques.' },
  { title: 'Finishing the details',  body: 'Surfaces and edges are refined for the material: sanding and finishing wood, polishing metal, or colouring and finishing leather. Hardware, linings and decorative details complete the design.' },
  { title: 'Final checks & packing', body: 'The finished piece is checked for appearance and function, including joints, clasps, stitching or surface finish as appropriate. Protective packing prepares it for the next stage of its journey.' },
];

export default function AboutPage() {
  usePageMeta({
    title: 'About us — Globrixa',
    description: 'Meet Globrixa: Indian design, a global outlook, and a considered approach to wholesale furniture and home accessories for independent retail businesses.',
    path: '/about',
  });

  return (
    <SiteLayout>
      <style>{CSS}</style>
      <div className="gx-about">
        <section className="ab-banner" aria-labelledby="about-title">
          <img src="/images/v4/about-woven-woodwork.jpg" width="1793" height="877" fetchPriority="high" decoding="async"
            alt="Artisan weaving the seat of a wooden chair beside a hand plane and wood shavings" />
          <h1 id="about-title">ABOUT US</h1>
        </section>

        <section className="ab-story" aria-labelledby="our-story-title">
          <h2 id="our-story-title" className="ab-sr">Our story</h2>
          <div className="ab-story-statement">
            <p>Every store starts with a vision. An independent shop owner imagines shelves filled with pieces that feel right for their customers. An online seller looks for something worth sharing. An importer sees the beginnings of a new collection.</p>
            <p>That is the idea behind Globrixa. We help retailers discover furniture and home accessories that reflect their point of view, turning the first spark of inspiration into a considered shortlist.</p>
            <p>Because the best collections do more than fill shelves. They give customers a reason to come back.</p>
          </div>
        </section>

        <section className="ab-note" aria-labelledby="brand-note-title">
          <div className="ab-note-card">
            <div className="ab-note-copy">
              <h2 id="brand-note-title">Build a collection your customers will love.</h2>
              <p>Your business needs products that stand out for their quality, craftsmanship and lasting appeal. Globrixa helps retailers, importers and online sellers source furniture and home accessories that suit their market and give customers a reason to choose them.</p>
              <p>From wholesale sourcing to customisation and private label, we connect your requirements with skilled manufacturing partners, helping you build a distinctive collection around your customers’ needs.</p>
              <p className="ab-note-sign">Team Globrixa</p>
            </div>
            <div className="ab-note-image">
              <img src="/images/v3/furniture-design-workspace-edited.jpg" width="1200" height="1200" loading="lazy" decoding="async"
                alt="A furniture designer sketching an armchair alongside wood and fabric samples" />
            </div>
          </div>
        </section>

        <section className="ab-values" aria-labelledby="our-values-title">
          <h2 id="our-values-title">Our values</h2>
          <div className="ab-values-grid">
            {VALUES.map(v => (
              <article key={v.title}>
                <img className="ab-value-icon" src={`/images/about/${v.icon}`} width="88" height="88" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ab-purpose" aria-label="Our mission and vision">
          <article className="ab-feature ab-mission" aria-labelledby="our-mission-title">
            <div className="ab-visual">
              <img src="/images/about/mission-leather-shop.jpg" width="1600" height="1280" loading="lazy" decoding="async"
                alt="Smiling shopkeeper outside a leather goods shop displaying handmade shoes and bags" />
            </div>
            <div>
              <h2 id="our-mission-title">Our Mission</h2>
              <p>To help retailers, importers and online businesses build distinctive collections through thoughtfully sourced, high quality handmade furniture and home accessories.</p>
              <p>We connect commercial sourcing requirements with skilled manufacturing partners, combining craftsmanship, considered materials and refined finishes with practical support for wholesale, customisation and private-label needs.</p>
            </div>
          </article>
          <article className="ab-feature ab-vision" aria-labelledby="our-vision-title">
            <div>
              <h2 id="our-vision-title">Our Vision</h2>
              <p>To be a trusted global sourcing partner for businesses seeking exceptional handmade products that unite enduring quality, distinctive design and commercial value.</p>
              <p>We envision a future where skilled craftsmanship strengthens retail differentiation, supports lasting business partnerships and creates sustained opportunities for the makers behind every collection.</p>
            </div>
            <div className="ab-visual">
              <img src="/images/about/vision-warm-living-room.jpg" width="1600" height="1020" loading="lazy" decoding="async"
                alt="Warm contemporary living room with a brown sofa, sculptural coffee tables, woven rug and wooden accent chair" />
            </div>
          </article>
        </section>

        <section className="ab-stats" aria-label="Globrixa in numbers">
          <dl>
            {STATS.map(s => (
              <div key={s.label}><dt>{s.n}</dt><dd>{s.label}</dd></div>
            ))}
          </dl>
        </section>

        <section className="ab-making" aria-label="How handcrafted products are made">
          <ol className="ab-timeline">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <div className="ab-step">
                  <h3><span aria-hidden="true">{i + 1}. </span>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="ab-collage" aria-label="Woodcraft and the hands behind it">
          <img src="/images/about/woodcraft-collage.jpg" width="2048" height="853" loading="lazy" decoding="async"
            alt="A collage of woodworkers shaping, joining and carving wood by hand" />
        </section>
      </div>
    </SiteLayout>
  );
}
