import React from 'react';
import { Calendar, ChevronDown, RotateCcw } from 'lucide-react';
import { DIVISIONS, MONTHS, TEAMS, VENUES, REGIONS } from '../data/basketballData';

export default function FilterControls({
  selectedDivision,
  onChangeDivision,
  selectedMonth,
  onChangeMonth,
  selectedTeam,
  onChangeTeam,
  selectedVenue,
  onChangeVenue,
  selectedRegion,
  onChangeRegion,
  hidePreviousDates,
  onToggleHidePreviousDates,
  onOpenCalendarModal
}) {
  const isFiltered = 
    selectedDivision !== 'All Games' || 
    selectedMonth !== 'October' || 
    selectedTeam !== 'All Teams' || 
    selectedVenue !== 'All Venues' || 
    selectedRegion !== 'All Regions' ||
    hidePreviousDates;

  const handleReset = () => {
    onChangeDivision('All Games');
    onChangeMonth('October');
    onChangeTeam('All Teams');
    onChangeVenue('All Venues');
    onChangeRegion('All Regions');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6 pb-4">
      {/* SECTION TOP: TITLE & ADD TO CALENDAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase font-sans">
            ARBA SCHEDULE
          </h1>
          <span className="hidden sm:inline-block text-xs font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700">
            2026 Season
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 text-xs font-semibold text-gray-500 hover:text-orange-600 transition"
              title="Reset All Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={onOpenCalendarModal}
            className="flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition group cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-orange-500" />
            <span className="underline decoration-blue-300 underline-offset-4">Add Games to Calendar</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:flex xl:items-end gap-3 pt-1">
        
        {/* DIVISION / SEASON TYPE */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">
            SEASON TYPE
          </label>
          <div className="relative">
            <select
              value={selectedDivision}
              onChange={(e) => onChangeDivision(e.target.value)}
              className="w-full appearance-none bg-[#efeff1] hover:bg-[#e5e5e8] text-gray-800 text-xs font-semibold rounded-md py-2.5 pl-3 pr-8 border border-transparent focus:border-black focus:bg-white focus:outline-none transition cursor-pointer"
            >
              {DIVISIONS.map((div) => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* CALENDAR / MONTH */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">
            CALENDAR
          </label>
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => onChangeMonth(e.target.value)}
              className="w-full appearance-none bg-[#efeff1] hover:bg-[#e5e5e8] text-gray-800 text-xs font-semibold rounded-md py-2.5 pl-3 pr-8 border border-transparent focus:border-black focus:bg-white focus:outline-none transition cursor-pointer"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* TEAM */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">
            TEAM
          </label>
          <div className="relative">
            <select
              value={selectedTeam}
              onChange={(e) => onChangeTeam(e.target.value)}
              className="w-full appearance-none bg-[#efeff1] hover:bg-[#e5e5e8] text-gray-800 text-xs font-semibold rounded-md py-2.5 pl-3 pr-8 border border-transparent focus:border-black focus:bg-white focus:outline-none transition cursor-pointer"
            >
              <option value="All Teams">All Teams</option>
              {TEAMS.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* VENUE / BROADCASTER */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">
            VENUE / COURT
          </label>
          <div className="relative">
            <select
              value={selectedVenue}
              onChange={(e) => onChangeVenue(e.target.value)}
              className="w-full appearance-none bg-[#efeff1] hover:bg-[#e5e5e8] text-gray-800 text-xs font-semibold rounded-md py-2.5 pl-3 pr-8 border border-transparent focus:border-black focus:bg-white focus:outline-none transition cursor-pointer"
            >
              {VENUES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* REGION */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1">
            REGION
          </label>
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => onChangeRegion(e.target.value)}
              className="w-full appearance-none bg-[#efeff1] hover:bg-[#e5e5e8] text-gray-800 text-xs font-semibold rounded-md py-2.5 pl-3 pr-8 border border-transparent focus:border-black focus:bg-white focus:outline-none transition cursor-pointer"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* TOGGLE: HIDE PREVIOUS DATES (Exact NBA.com layout) */}
        <div className="col-span-2 sm:col-span-1 xl:flex xl:items-center xl:self-end pb-1.5 shrink-0 pl-1">
          <label className="inline-flex items-center space-x-2.5 cursor-pointer select-none">
            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
              Hide Previous Dates
            </span>
            <div 
              onClick={onToggleHidePreviousDates}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                hidePreviousDates ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
                  hidePreviousDates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
          </label>
        </div>

      </div>
    </div>
  );
}
