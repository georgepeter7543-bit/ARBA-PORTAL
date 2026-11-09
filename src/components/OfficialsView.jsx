import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  User, 
  CheckCircle2, 
  Award, 
  MapPin, 
  ShieldCheck, 
  X,
  Eye
} from 'lucide-react';

export default function OfficialsView({ officials = [] }) {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedOfficial, setSelectedOfficial] = useState(null);

  // Local storage real-time listener for instant dynamic sync
  const [localOfficials, setLocalOfficials] = useState(() => {
    try {
      const saved = localStorage.getItem('arba_officials');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('arba_officials');
        if (saved) {
          setLocalOfficials(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error syncing officials:', err);
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('arba_officials_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('arba_officials_updated', handleSync);
    };
  }, []);

  // Use props if provided, otherwise fallback to localOfficials
  const activeOfficials = useMemo(() => {
    if (Array.isArray(officials) && officials.length > 0) return officials;
    if (Array.isArray(localOfficials) && localOfficials.length > 0) return localOfficials;
    try {
      const saved = localStorage.getItem('arba_officials');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, [officials, localOfficials]);

  // Filter officials
  const filteredOfficials = useMemo(() => {
    return activeOfficials.filter((official) => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || (
        official.name?.toLowerCase().includes(q) ||
        official.role?.toLowerCase().includes(q) ||
        official.certification?.toLowerCase().includes(q) ||
        official.badge?.toLowerCase().includes(q) ||
        official.zone?.toLowerCase().includes(q)
      );

      const offRole = (official.role || '').toLowerCase();
      const offCert = (official.certification || official.badge || '').toLowerCase();

      let matchesFilter = true;
      if (selectedFilter === 'Referee') matchesFilter = offRole.includes('referee') || offRole.includes('umpire');
      else if (selectedFilter === 'Commissioner') matchesFilter = offRole.includes('commissioner');
      else if (selectedFilter === 'Table Official') matchesFilter = offRole.includes('table') || offRole.includes('timekeeper') || offRole.includes('scorer');
      else if (selectedFilter === 'FIBA') matchesFilter = offCert.includes('fiba');

      return matchesSearch && matchesFilter;
    });
  }, [activeOfficials, search, selectedFilter]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] selection:bg-orange-500 selection:text-white pb-20 animate-fadeIn">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E5E7EB] pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]"></span>
              <span className="text-xs font-black uppercase tracking-widest text-[#F97316]">
                MATCH INTEGRITY &amp; ARBITRATION • FIBA COMPLIANT
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] uppercase tracking-tight font-sans antialiased leading-tight">
              ARBA Match Officials &amp; Referees
            </h1>
            <p className="text-sm text-[#4B5563] font-medium leading-relaxed mt-2 max-w-2xl antialiased">
              Certified floor referees, table commissioners, and evaluators maintaining FIBA standards across Northern Tanzania.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 text-xs font-bold text-[#374151] bg-white border border-[#E5E7EB] px-4 py-2.5 rounded-xl shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>
              <strong className="text-[#111827] font-mono text-sm">{filteredOfficials.length}</strong> Registered Officials
            </span>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#F3F4F6] p-4 rounded-xl border border-[#E5E7EB]">
          {/* SEARCH BAR */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by official name, role, certification, or zone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#D1D5DB] text-[#111827] placeholder-gray-400 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition"
            />
          </div>

          {/* FILTER PILLS */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-[11px] font-black uppercase text-[#6B7280] mr-1 hidden sm:inline">
              Filter:
            </span>
            {['ALL', 'Referee', 'Commissioner', 'Table Official', 'FIBA'].map((item) => (
              <button
                key={item}
                onClick={() => setSelectedFilter(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                  selectedFilter === item
                    ? 'bg-[#F97316] text-white shadow-xs'
                    : 'bg-white border border-[#E5E7EB] text-[#374151] hover:bg-gray-100 hover:text-[#111827]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* OFFICIALS INTERACTIVE DATA TABLE */}
        <div className="w-full overflow-x-auto rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-xs">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead className="sticky top-0 z-20 bg-[#F3F4F6] text-[#374151] text-[11px] font-black uppercase tracking-wider border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3.5 px-5">Official Name</th>
                <th className="py-3.5 px-4">Role / Designation</th>
                <th className="py-3.5 px-4 text-center">Certification</th>
                <th className="py-3.5 px-4 text-center">Assigned Zone / Region</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs">
              {filteredOfficials.map((official) => {
                const certLabel = official.certification || official.badge || 'National Grade A';
                const zoneLabel = official.zone || 'Central Arusha';
                const statusLabel = official.status || 'Active Licensed';

                return (
                  <tr 
                    key={official.id || official.name} 
                    className="hover:bg-orange-50/30 transition-colors group"
                  >
                    {/* 1. NAME (Avatar + Name) */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-3">
                        {official.image ? (
                          <img
                            src={official.image}
                            alt={official.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB] shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-900 text-orange-400 font-black text-sm flex items-center justify-center border border-neutral-700 shrink-0">
                            {official.name?.charAt(0) || 'O'}
                          </div>
                        )}
                        <div>
                          <h4 className="font-black text-[#111827] text-sm group-hover:text-[#F97316] transition-colors">
                            {official.name}
                          </h4>
                          <span className="text-[10px] text-gray-500 font-mono">
                            LIC: {official.id ? String(official.id).slice(-6).toUpperCase() : 'REF'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. ROLE / DESIGNATION */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#111827] text-xs bg-gray-100 px-2.5 py-1 rounded-md">
                        {official.role || 'Floor Referee'}
                      </span>
                    </td>

                    {/* 3. CERTIFICATION */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-orange-50 text-[#F97316] border border-orange-200">
                        <Award className="w-3 h-3 text-[#F97316]" />
                        <span>{certLabel}</span>
                      </span>
                    </td>

                    {/* 4. ASSIGNED ZONE / REGION */}
                    <td className="py-3.5 px-4 text-center font-mono font-medium text-gray-700">
                      <span className="inline-flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{zoneLabel}</span>
                      </span>
                    </td>

                    {/* 5. STATUS */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{statusLabel}</span>
                      </span>
                    </td>

                    {/* 6. ACTIONS */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedOfficial(official)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white hover:text-orange-400 text-xs font-bold transition flex items-center space-x-1.5 ml-auto cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredOfficials.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 px-4 text-center bg-[#FFFFFF]">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#F97316]">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-[#111827] uppercase tracking-wide">
                          No registered match officials found
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          {search.trim() || selectedFilter !== 'ALL'
                            ? `No officials match "${search || selectedFilter}". Try clearing your filters.`
                            : 'No registered match officials found. Add officials via the Admin Dashboard.'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* INSPECT DETAILS MODAL */}
      {selectedOfficial && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedOfficial(null)}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 sm:p-8 text-[#111827] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/25">
                Official Credential File
              </span>
              <button 
                onClick={() => setSelectedOfficial(null)}
                className="text-gray-400 hover:text-[#111827] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {selectedOfficial.image ? (
                <img
                  src={selectedOfficial.image}
                  alt={selectedOfficial.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-orange-400 font-black text-2xl flex items-center justify-center border border-neutral-700 shadow-md">
                  {selectedOfficial.name?.charAt(0) || 'O'}
                </div>
              )}
              <div>
                <h3 className="text-xl font-black text-[#111827]">
                  {selectedOfficial.name}
                </h3>
                <p className="text-xs font-bold text-orange-600 mt-0.5">
                  {selectedOfficial.role || 'Match Official'}
                </p>
                <span className="text-[11px] font-semibold text-gray-500">
                  {selectedOfficial.zone || 'Central Arusha Zone'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-[#E5E7EB] text-xs">
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Accreditation</span>
                <span className="font-black text-[#111827] mt-0.5 block">
                  {selectedOfficial.certification || selectedOfficial.badge || 'National Grade A'}
                </span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Assigned Zone</span>
                <span className="font-bold text-[#111827] mt-0.5 block">
                  {selectedOfficial.zone || 'Central Arusha Zone'}
                </span>
              </div>

              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 col-span-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Accreditation Status</span>
                <div className="flex items-center space-x-1.5 mt-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{selectedOfficial.status || 'Active Licensed'} • Cleared for 2026 ARBA Tournaments</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOfficial(null)}
                className="px-5 py-2.5 bg-[#111827] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
              >
                Close Credential File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
