// app/page.tsx — SERVER COMPONENT (no "use client")
import dynamic from "next/dynamic";

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import KeyFeatures from '@/components/KeyFeatures';
import FeaturedProperties from '@/components/FeaturedProperties';
import ExclusiveProperties from '@/components/ExclusiveProperties';
import Experience from '@/components/Experience';
import WhyChoose from '@/components/WhyChoose';
import WhyInvest from '@/components/WhyInvest';
import ExploreListing from '@/components/ExploreListing'; // working client/server-safe component
import Footer from '@/components/Footer';

// Client-only sections to avoid "Unsupported Server Component type" errors
const ExploreLocations = dynamic(() => import('@/components/ExploreLocations'), { ssr: false });
const ContactUs = dynamic(() => import('@/components/ContactUs'), { ssr: false });

export default function Home() {
  // --- plain JSON data only ---
  const allProps: any[] = [];

  const locations = [
    { id: 'koba',   name: 'Koba, Gandhinagar',   count: 13, href: '/listings?loc=koba' },
    { id: 'kudasan', name: 'Kudasan, Gandhinagar', count: 24, href: '/listings?loc=kudasan' },
    { id: 'randesan', name: 'Randesan, Gandhinagar', count: 20, href: '/listings?loc=randesan' },
    { id: 'raysan',   name: 'Raysan, Gandhinagar',   count: 40, href: '/listings?loc=raysan' },
    { id: 'sargasan', name: 'Sargasan, Gandhinagar', count: 44, href: '/listings?loc=sargasan' },
  ];

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <KeyFeatures />
      
      {/* --- UPDATED ORDER --- */}
      <ExclusiveProperties />
      <FeaturedProperties />
      {/* --- END UPDATED ORDER --- */}

      <Experience />
      <WhyChoose />
      <WhyInvest />

      {/* Your BHK/Bungalow/Plot filtered listings */}
      <ExploreListing properties={allProps} />

      {/* Explore by Location */}
      <ExploreLocations/>

      {/* 👇 New: Contact Us form directly under Explore Locations */}
      <ContactUs />

      <Footer />
    </main>
  );
}