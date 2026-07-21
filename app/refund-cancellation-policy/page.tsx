'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RefundCancellationPolicy() {
  return (
    <main className="bg-white min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">

        <Link href="/" className="inline-flex items-center gap-2 text-[#006A58] hover:text-[#005445] font-semibold text-sm mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Refund & Cancellation Policy</h1>
          <p className="text-gray-600 text-sm">Last updated: July 2026</p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This policy applies to property listing service charges only. Please refer to our <Link href="/terms-and-conditions" className="font-semibold text-blue-900 hover:underline">Terms & Conditions</Link> for information about property transactions.
            </p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none space-y-8 text-gray-700">

          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              This Refund & Cancellation Policy applies to all property listing service charges paid to Gandhinagar Homes (operated by Lux Realty). This policy outlines the conditions under which refunds, cancellations, and refunds may be processed.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Important:</strong> This policy applies ONLY to platform listing service charges. It does NOT apply to property sales, booking amounts, token amounts, advances, or any real estate transaction values, which are handled directly between buyers and sellers.
            </p>
          </section>

          {/* Section 2: Non-Refundable Charges */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Non-Refundable Listing Charges</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Once a property listing has been reviewed and published on Gandhinagar Homes, all listing charges become NON-REFUNDABLE.</strong>
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">This includes charges for all our listing plans:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mb-4">
              <li><strong>Standard Plan (₹299):</strong> Once your property listing is published for the 180-day period</li>
              <li><strong>Featured Plan (₹14,997):</strong> Once your property becomes featured on the home page for 30 days + standard listing for 150 days</li>
              <li><strong>Exclusive Plan (₹19,997):</strong> Once your property achieves exclusive top positioning for 30 days + standard listing for 150 days</li>
            </ul>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>Reason:</strong> Once your listing is published and appears on the platform, it immediately provides value and visibility to potential buyers. The platform begins offering marketing, distribution, and exposure benefits from the moment of publication.
              </p>
            </div>
          </section>

          {/* Section 3: Refundable Conditions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refundable Conditions</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Refunds may be processed in the following limited circumstances:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.1 Technical Issues or Platform Errors</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If a payment is made successfully but the listing <strong>cannot be published</strong> due to a technical issue, platform error, or system malfunction on Gandhinagar Homes' side, an appropriate refund may be processed after investigation.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Customer must report the issue within 24 hours of payment</li>
              <li>Gandhinagar Homes will investigate the technical problem</li>
              <li>If the issue is confirmed as a platform error, a refund will be initiated</li>
              <li>Refund processing typically takes 5-7 business days</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Duplicate Payment</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If a duplicate payment is accidentally processed (e.g., double charge due to technical error), the duplicate amount will be refunded.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Customer must report the duplicate charge within 48 hours</li>
              <li>Gandhinagar Homes will verify the duplicate transaction</li>
              <li>The duplicate amount will be refunded promptly</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.3 Cancellation Before Review & Publication</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Cancellation requests for Standard, Featured, or Exclusive plans before a listing has been reviewed and published may be considered at Gandhinagar Homes' sole discretion.</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Cancellation request must be submitted within 24 hours of payment</li>
              <li>The listing must not have been published or made live on the platform</li>
              <li>A processing/administrative fee of 10-15% may be deducted</li>
              <li>The balance may be refunded, subject to approval</li>
              <li>Featured and Exclusive plans follow the same pre-publication cancellation policy</li>
            </ul>
          </section>

          {/* Section 4: Non-Refundable Scenarios */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Non-Refundable Scenarios</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The following situations are <strong>NOT eligible for refunds:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Listing has been published and is currently live on the platform</li>
              <li>User wishes to remove or delist a property after publication</li>
              <li>User is unsatisfied with the platform or listing results</li>
              <li>User did not receive sufficient inquiries or interest</li>
              <li>User deleted their own listing</li>
              <li>Listing was suspended due to policy violation by the user</li>
              <li>User changed their mind after listing publication</li>
              <li>Payment processing delay or delay in listing publication</li>
            </ul>
          </section>

          {/* Section 5: Refund Process */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Refund Process & Timelines</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 How to Request a Refund</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-2 mb-4">
              <li>Send a refund request email to <a href="mailto:support@gandhinagarhomes.com" className="text-[#006A58] hover:text-[#005445] font-semibold">support@gandhinagarhomes.com</a></li>
              <li>Include your transaction ID, listing details, and reason for refund request</li>
              <li>Gandhinagar Homes will review your request and respond within 5-7 business days</li>
              <li>If approved, the refund will be initiated to your original payment method</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Refund Processing Timeline</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Refund request review: 5-7 business days</li>
              <li>Refund approval processing: 2-3 business days</li>
              <li>Bank/card processing (after approval): 5-10 business days</li>
              <li>Total timeline: 12-20 business days from initial request</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Note:</strong> Refund timelines depend on your bank or payment processor. Some banks may take additional time to credit refunds.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.3 Refund Method</h3>
            <p className="text-gray-700 leading-relaxed">
              All approved refunds will be processed to the original payment method used for the purchase. If payment was made via credit/debit card, the refund will be credited back to that card within 7-10 business days after approval.
            </p>
          </section>

          {/* Section 6: Cancellation Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Listing Cancellation Policy</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 User-Initiated Cancellation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Users may cancel or delist their published property listings at any time through their account dashboard. <strong>However, cancellation of a published listing does NOT entitle you to a refund of listing charges already paid.</strong>
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">6.2 Gandhinagar Homes-Initiated Cancellation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Gandhinagar Homes reserves the right to cancel or remove listings that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Violate the Terms & Conditions or Refund Policy</li>
              <li>Contain false, misleading, or fraudulent information</li>
              <li>Include prohibited content or images</li>
              <li>Result from user policy violations</li>
              <li>Are reported as inappropriate or illegal by other users</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>In these cases, no refund will be issued.</strong>
            </p>
          </section>

          {/* Section 7: Property Transaction Refunds */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Property Transaction Amounts (NOT Covered)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>This Refund & Cancellation Policy does NOT apply to property transaction amounts or real estate transaction values.</strong>
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Gandhinagar Homes is exclusively a property listing platform. We do NOT accept or process payments for property transactions. The following are handled directly between buyers and sellers and are NOT processed through our payment system:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Property purchase price or sale value</li>
              <li>Booking amount or token payment</li>
              <li>Advance payment for property</li>
              <li>Brokerage or agent fees for property transactions</li>
              <li>Registration or legal fees</li>
              <li>Any funds related to property title or possession transfer</li>
            </ul>
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900">
                <strong>Important:</strong> Gandhinagar Homes and Lux Realty process ONLY listing publication charges (Standard, Featured, or Exclusive plans). We have NO responsibility or liability for disputes or refund requests related to property transaction amounts. All such transactions occur directly between buyers and sellers.
              </p>
            </div>
          </section>

          {/* Section 8: Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Policy Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              Gandhinagar Homes reserves the right to modify this Refund & Cancellation Policy at any time. Changes will be effective immediately upon publication. Users are responsible for reviewing the policy regularly. Continued use of the platform constitutes acceptance of any modifications.
            </p>
          </section>

          {/* Section 9: Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact for Refund Inquiries</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              For refund requests, disputes, or questions about this policy:
            </p>
            <div className="bg-[#006A58]/5 border border-[#006A58]/20 rounded-xl p-6 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email</p>
                <p className="text-lg font-semibold text-gray-900">
                  <a href="mailto:support@gandhinagarhomes.com" className="text-[#006A58] hover:text-[#005445] transition-colors">
                    support@gandhinagarhomes.com
                  </a>
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Address</p>
                <p className="text-lg font-semibold text-gray-900">
                  414, Pramukh Square<br />
                  Sargasan, Gandhinagar<br />
                  Gujarat, India - 382421
                </p>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-center mb-6">
              <strong>Acknowledgment:</strong> By using Gandhinagar Homes' listing services, you acknowledge that you have read and agree to this Refund & Cancellation Policy.
            </p>
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
