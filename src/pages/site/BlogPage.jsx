import { Link } from 'react-router-dom';
import SiteLayout from './SiteLayout';
import usePageMeta from '../../hooks/usePageMeta';
import './siteBase.css';
import './blog/blog.css';

// Blog ("The Globrixa Journal"), built from the client's reference (/blog/):
// a coming-soon welcome until the first stories are published.
export default function BlogPage() {
  usePageMeta({
    title: 'Blog — The Globrixa Journal',
    description: 'Stories of craft, considered spaces and independent retail from Globrixa. Our first stories are coming soon.',
    path: '/blog',
  });

  return (
    <SiteLayout>
      <div className="gx-ref blog-main">
        <section className="blog-welcome" aria-labelledby="blog-title">
          <div className="blog-welcome-copy">
            <div className="eyebrow">THE GLOBRIXA JOURNAL</div>
            <h1 id="blog-title">Ideas for your<br />next chapter.</h1>
            <p>Stories of craft, considered spaces and independent retail.</p>
            <div className="blog-coming">
              <span>COMING SOON</span>
              <p>{'We’re preparing our first stories. Explore the collection while we put the finishing touches on the journal.'}</p>
            </div>
            {/* The reference points at the homepage product grid; the full catalogue is the closest working destination. */}
            <Link className="btn" to="/products">Explore the collection <span aria-hidden="true">{'↗'}</span></Link>
          </div>
          <img src="/images/v3/furniture-design-workspace-edited.jpg" width="1200" height="1200" loading="lazy" decoding="async"
            alt={'Furniture sketches, material samples and inspiration on a designer’s desk'} />
        </section>
      </div>
    </SiteLayout>
  );
}
