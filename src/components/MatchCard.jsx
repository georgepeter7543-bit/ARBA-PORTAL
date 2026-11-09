import React from 'react';
import { Play, FileText, Info, MapPin } from 'lucide-react';

export default function MatchCard({ 
  match, 
  onOpenWatch, 
  onOpenBoxScore, 
  onOpenGameDetails,
  onSelectTeam
}) {
  const {
    status,
    isLive,
    awayTeam,
    homeTeam,
    venue,
    city
  } = match;

  return (
    <div className="group border-b border-gray-200 last:border-b-0 hover:bg-slate-50/80 transition-colors duration-150 py-3.5 sm:py-4 px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* LEFT & CENTER: STATUS, TEAMS, SCORES, VENUE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-1">
          
          {/* 1. MATCH STATUS */}
          <div className="w-20 shrink-0">
            {isLive ? (
              <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-600 text-[11px] font-black tracking-wide uppercase animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                <span>{status}</span>
              </div>
            ) : status === 'FINAL' ? (
              <span className="text-[12px] font-bold text-gray-500 tracking-wider uppercase">
                FINAL
              </span>
            ) : (
              <div className="flex flex-col">
                <span className="text-[12px] font-extrabold text-gray-900 tracking-wide">
                  {status}
                </span>
                <span className="text-[10px] font-semibold text-orange-600 uppercase">
                  Upcoming
                </span>
              </div>
            )}
          </div>

          {/* 2. TEAMS AND SCORES STACK */}
          <div className="min-w-[240px] sm:w-[310px] shrink-0 space-y-1.5">
            {/* AWAY TEAM */}
            <div className="flex items-center justify-between group/away">
              <button
                onClick={() => onSelectTeam && onSelectTeam(awayTeam.name)}
                className={`text-left text-[14px] font-semibold hover:text-orange-600 hover:underline transition truncate max-w-[210px] ${
                  awayTeam.isWinner ? 'text-gray-950 font-bold' : 'text-blue-700 font-medium'
                }`}
              >
                {awayTeam.name}
              </button>

              <div className="flex items-center space-x-1.5 tabular-nums">
                {awayTeam.score !== null ? (
                  <>
                    {awayTeam.isWinner && (
                      <span className="text-red-600 text-[11px] font-black leading-none">
                        &#9658;
                      </span>
                    )}
                    <span className={`text-[15px] font-bold ${
                      awayTeam.isWinner ? 'text-gray-950' : 'text-gray-600'
                    }`}>
                      {awayTeam.score}
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-gray-400">
                    ({awayTeam.record})
                  </span>
                )}
              </div>
            </div>

            {/* HOME TEAM */}
            <div className="flex items-center justify-between group/home">
              <button
                onClick={() => onSelectTeam && onSelectTeam(homeTeam.name)}
                className={`text-left text-[14px] font-semibold hover:text-orange-600 hover:underline transition truncate max-w-[210px] ${
                  homeTeam.isWinner ? 'text-gray-950 font-bold' : 'text-blue-700 font-medium'
                }`}
              >
                {homeTeam.name}
              </button>

              <div className="flex items-center space-x-1.5 tabular-nums">
                {homeTeam.score !== null ? (
                  <>
                    {homeTeam.isWinner && (
                      <span className="text-red-600 text-[11px] font-black leading-none">
                        &#9658;
                      </span>
                    )}
                    <span className={`text-[15px] font-bold ${
                      homeTeam.isWinner ? 'text-gray-950' : 'text-gray-600'
                    }`}>
                      {homeTeam.score}
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-gray-400">
                    ({homeTeam.record})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3. VENUE & LOCATION */}
          <div className="text-[12px] text-gray-600 min-w-[180px] shrink-0 sm:pl-4 border-l-0 sm:border-l border-gray-100 flex flex-col justify-center">
            <span className="font-semibold text-gray-800 truncate flex items-center space-x-1">
              <span className="hidden sm:inline text-gray-400">•</span>
              <span>{venue}</span>
            </span>
            <span className="text-gray-500 text-[11px] truncate flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-orange-500 inline shrink-0" />
              <span>{city}</span>
            </span>
          </div>

        </div>

        {/* RIGHT: THREE NBA ACTION BUTTONS [WATCH] [BOX SCORE] [GAME DETAILS] */}
        <div className="flex items-center space-x-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          
          {/* WATCH BUTTON */}
          <button
            onClick={() => onOpenWatch(match)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 sm:px-4 py-2 border border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-800 text-[11px] font-extrabold uppercase tracking-wider rounded transition-all duration-150 cursor-pointer shadow-2xs active:scale-95"
          >
            <Play className="w-3 h-3 fill-current text-orange-500" />
            <span>{isLive ? 'WATCH LIVE' : 'WATCH'}</span>
          </button>

          {/* BOX SCORE BUTTON */}
          <button
            onClick={() => onOpenBoxScore(match)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 sm:px-4 py-2 border border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-800 text-[11px] font-extrabold uppercase tracking-wider rounded transition-all duration-150 cursor-pointer shadow-2xs active:scale-95"
          >
            <FileText className="w-3 h-3 text-gray-400" />
            <span>BOX SCORE</span>
          </button>

          {/* GAME DETAILS BUTTON */}
          <button
            onClick={() => onOpenGameDetails(match)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 sm:px-4 py-2 border border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-800 text-[11px] font-extrabold uppercase tracking-wider rounded transition-all duration-150 cursor-pointer shadow-2xs active:scale-95"
          >
            <Info className="w-3 h-3 text-gray-400" />
            <span>GAME DETAILS</span>
          </button>

        </div>

      </div>
    </div>
  );
}
