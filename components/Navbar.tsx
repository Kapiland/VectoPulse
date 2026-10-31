"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Sparkles, 
  Compass, 
  FileText, 
  Users, 
  User, 
  Play, 
  Menu, 
  X,
  Radio,
  Cpu
} from "lucide-react";

interface NavbarProps {
  onOpenDemo?: () => void;
}

export default function Navbar({ onOpenDemo }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Compass },
    { href: "/notice-intelligence", label: "Notice AI", icon: FileText, badge: "Gemini" },
    { href: "/radar", label: "Opportunity Radar", icon: Radio },
    { href: "/team-matcher", label: "Team Matcher", icon: Users, badge: "Gemma" },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-500/15 bg-[#080c16]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <div className="w-full h-full bg-[#0a0e1a] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-300 transition-colors">
                CampusSignal
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-1 hidden sm:block">Campus Opportunity Intelligence</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600/20 text-cyan-300 border border-blue-500/30 shadow-sm shadow-blue-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Active AI indicator badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-emerald-500/30 text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>Gemini + Gemma Active</span>
          </div>

          {/* 60s Demo Button */}
          {onOpenDemo && (
            <button
              onClick={onOpenDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Try Live Demo</span>
              <span className="hidden sm:inline text-[10px] opacity-80">(60s)</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#080c16]/95 backdrop-blur-xl px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? "bg-blue-600/20 text-cyan-300 border border-blue-500/30"
                    : "text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
