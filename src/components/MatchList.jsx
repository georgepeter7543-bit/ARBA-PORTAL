import React from 'react';
import MatchCard from './MatchCard';
import { CalendarX2 } from 'lucide-react';

export default function MatchList({
  matches,
  onOpenWatch,
  onOpenBoxScore,
  onOpenGameDetails,
  onSelectTeam,
  onResetFilters
}) {
  // Group matches by Date Label
  const groupedMatches = matches.reduce((acc, match) => {
    const key = match.dateLabel;
    if (!acc[key]) {
      acc[key] = {
        week: match.week,
        date: match.date,
        items: []
      };
    }
    acc[key].items.push(match);
    return acc;
  }, {});

  const dateKeys = Object.keys(groupedMatches);

  if (matches.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
            <CalendarX2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Matching Fixtures Found</h3>
          <p className="text-xs text-gray-500 mb-6">
            There are no games scheduled matching your current filter combination. Try adjusting the season type, team, or court.
          </p>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded hover:bg-neutral-800 transition shadow"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pb-16 space-y-8">
      {/* WEEK HEADER (from blueprint: Week 1 (Oct 20 - Oct 25)) */}
      <div className="pt-2">
        <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight font-sans">
          Week 1 (Oct 20 - Oct 25)
        </h2>
      </div>

      {dateKeys.map((dateLabel) => {
        const group = groupedMatches[dateLabel];
        return (
          <div key={dateLabel} className="space-y-2">
            
            {/* DATE SUBHEADER (from blueprint: FRIDAY, OCTOBER 23 ... 12 Games) */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold uppercase tracking-wider text-gray-800 border-b border-gray-300 pb-2">
              <div className="flex items-center space-x-2">
                <span>{dateLabel}</span>
                {group.items.some(m => m.isLive) && (
                  <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black tracking-normal">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>LIVE GAMES NOW</span>
                  </span>
                )}
              </div>
              <span className="text-gray-500 font-semibold lowercase first-letter:uppercase">
                {group.items.length} {group.items.length === 1 ? 'game' : 'games'}
              </span>
            </div>

            {/* WHITE SCORECARD CONTAINER WITH BORDER */}
            <div className="bg-white rounded-md border border-gray-200/90 shadow-xs divide-y divide-gray-100 overflow-hidden">
              {group.items.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onOpenWatch={onOpenWatch}
                  onOpenBoxScore={onOpenBoxScore}
                  onOpenGameDetails={onOpenGameDetails}
                  onSelectTeam={onSelectTeam}
                />
              ))}
            </div>

          </div>
        );
      })}
    </div>
  );
}
