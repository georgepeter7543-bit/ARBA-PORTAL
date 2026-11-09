import React, { useState } from 'react';
import { Menu, X, ChevronRight, ShieldCheck, LogOut } from 'lucide-react';
import { NAV_LINKS, ADMIN_NAV_LINKS } from '../data/basketballData';

export default function HeaderNav({ 
  activeNav, 
  onSelectNav, 
  onOpenLogin, 
  isAdminAuthenticated = false, 
  isAdmin = false, 
  onSignOut 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authenticated = Boolean(isAdminAuthenticated || isAdmin);

  // Default visitor view: ['Home', 'Teams', 'Players', 'Women', 'D-League', 'Coaches', 'Officials', 'Academies', 'Login']
  // Authenticated admin view: ['Home', 'Teams', 'Players', 'Women', 'D-League', 'Coaches', 'Officials', 'Academies', 'Dashboard', 'Login']
  const displayedLinks = authenticated ? ADMIN_NAV_LINKS : NAV_LINKS;

  // Filter out duplicate 'Login' from the center text links since 'Sign In' is on the right
  const centerLinks = displayedLinks.filter(l => l.name !== 'Login');

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19] text-white shadow-md border-b border-[#1F2937] select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. LEFT: OFFICIAL ARBA LOGO & BRAND IDENTITY */}
          <div 
            className="flex items-center space-x-3 shrink-0 cursor-pointer group py-1" 
            onClick={() => onSelectNav('Home')}
          >
            {/* Fixed Height Logo Container (h-10 / 40px) with Clean Scaling */}
            <div className="h-10 w-10 flex items-center justify-center shrink-0">
              <img
                src="/arba-logo.jpg"
                alt="ARBA - Arusha Regional Basketball Association"
                className="h-10 w-10 object-contain group-hover:scale-105 transition-transform duration-150 rounded-xs drop-shadow"
              />
            </div>

            {/* Brand Typography */}
            <div className="flex flex-col">
              <span className="text-[19px] sm:text-[20px] font-black tracking-tight text-white uppercase font-sans leading-none">
                ARBA
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase mt-0.5">
                ARUSHA, TANZANIA
              </span>
            </div>
          </div>

          {/* 2. CENTER: NAVIGATION TABS */}
          <nav className="hidden xl:flex items-center space-x-3.5 2xl:space-x-5 h-full">
            {centerLinks.map((link) => {
              const isActive = activeNav === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => onSelectNav(link.name)}
                  className={`relative flex items-center h-full px-1.5 py-0 text-[13px] font-bold tracking-normal transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? 'text-white font-black'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>

                  {/* ACTIVE ORANGE ACCENT LINE */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F97316] rounded-t-sm shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. RIGHT SIDE: 9-DOT GRID & SIGN IN / ADMIN CONTROLS */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            {/* 3x3 MATRIX 9-DOT GRID ICON */}
            <button 
              onClick={() => {
                if (authenticated) {
                  onSelectNav('Dashboard');
                } else {
                  onOpenLogin();
                }
              }}
              title={authenticated ? "ARBA Admin Dashboard" : "Sign In to ARBA Portal"}
              className="p-1.5 text-slate-300 hover:text-[#F97316] hover:bg-slate-800/80 rounded-lg transition cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                <rect x="1" y="1" width="3" height="3" rx="0.5" />
                <rect x="6.5" y="1" width="3" height="3" rx="0.5" />
                <rect x="12" y="1" width="3" height="3" rx="0.5" />
                <rect x="1" y="6.5" width="3" height="3" rx="0.5" />
                <rect x="6.5" y="6.5" width="3" height="3" rx="0.5" />
                <rect x="12" y="6.5" width="3" height="3" rx="0.5" />
                <rect x="1" y="12" width="3" height="3" rx="0.5" />
                <rect x="6.5" y="12" width="3" height="3" rx="0.5" />
                <rect x="12" y="12" width="3" height="3" rx="0.5" />
              </svg>
            </button>

            {/* ADMIN OR SIGN IN BUTTONS */}
            {authenticated ? (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onSelectNav('Dashboard')}
                  className={`text-[12px] font-black px-3 py-1.5 rounded-lg border transition cursor-pointer flex items-center space-x-1 ${
                    activeNav === 'Dashboard'
                      ? 'bg-[#F97316] text-white border-[#F97316] shadow-xs'
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
                <button
                  onClick={onSignOut}
                  title="Sign Out as Admin"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenLogin}
                className="text-[13px] font-bold text-slate-200 hover:text-[#F97316] transition cursor-pointer whitespace-nowrap pl-0.5"
              >
                Sign In
              </button>
            )}

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/80 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#F97316]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DROPDOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0B0F19] border-t border-[#1F2937] px-4 pt-3 pb-6 shadow-2xl animate-fadeIn">
          {authenticated && (
            <div className="mb-3 pb-3 border-b border-[#1F2937] flex items-center justify-between">
              <button
                onClick={() => {
                  onSelectNav('Dashboard');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-xs font-black text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-2 rounded-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
              <button
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-slate-400 hover:text-red-400"
              >
                Sign Out
              </button>
            </div>
          )}

          <div className="space-y-1">
            {displayedLinks.map((link) => {
              const isActive = activeNav === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    if (link.name === 'Login') {
                      onOpenLogin();
                    } else {
                      onSelectNav(link.name);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#F97316] text-white'
                      : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
