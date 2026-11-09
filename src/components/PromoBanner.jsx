import React from 'react';
import { Tv, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PromoBanner({ onWatchFeatured }) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-5 pb-2">
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-neutral-900 via-neutral-950 to-orange-950 border border-neutral-800 text-white shadow-sm">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between p-4 sm:p-5 relative z-10 gap-4">
          
          {/* Banner Left Info */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0 shadow-md">
              <Tv className="w-6 h-6 text-black" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                  ARBA LIVE BROADCAST
                </span>
                <span className="text-xs text-neutral-400 hidden sm:inline">• Official Regional Series</span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white mt-1">
                ARUSHA REGIONAL BASKETBALL CHAMPIONSHIP 2026
              </h3>
              <p className="text-xs text-neutral-300">
                Stream every dunk, buzzer-beater, and high-stakes clash from Arusha City, Meru & Njiro courtside in HD.
              </p>
            </div>
          </div>

          {/* Banner Right Actions */}
          <div className="flex items-center space-x-3 shrink-0 w-full md:w-auto justify-end">
            <button 
              onClick={onWatchFeatured}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs px-4 py-2.5 rounded uppercase tracking-wide transition shadow hover:shadow-orange-500/30 active:scale-95 cursor-pointer"
            >
              <span>Watch Live Stream</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => alert('Season pass includes all Premier, Women, and D-League match broadcasts.')}
              className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2.5 rounded border border-neutral-700 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Get Pass</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
