import React, { useState, useMemo, useEffect } from 'react';
import TeamCrest from './TeamCrest';
import { TEAMS } from '../data/basketballData';
import { 
  Search, 
  MapPin, 
  User, 
  X, 
  Shield
} from 'lucide-react';

export default function TeamsView({ selectedTeamModal, onCloseTeamModal, onOpenTeamModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState('All');

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedTeamModal) {
        onCloseTeamModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTeamModal, onCloseTeamModal]);

  const filteredTeams = TEAMS.filter((team) => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.homeCourt.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterDivision === 'All') return matchesSearch;
    return matchesSearch && team.division === filterDivision;
  });

  // Filter automatically from registered players dataset matching this team
  const modalRoster = useMemo(() => {
    if (!selectedTeamModal) return [];

    const teamNameLower = selectedTeamModal.name.toLowerCase();
    const shortNameLower = selectedTeamModal.shortName ? selectedTeamModal.shortName.toLowerCase() : '';

    const rosterMap = new Map();

    // Check registered players from localStorage
    try {
      const saved = localStorage.getItem('arba_custom_players');
      if (saved) {
        const custom = JSON.parse(saved);
        if (Array.isArray(custom)) {
          custom.forEach((cp) => {
            const cpTeam = (cp.team || '').toLowerCase();
            if (
              cpTeam === teamNameLower || 
              cpTeam === shortNameLower || 
              (shortNameLower && cpTeam.includes(shortNameLower))
            ) {
              rosterMap.set(cp.name.toLowerCase(), {
                id: cp.id,
                num: cp.jersey !== undefined && cp.jersey !== '' ? cp.jersey : 0,
                name: cp.name,
                image: cp.image || null,
                pos: cp.pos || 'G',
                age: cp.age || 24,
                height: cp.height || '196 cm / 6\'5"',
                ppg: cp.ppg || 0,
                isCustom: true
              });
            }
          });
        }
      }
    } catch (err) {
      console.error('Error reading custom players for modal:', err);
    }

    return Array.from(rosterMap.values());
  }, [selectedTeamModal]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] pb-16 animate-fadeIn select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E5E7EB] pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
              <span className="text-xs font-black uppercase tracking-widest text-[#F97316]">
                OFFICIAL FRANCHISES • 2026 SEASON
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] uppercase tracking-tight font-sans antialiased leading-tight mt-1">
              Arusha Regional Basketball Teams
            </h1>
          </div>

          {/* SEARCH & FILTERS */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center space-x-1 bg-[#F3F4F6] p-1 rounded-xl border border-[#E5E7EB]">
              {['All', "Men's Premier Division"].map((div) => (
                <button
                  key={div}
                  onClick={() => setFilterDivision(div)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    filterDivision === div
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-gray-600 hover:text-[#111827]'
                  }`}
                >
                  {div === "Men's Premier Division" ? 'Premier' : 'All Teams'}
                </button>
              ))}
            </div>

            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search team or court..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl py-2 pl-9 pr-3 text-xs text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition"
              />
            </div>
          </div>
        </div>

        {/* 1. ULTRA-MINIMALIST LOGO-ONLY TEAMS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              onClick={() => onOpenTeamModal(team)}
              className="rounded-3xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs hover:shadow-2xl hover:border-orange-400 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex items-center justify-center p-6 sm:p-7 h-64 sm:h-72 group relative overflow-hidden"
              title={`Click to view ${team.name} full roster & stats`}
            >
              {/* Subtle hover background accent */}
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* ENLARGED CRISP LOGO WITH STANDARD PADDING & OBJECT-CONTAIN */}
              <div className="w-full h-full max-w-[210px] max-h-[210px] p-2 sm:p-3 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative z-10">
                <TeamCrest 
                  team={team} 
                  className="w-full h-full object-contain drop-shadow-xs" 
                />
              </div>
            </div>
          ))}
        </div>

        {/* 2. INTERACTIVE TEAM DETAIL & ROSTER MODAL */}
        {selectedTeamModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn"
            onClick={onCloseTeamModal}
          >
            <div 
              className="bg-[#FFFFFF] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODAL HEADER: ENLARGED LOGO, CLUB NAME, HEAD COACH, HOME ARENA, DIVISION RECORD */}
              <div className="bg-white p-6 sm:p-7 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative">
                <div className="flex items-center space-x-5">
                  {/* ENLARGED TEAM LOGO */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#FFFFFF] rounded-2xl p-2.5 flex items-center justify-center border border-[#E5E7EB] shadow-xs shrink-0">
                    <TeamCrest 
                      team={selectedTeamModal} 
                      className="w-full h-full object-contain drop-shadow-xs" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-[#F97316] border border-orange-200">
                        {selectedTeamModal.division || "Men's Premier Division"}
                      </span>
                      <span className="font-mono text-xs font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                        Rec: {selectedTeamModal.record}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-[#111827] uppercase tracking-tight font-sans leading-tight">
                      {selectedTeamModal.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 font-medium">
                      <span className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>Head Coach: <strong className="text-[#111827] font-semibold">{selectedTeamModal.coach}</strong></span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>Arena: <strong className="text-[#111827] font-semibold">{selectedTeamModal.homeCourt}</strong></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* INTUITIVE CLOSE (X) BUTTON */}
                <button
                  type="button"
                  onClick={onCloseTeamModal}
                  aria-label="Close Team Profile"
                  className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-[#111827] hover:bg-gray-100 transition cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* MODAL BODY: FILTERED ROSTER TABLE */}
              <div className="p-6 sm:p-7 overflow-y-auto bg-white flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#111827] flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-[#F97316]" />
                    <span>Official Active Roster ({selectedTeamModal.name})</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-gray-500">
                    {modalRoster.length} Registered Athletes
                  </span>
                </div>

                {/* CLEAN LIGHT-MODE DATA TABLE */}
                <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#F3F4F6] font-black text-[#374151] uppercase tracking-wider border-b border-[#E5E7EB]">
                      <tr>
                        <th className="py-3.5 px-3.5 w-16 text-center">#</th>
                        <th className="py-3.5 px-4">Player Name</th>
                        <th className="py-3.5 px-3 text-center">POS</th>
                        <th className="py-3.5 px-3 text-center">Age</th>
                        <th className="py-3.5 px-4 text-center">Height</th>
                        <th className="py-3.5 px-5 text-right text-[#F97316]">PPG</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] font-medium bg-white">
                      {modalRoster.map((player, idx) => (
                        <tr 
                          key={player.id || `${player.name}-${idx}`} 
                          className="hover:bg-orange-50/50 transition-colors"
                        >
                          {/* 1. JERSEY NUMBER */}
                          <td className="py-3.5 px-3.5 text-center font-mono font-bold text-gray-400">
                            #{player.num || '00'}
                          </td>

                          {/* 2. PLAYER NAME (AVATAR + NAME) */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center text-[#F97316] font-bold text-xs shrink-0">
                                {player.image ? (
                                  <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-[#111827] text-xs sm:text-sm">
                                  {player.name}
                                </span>
                                {player.isCustom && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-orange-100 text-[#F97316] border border-orange-300 shrink-0">
                                    NEW
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 3. POSITION (POS) */}
                          <td className="py-3.5 px-3 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-black font-mono tracking-wider bg-orange-50 text-[#F97316] border border-orange-200">
                              {player.pos || 'G'}
                            </span>
                          </td>

                          {/* 4. AGE */}
                          <td className="py-3.5 px-3 text-center font-mono text-gray-600">
                            {player.age ? `${player.age} yrs` : '24 yrs'}
                          </td>

                          {/* 5. HEIGHT */}
                          <td className="py-3.5 px-4 text-center font-mono text-gray-600 whitespace-nowrap">
                            {player.height || '196 cm / 6\'5"'}
                          </td>

                          {/* 6. PPG */}
                          <td className="py-3.5 px-5 text-right font-mono font-black text-[#F97316] text-sm sm:text-base">
                            {Number(player.ppg || 0).toFixed(1)}
                          </td>
                        </tr>
                      ))}

                      {modalRoster.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-gray-400 font-semibold bg-white">
                            Roster details currently being finalized with ARBA Competitions Secretariat.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="bg-[#F9FAFB] p-4 sm:p-5 border-t border-[#E5E7EB] flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                  Official ARBA Roster • Verified FIBA Zone 5 Standards
                </span>
                <button
                  type="button"
                  onClick={onCloseTeamModal}
                  className="px-5 py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-xs ml-auto"
                >
                  Close Roster
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
