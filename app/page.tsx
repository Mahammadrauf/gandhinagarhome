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
import WhatsAppChat from '@/components/WhatsAppChat';

// Client-only sections to avoid "Unsupported Server Component type" errors
const ExploreLocations = dynamic(() => import('@/components/ExploreLocations'), { ssr: false });
const ContactUs = dynamic(() => import('@/components/ContactUs'), { ssr: false });

export default function Home() {
  // --- plain JSON data only ---
  const allProps = [
    { id: '2-101', title: '2BHK for Sale in Gandhinagar',
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      price: '₹65 L', location: 'Kudasan', beds: 2, baths: 2, sqft: '1,150',
      features: ['Club Access', 'City View'], tag: { text: 'Featured', color: 'bg-yellow-500 text-white' }, tier: 'featured' },
    { id: '2-102', title: '2BHK for Sale in Adalaj',
      image: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=1200&q=80',
      price: '₹58 L', location: 'Adalaj', beds: 2, baths: 2, sqft: '980',
      features: ['Park Facing', 'Ready to Move'], tag: { text: 'New', color: 'bg-primary text-white' }, tier: 'standard' },
      { id: '2-103',
    title: 'Bungalow for sale in Gandhinagar',
    image: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80',
    price: '₹3.60 Cr', location: 'Raysan', baths: 4, sqft: '4,200',
    features: ['Private Garden', 'Parking'],
    tag: { text: 'Premium', color: 'bg-primary text-white' },
    tier: 'featured',
    category: '2bhk'
  },

  // ADD PLOT into 2BHK tab
  { id: '2-103',
    title: 'Residential Plot in Koba',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    price: '₹95 L', location: 'Koba', baths: 0, sqft: '2,400',
    features: ['Corner', 'Wide Road'],
    tag: { text: 'New', color: 'bg-primary text-white' },
    tier: 'standard',
    category: '2bhk'
  },

  // OPTIONAL: add any 1 more for total 5
  { id: '2-104',
    title: '2BHK in Randesan',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    price: '₹62 L', location: 'Randesan', beds: 2, baths: 2, sqft: '1,050',
    features: ['City View', 'Near School'],
    tag: { text: 'Hot', color: 'bg-red-500 text-white' },
    tier: 'featured',
    category: '2bhk'
  },

    { id: '3-201', title: '3BHK for Sale in Sargasan',
      image: 'https://images.unsplash.com/photo-1505692952047-1a78307da8e8?auto=format&fit=crop&w=1200&q=80',
      price: '₹1.15 Cr', location: 'Sargasan', beds: 3, baths: 3, sqft: '1,780',
      features: ['High Floor', 'Club Access'], tag: { text: 'Exclusive', color: 'bg-yellow-500 text-white' }, tier: 'exclusive' },
    { id: '3-202', title: '3BHK for Sale in Torda',
      image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?auto=format&fit=crop&w=1200&q=80',
      price: '₹98 L', location: 'Torda', beds: 3, baths: 3, sqft: '1,520',
      features: ['Garden View', 'Home Office'], tag: { text: 'New', color: 'bg-primary text-white' }, tier: 'standard' },

    { id: '4-301', title: '4BHK for Sale in Sector 10',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      price: '₹2.35 Cr', location: 'Sector 10', beds: 4, baths: 4, sqft: '3,120',
      features: ['Terrace Deck', '2 Car Parks'], tag: { text: 'Private', color: 'bg-purple-500 text-white' }, tier: 'exclusive' },
    { id: '4-302', title: '4BHK for Sale in Gift City',
      image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
      price: '₹1.95 Cr', location: 'Gift City', beds: 4, baths: 3, sqft: '2,650',
      features: ['Riverfront', 'Premium Location'], tag: { text: 'Premium', color: 'bg-primary text-white' }, tier: 'featured' },

    // extras for ExploreListing tabs
    { id: 'bung-501', title: 'Bungalow for sale in Gandhinagar',
      image: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80',
      price: '₹3.60 Cr', location: 'Raysan', baths: 4, sqft: '4,200',
      features: ['Private Garden', 'Parking'], tag: { text: 'Premium', color: 'bg-primary text-white' }, tier: 'featured', category: 'bungalow' },
    { id: 'plot-601', title: 'Residential Plot in Koba',
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      price: '₹95 L', location: 'Koba', baths: 0, sqft: '2,400',
      features: ['Corner', 'Wide Road'], tag: { text: 'New', color: 'bg-primary text-white' }, tier: 'standard', category: 'plot' },
  ];

  const locations = [
    { id: 'koba',     name: 'Koba, Gandhinagar',     count: 13, href: '/listings?loc=koba' },
    { id: 'kudasan',  name: 'Kudasan, Gandhinagar',  count: 24, href: '/listings?loc=kudasan' },
    { id: 'randesan', name: 'Randesan, Gandhinagar', count: 20, href: '/listings?loc=randesan' },
    { id: 'raysan',   name: 'Raysan, Gandhinagar',   count: 40, href: '/listings?loc=raysan' },
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
      <WhatsAppChat />
    </main>
  );
}