"use client";

import React, { useEffect, useRef } from "react";

type LocationItem = {
  id: string | number;
  name: string;
  count: number;
  href?: string;
};

type ExploreLocationsProps = {
  title?: string;
  subtitle?: string;
  locations: LocationItem[];
  allLocationHref?: string;
};

// 🏠 Home icon in theme color
const HomeIcon = () => (
  <svg
    className="w-7 h-7 text-primary"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-7 9 7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V9h6v12" />
  </svg>
);

export default function ExploreLocations({
  title = "Explore Location",
  subtitle = "Discover exceptional residential spaces",
  locations,
  allLocationHref = "/locations",
}: ExploreLocationsProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0 });
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 px-4 sm:px-6 lg:px-4">
          <div>
            {/* 👇 Now black text */}
            <h2 className="text-3xl sm:text-4xl font-bold text-black">{title}</h2>
            <p className="text-black/70 mt-2">{subtitle}</p>
          </div>

          <a
            href={allLocationHref}
            className="hidden sm:inline-flex items-center gap-2 font-semibold text-emerald-900 hover:text-primary transition-colors"
          >
            All Location
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Scrollable location list */}
        <div
          ref={scrollerRef}
          className="relative overflow-x-auto overflow-y-visible px-4 sm:px-6 lg:px-4 snap-x snap-mandatory
                     [-ms-overflow-style:auto] [scrollbar-width:auto]"
        >
          <div className="flex gap-6 min-w-full py-4">
            {locations.map((loc) => {
              const Card = (
                <div
                  className="h-full flex flex-col justify-center rounded-3xl bg-primary/5 ring-1 ring-primary/15
                             shadow-sm hover:shadow-md transition-all duration-200 p-6 sm:p-8 hover:-translate-y-0.5"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white ring-1 ring-primary/20 shadow flex items-center justify-center mb-6">
                    <HomeIcon />
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-emerald-900 leading-snug">
                    {loc.name}
                  </h3>

                  <p className="text-emerald-800/70 mt-2">{loc.count} Properties</p>
                </div>
              );

              return (
                <div
                  key={loc.id}
                  className="snap-start flex-none w-[82%] sm:w-[55%] md:w-[40%] lg:w-[30%] xl:w-[24%]"
                >
                  {loc.href ? (
                    <a
                      href={loc.href}
                      className="block rounded-3xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    >
                      {Card}
                    </a>
                  ) : (
                    <div className="rounded-3xl overflow-hidden">{Card}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 px-4 sm:px-6 lg:px-4 sm:hidden">
          <a
            href={allLocationHref}
            className="inline-flex items-center gap-2 font-semibold text-emerald-900 hover:text-primary transition-colors"
          >
            All Location
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
