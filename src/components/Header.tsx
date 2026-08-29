"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, isAuthenticated, logout, savedProofs } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Analyze", href: "/" },
    { label: "Compare", href: "/compare" },
    { label: "Job Match", href: "/job-match" },
    {
      label: "Saved Proofs",
      href: "/saved",
      badgeCount: savedProofs.length,
    },
  ];

  return (
    <header className="border-b border-[#2A2D30] bg-[#0D0F10]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#F9732F] flex items-center justify-center font-black text-[#0D0F10] text-sm shadow-md shadow-[#F9732F]/15 group-hover:scale-105 transition-transform">
              GP
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-[#F5F2ED] group-hover:text-[#F9732F] transition-colors">
                  GitProof
                </span>
                <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-[#F9732F] bg-[#F9732F]/10 px-1.5 py-0.5 rounded border border-[#F9732F]/20">
                  DEVELOPER INTELLIGENCE
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 relative ${
                  isActive
                    ? "bg-[#181A1C] text-[#F9732F] border border-[#F9732F]/30 shadow-sm"
                    : "text-[#9CA3AF] hover:text-[#F5F2ED] hover:bg-[#181A1C]/60 border border-transparent"
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F9732F]"></span>
                )}
                <span>{item.label}</span>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#F9732F]/15 text-[#F9732F] border border-[#F9732F]/30 font-mono">
                    {item.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Auth Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-3 pr-2 py-1 rounded-lg bg-[#151719] border border-[#2A2D30]">
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-6 h-6 rounded border border-[#F9732F]/40 object-cover"
                />
                <span className="text-xs font-semibold text-[#F5F2ED] font-mono">
                  @{user.login}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs text-[#9CA3AF] hover:text-rose-400 transition-colors cursor-pointer font-mono pl-2 border-l border-[#2A2D30]"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-lg btn-orange text-xs font-bold transition-all cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-[#151719] border border-[#2A2D30] text-[#9CA3AF] hover:text-[#F5F2ED] transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2A2D30] bg-[#0D0F10] px-4 py-3 space-y-3 shadow-2xl">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-[#181A1C] text-[#F9732F] border border-[#F9732F]/30"
                      : "text-[#9CA3AF] hover:text-[#F5F2ED] hover:bg-[#151719]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#F9732F]"></span>}
                    <span>{item.label}</span>
                  </span>
                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#F9732F]/15 text-[#F9732F] font-mono">
                      {item.badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-[#2A2D30]">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-7 h-7 rounded border border-[#F9732F]/40 object-cover"
                  />
                  <span className="text-xs font-semibold text-[#F5F2ED] font-mono">
                    @{user.login}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 font-mono"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 rounded-lg btn-orange text-xs font-bold text-center block"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
