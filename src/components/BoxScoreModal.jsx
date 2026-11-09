import React, { useState } from 'react';
import { X, Award, Activity, BarChart2 } from 'lucide-react';

export default function BoxScoreModal({ match, onClose }) {
  const [activeTeamTab, setActiveTeamTab] = useState('away');

  if (!match) return null;

  const { awayTeam, homeTeam, boxScore, status } = match;

  const players = activeTeamTab === 'away' 
    ? boxScore?.awayPlayers || []
    : boxScore?.homePlayers || [];

  const totals = players.reduce(
    (acc, p) => ({
      pts: acc.pts + p.pts,
      reb: acc.reb + p.reb,
      ast: acc.ast + p.ast,
      stl: acc.stl + p.stl,
      blk: acc.blk + p.blk
    }),
    { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0 }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-neutral-700 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MODAL HEADER */}
        <div className="bg-[#0b0f19] text-white p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400">
                  OFFICIAL ARBA BOX SCORE
                </span>
                <span className="text-neutral-500 text-xs">•</span>
                <span className="text-xs text-neutral-300 font-semibold">{status}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                {awayTeam.name} <span className="text-neutral-400">vs</span> {homeTeam.name}
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

        {/* SCORE SUMMARY STRIP */}
        <div className="bg-neutral-900 text-white px-5 py-3 border-b border-neutral-800 flex items-center justify-around">
          <div className="text-center">
            <div className="text-xs font-semibold text-neutral-400">{awayTeam.name}</div>
            <div className="text-2xl font-black text-orange-400">{awayTeam.score ?? '--'}</div>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded bg-black/60 text-neutral-400 border border-neutral-700">
            {status}
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-neutral-400">{homeTeam.name}</div>
            <div className="text-2xl font-black text-white">{homeTeam.score ?? '--'}</div>
          </div>
        </div>

        {/* TEAM SELECTOR TABS */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTeamTab('away')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold tracking-wide transition border-b-2 cursor-pointer ${
              activeTeamTab === 'away'
                ? 'border-orange-500 text-black bg-white shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {awayTeam.name} Roster & Stats
          </button>
          <button
            onClick={() => setActiveTeamTab('home')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold tracking-wide transition border-b-2 cursor-pointer ${
              activeTeamTab === 'home'
                ? 'border-orange-500 text-black bg-white shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            {homeTeam.name} Roster & Stats
          </button>
        </div>

        {/* PLAYERS STATS TABLE */}
        <div className="overflow-x-auto p-4 flex-1">
          {players.length > 0 ? (
            <table className="w-full text-left text-xs text-gray-800 border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-[11px] font-black uppercase text-gray-500 bg-gray-100">
                  <th className="py-2.5 px-3">PLAYER</th>
                  <th className="py-2.5 px-2 text-center">POS</th>
                  <th className="py-2.5 px-2 text-center">MIN</th>
                  <th className="py-2.5 px-2 text-center text-orange-600 font-extrabold">PTS</th>
                  <th className="py-2.5 px-2 text-center">REB</th>
                  <th className="py-2.5 px-2 text-center">AST</th>
                  <th className="py-2.5 px-2 text-center">STL</th>
                  <th className="py-2.5 px-2 text-center">BLK</th>
                  <th className="py-2.5 px-2 text-center">FG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {players.map((p, idx) => (
                  <tr key={idx} className="hover:bg-orange-50/50 transition">
                    <td className="py-2.5 px-3 font-bold text-gray-900 flex items-center space-x-1.5">
                      <span>{p.name}</span>
                      {p.pts >= 25 && (
                        <Award className="w-3.5 h-3.5 text-amber-500 inline shrink-0" title="Top Performer" />
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center text-gray-500 font-semibold">{p.pos}</td>
                    <td className="py-2.5 px-2 text-center text-gray-600">{p.min}</td>
                    <td className="py-2.5 px-2 text-center font-extrabold text-orange-600 text-sm">{p.pts}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-gray-800">{p.reb}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-gray-800">{p.ast}</td>
                    <td className="py-2.5 px-2 text-center text-gray-600">{p.stl}</td>
                    <td className="py-2.5 px-2 text-center text-gray-600">{p.blk}</td>
                    <td className="py-2.5 px-2 text-center text-gray-700 font-mono text-[11px]">{p.fg}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-black border-t-2 border-gray-300 text-gray-900">
                  <td className="py-3 px-3 uppercase tracking-wider">TEAM TOTALS</td>
                  <td className="py-3 px-2 text-center">-</td>
                  <td className="py-3 px-2 text-center">200:00</td>
                  <td className="py-3 px-2 text-center text-orange-600 text-sm">{totals.pts}</td>
                  <td className="py-3 px-2 text-center">{totals.reb}</td>
                  <td className="py-3 px-2 text-center">{totals.ast}</td>
                  <td className="py-3 px-2 text-center">{totals.stl}</td>
                  <td className="py-3 px-2 text-center">{totals.blk}</td>
                  <td className="py-3 px-2 text-center text-gray-600">-</td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="py-12 text-center text-gray-400">
              <Activity className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="font-semibold text-sm">Official box score will be populated upon tip-off.</p>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between text-xs text-gray-500">
          <span>Venue: {match.venue}, {match.city}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded hover:bg-neutral-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
