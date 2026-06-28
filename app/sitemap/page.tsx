import Link from 'next/link'
import React from 'react'
import { generatePropertyUrl } from '../../lib/propertyUrl'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gandhinagarhomes.com/api'

async function fetchAllProperties() {
  try {
    const res = await fetch(`${API_BASE_URL}/properties`)
    if (!res.ok) return []
    const json = await res.json()
    if (json && json.success && Array.isArray(json.data)) return json.data
    if (Array.isArray(json)) return json
    return []
  } catch (e) {
    console.error('Error fetching properties for sitemap page', e)
    return []
  }
}

export default async function SitemapPage() {
  const properties = await fetchAllProperties()

  const staticPages = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/buy-property-in-gandhinagar-gujarat', label: 'Buy' },
    { href: '/buy-property-in-gandhinagar-gujarat/search', label: 'Buy — Search' },
    { href: '/buy-property-in-gandhinagar-gujarat/subscription', label: 'Buy — Subscription' },
    { href: '/sell-property-in-gandhinagar-gujarat', label: 'Sell' },
    { href: '/sell-property-in-gandhinagar-gujarat/form', label: 'Sell — Form' },
    { href: '/sell-property-in-gandhinagar-gujarat/subscription', label: 'Sell — Subscription' },
    { href: '/sell-property-in-gandhinagar-gujarat/confirmation', label: 'Sell — Confirmation' },
    { href: '/profile', label: 'Profile' },
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
    { href: '/disclaimer', label: 'Disclaimer' }
  ]

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Sitemap</h1>
        <p className="text-sm text-gray-600">HTML sitemap of pages and properties on the site.</p>
        <p className="mt-2 text-sm"><Link href="/sitemap.xml" className="text-blue-600 underline">XML sitemap</Link></p>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-medium mb-3">Pages</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {staticPages.map(p => (
            <li key={p.href}>
              <Link href={p.href} className="text-blue-600 hover:underline">{p.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-3">Properties ({properties.length})</h2>
        {properties.length === 0 ? (
          <p className="text-sm text-gray-600">No properties found.</p>
        ) : (
          <ul className="space-y-2">
            {properties.map((p: any) => {
              const title = p.title || p.name || 'Property'
              const id = p.propertyid || p._id || ''
              const slug = generatePropertyUrl(title, id, (p.specifications && p.specifications.bhk) || undefined, (p.location && p.location.city) || undefined)
              const href = `/properties/${slug}`
              return (
                <li key={id || slug}>
                  <Link href={href} className="text-blue-600 hover:underline">{title}{id ? ` — ${id}` : ''}</Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
