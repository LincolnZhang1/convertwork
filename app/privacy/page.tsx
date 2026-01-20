import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - Convert.Work',
  description: 'Read Convert.Work privacy policy. Learn how we protect your data and handle file conversions securely.',
  keywords: 'privacy policy, data protection, file security, convert.work privacy',
  openGraph: {
    title: 'Privacy Policy - Convert.Work',
    description: 'Read Convert.Work privacy policy. Learn how we protect your data and handle file conversions securely.',
    url: 'https://www.convert.work/privacy',
    siteName: 'Convert.Work',
    type: 'website',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 gradient-text">Privacy Policy</h1>
          <p className="text-lg text-gray-600">How we protect your data and privacy</p>
        </header>

        <main className="space-y-8">
          <section className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-sm text-gray-500 mb-6"><em>Last updated: January 15, 2025</em></p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Convert.Work is committed to protecting your privacy. We do not collect personal information
              from users of our service. Our file conversion service operates without requiring user registration
              or account creation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">File Processing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you upload files for conversion:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mb-6">
              <li>Files are temporarily stored on secure servers during processing</li>
              <li>Files are automatically deleted after conversion is complete</li>
              <li>We do not retain copies of your original files or converted files</li>
              <li>File processing is done securely with industry-standard encryption</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your files during processing:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4 mb-6">
              <li>SSL/TLS encryption for all data transmission</li>
              <li>Secure cloud infrastructure with access controls</li>
              <li>Automatic cleanup of temporary files</li>
              <li>No logging of file contents or user activities</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Convert.Work may use third-party conversion services for certain file formats.
              These services are selected for their reliability and security standards.
              We do not share your files with third parties for any other purposes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our website may use essential cookies for functionality. We do not use tracking
              cookies or analytics that collect personal information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We may update this privacy policy from time to time. Any changes will be posted
              on this page with an updated revision date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this privacy policy, please contact us at{' '}
              <a href="mailto:hello@convert.work" className="text-blue-600 hover:text-blue-700 font-medium">
                hello@convert.work
              </a>
            </p>
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