import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions - Convert.Work',
  description: 'Read Convert.Work terms and conditions for using our free online file converter service.',
  keywords: 'terms and conditions, service terms, convert.work terms',
  openGraph: {
    title: 'Terms & Conditions - Convert.Work',
    description: 'Read Convert.Work terms and conditions for using our free online file converter service.',
    url: 'https://www.convert.work/terms',
    siteName: 'Convert.Work',
    type: 'website',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 gradient-text">Terms & Conditions</h1>
          <p className="text-lg text-gray-600">Terms for using our file conversion service</p>
        </header>

        <main className="space-y-8">
          <section className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-sm text-gray-500 mb-6"><em>Last updated: January 15, 2025</em></p>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using Convert.Work, you accept and agree to be bound by terms
                  and provision of this agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Use License</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Permission is granted to temporarily use Convert.Work for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a transfer of title,
                  and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Modify or copy the service</li>
                  <li>Use the service for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software</li>
                  <li>Remove any copyright or other proprietary notations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">File Conversion Terms</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Maximum file size: 100MB per file</li>
                  <li>Maximum 25 conversions per day</li>
                  <li>Maximum 5 conversions per hour</li>
                  <li>Files are automatically deleted after processing</li>
                  <li>We reserve the right to reject inappropriate or malicious files</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
                <p className="text-gray-600 leading-relaxed">
                  The service is provided on an 'as is' basis. Convert.Work makes no warranties,
                  expressed or implied, and hereby disclaims and negates all other warranties
                  including without limitation, implied warranties or conditions of merchantability,
                  fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations</h2>
                <p className="text-gray-600 leading-relaxed">
                  In no event shall Convert.Work or its suppliers be liable for any damages
                  (including, without limitation, damages for loss of data or profit, or due to
                  business interruption) arising out of the use or inability to use the service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Accuracy of Materials</h2>
                <p className="text-gray-600 leading-relaxed">
                  The materials appearing on Convert.Work could include technical, typographical,
                  or photographic errors. Convert.Work does not warrant that any of the materials
                  on its service are accurate, complete, or current.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications</h2>
                <p className="text-gray-600 leading-relaxed">
                  Convert.Work may revise these terms of service at any time without notice.
                  By using this service you are agreeing to be bound by the then current version of these terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with applicable laws
                  and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  Questions about the Terms of Service should be sent to us at{' '}
                  <a href="mailto:hello@convert.work" className="text-blue-600 hover:text-blue-700 font-medium">
                    hello@convert.work
                  </a>
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Converter
          </Link>
        </footer>
      </div>
    </div>
  )
}