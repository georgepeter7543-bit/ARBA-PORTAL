import React, { useState, useMemo, useEffect } from 'react';
import { Search, User, ShieldCheck, ArrowUpDown } from 'lucide-react';

export default function PlayersView({ customPlayers = [] }) {
  const [search, setSearch] = useState('');
  const [selectedPos, setSelectedPos] = useState('ALL'); // 'ALL' | 'PG' | 'SG' | 'SF' | 'PF' | 'C'
  const [sortField, setSortField] = useState(null); // null means default (newest custom players first)
  const [sortAsc, setSortAsc] = useState(false);

  // Local storage real-time listener for instant dynamic sync
  const [localPlayers, setLocalPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem('arba_custom_players');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('arba_custom_players');
        if (saved) {
          setLocalPlayers(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error syncing players:', err);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('arba_player_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('arba_player_updated', handleSync);
    };
  }, []);

  // Combine custom players from props or local storage
  const storedPlayers = useMemo(() => {
    if (Array.isArray(customPlayers) && customPlayers.length > 0) return customPlayers;
    if (Array.isArray(localPlayers) && localPlayers.length > 0) return localPlayers;
    try {
      const saved = localStorage.getItem('arba_custom_players');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, [customPlayers, localPlayers]);

  // All active registered players (from Admin Dashboard / localStorage)
  const allPlayers = useMemo(() => {
    return (storedPlayers || []).map((p) => ({
      ...p,
      isCustom: true,
      jersey: p.jersey !== undefined && p.jersey !== '' ? p.jersey : 0,
      age: p.age || 24,
      height: p.height || '196 cm / 6\'5"',
      status: p.status || 'Active'
    }));
  }, [storedPlayers]);

  // Filter by search & position
  const filteredPlayers = useMemo(() => {
    let result = allPlayers.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || (
        p.name?.toLowerCase().includes(q) ||
        p.team?.toLowerCase().includes(q) ||
        p.pos?.toLowerCase().includes(q) ||
        String(p.jersey)?.includes(q)
      );

      const matchesPos = selectedPos === 'ALL' || p.pos === selectedPos;
      return matchesSearch && matchesPos;
    });

    if (sortField) {
      result = [...result].sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
        return sortAsc ? valA - valB : valB - valA;
      });
    }

    return result;
  }, [allPlayers, search, selectedPos, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      if (sortAsc) {
        setSortAsc(false);
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] selection:bg-orange-500 selection:text-white pb-20 animate-fadeIn">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E5E7EB] pb-6 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] uppercase tracking-tight font-sans antialiased leading-tight">
              Players Directory
            </h1>
          </div>

          <div className="flex items-center space-x-2.5 text-xs font-bold text-[#374151] bg-white border border-[#E5E7EB] px-4 py-2.5 rounded-xl shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>
              <strong className="text-[#111827] font-mono text-sm">{filteredPlayers.length}</strong> Registered Athletes
            </span>
          </div>
        </div>

        {/* 2. LIGHT MODE SEARCH & POSITION FILTER BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#F3F4F6] p-4 rounded-xl border border-[#E5E7EB]">
          {/* SEARCH BAR */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by player name, club, position, or jersey #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#D1D5DB] text-[#111827] placeholder-gray-400 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition"
            />
          </div>

          {/* POSITION PILLS */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-[11px] font-black uppercase text-[#6B7280] mr-1 hidden sm:inline">
              Position:
            </span>
            {['ALL', 'PG', 'SG', 'SF', 'PF', 'C'].map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPos(pos)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                  selectedPos === pos
                    ? 'bg-[#F97316] text-white shadow-sm'
                    : 'bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-100 hover:text-[#111827]'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* 1. CLEAN WHITE FIBA-STYLE DATA TABLE */}
        <div className="w-full overflow-x-auto rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            {/* STICKY TABLE HEADER */}
            <thead className="sticky top-0 z-20 bg-[#F3F4F6] text-[#374151] text-[11px] font-black uppercase tracking-wider border-b border-[#E5E7EB]">
              <tr>
                <th 
                  onClick={() => handleSort('jersey')} 
                  className="py-3.5 px-4 w-16 text-center cursor-pointer hover:text-[#F97316] select-none transition"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>#</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('name')} 
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F97316] select-none transition"
                >
                  <div className="flex items-center space-x-1">
                    <span>Player Name</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('team')} 
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F97316] select-none transition"
                >
                  <div className="flex items-center space-x-1">
                    <span>Current Team</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('pos')} 
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-[#F97316] select-none transition"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>POS</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('age')} 
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-[#F97316] select-none transition"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Age</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">
                  Height
                </th>
                <th 
                  onClick={() => handleSort('ppg')} 
                  className="py-3.5 px-5 text-right cursor-pointer hover:text-[#F97316] select-none transition"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>PPG</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
              </tr>
            </thead>

            {/* WHITE DATA ROWS WITH CRISP ACCENTS */}
            <tbody className="divide-y divide-[#E5E7EB] text-xs sm:text-sm bg-[#FFFFFF]">
              {filteredPlayers.map((player, idx) => (
                <tr
                  key={player.id || `${player.name}-${idx}`}
                  className="transition-all duration-150 border-b border-[#E5E7EB] bg-[#FFFFFF] hover:bg-orange-50/50 hover:outline hover:outline-1 hover:outline-[#F97316] cursor-pointer group"
                >
                  {/* 1. JERSEY NUMBER */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-[#6B7280] group-hover:text-[#F97316] transition">
                    #{player.jersey || '00'}
                  </td>

                  {/* 2. PLAYER NAME & AVATAR */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center text-[#F97316] font-bold text-xs shrink-0 group-hover:border-[#F97316] transition">
                        {player.image ? (
                          <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-[#9CA3AF]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-[#111827] text-xs sm:text-sm group-hover:text-[#F97316] transition truncate">
                            {player.name}
                          </span>
                          {player.isCustom && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-orange-100 text-[#F97316] border border-orange-300 shrink-0">
                              NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 3. CURRENT TEAM */}
                  <td className="py-3.5 px-4 font-semibold text-[#1F2937] text-xs sm:text-sm">
                    {player.team}
                  </td>

                  {/* 4. POS */}
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-black font-mono tracking-wider bg-orange-50 text-[#F97316] border border-orange-200">
                      {player.pos || 'G'}
                    </span>
                  </td>

                  {/* 5. AGE */}
                  <td className="py-3.5 px-3 text-center font-mono text-[#374151] text-xs font-medium">
                    {player.age ? `${player.age} yrs` : '24 yrs'}
                  </td>

                  {/* 6. HEIGHT */}
                  <td className="py-3.5 px-4 text-center font-mono text-[#374151] text-xs font-medium whitespace-nowrap">
                    {player.height || '196 cm / 6\'5"'}
                  </td>

                  {/* 7. PPG */}
                  <td className="py-3.5 px-5 text-right font-mono font-black text-[#F97316] text-sm sm:text-base">
                    {Number(player.ppg || 0).toFixed(1)}
                  </td>
                </tr>
              ))}

              {filteredPlayers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 px-4 text-center bg-[#FFFFFF]">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#F97316]">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-[#111827] uppercase tracking-wide">
                          No registered players found
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          {search.trim() || selectedPos !== 'ALL'
                            ? `No athletes match "${search || selectedPos}". Try clearing your filters.`
                            : 'No registered players found. Add players via the Admin Dashboard.'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM METRICS BAR */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <span>
            ARBA Official Player Directory • Arusha, Tanzania
          </span>
          <span className="font-mono text-gray-400">
            Updated in Real-Time via ARBA Secretariat Admin
          </span>
        </div>

      </div>
    </div>
  );
}
