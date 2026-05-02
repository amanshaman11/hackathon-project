import Link from 'next/link';
import { Footer } from '@/components/Footer';

export const metadata = { title: 'Privacy Policy — TrialMatch AI' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">TrialMatch AI</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: May 2, 2026</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Overview</h2>
            <p className="text-sm leading-relaxed">
              TrialMatch AI is a hackathon demonstration project built to help patients discover relevant clinical trials.
              We take privacy seriously. This policy explains what information we collect, how we use it, and your rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Information We Collect</h2>
            <p className="text-sm leading-relaxed mb-3">
              When you use TrialMatch AI, the only information we process is the text you type into the search box
              (your natural-language description of a medical condition). This text is:
            </p>
            <ul className="text-sm space-y-2 list-disc list-inside text-gray-600">
              <li>Sent to our AI provider (Google Gemini) to extract structured medical data</li>
              <li>Used to match against our clinical trial dataset</li>
              <li><strong>Never stored</strong> on our servers after your session ends</li>
              <li><strong>Never linked</strong> to any personally identifiable information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
            <p className="text-sm leading-relaxed">
              Your input is used solely to generate trial match results in real time. We do not build profiles,
              track users across sessions, or use your data for advertising. We do not sell or share your data
              with third parties except our AI processing provider (Google Gemini) as necessary to provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Cookies and Tracking</h2>
            <p className="text-sm leading-relaxed">
              TrialMatch AI does not use cookies, analytics trackers, or any persistent client-side storage.
              Your search history is not retained between sessions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Services</h2>
            <p className="text-sm leading-relaxed">
              Trial data is sourced from ClinicalTrials.gov, a public database maintained by the U.S. National Library of Medicine.
              AI processing is performed via Google Gemini. Please review Google's privacy policy for information on how
              they handle data submitted through their API.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Children's Privacy</h2>
            <p className="text-sm leading-relaxed">
              TrialMatch AI is not directed at children under 13. We do not knowingly collect information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
            <p className="text-sm leading-relaxed">
              This is a BeaverHacks hackathon project. For questions about this privacy policy, please reach out
              to the team via the{' '}
              <a
                href="https://github.com/amanshaman11/hackathon-project"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                project repository
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
