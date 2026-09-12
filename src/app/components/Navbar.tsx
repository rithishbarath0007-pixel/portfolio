"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/work", label: "Work" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full pointer-events-none px-4">
      <nav
        className="
          flex items-center gap-1
          p-1
          bg-black/60
          border border-white/10
          backdrop-blur-xl
          rounded-full
          pointer-events-auto
          shadow-2xl
        "
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                relative
                px-4 py-2
                text-sm font-medium
                rounded-full
                transition-colors duration-200
                ${
                  isActive
                    ? "text-white"
                    : "text-neutral-400 hover:text-white"
                }
              `}
            >
              {/* Active background */}
              {isActive && (
                <motion.span
                  layoutId="active-nav"
                  className="
                    absolute
                    inset-0
                    rounded-full
                    bg-neutral-800
                    -z-10
                  "
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                    mass: 0.5,
                  }}
                />
              )}

              <span className="relative z-10">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}