import Link from "next/link";

export default function Home() {
  return (
    <section className="page-enter">
      <div className="ocean-surface-gradient rounded-2xl p-8 sm:p-12 border border-blue-100 shadow-sm">
        <div className="max-w-2xl">
          <span className="cc-badge cc-badge-blue mb-3">Ocean Professional</span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Welcome to CalmCommute
          </h1>
          <p className="text-slate-600 mt-3 leading-relaxed">
            Reduce stress during your daily commute with quick mood check-ins,
            commute-aware content suggestions, and mindful breathing.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link href="/dashboard" className="cc-btn cc-btn-primary">
              Go to Dashboard
            </Link>
            <Link href="/preferences" className="cc-btn cc-btn-secondary">
              Set Preferences
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
