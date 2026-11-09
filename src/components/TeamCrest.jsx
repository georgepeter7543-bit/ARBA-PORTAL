import React from 'react';

/**
 * TeamCrest component with full vector SVG artwork support.
 * Features the signature "Arusha Kings" crest with silver crown, shield,
 * and basketball artwork, plus custom crests for all Arusha clubs.
 * Supports custom image URLs (PNG/SVG/WebP) with automatic fallback.
 */
export default function TeamCrest({ team, className = "w-12 h-12", showGlow = false }) {
  const [hasImgError, setHasImgError] = React.useState(false);

  if (!team) return null;

  // Support direct image asset URL if provided
  if (team.logoUrl && !hasImgError) {
    return (
      <img
        src={team.logoUrl}
        alt={`${team.name} crest`}
        onError={() => setHasImgError(true)}
        className={`${className} object-contain ${showGlow ? 'drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]' : ''}`}
      />
    );
  }

  const teamId = team.id || '';

  // ARUSHA KINGS CREST (Silver Crown + Heraldic Shield + Basketball Artwork)
  if (teamId === 'arusha-kings') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className} ${showGlow ? 'drop-shadow-[0_0_15px_rgba(192,192,192,0.6)]' : ''}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            {/* Silver metallic gradients */}
            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#D1D5DB" />
              <stop offset="50%" stopColor="#9CA3AF" />
              <stop offset="75%" stopColor="#E5E7EB" />
              <stop offset="100%" stopColor="#6B7280" />
            </linearGradient>

            <linearGradient id="shieldBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <linearGradient id="ballGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="60%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#9A3412" />
            </linearGradient>

            <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            
            <filter id="kingsShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.6"/>
            </filter>
          </defs>

          {/* 1. HERALDIC SHIELD BASE */}
          <path
            d="M 50 8 
               C 78 8, 88 12, 88 32 
               C 88 66, 68 85, 50 94 
               C 32 85, 12 66, 12 32 
               C 12 12, 22 8, 50 8 Z"
            fill="url(#shieldBg)"
            stroke="url(#silverGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            filter="url(#kingsShadow)"
          />

          {/* Inner Shield Inset Line */}
          <path
            d="M 50 14 
               C 74 14, 82 17, 82 34 
               C 82 63, 64 80, 50 88 
               C 36 80, 18 63, 18 34 
               C 18 17, 26 14, 50 14 Z"
            fill="none"
            stroke="url(#goldTrim)"
            strokeWidth="1.2"
            opacity="0.8"
          />

          {/* 2. BASKETBALL ARTWORK (Inside the shield) */}
          <g transform="translate(50, 58)">
            {/* Ball Sphere */}
            <circle cx="0" cy="0" r="22" fill="url(#ballGrad)" stroke="url(#silverGrad)" strokeWidth="1.8" />
            
            {/* Seams */}
            <path d="M -22 0 Q 0 0 22 0" fill="none" stroke="#18181B" strokeWidth="1.6" />
            <path d="M 0 -22 Q 0 0 0 22" fill="none" stroke="#18181B" strokeWidth="1.6" />
            <path d="M -16 -16 Q 0 0 -16 16" fill="none" stroke="#18181B" strokeWidth="1.4" />
            <path d="M 16 -16 Q 0 0 16 16" fill="none" stroke="#18181B" strokeWidth="1.4" />
            
            {/* Highlight Shine */}
            <ellipse cx="-6" cy="-8" rx="8" ry="4" fill="#FFFFFF" opacity="0.35" transform="rotate(-30, -6, -8)" />
          </g>

          {/* 3. SILVER CROWN ARTWORK (Top of Shield) */}
          <g transform="translate(0, -2)">
            {/* Crown Base Band */}
            <path
              d="M 30 33 L 70 33 L 68 37 L 32 37 Z"
              fill="url(#silverGrad)"
              stroke="#4B5563"
              strokeWidth="0.8"
            />
            {/* Crown Jewels on Band */}
            <circle cx="36" cy="35" r="1.5" fill="url(#goldTrim)" />
            <circle cx="50" cy="35" r="1.8" fill="#EF4444" />
            <circle cx="64" cy="35" r="1.5" fill="url(#goldTrim)" />

            {/* Crown Spikes / Peaks */}
            <path
              d="M 30 33 
                 L 26 19 
                 L 38 25 
                 L 50 12 
                 L 62 25 
                 L 74 19 
                 L 70 33 Z"
              fill="url(#silverGrad)"
              stroke="#374151"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />

            {/* Crown Jewels on Peaks */}
            <circle cx="26" cy="19" r="2" fill="url(#silverGrad)" stroke="#4B5563" strokeWidth="0.5" />
            <circle cx="50" cy="12" r="2.8" fill="url(#goldTrim)" stroke="#4B5563" strokeWidth="0.6" />
            <circle cx="74" cy="19" r="2" fill="url(#silverGrad)" stroke="#4B5563" strokeWidth="0.5" />
            
            {/* Cross on Center Jewel */}
            <line x1="50" y1="7" x2="50" y2="10" stroke="url(#goldTrim)" strokeWidth="1.2" />
            <line x1="48.5" y1="8.5" x2="51.5" y2="8.5" stroke="url(#goldTrim)" strokeWidth="1.2" />
          </g>

          {/* 4. RIBBON BANNER WITH "KINGS" */}
          <g transform="translate(0, 5)">
            <path
              d="M 22 84 L 50 89 L 78 84 L 74 77 L 50 82 L 26 77 Z"
              fill="#0F172A"
              stroke="url(#silverGrad)"
              strokeWidth="1.2"
            />
            <text
              x="50"
              y="85.5"
              fill="#FFFFFF"
              fontSize="6.5"
              fontWeight="900"
              fontFamily="sans-serif"
              textAnchor="middle"
              letterSpacing="0.8"
            >
              KINGS
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // ARUSHA SPURS CREST
  if (teamId === 'arusha-spurs') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="spursSilver" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="#000000" stroke="url(#spursSilver)" strokeWidth="4" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#334155" strokeWidth="1.5" />
          {/* Spur Gear & Rowel Artwork */}
          <path
            d="M 50 20 L 53 30 L 63 26 L 59 36 L 69 40 L 59 47 L 66 56 L 56 57 L 58 68 L 49 61 L 43 70 L 41 59 L 31 63 L 36 53 L 26 48 L 36 43 L 30 33 L 41 35 Z"
            fill="url(#spursSilver)"
          />
          <circle cx="48" cy="48" r="9" fill="#000000" stroke="#FFFFFF" strokeWidth="2" />
          <text x="50" y="86" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle" letterSpacing="1">SPURS</text>
        </svg>
      </div>
    );
  }

  // DEFAULT / GENERIC SPORT CREST
  return (
    <div className={`relative inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 text-white shrink-0 p-2 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-orange-500" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    </div>
  );
}
