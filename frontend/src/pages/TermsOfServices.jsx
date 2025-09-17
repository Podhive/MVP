import React from "react";
import {
  Shield,
  FileText,
  Users,
  AlertTriangle,
  Scale,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useState } from "react";
const TermsOfService = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: FileText,
      content: [
        "By creating an account or using PodHive (via website or mobile app), you agree to these Terms of Service and our Privacy Policy. If you do not agree, you must stop using our services.",
      ],
    },
    {
      id: "our-role",
      title: "Our Role",
      icon: Users,
      content: [
        "PodHive is a podcast studio aggregator platform — connecting users with verified studio spaces across cities.",
        "We enable Browse of studio listings, booking of available slots, and seamless communication between hosts and renters.",
        "Note: PodHive is not the service provider of the studios listed. The responsibility for the actual experience rests with the studio partner.",
      ],
    },
    {
      id: "user-accounts",
      title: "User Accounts",
      icon: Shield,
      content: [
        "To access full features, users must create an account with a valid phone number and email.",
        "Keep login credentials safe. You’re responsible for all activity on your account.",
        "Misuse (e.g., booking abuse, impersonation) may lead to suspension.",
      ],
    },
    {
      id: "studio-listings",
      title: "Studio Listings",
      icon: Users,
      content: [
        "Studios are independently listed. Each studio owner agrees to provide accurate descriptions, photos, pricing, and availability.",
        "Maintain safety and cleanliness standards.",
        "Respect confirmed bookings made via PodHive.",
        "PodHive reserves the right to delist studios that receive repeated complaints or violate platform quality guidelines.",
      ],
    },
    {
      id: "payments-fees",
      title: "Payments & Fees",
      icon: FileText,
      content: [
        "Currently, PodHive does not handle online payments. All payments are to be made directly at the studio.",
        "PodHive does not charge any platform fee or service charge to the user for booking.",
        "Studio rates, discounts, and payment methods accepted are determined by the studio owner.",
      ],
    },
    {
      id: "cancellations-refunds",
      title: "Cancellations & Refunds",
      icon: Clock,
      content: [
        "Cancellation or changes in booking is possible through demand, visit contact us page and pull up the request.",
        "Since payments are made at the studio, any refunds are subject to the individual studio's cancellation policy.",
        "PodHive does not process refunds as we do not handle payments.",
      ],
    },
    {
      id: "third-party",
      title: "Third-Party Tools & Integrations",
      icon: Scale,
      content: [
        "PodHive may use or connect to third-party tools, including but not limited to Google Calendar or Apple Calendar for booking sync, map & location APIs for discovery.",
        "We are not liable for service disruptions or data errors caused by these third-party tools.",
      ],
    },
    {
      id: "mobile-app",
      title: "Mobile App Usage",
      icon: Users,
      content: [
        "The PodHive mobile app (Android/iOS) offers booking, listing, and support features.",
        "By using the app, you consent to allowing access to your location for studio suggestions, enabling notifications for booking status, and background sync with your calendar (optional).",
      ],
    },
    {
      id: "support",
      title: "Support & Grievance Redressal",
      icon: FileText,
      content: [
        "Facing issues? Reach out to us: Email: support@podhive.in. We aim to respond within 24 hours (Mon–Fri).",
      ],
    },
    {
      id: "prohibited-conduct",
      title: "Prohibited Conduct",
      icon: AlertTriangle,
      content: [
        "Use fake IDs or impersonate another person/studio.",
        "Harass, threaten, or abuse other users or studio partners.",
        "Interfere with platform security or functionality.",
      ],
    },
    {
      id: "termination",
      title: "Termination",
      icon: AlertTriangle,
      content: [
        "PodHive may suspend or terminate accounts that violate platform policies, receive repeated user complaints, or are found engaging in malicious activity or fraud.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: AlertTriangle,
      content: [
        "PodHive is not responsible for studio safety or hygiene; responsibility lies with the studio.",
        "Delays or failures in studio services.",
        "Injuries, theft, or damage on studio premises.",
      ],
    },
    {
      id: "modifications",
      title: "Modifications to Terms",
      icon: FileText,
      content: [
        "We may revise these Terms from time to time. We’ll notify users via in-app alerts or email. Continued use implies acceptance of updated terms.",
      ],
    },
    {
      id: "governing-law",
      title: "Governing Law",
      icon: Shield,
      content: [
        "These Terms are governed by Indian law. Disputes will be subject to the jurisdiction of courts in Gurgaon.",
      ],
    },
    {
      id: "onboarding-summary",
      title: "Quick Onboarding Summary",
      icon: FileText,
      content: [
        "Sign up, verify and complete your profile.",
        "Browse and select a studio, choose your desired slots and add-ons.",
        "Confirm your booking and get ready to create.",
        "Show up, pay at the studio, and enjoy your session!",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-900 rounded-full mb-6">
            <Scale className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Please read these terms and conditions carefully before using our
            service.
          </p>
          <p className="text-sm text-gray-500">Last updated: January 2025</p>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                Welcome to PodHive. These Terms of Service ("Terms") govern your
                use of our website and services. By using PodHive, you agree to
                these terms in full. If you disagree with any part of these
                terms, then you may not use our service.
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
            Questions about our Terms?
          </h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            If you have any questions about these Terms of Service, please don't
            hesitate to contact our legal team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
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

export default TermsOfService;
