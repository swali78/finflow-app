import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | FinFlow",
  description: "FinFlow Privacy Policy and Data Sovereignity documentation.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-8 md:p-24 selection:bg-white selection:text-black">
      <div className="max-w-3xl mx-auto space-y-12">
        <header className="space-y-4 border-l-4 border-white pl-6">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">
            Updated: April 3, 2026 / FINFLOW-v1.0.0
          </p>
        </header>

        <section className="space-y-8 text-lg text-zinc-300 leading-relaxed font-light">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">1. Data Sovereignity</h2>
            <p>
              FinFlow is built on the principle of data ownership. All financial data you input is stored in your private, 
              secure database. We do not sell, share, or analyze your personal financial records for advertising.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">2. Collection and Usage</h2>
            <p>
              We collect transaction data solely to provide you with insights, analytics, and financial management tools. 
              This data remains within your account and is only accessible by you.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">3. Security Protocals</h2>
            <p>
              Your data is encrypted in transit and at rest. We utilize industry-standard PostgreSQL security measures 
              to ensure your financial history remains confidential.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">4. Compliance</h2>
            <p>
              FinFlow complies with Google Play’s Developer Program Policies regarding user data and financial 
              record transparency.
            </p>
          </div>
        </section>

        <footer className="pt-12 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <p className="font-bold text-white uppercase tracking-wider">Contact</p>
            <p className="text-zinc-500">support@finflow.app</p>
          </div>
          <Link 
            href="/" 
            className="px-6 py-3 bg-white text-black font-black uppercase italic tracking-tighter hover:bg-[#D4D4D4] transition-colors"
          >
            Back to App
          </Link>
        </footer>
      </div>
    </div>
  )
}
