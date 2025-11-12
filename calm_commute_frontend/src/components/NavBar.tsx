"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * PUBLIC_INTERFACE
 * NavBar
 * Top navigation bar providing links to Dashboard, History, and Preferences,
 * styled with the Ocean Professional theme. Highlights the active route.
 */
export function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/history", label: "History" },
    { href: "/preferences", label: "Preferences" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ocean-surface/80 backdrop-blur border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white shadow">
            ☼
          </span>
          CalmCommute
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
