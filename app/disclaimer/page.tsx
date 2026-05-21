'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Disclaimer() {
  return (
    <main className="bg-white min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">

        <Link href="/" className="inline-flex items-center gap-2 text-[#006A58] hover:text-[#005445] font-semibold text-sm mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Disclaimer</h1>
          <p className="text-gray-600 text-sm">Last updated: Sep 04, 2023</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p>
            GandhinagarHomes.com is only acting as a medium for providing online advertising services. GandhinagarHomes.com does not in any way facilitate and cannot be deemed to be facilitating sales between developers and the visitors/users of the website.
          </p>

          <p>
            All information in relation to the project whether written, visual representation or oral, as made available on GandhinagarHomes.com are all information as provided, described and supplied by the concerned developer.
          </p>

          <p>
            The pictures / photos / visuals / videos shown here include artist’s impression of the property being displayed and have been provided by the developers. The actual properties may vary from, and may be inconsistent with, such representations. Further pictures/photos/ representations of furniture and fixtures, surroundings, roads etc. are merely illustrative and shall not be construed to be available with the listed properties or as part of the offerings.
          </p>

          <p>
            Before deciding to purchase or taking any other action, you are requested to exercise due caution and to independently validate and verify all information and details and go through the terms and conditions as included in the documents.
          </p>

          <p>
            The display of information on GandhinagarHomes.com with respect to a developer or project does not guarantee that the developer / project has registered under the Real Estate (Regulation and Development), 2016 or is compliant with the same.
          </p>

          <p>
            You acknowledge that by merely making such information available on GandhinagarHomes.com, GandhinagarHomes Parties are not involved in any ‘unfair trade practice’, as defined under the Act, if such information turns out to be inaccurate, incomplete or false.
          </p>

          <p>
            We may contact you to solicit feedback of your experience and to provide any additional information that you would be eligible for, either as a customer or as a visitor.
          </p>

          <p>
            Neither GandhinagarHomes.com nor any person having any ownership or other interest in either of them and their respective directors, employees, agents and other representatives shall be responsible or liable to you or any other person (a) for any error, falsity, or inaccuracy in the information provided herein or for any omission of information; (b) for any action taken, cost / expenses / losses incurred, by you or any other person, based on the information given on the portal; or (c) for any act or omission of the developers or any default or failure or breach on their part, including with respect to delivery of any services or amenities advertised and any delay in delivery or completion of the property.
          </p>

          <p>
            Please note that this disclaimer is in addition to the provisions of any other disclaimer displayed / listed on GandhinagarHomes.com.
          </p>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-center mb-6">Questions or concerns? Contact our support team.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/contact" className="px-6 py-3 bg-[#006A58] text-white font-semibold rounded-lg hover:bg-[#005445] transition-colors">Contact Support</Link>
              <Link href="/" className="px-6 py-3 border-2 border-[#006A58] text-[#006A58] font-semibold rounded-lg hover:bg-[#006A58]/5 transition-colors">Back to Home</Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
