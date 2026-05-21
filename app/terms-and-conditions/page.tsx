'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <main className="bg-white min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">

        <Link href="/" className="inline-flex items-center gap-2 text-[#006A58] hover:text-[#005445] font-semibold text-sm mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Terms &amp; Conditions</h1>
          <p className="text-gray-600 text-sm">Last updated: May 2026</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
          <section>
            <p>
              GandhinagarHomes.com – Seller Terms &amp; Conditions
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-4">
              <li>By listing a property on GandhinagarHomes.com, I confirm that I am the legal owner of the property or I am legally authorized by the owner to post the property listing.</li>
              <li>I confirm that all information provided by me including property details, pricing, area, location, approvals, amenities, photographs, videos, and ownership details are true, accurate, and updated.</li>
              <li>I understand that GandhinagarHomes.com is only a technology-enabled property listing platform connecting buyers and sellers directly and is not acting as a broker, agent, legal advisor, or transaction mediator.</li>
              <li>I understand that GandhinagarHomes.com does not guarantee property sale, buyer inquiries, transaction completion, or any financial outcome from the listing.</li>
              <li>I agree that all negotiations, site visits, token amounts, agreements, payments, registrations, possession transfers, and transactions shall be handled directly between the buyer and seller without any responsibility of GandhinagarHomes.com.</li>
              <li>I agree that GandhinagarHomes.com shall not be held responsible for any disputes related to ownership, title, payments, fraud, legal issues, possession, documentation, pricing, or transaction failure.</li>
              <li>I confirm that the property listed by me complies with applicable laws, municipal rules, society norms, and other legal requirements.</li>
              <li>I agree that any false, misleading, fake, duplicate, illegal, or suspicious listing may be removed by GandhinagarHomes.com without prior notice.</li>
              <li>I authorize GandhinagarHomes.com to verify my listing details and request supporting documents whenever required.</li>
              <li>I consent to GandhinagarHomes.com sharing my contact details with genuine interested buyers for property-related communication.</li>
              <li>I agree not to upload any content that is false, offensive, misleading, copyrighted without permission, unlawful, or intended to deceive users.</li>
              <li>I agree not to misuse buyer information received through the platform for spam, harassment, or unrelated promotional activities.</li>
              <li>I understand that GandhinagarHomes.com reserves the right to edit, reject, suspend, remove, or deactivate any listing at its sole discretion.</li>
              <li>I grant GandhinagarHomes.com permission to use, display, promote, advertise, and publish my uploaded property photographs, videos, and descriptions across digital platforms and social media for marketing purposes.</li>
              <li>I agree that GandhinagarHomes.com may contact me regarding listing verification, property updates, promotional services, or platform-related communication.</li>
              <li>I understand that brokers, agents, or third parties posting misleading owner listings may face suspension or permanent removal from the platform.</li>
              <li>I agree that GandhinagarHomes.com shall not be liable for any direct or indirect financial loss, damages, fraud, or legal claims arising from buyer-seller interactions.</li>
              <li>I agree to indemnify and hold harmless GandhinagarHomes.com, its owners, employees, and affiliates against any legal claims, disputes, damages, or liabilities arising due to my listing or actions.</li>
              <li>I understand that GandhinagarHomes.com reserves the right to modify these terms and conditions at any time without prior notice.</li>
              <li>I agree that any disputes related to the use of this platform shall be subject to the jurisdiction of courts located in Ahmedabad/Gandhinagar, Gujarat.</li>
              <li>I confirm that I have read, understood, and agreed to all the above Terms &amp; Conditions before submitting my property listing.</li>
            </ol>
          </section>

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
