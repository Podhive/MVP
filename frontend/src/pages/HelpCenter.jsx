import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Book,
  Users,
  Settings,
  Mic,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Topics", icon: Book },
    { id: "booking", name: "Booking", icon: MessageCircle },
    { id: "studio", name: "Studio Management", icon: Mic },
    { id: "account", name: "Account", icon: Users },
    { id: "technical", name: "General & Technical", icon: Settings },
  ];

  const faqs = [
    // General & Technical
    {
      id: 1,
      category: "technical",
      question: "What is PodHive?",
      answer:
        "PodHive is a discovery and booking platform that connects creators with top-rated podcast studios. We help you compare, shortlist, and book verified studio spaces near you.",
    },
    {
      id: 2,
      category: "technical",
      question: "Is PodHive available in my city?",
      answer:
        "We're currently active in Delhi NCR. We’re expanding quickly — follow us on Instagram for updates or drop us a request via our Contact Us form!",
    },
    // For Creators / Users (Booking)
    {
      id: 3,
      category: "booking",
      question: "How do I book a podcast studio?",
      answer:
        "Sign in to PodHive, browse studios by location, amenities, or ratings, choose your preferred slot and time. You can then contact the studio to confirm and pay directly upon arrival.",
    },
    {
      id: 4,
      category: "booking",
      question: "Can I reschedule or cancel my booking?",
      answer:
        "Cancellation or changes in booking is possible through demand, visit contact us page and pull up the request.",
    },
    {
      id: 5,
      category: "booking",
      question: "Will I get a refund if I cancel?",
      answer:
        "Since all payments are made directly at the studio, any refund requests upon cancellation are subject to the studio's individual policies. Please confirm with the studio directly.",
    },
    {
      id: 6,
      category: "booking",
      question: "What if the studio denies me entry or cancels last minute?",
      answer:
        "In such cases, please contact our support team immediately. We’ll investigate and help you arrange an alternative if possible.",
    },
    {
      id: 7,
      category: "booking",
      question: "How do I know a studio is legit?",
      answer:
        "All studios on PodHive are manually verified. We list only those with clear images, verified ownership, and a basic quality standard.",
    },
    // For Studio Owners / Hosts
    {
      id: 8,
      category: "studio",
      question: "How do I list my studio on PodHive?",
      answer:
        "Click on “List Your Studio” from the homepage and fill out your details. Our team will verify and activate your listing within 48 hours.",
    },
    {
      id: 9,
      category: "studio",
      question: "Can I set my own prices and policies?",
      answer:
        "Yes! You control your hourly pricing, available slots, cancellation rules, and add-on services which customers will see on your listing.",
    },
    {
      id: 10,
      category: "studio",
      question: "How do I receive payments?",
      answer:
        "As all payments are made directly by the creators at your studio, you will receive payments on the spot. PodHive currently does not process payments on your behalf.",
    },
    {
      id: 11,
      category: "studio",
      question: "Can I block dates or modify availability?",
      answer:
        "Yes, log into your studio dashboard and block out dates/times as needed. This helps creators know when you are available.",
    },
    // Payments & Refunds
    {
      id: 12,
      category: "booking",
      question: "What payment methods are supported?",
      answer:
        "Currently, we are not accepting online payments. 'Pay at Studio' is the only available option, and payments should be made directly to the studio upon arrival.",
    },
    {
      id: 14,
      category: "booking",
      question: "How long do refunds take?",
      answer:
        "Refund processing times are determined by the individual studio's policy, as payments and cancellations are handled directly with them.",
    },
    // Account & App
    {
      id: 15,
      category: "account",
      question: "Can I use PodHive without signing up?",
      answer:
        "You can browse studios, but booking or messaging requires a free PodHive account.",
    },
    {
      id: 16,
      category: "account",
      question: "How do I delete or deactivate my account?",
      answer:
        "Email us at care.podhive@gmail.com with your registered email and request for deletion. We’ll process it within 72 hours.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-900 rounded-full mb-6">
            <Book className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions about booking studios, managing
            listings, and using PodHive.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center p-3 rounded-xl transition-all ${
                        selectedCategory === category.id
                          ? "bg-indigo-900 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 mt-2">
                  {filteredFaqs.length}{" "}
                  {filteredFaqs.length === 1 ? "result" : "results"} found
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="p-6">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex justify-between items-start text-left group"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-900 transition-colors pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="h-6 w-6 text-indigo-600" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        )}
                      </div>
                    </button>

                    {expandedFaq === faq.id && (
                      <div className="mt-4 pr-8">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="p-12 text-center">
                  <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any articles matching your search. Try
                    different keywords or browse by category.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 bg-indigo-900 rounded-2xl p-8 text-center text-white">
          <MessageCircle className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help
            you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-900 rounded-xl hover:bg-gray-50 transition-colors font-semibold shadow-lg"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Support
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <a
              href="mailto:care.podhive@gmail.com"
              className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors font-semibold border border-white/20"
            >
              Email Us Directly
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
