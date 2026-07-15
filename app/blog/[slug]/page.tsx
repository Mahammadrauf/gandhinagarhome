// app/blog/[slug]/page.tsx — SERVER COMPONENT (SEO-first article page)
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "@/lib/blogPosts";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://gandhinagarhomes.com";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Article not found | GandhinagarHomes" };
  return {
    title: `${post.title} | GandhinagarHomes`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      siteName: "GandhinagarHomes",
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "GandhinagarHomes Team", url: BASE_URL },
    publisher: { "@type": "Organization", name: "GandhinagarHomes", url: BASE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${post.slug}` },
    keywords: post.keywords.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${BASE_URL}/blog/${post.slug}` },
    ],
  };

  const faqLd = post.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      <style>{`
        @keyframes blogRise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .blog-rise { opacity: 0; animation: blogRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .blog-d1 { animation-delay: 0.08s; }
        .blog-d2 { animation-delay: 0.16s; }
        .blog-d3 { animation-delay: 0.24s; }
        @media (prefers-reduced-motion: reduce) {
          .blog-rise { animation: none; opacity: 1; }
        }
      `}</style>

      <Header />

      <main>
        {/* ARTICLE HERO */}
        <section className={`relative overflow-hidden bg-gradient-to-br ${post.accent} py-14 md:py-20`}>
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] bg-[size:36px_36px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-6">
            <nav className="blog-rise flex items-center gap-2 text-xs font-semibold text-white/70 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            </nav>
            <span className="blog-rise inline-block px-3 py-1.5 mb-5 text-[11px] font-bold uppercase tracking-wider bg-white/15 text-white rounded-full border border-white/20 backdrop-blur-sm">
              {post.category}
            </span>
            <h1 className="blog-rise blog-d1 text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="blog-rise blog-d2 flex flex-wrap items-center gap-3 text-sm text-white/75 font-medium">
              <span>By GandhinagarHomes Team</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{formatDate(post.date)}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

        {/* ARTICLE BODY */}
        <article className="blog-rise blog-d3 max-w-3xl mx-auto px-6 py-12 md:py-16">
          {post.intro.map((p, i) => (
            <p key={i} className="text-base md:text-lg text-slate-600 leading-relaxed md:leading-loose mb-6 first:text-slate-700 first:font-medium">
              {p}
            </p>
          ))}

          {post.sections.map((section, i) => (
            <div key={i} className="mt-10">
              {section.heading && (
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 mb-4">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs?.map((p, j) => (
                <p key={j} className="text-base md:text-lg text-slate-600 leading-relaxed md:leading-loose mb-5">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="space-y-3 mb-5">
                  {section.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3 text-base md:text-lg text-slate-600 leading-relaxed">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#0b6b53] flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Mid-article CTA after the second section */}
              {i === 1 && (
                <aside className="my-10 rounded-3xl border border-[#0b6b53]/15 bg-gradient-to-br from-[#0b6b53]/5 to-white p-7 md:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#0b6b53] mb-2">
                    GandhinagarHomes
                  </p>
                  <p className="text-lg md:text-xl font-bold tracking-tight text-slate-900 mb-4">
                    Browse verified resale properties in Gandhinagar — filtered by
                    locality, budget, and BHK.
                  </p>
                  <Link
                    href="/buy-property-in-gandhinagar-gujarat"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0b6b53] text-white font-bold text-sm shadow-[0_8px_20px_-8px_rgba(11,107,83,0.5)] hover:bg-[#095c47] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(11,107,83,0.55)] transition-all duration-200"
                  >
                    Explore Listings
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </aside>
              )}
            </div>
          ))}

          {post.conclusion && (
            <div className="mt-12 pt-8 border-t border-slate-100">
              {post.conclusion.map((p, i) => (
                <p key={i} className="text-base md:text-lg text-slate-600 leading-relaxed md:leading-loose mb-5">
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {post.faq.map((f, i) => (
                  <details
                    key={i}
                    className="group rounded-2xl border border-slate-200/70 bg-white open:shadow-[0_10px_30px_-18px_rgba(11,107,83,0.3)] open:border-[#0b6b53]/25 transition-all duration-300"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 font-bold text-slate-900 text-sm md:text-base">
                      {f.q}
                      <svg
                        className="w-4 h-4 text-[#0b6b53] flex-shrink-0 group-open:rotate-180 transition-transform duration-300"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="px-5 pb-5 text-sm md:text-base text-slate-600 leading-relaxed">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* END CTA */}
          <div className="mt-14 rounded-3xl overflow-hidden bg-[#0A2E2A] relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full" />
            <div className="relative p-8 md:p-10 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                Buying or selling in Gandhinagar?
              </h3>
              <p className="text-slate-300 text-sm md:text-base mb-7 max-w-md mx-auto">
                GandhinagarHomes is the region's dedicated resale property
                platform — genuine listings, verified buyers, zero broker spam.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/buy-property-in-gandhinagar-gujarat"
                  className="bg-white text-[#0A2E2A] px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300"
                >
                  Browse Properties
                </Link>
                <Link
                  href="/sell-property-in-gandhinagar-gujarat"
                  className="bg-white/5 border border-white/20 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  List Your Property
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* RELATED POSTS */}
        <section className="bg-slate-50 py-14 md:py-16 border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 mb-8">
              Keep reading
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-[0_10px_30px_-16px_rgba(4,76,67,0.18)] hover:shadow-[0_18px_40px_-18px_rgba(4,76,67,0.3)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`relative h-28 bg-gradient-to-br ${r.accent}`}>
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20">
                      {r.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm md:text-base font-bold tracking-tight leading-snug group-hover:text-[#044c43] transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    <div className="mt-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      {r.readTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
