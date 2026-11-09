import React from 'react';
import { D_LEAGUE_PROGRAMS } from '../data/basketballData';
import { Flame, Trophy, Calendar, MapPin, ChevronRight } from 'lucide-react';

export default function DLeagueView() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-black p-8 text-white border border-blue-900/50 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-blue-400" />
            <span>ARBA YOUTH DEVELOPMENT PROGRAM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-sans">
            ARBA D-League Circuit
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
            The official incubator of Northern Tanzania talent. Preparing rising high school and club athletes for the Men's Premier League and collegiate scholarships.
          </p>
        </div>
      </div>

      {/* D-LEAGUE CIRCUITS */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#111827] uppercase tracking-tight font-sans antialiased mb-4 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-blue-600" />
          <span>Active D-League Divisions &amp; Circuits</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {D_LEAGUE_PROGRAMS.map((prog, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {prog.season}
                </span>

                <h3 className="text-lg font-black text-gray-900 mt-3">{prog.name}</h3>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600 font-semibold">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Competing Teams: <strong>{prog.teams} Franchises</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>Host Court: <strong>{prog.venue}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>View Circuit Standings</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DRAFT COMBINE BANNER */}
      <div className="p-6 rounded-xl bg-neutral-900 text-white border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-orange-400 font-bold uppercase mb-1">
            <Calendar className="w-4 h-4" />
            <span>2026 ARBA D-League Combine</span>
          </div>
          <h4 className="text-base font-black">Annual Talent Scouting & Skill Assessment</h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            Open to all players under 20 years with valid national or school ID.
          </p>
        </div>
        <button
          onClick={() => alert('Combine registration form opens Nov 1, 2026.')}
          className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider transition active:scale-95 shrink-0 cursor-pointer"
        >
          Sign Up for Combine
        </button>
      </div>

    </div>
  );
}
