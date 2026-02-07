'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    // Reduced top padding from pt-32 to pt-16 to pull content up
    <main className="bg-white min-h-screen pt-16 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#006A58] hover:text-[#005445] font-semibold text-sm mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-sm">
            Last updated: February 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-8">
          
          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              GandhinagarHomes ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise process personal information in connection with our website, mobile application, and related services (collectively, the "Platform").
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              We respect your privacy and are committed to being transparent about the data we collect and how we use it. This policy describes our privacy practices in clear and simple language.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information in various ways to provide and improve our services:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 ml-2">
              <li><strong>Name and Contact Information:</strong> First name, last name, email address, and phone/WhatsApp number</li>
              <li><strong>Property Information:</strong> Details about properties you list, buy, or inquire about, including location, type, price, and descriptions</li>
              <li><strong>Account Information:</strong> Login credentials, account preferences, and user role (buyer/seller)</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our Platform, including pages visited, features used, and browsing patterns</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
            </ul>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 ml-2">
              <li>Creating and maintaining your user account</li>
              <li>Sending you verification codes (OTP) via WhatsApp and email</li>
              <li>Facilitating property listings, searches, and inquiries</li>
              <li>Communicating with you about transactions and service updates</li>
              <li>Improving our Platform features and user experience</li>
              <li>Sending promotional content and newsletters (with your consent)</li>
              <li>Analyzing user behavior to optimize our services</li>
              <li>Complying with legal obligations and resolving disputes</li>
              <li>Protecting against fraud and security threats</li>
            </ul>
          </section>

          {/* Section 4: Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Data Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>We do not sell, trade, or rent your personal information to third parties.</strong> However, we may share your data in the following limited circumstances:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 ml-2">
              <li><strong>Service Providers:</strong> We share information with third-party providers who assist us in operating our Platform, such as OTP service providers, cloud hosting services, analytics providers, and payment processors</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required by law, court order, or government request to comply with legal obligations</li>
              <li><strong>Property Interactions:</strong> When you list a property or respond to an inquiry, relevant property information may be shared with interested buyers or sellers</li>
              <li><strong>Business Transfers:</strong> If GandhinagarHomes is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction</li>
            </ul>
          </section>

          {/* Section 5: Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure socket technology, and access controls.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              However, <strong>no method of transmission over the internet or electronic storage is 100% secure.</strong> We cannot guarantee absolute security of your information. You are responsible for maintaining the confidentiality of your login credentials and account information.
            </p>
          </section>

          {/* Section 6: Cookies & Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Cookies & Tracking Technologies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Platform uses cookies and similar tracking technologies to enhance your experience. These technologies help us:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 ml-2">
              <li>Remember your login information and preferences</li>
              <li>Analyze user behavior and Platform performance</li>
              <li>Deliver personalized content and recommendations</li>
              <li>Track analytics to improve our services</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can manage cookie preferences through your browser settings. However, disabling cookies may limit your ability to use certain features of our Platform.
            </p>
          </section>

          {/* Section 7: User Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-700 ml-2">
              <li><strong>Access:</strong> You can request to know what personal information we hold about you</li>
              <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> You can request deletion of your personal information, subject to legal and contractual obligations</li>
              <li><strong>Opt-Out:</strong> You can opt out of marketing communications by clicking the unsubscribe link in our emails</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          {/* Section 8: Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our Platform may contain links to external websites and services that are not operated by GandhinagarHomes. This Privacy Policy does not apply to third-party websites, and we are not responsible for their privacy practices, content, or security.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              We recommend reviewing the privacy policies of any external sites before providing your personal information.
            </p>
          </section>

          {/* Section 9: Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will notify you by updating the "Last updated" date at the top of this policy and, where appropriate, providing additional notice.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Your continued use of the Platform following any changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Section 10: Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have questions about this Privacy Policy, our privacy practices, or wish to exercise your rights, please contact us:
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
                  Gujarat, India
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone</p>
                <p className="text-lg font-semibold text-gray-900">
                  <a href="tel:+919998274454" className="text-[#006A58] hover:text-[#005445] transition-colors">
                    +91 99982 74454
                  </a>
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer CTA */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-center mb-6">
            Have more questions? Visit our help center or contact our support team.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/contact" className="px-6 py-3 bg-[#006A58] text-white font-semibold rounded-lg hover:bg-[#005445] transition-colors">
              Contact Support
            </Link>
            <Link href="/" className="px-6 py-3 border-2 border-[#006A58] text-[#006A58] font-semibold rounded-lg hover:bg-[#006A58]/5 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}