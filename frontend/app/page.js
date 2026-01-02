import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="card max-w-2xl w-full text-center">
        <div className="mb-8">
          <svg
            className="w-20 h-20 mx-auto mb-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PayPal Checkout System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Secure, production-ready payment processing with PayPal
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/checkout" className="block">
            <button className="btn-primary w-full text-lg">
              Start Checkout
            </button>
          </Link>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-900 mb-1">🔒 Secure</div>
                <div>PCI compliant processing</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-900 mb-1">⚡ Fast</div>
                <div>Real-time transactions</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-900 mb-1">🌍 Global</div>
                <div>Multiple currencies</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© 2026 PayPal Checkout System. Built with Next.js & Express.</p>
      </footer>
    </main>
  )
}

