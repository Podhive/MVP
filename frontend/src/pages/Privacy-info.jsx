import React from "react";
import {
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Globe,
  FileText,
  AlertTriangle,
  Mail,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useState } from "react";

const PrivacyPolicy = () => {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: FileText,
      content: [
        "A. Personal Information: Name, email, and phone number; Login credentials; Payment information (handled via Razorpay, Stripe, or other third-party gateways)",
        "B. Automatically Collected Data: IP address, browser type, device info; Location (for showing nearby studios); Site usage behavior (via Google Analytics)",
        "C. Optional: Studio preferences; Profile photos (if uploaded); Booking history and feedback",
      ],
    },
    {
      id: "data-use",
      title: "How We Use Your Data",
      icon: Users,
      content: [
        "To create and manage user accounts",
        "To process bookings securely",
        "To recommend relevant studios based on your location or interest",
        "To communicate updates, promotions, and confirmations",
        "For performance, analytics, and improving platform UX",
      ],
    },
    {
      id: "data-sharing",
      title: "Who We Share With",
      icon: Users,
      content: [
        "We do not sell your data. However, we share it with: Studios you book with (only necessary details); Payment processors (for transactions); Third-party services (e.g., analytics, cloud hosting); Legal authorities (if required by law)",
      ],
    },
    {
      id: "children-privacy",
      title: "Children’s Privacy",
      icon: Shield,
      content: [
        "If you are under 18, you must have consent from a parent or guardian to use PodHive. We reserve the right to disable accounts that violate this policy.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      icon: Globe,
      content: [
        "We use cookies to: Keep you logged in; Track studio browsing and improve experience; Analyze traffic with tools like Google Analytics",
        "You can block cookies through your browser settings.",
      ],
    },
    {
      id: "promotional-communication",
      title: "Promotional Communication",
      icon: Mail,
      content: [
        "With your consent, we may send: Newsletters, discount offers, new studio updates",
        "You can opt-out at any time via the unsubscribe link in emails.",
      ],
    },
    {
      id: "security",
      title: "Security",
      icon: Lock,
      content: [
        "We protect your data using: Encrypted storage; Secure HTTPS connections; Access control and platform audits",
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights",
      icon: Shield,
      content: [
        "You may: View or edit your account info; Request deletion of your data; Withdraw marketing consent",
        "To exercise these, email us at: support@podhive.in",
      ],
    },
    {
      id: "retention",
      title: "Retention",
      icon: Database,
      content: [
        "We keep your data: As long as your account is active; Or for legal and business purposes (invoices, logs)",
      ],
    },
    {
      id: "updates-policy",
      title: "Updates to This Policy",
      icon: AlertTriangle,
      content: ["Any major updates will be notified via email or on the site."],
    },
    {
      id: "contact",
      title: "Contact",
      icon: Users,
      content: ["Email: privacy@podhive.com", "Entity: PodHive Studios."],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-900 rounded-full mb-6">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500">Last updated: January 2025</p>
        </div>

        {/* Privacy Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                At PodHive, we are committed to protecting your privacy and
                ensuring the security of your personal information. This Privacy
                Policy describes how we collect, use, and safeguard your data
                when you use our platform to discover and book podcast studios.
              </p>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="p-8">
                  <div className="flex items-start mb-6">
                    <div className="bg-indigo-900 p-3 rounded-xl mr-4 flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {index + 1}. {section.title}
                      </h2>
                    </div>
                  </div>

                  <div className="ml-16">
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-indigo-900 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                          <p className="text-gray-700 leading-relaxed">
                            {item}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 bg-indigo-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Questions about your Privacy?
          </h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            If you have any questions about this Privacy Policy or how we handle
            your data, please contact our privacy team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-900 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Contact Team
            </a>
            <a
              href="mailto:care.podhive@gmail.com"
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors font-semibold border border-white/20"
            >
              care.podhive@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
