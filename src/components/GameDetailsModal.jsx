import React from 'react';
import { X, Info, MapPin, Users, Radio, Shield, Trophy } from 'lucide-react';

export default function GameDetailsModal({ match, onClose }) {
  if (!match) return null;

  const {
    awayTeam,
    homeTeam,
    venue,
    city,
    division,
    broadcaster,
    attendance,
    referees,
    quarters,
    topPerformers
  } = match;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-neutral-700 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="bg-[#000000] text-white p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
                {division} • MATCH DETAILS
              </span>
              <h2 className="text-lg font-black text-white">
                {awayTeam.name} vs {homeTeam.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-6 overflow-y-auto">
          
          {/* QUARTER BREAKDOWN (IF AVAILABLE) */}
          {quarters && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5 flex items-center space-x-1.5">
                <Trophy className="w-3.5 h-3.5 text-orange-500" />
                <span>Linescore / Quarter by Quarter</span>
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-2xs">
                <table className="w-full text-center text-xs">
                  <thead className="bg-gray-100 font-extrabold text-gray-500 uppercase border-b border-gray-200">
                    <tr>
                      <th className="py-2 px-3 text-left">Team</th>
                      <th className="py-2 px-2">Q1</th>
                      <th className="py-2 px-2">Q2</th>
                      <th className="py-2 px-2">Q3</th>
                      <th className="py-2 px-2">Q4</th>
                      <th className="py-2 px-3 font-black text-black">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-bold">
                    <tr className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 text-left font-black text-gray-900">{awayTeam.name}</td>
                      <td className="py-2.5 px-2 text-gray-600">{quarters.away[0]}</td>
                      <td className="py-2.5 px-2 text-gray-600">{quarters.away[1]}</td>
                      <td className="py-2.5 px-2 text-gray-600">{quarters.away[2]}</td>
                      <td className="py-2.5 px-2 text-gray-600">{quarters.away[3]}</td>
                      <td className="py-2.5 px-3 font-extrabold text-orange-600 text-sm">{awayTeam.score}</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 text-left font-black text-gray-900">{homeTeam.name}</td>
                      <td className="py-2.5 px-2 text-gray-600">{quarters.home[0]}</td>
                      <td className="py-2.5 px-2 text-gray-600">{quarters.home[1]}</td>
                      <td className="py-2.5 px-2 text-gray-600">{quarters.home[2]}</td>
                      <td className="py-2.5 px-2 text-gray-600">{quarters.home[3]}</td>
                      <td className="py-2.5 px-3 font-extrabold text-orange-600 text-sm">{homeTeam.score}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TOP PERFORMERS */}
          {topPerformers && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2.5">
                Top Game Performers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-[10px] font-bold uppercase text-orange-600 tracking-wider">
                    {awayTeam.name}
                  </div>
                  <div className="font-extrabold text-sm text-gray-900 mt-0.5">
                    {topPerformers.away.name}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200 font-semibold">
                    <span><strong className="text-black">{topPerformers.away.pts}</strong> PTS</span>
                    <span><strong className="text-black">{topPerformers.away.reb}</strong> REB</span>
                    <span><strong className="text-black">{topPerformers.away.ast}</strong> AST</span>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-[10px] font-bold uppercase text-orange-600 tracking-wider">
                    {homeTeam.name}
                  </div>
                  <div className="font-extrabold text-sm text-gray-900 mt-0.5">
                    {topPerformers.home.name}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200 font-semibold">
                    <span><strong className="text-black">{topPerformers.home.pts}</strong> PTS</span>
                    <span><strong className="text-black">{topPerformers.home.reb}</strong> REB</span>
                    <span><strong className="text-black">{topPerformers.home.ast}</strong> AST</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MATCH DETAILS METADATA */}
          <div className="bg-slate-50 rounded-lg p-4 border border-gray-200 space-y-3 text-xs">
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Venue & City: </span>
                <span className="text-gray-600">{venue}, {city}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Radio className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Broadcast Network: </span>
                <span className="text-gray-600">{broadcaster}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Official Attendance: </span>
                <span className="text-gray-600">{attendance} spectators</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Shield className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-900">Game Officials / Referees: </span>
                <span className="text-gray-600">{referees?.join(', ') || 'Certified ARBA Officials'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="bg-gray-100 border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black text-white text-xs font-bold uppercase rounded hover:bg-neutral-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
