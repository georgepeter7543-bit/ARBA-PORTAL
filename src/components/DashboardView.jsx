import React from 'react';
import { ARBA_INFO } from '../data/basketballData';
import { Shield, Users, FileText, ArrowUpRight, Lock, ShieldCheck } from 'lucide-react';

export default function DashboardView({ onOpenLogin, isAdmin = false, onOpenAdmin }) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-5 gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-orange-600">
            PORTAL OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-tight font-sans mt-0.5">
            ARBA Management Portal
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Centralized portal for club licensing, player transfers, and competition management.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={onOpenAdmin}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Admin Management Portal</span>
          </button>
        ) : (
          <button
            onClick={onOpenLogin}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Member Secure Sign In</span>
          </button>
        )}
      </div>

      {/* ADMIN STATUS BANNER IF AUTHENTICATED */}
      {isAdmin && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#000000] border-2 border-orange-500/40 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-orange-400">
                  ADMINISTRATOR PRIVILEGES ACTIVE
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                  SECRETARIAT LEVEL
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                You have administrative access to register new players to the live directory and publish news bulletins directly to the Home feed.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAdmin}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow shrink-0 cursor-pointer"
          >
            Launch Admin Panel &rarr;
          </button>
        </div>
      )}

      {/* QUICK STATUS METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase">2026 Season State</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-xl font-black text-gray-900">Active Competition</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Week 1 In Progress</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase">Transfer Window</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-xl font-black text-gray-900">Mid-Season Draft</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Closes in 18 Days</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase">Affiliated Clubs</span>
            <Shield className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-xl font-black text-gray-900">{ARBA_INFO.stats.registeredClubs} Teams</div>
          <div className="text-[11px] text-gray-500 font-semibold mt-1">100% Certified for 2026</div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase">Player Passports</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-black text-gray-900">{ARBA_INFO.stats.activePlayers} ID Passports</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">TBF Biometric Clearance</div>
        </div>
      </div>

      {/* PORTAL MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MODULE 1 */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-gray-900 uppercase">Club License Registration</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Submit team rosters, medical forms, home court insurance certification, and official kit submissions for the 2026 season.
          </p>
          <button 
            onClick={isAdmin ? onOpenAdmin : onOpenLogin}
            className="text-xs font-bold text-orange-600 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Access Licensing Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MODULE 2 */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-gray-900 uppercase">Player Transfer Window</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Execute official intra-division player transfers, loan agreements, and release letters under ARBA arbitration bylaws.
          </p>
          <button 
            onClick={isAdmin ? onOpenAdmin : onOpenLogin}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Manage Player Transfers</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MODULE 3 */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-gray-900 uppercase">Referees & Match Reports</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Authorized table officials and referees can input live scores, digital score sheets, foul charts, and match incidents.
          </p>
          <button 
            onClick={isAdmin ? onOpenAdmin : onOpenLogin}
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>Submit Game Score Sheet</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
