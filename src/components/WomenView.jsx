import React from 'react';
import { WOMEN_TEAMS } from '../data/basketballData';
import { Sparkles, Trophy, ChevronRight } from 'lucide-react';

export default function WomenView() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn select-none">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-950 via-purple-950 to-black p-8 text-white border border-pink-900/50 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>ARUSHA REGIONAL WOMEN'S BASKETBALL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans">
            Women's Basketball Championship
          </h1>

          <p className="text-xs sm:text-sm text-pink-100/80 leading-relaxed">
            Empowering women through competitive basketball. Follow Arusha's premier female athletes, clubs, championship standings, and national team selections.
          </p>
        </div>
      </div>

      {/* TEAMS GRID */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#111827] uppercase tracking-tight font-sans antialiased mb-4 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-pink-600" />
          <span>Women's Division Clubs</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WOMEN_TEAMS.map((team) => (
            <div
              key={team.id}
              className="p-6 rounded-2xl bg-white border border-pink-100 shadow-sm hover:shadow-lg hover:border-pink-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-200">
                    Rec: {team.record}
                  </span>
                </div>

                <h3 className="text-lg font-black text-gray-900">{team.name}</h3>
                <p className="text-xs text-gray-500">{team.city}</p>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-xs text-gray-600 font-semibold">
                  <div>Coach: <span className="text-black">{team.coach}</span></div>
                  <div>Championship Titles: <span className="text-pink-600 font-bold">{team.titles}x</span></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-pink-600">
                <span>Team Profile</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INITIATIVES BANNER */}
      <div className="p-6 rounded-xl bg-pink-50/70 border border-pink-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-gray-900 uppercase">
            ARBA Women in Sports Grassroots Clinic
          </h4>
          <p className="text-xs text-gray-600 mt-1">
            Free basketball clinics for schoolgirls aged 10-18 held every weekend across Arusha.
          </p>
        </div>
        <button 
          onClick={() => alert('Registration for Grassroots Clinic is open! Contact secretariat@arba.tz')}
          className="px-5 py-2.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider transition shadow cursor-pointer shrink-0"
        >
          Register Youth Girl Player
        </button>
      </div>

    </div>
  );
}
