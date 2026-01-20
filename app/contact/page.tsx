import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us - Convert.Work',
  description: 'Get in touch with Convert.Work team. Contact us for questions, feedback, or support regarding our file conversion service.',
  keywords: 'contact convert.work, support, help, file converter contact',
  openGraph: {
    title: 'Contact Us - Convert.Work',
    description: 'Get in touch with Convert.Work team. Contact us for questions, feedback, or support.',
    url: 'https://www.convert.work/contact',
    siteName: 'Convert.Work',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 gradient-text">Contact Us</h1>
          <p className="text-lg text-gray-600">Get in touch with the Convert.Work team</p>
        </header>

        <main className="space-y-8">
          <section className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-lg text-gray-600 text-center mb-8">
              We'd love to hear from you! Whether you have questions about our service,
              feedback, or need support, feel free to reach out.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-envelope text-blue-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p>
                  <a href="mailto:hello@convert.work" className="text-blue-600 hover:text-blue-700 font-medium">
                    hello@convert.work
                  </a>
                </p>
                <p className="text-sm text-gray-600 mt-2">Our primary contact method. We typically respond within 24 hours.</p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-question-circle text-green-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">FAQ</h3>
                <p className="text-sm text-gray-600">Check our frequently asked questions for quick answers.</p>
                <p className="text-sm text-gray-600 mt-1">Coming soon - we're working on comprehensive documentation.</p>
              </div>

              <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bug text-orange-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Issues</h3>
                <p className="text-sm text-gray-600">Found a bug or having trouble with conversions?</p>
                <p className="text-sm text-gray-600 mt-1">Please email us with details about the issue.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Can Help With</h2>
                <ul className="grid md:grid-cols-2 gap-2 text-gray-600">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Questions about file conversion features
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Technical support and troubleshooting
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Feature requests and suggestions
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Partnership and business inquiries
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    Privacy and security concerns
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    General feedback and comments
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Response Time</h2>
                <p className="text-gray-600 leading-relaxed">
                  We strive to respond to all inquiries within 24-48 hours during business days.
                  For urgent technical issues, please include "URGENT" in your email subject line.
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-12 text-center">
          <div className="space-x-4">
            <a 
              href="mailto:hello@convert.work" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <i className="fas fa-envelope mr-2"></i>
              Send Email
            </a>
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Converter
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}