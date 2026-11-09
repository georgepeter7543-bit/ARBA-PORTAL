import React from 'react';

export default function Footer({ onSelectNav }) {
  const socialLinks = [
    {
      name: 'Instagram',
      handle: '@arusha_basketbal',
      url: 'https://www.instagram.com/arusha_basketbal/',
      color: 'hover:text-pink-500 hover:border-pink-500/40',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      handle: 'Arusha Basketball',
      url: 'https://facebook.com',
      color: 'hover:text-blue-500 hover:border-blue-500/40',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.7 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z"/>
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      handle: '@ARBA_Basketball',
      url: 'https://x.com',
      color: 'hover:text-white hover:border-neutral-500',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      handle: 'ARBA TV Live',
      url: 'https://youtube.com',
      color: 'hover:text-red-500 hover:border-red-500/40',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: 'Telegram',
      handle: 't.me/arba_tz',
      url: 'https://telegram.org',
      color: 'hover:text-sky-400 hover:border-sky-400/40',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-[#000000] text-white border-t border-neutral-800 pt-12 pb-8 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        
        {/* SOCIAL ENGAGEMENT BAR (NBA-Style) */}
        <div className="pb-10 mb-10 border-b border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-widest text-orange-400">
                CONNECT COURTSIDE
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5 tracking-tight">
              Follow Arusha Regional Basketball Association
            </h3>
            <p className="text-xs text-neutral-400">
              Get official announcements, photo galleries, highlights, and tournament coverage.
            </p>
          </div>

          {/* SOCIAL MEDIA ICONS (Instagram, Facebook, X, YouTube, Telegram) */}
          <div className="flex items-center flex-wrap justify-center gap-2.5 sm:gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${item.name} - ${item.handle}`}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 ${item.color} transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm group`}
              >
                <span className="group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-xs font-bold hidden sm:inline">
                  {item.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* MAIN FOOTER COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-neutral-800">
          
          {/* COL 1: ARBA OFFICIAL CREST & MISSION */}
          <div className="space-y-3">
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => onSelectNav('Home')}
            >
              <img
                src="/arba-logo.jpg"
                alt="ARBA Official Shield Crest"
                className="w-10 h-10 object-contain drop-shadow group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight uppercase leading-none">
                  ARBA
                </span>
                <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
                  SINCE '01 • ARUSHA, TZ
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Arusha Regional Basketball Association (ARBA) is the official governing authority for basketball leagues, player development, and grassroots academies in Arusha, Tanzania.
            </p>
            <div className="pt-2 flex flex-col space-y-1 text-[11px] font-semibold text-neutral-400">
              <span className="text-orange-400">• Affiliated with Tanzania Basketball Federation (TBF)</span>
              <span className="text-neutral-500">• FIBA Africa Zone 5 Sanctioned Competitions</span>
            </div>
          </div>

          {/* COL 2: QUICK LEAGUE TABS */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-200 mb-3.5 border-l-2 border-orange-500 pl-2">
              Championships & Leagues
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => onSelectNav('Teams')} className="hover:text-orange-400 transition cursor-pointer">
                  Arusha Premier Division (Men)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('Women')} className="hover:text-orange-400 transition cursor-pointer">
                  Arusha Women's Championship
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('D-League')} className="hover:text-orange-400 transition cursor-pointer">
                  D-League Development
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('Academies')} className="hover:text-orange-400 transition cursor-pointer">
                  Junior Hoops Grassroots Academies
                </button>
              </li>
            </ul>
          </div>

          {/* COL 3: GOVERNANCE & CONTACT */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-200 mb-3.5 border-l-2 border-orange-500 pl-2">
              Association Office
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <p>ARBA Secretariat, Sheikh Amri Abeid Stadium Offices, Arusha, Tanzania.</p>
              <p>Email: <span className="text-neutral-200 font-mono">info@arba.tz</span></p>
              <p>Hotline: <span className="text-neutral-200 font-mono">+255 (0) 754 000 255</span></p>
              <div className="pt-2">
                <button
                  onClick={() => onSelectNav('Login')}
                  className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-orange-400 border border-neutral-700 text-xs font-bold rounded transition cursor-pointer"
                >
                  Official ARBA Portal Login &rarr;
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* REGIONAL COPYRIGHT */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-3">
          <div>
            &copy; 2026 Arusha Regional Basketball Association (ARBA). All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4">
            <a href="#privacy" className="hover:text-neutral-300 transition">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-neutral-300 transition">Constitution & Bylaws</a>
            <span>•</span>
            <a href="#rules" className="hover:text-neutral-300 transition">FIBA Official Rules</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
