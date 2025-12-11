"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create" },
  { href: "/postcards", label: "Postcards" },
  { href: "/search", label: "Search" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold">
          BibleVerse Postcards 📬
        </Link>

        <div className="flex gap-1">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "px-3 py-1.5 rounded-full text-xs border transition-colors",
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
