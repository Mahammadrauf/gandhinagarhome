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
          <p className="text-gray-600 text-sm">Last updated: July 2026</p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> This website is operated by <strong>Lux Realty</strong>. Please read these terms carefully before using the platform.
            </p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
          
          {/* Section 1: Platform Nature */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Platform Nature & Purpose</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Gandhinagar Homes, operated by <strong>Lux Realty</strong>, is an online property listing platform exclusively for residential resale properties in Gandhinagar, Gujarat. The platform serves as a technology-enabled ecosystem connecting verified buyers and sellers directly.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are <strong>NOT</strong> a broker, agent, real estate advisor, or transaction mediator. Gandhinagar Homes simply provides the platform; all property transactions occur directly between buyers and sellers.
            </p>
          </section>

          {/* Section 2: Payment Policy - CRITICAL */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Payment Policy & Acceptable Uses</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Gandhinagar Homes accepts online payments EXCLUSIVELY for property listing publication and promotion plans.</strong> All payments are processed through CCAvenue and Lux Realty processes all payments on behalf of Gandhinagar Homes.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.1 Our Listing Plans</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We currently offer the following property listing publication plans:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
              <div>
                <p className="font-bold text-gray-900">1. Standard Plan - ₹299 (One-time payment)</p>
                <p className="text-sm text-gray-700">Listing valid for 180 Days • Visible to buyers after approval • Standard inquiry form • Email support</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">2. Featured Plan - ₹14,997 (One-time payment) [Coming Soon]</p>
                <p className="text-sm text-gray-700">30 Days Featured + 150 Days Standard (180 Days Total) • Visible on Home Page • Extra Reach & Visibility • Top 5 Search Ranking • Dedicated WhatsApp Support</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">3. Exclusive Plan - ₹19,997 (One-time payment) [Coming Soon]</p>
                <p className="text-sm text-gray-700">30 Days Exclusive + 150 Days Standard (180 Days Total) • Top positioning on Home Page • Top of Property Page • Maximum Extra Reach • Professional Photoshoot & Video Shoot Included • 16x7 on call support • Dedicated Support Manager</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Payments We Accept</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mb-4">
              <li>Standard Plan payment (₹299 for 180-day listing)</li>
              <li>Featured Plan payment (₹14,997 for 30 days featured + 150 days standard listing)</li>
              <li>Exclusive Plan payment (₹19,997 for 30 days exclusive + 150 days standard listing)</li>
              <li>Plan upgrades or additional property listings</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.3 Payments We DO NOT Accept</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong>The following payments are strictly prohibited and will NOT be accepted through our payment gateway:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mb-4">
              <li>Property purchase price or sale value</li>
              <li>Booking amount or booking fee</li>
              <li>Token amount or token payment</li>
              <li>Advance payment for property purchase</li>
              <li>Brokerage or agent commission</li>
              <li>Registration charges or legal fees</li>
              <li>Any real estate transaction value</li>
              <li>Any amount related to property title transfer or possession</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <strong>Warning:</strong> Users attempting to process prohibited transactions will have their accounts suspended immediately. Gandhinagar Homes and Lux Realty accept no liability for unauthorized transaction attempts.
            </p>
          </section>

          {/* Section 3: User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities & Accuracy</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-2">
              <li>By listing a property on Gandhinagar Homes, you confirm that you are the legal owner or legally authorized representative of the owner.</li>
              <li>All information provided by you (property details, pricing, location, area, approvals, amenities, photographs, videos, and ownership details) must be <strong>true, accurate, and current</strong>.</li>
              <li>You are entirely responsible for the accuracy and legality of all information you publish.</li>
              <li>You warrant that the property complies with all applicable laws, municipal rules, society norms, and local regulations.</li>
              <li>You agree not to upload false, misleading, fake, duplicate, illegal, or suspicious content.</li>
              <li>You agree not to upload copyrighted material without proper authorization.</li>
              <li>You grant Gandhinagar Homes permission to verify your listing details and request supporting documents at any time.</li>
            </ol>
          </section>

          {/* Section 4: Property Transactions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Property Transactions & Buyer-Seller Responsibility</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>All property transactions occur directly between buyers and sellers. Gandhinagar Homes has no role, responsibility, or liability in property transactions.</strong>
            </p>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-2">
              <li>All negotiations, terms, site visits, agreements, and payment arrangements are the sole responsibility of the buyer and seller.</li>
              <li>Gandhinagar Homes does not guarantee property sale, buyer inquiries, transaction completion, or any financial outcome from listing.</li>
              <li>Buyers and sellers must independently verify property title, legal status, clearances, and ownership documentation.</li>
              <li>Gandhinagar Homes strongly recommends consulting a qualified legal advisor before any property transaction.</li>
              <li>We do not verify legal ownership, title deeds, municipal approvals, or property legality. This is the sole responsibility of buyers and sellers.</li>
            </ol>
          </section>

          {/* Section 5: Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Gandhinagar Homes and Lux Realty shall NOT be held responsible or liable for:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mb-4">
              <li>Any disputes, claims, or conflicts between buyers and sellers</li>
              <li>Property ownership issues, title disputes, or legal defects</li>
              <li>Fraud, misrepresentation, or dishonesty by any user</li>
              <li>Payment disputes or unauthorized payment processing</li>
              <li>Unauthorized use of property information</li>
              <li>Physical damage to property or personal injury during site visits</li>
              <li>Non-completion or failure of property transactions</li>
              <li>Any direct or indirect financial loss arising from property transactions</li>
              <li>Loss of data, platform downtime, or technical errors</li>
              <li>Damages arising from third-party actions or external factors</li>
            </ul>
          </section>

          {/* Section 6: Platform Management */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Platform Management & Content Removal</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-2">
              <li>Gandhinagar Homes reserves the right to edit, reject, suspend, remove, or deactivate any listing at its sole discretion without prior notice.</li>
              <li>Any listing that is false, misleading, fake, duplicate, illegal, or violates platform policies will be immediately removed.</li>
              <li>Users who post misleading or fraudulent listings may face permanent suspension or removal from the platform.</li>
              <li>Brokers, agents, or third parties posting as individual property owners are prohibited and will face immediate suspension.</li>
              <li>Gandhinagar Homes reserves the right to monitor all listings for compliance with platform policies and applicable laws.</li>
              <li>We may contact you regarding listing verification, updates, or policy violations at any time.</li>
            </ol>
          </section>

          {/* Section 7: Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-2">
              <li>By uploading content to Gandhinagar Homes, you grant us a perpetual, non-exclusive license to use, display, promote, advertise, and publish your property photographs, videos, and descriptions across all digital platforms and social media for marketing purposes.</li>
              <li>Gandhinagar Homes retains all rights to platform design, functionality, technology, and branding.</li>
              <li>You retain ownership of your property information but grant us the rights specified above.</li>
              <li>You are responsible for ensuring you have the right to grant these permissions and that uploaded content does not infringe on third-party rights.</li>
            </ol>
          </section>

          {/* Section 8: Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Prohibited Activities</h2>
            <p className="text-gray-700 leading-relaxed mb-3">Users are strictly prohibited from:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Uploading false, misleading, or fraudulent property information</li>
              <li>Posting duplicate or competing listings for the same property</li>
              <li>Uploading copyrighted or third-party content without authorization</li>
              <li>Harassment, spam, or abusive communication with other users</li>
              <li>Misusing contact information of other users</li>
              <li>Attempting unauthorized payment transactions</li>
              <li>Hacking, disrupting, or manipulating platform functionality</li>
              <li>Attempting to process prohibited transaction types (as outlined in Section 2.2)</li>
            </ul>
          </section>

          {/* Section 9: Account Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Account Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Gandhinagar Homes reserves the right to terminate any user account immediately, without notice, for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Posting false, misleading, or fraudulent listings</li>
              <li>Violation of any provision in these Terms & Conditions</li>
              <li>Attempting unauthorized or prohibited payment transactions</li>
              <li>Harassment or abusive behavior toward other users</li>
              <li>Breach of platform policies or legal requirements</li>
              <li>Any activity deemed harmful to the platform or other users</li>
            </ul>
          </section>

          {/* Section 10: Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law & Jurisdiction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms & Conditions are governed by the laws of the State of Gujarat, India. Any disputes arising from the use of this platform shall be subject to the exclusive jurisdiction of the courts located in Ahmedabad/Gandhinagar, Gujarat.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Payment Processing:</strong> Lux Realty is the registered legal entity responsible for payment processing on behalf of Gandhinagar Homes through the CCAvenue payment gateway. Until Gandhinagar Homes is registered as an independent legal entity, all payments are processed and managed by Lux Realty.
            </p>
          </section>

          {/* Section 11: Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              By using Gandhinagar Homes, you agree to indemnify and hold harmless Gandhinagar Homes, Lux Realty, and their owners, employees, and affiliates from any legal claims, disputes, damages, liabilities, or losses arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2 mt-3">
              <li>Your use of the platform</li>
              <li>Your property listing or uploaded content</li>
              <li>Your violation of these Terms & Conditions</li>
              <li>Your property transaction or buyer-seller disputes</li>
              <li>Your violation of any applicable law</li>
            </ul>
          </section>

          {/* Section 12: Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Modifications to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              Gandhinagar Homes reserves the right to modify these Terms & Conditions at any time without prior notice. Your continued use of the platform following any changes constitutes your acceptance of the updated terms. We recommend reviewing these Terms regularly.
            </p>
          </section>

          {/* Section 13: Severability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms & Conditions is found to be invalid or unenforceable, such provision shall be severed, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          {/* Section 14: Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              For questions about these Terms & Conditions, please contact us:
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
              <strong>Acknowledgment:</strong> By using Gandhinagar Homes, you confirm that you have read, understood, and agree to be bound by these Terms & Conditions.
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
