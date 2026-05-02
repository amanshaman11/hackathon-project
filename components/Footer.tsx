import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm">TrialMatch AI</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Helping patients find relevant clinical trials through AI-powered matching. Built for BeaverHacks.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Resources</p>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://clinicaltrials.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  ClinicalTrials.gov
                </a>
              </li>
              <li>
                <a
                  href="https://www.nih.gov/health-information/clinical-trials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  NIH — What are Clinical Trials?
                </a>
              </li>
              <li>
                <a
                  href="https://www.cancer.gov/about-cancer/treatment/clinical-trials/search"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  NCI Trial Finder
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Legal</p>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/terms#disclaimer" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} TrialMatch AI. Built for BeaverHacks.
          </p>
          <p className="text-xs text-gray-400 max-w-md text-right">
            This tool is for informational purposes only and does not constitute medical advice.
            Always consult a qualified healthcare provider before making any medical decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
