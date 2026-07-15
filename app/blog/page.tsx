// app/blog/page.tsx — SERVER COMPONENT (SEO-first blog listing)
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/blogPosts";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://gandhinagarhomes.com";

export const metadata: Metadata = {
  title: "Gandhinagar Real Estate Blog | Resale Property Insights & Guides | GandhinagarHomes",
  description:
    "Expert guides on resale property in Gandhinagar — 2 BHK & 3 BHK price insights, locality comparisons for Kudasan, Sargasan, Raysan, Randesan & Koba, GIFT City market trends, and seller tips.",
  keywords: [
    "resale property in Gandhinagar",
    "2 BHK resale flat Gandhinagar",
    "3 BHK in Gandhinagar",
    "Gandhinagar real estate blog",
    "property near GIFT City",
    "flats in Kudasan",
    "flats in Sargasan",
  ],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: "Gandhinagar Real Estate Blog | GandhinagarHomes",
    description:
      "Guides and market insights on resale properties in Gandhinagar — localities, prices, GIFT City trends, and selling tips.",
    url: `${BASE_URL}/blog`,
    siteName: "GandhinagarHomes",
    type: "website",
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "GandhinagarHomes Blog",
    url: `${BASE_URL}/blog`,
    description:
      "Insights and guides on resale property in Gandhinagar — prices, localities, and market trends.",
    publisher: {
      "@type": "Organization",
      name: "GandhinagarHomes",
      url: BASE_URL,
    },
    blogPost: BLOG_POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${BASE_URL}/blog/${p.slug}`,
      datePublished: p.date,
    })),
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        @keyframes blogRise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .blog-rise { opacity: 0; animation: blogRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .blog-d1 { animation-delay: 0.08s; }
        .blog-d2 { animation-delay: 0.16s; }
        .blog-d3 { animation-delay: 0.24s; }
        .blog-d4 { animation-delay: 0.32s; }
        .blog-d5 { animation-delay: 0.4s; }
        .blog-d6 { animation-delay: 0.48s; }
        @media (prefers-reduced-motion: reduce) {
          .blog-rise { animation: none; opacity: 1; }
        }
      `}</style>

      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#0A2E2A] py-14 md:py-20">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute inset-0 bg-[radial-gradient(90%_120%_at_85%_-10%,rgba(52,211,153,0.14),transparent_55%)] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <span className="blog-rise inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-[0.2em] uppercase bg-[#8ee3d4]/10 text-[#8ee3d4] rounded-full border border-[#8ee3d4]/20">
              GandhinagarHomes Blog
            </span>
            <h1 className="blog-rise blog-d1 text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] mb-5 tracking-tight">
              Gandhinagar Real Estate,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ee3d4] to-emerald-400">
                Explained.
              </span>
            </h1>
            <p className="blog-rise blog-d2 text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Locality guides, price insights, and honest advice on buying and
              selling resale property in Gandhinagar — written by the team that
              lives and breathes this market.
            </p>
          </div>
        </section>

        {/* FEATURED POST */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
          <Link
            href={`/blog/${featured.slug}`}
            className="blog-rise blog-d3 group grid md:grid-cols-2 rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-[0_24px_60px_-24px_rgba(4,76,67,0.3)] hover:shadow-[0_30px_70px_-24px_rgba(4,76,67,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`relative min-h-[220px] md:min-h-[320px] bg-gradient-to-br ${featured.accent} overflow-hidden`}>
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-6 left-6">
                <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20 backdrop-blur-sm">
                  {featured.category}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 text-white/80 text-sm font-medium">
                Featured
              </div>
            </div>
            <div className="p-7 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mb-4 uppercase tracking-wider">
                <span>{formatDate(featured.date)}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{featured.readTime}</span>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug mb-4 group-hover:text-[#044c43] transition-colors">
                {featured.title}
              </h2>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base mb-6">
                {featured.description}
              </p>
              <span className="inline-flex items-center gap-2 text-[#0b6b53] font-bold text-sm">
                Read article
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </Link>
        </section>

        {/* POST GRID */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {rest.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`blog-rise blog-d${Math.min(i + 4, 6)} group flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-[0_10px_30px_-16px_rgba(4,76,67,0.2)] hover:shadow-[0_20px_44px_-18px_rgba(4,76,67,0.32)] hover:-translate-y-1.5 transition-all duration-300`}
              >
                <div className={`relative h-40 bg-gradient-to-br ${post.accent} overflow-hidden`}>
                  <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] bg-[size:28px_28px]" />
                  <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-700" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20 backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold mb-3 uppercase tracking-wider">
                    <span>{formatDate(post.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold tracking-tight leading-snug mb-3 group-hover:text-[#044c43] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-3">
                    {post.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 text-[#0b6b53] font-bold text-sm">
                    Read article
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden bg-[#0A2E2A] relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
            <div className="relative py-14 px-8 md:px-16 text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to find your resale home in Gandhinagar?
              </h2>
              <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto">
                Browse verified resale listings across Kudasan, Sargasan, Raysan,
                Randesan, Koba and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/buy-property-in-gandhinagar-gujarat"
                  className="bg-white text-[#0A2E2A] px-10 py-3.5 rounded-full font-bold shadow-lg hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300"
                >
                  Browse Properties
                </Link>
                <Link
                  href="/sell-property-in-gandhinagar-gujarat"
                  className="bg-white/5 border border-white/20 text-white px-10 py-3.5 rounded-full font-semibold hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                  List Your Property
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
