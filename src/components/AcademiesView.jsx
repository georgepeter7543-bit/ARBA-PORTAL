import React from 'react';
import { ACADEMIES_LIST } from '../data/basketballData';
import { Users, MapPin, ChevronRight } from 'lucide-react';

export default function AcademiesView() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="border-b border-[#E5E7EB] pb-6">
        <div className="flex items-center space-x-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
          <span className="text-xs font-black uppercase tracking-widest text-[#F97316]">
            GRASSROOTS &amp; JUNIOR HOOPS • AGES 7-16
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] uppercase tracking-tight font-sans antialiased leading-tight mt-1">
          Arusha Youth Basketball Academies
        </h1>
        <p className="text-sm text-[#4B5563] font-medium leading-relaxed mt-2 max-w-2xl antialiased">
          Nurturing Northern Tanzania's next generation of champions through disciplined skill clinics and school leagues.
        </p>
      </div>

      {/* ACADEMIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ACADEMIES_LIST.map((academy, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-emerald-400 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {academy.enrollment} Kids Enrolled
                </span>
              </div>

              <h3 className="text-lg font-black text-gray-900">{academy.name}</h3>
              <p className="text-xs font-semibold text-orange-600 mt-0.5">Age Bracket: {academy.ages}</p>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600 font-semibold">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Home Facility: <strong>{academy.court}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Head Trainer: <strong>{academy.head}</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Enroll Student / Player</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* REGISTER ACADEMY BANNER */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-950 to-neutral-950 text-white border border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-black uppercase">Are you operating a youth basketball program in Arusha?</h4>
          <p className="text-xs text-neutral-300 mt-0.5">
            Register your academy with ARBA to receive official FIBA coach certification, match balls, and tournament invitations.
          </p>
        </div>
        <button
          onClick={() => alert('Official academy registration portal: Contact registrar@arba.tz')}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs uppercase rounded transition shrink-0 cursor-pointer"
        >
          Affiliate Academy with ARBA
        </button>
      </div>

    </div>
  );
}
