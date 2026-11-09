import React, { useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Tv, MessageSquare } from 'lucide-react';

export default function WatchModal({ match, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!match) return null;

  const {
    awayTeam,
    homeTeam,
    venue,
    status,
    isLive,
    broadcaster
  } = match;

  const commentaryFeed = [
    { time: 'Q4 3:24', text: `${awayTeam.name} forces a shot-clock violation with aggressive perimeter trap!` },
    { time: 'Q4 3:52', text: `Deep 3-pointer hits nothing but net from the wing! The court is electric.` },
    { time: 'Q4 4:18', text: `Huge fast break dunk! The home crowd roaring with chants.` },
    { time: 'Q4 5:02', text: `Timeout called on the floor by head coach. Tactical adjustment incoming.` }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-neutral-950 w-full max-w-4xl rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="bg-[#000000] text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-orange-500 text-black font-extrabold text-[10px] uppercase tracking-wider">
              <Tv className="w-3.5 h-3.5" />
              <span>ARBA TV BROADCAST</span>
            </span>
            <span className="text-xs text-neutral-400 font-semibold hidden sm:inline">
              {venue} • {broadcaster}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIDEO PLAYER SCREEN SIMULATION */}
        <div className="relative aspect-video bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex items-center justify-center overflow-hidden group select-none">
          
          {/* Basketball court ambient background graphic */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px]"></div>
          
          {/* Subtle court lines SVG watermark */}
          <svg className="absolute w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 60">
            <rect x="5" y="5" width="90" height="50" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="50" cy="30" r="10" fill="none" stroke="white" strokeWidth="0.5" />
            <line x1="50" y1="5" x2="50" y2="55" stroke="white" strokeWidth="0.5" />
          </svg>

          {/* OVERLAY: LIVE SCOREBOARD BANNER (NBA style) */}
          <div className="absolute top-4 left-4 z-20 bg-black/85 backdrop-blur-md border border-neutral-700/80 rounded-lg p-2.5 shadow-2xl flex items-center space-x-3 text-white">
            <div className="flex items-center space-x-2 border-r border-neutral-700 pr-3">
              {isLive ? (
                <span className="flex items-center space-x-1 text-[10px] font-black uppercase text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  <span>LIVE</span>
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase text-neutral-400">
                  REPLAY
                </span>
              )}
              <span className="text-[11px] font-mono font-bold text-neutral-300">
                {status}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs font-black tabular-nums">
              <span className="text-neutral-300">{awayTeam.abbr}</span>
              <span className="text-orange-400 text-sm font-black">{awayTeam.score ?? '--'}</span>
              <span className="text-neutral-500 font-normal">|</span>
              <span className="text-white text-sm font-black">{homeTeam.score ?? '--'}</span>
              <span className="text-neutral-300">{homeTeam.abbr}</span>
            </div>
          </div>

          {/* RESOLUTION BADGE */}
          <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm border border-neutral-700 rounded px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
            1080p 60FPS HD
          </div>

          {/* CENTER ACTION / PAUSE ICON */}
          <div 
            onClick={() => setIsPlaying(!isPlaying)}
            className="z-20 cursor-pointer flex flex-col items-center justify-center group-hover:scale-105 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-orange-500/90 hover:bg-orange-500 text-black flex items-center justify-center shadow-2xl transition">
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </div>
            <span className="mt-2 text-xs font-bold text-neutral-300 uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded">
              {isPlaying ? 'Streaming Broadcast' : 'Paused'}
            </span>
          </div>

          {/* PLAYER BOTTOM CONTROLS BAR */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6 z-20 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-orange-400 transition cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-orange-400 transition cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-[11px] font-mono text-neutral-400">
                {isLive ? '00:32:15 • LIVE FEED' : '01:42:10'}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[10px] font-bold text-orange-400 tracking-wider">ARBA DIGITAL COURTSIDE</span>
              <button className="hover:text-orange-400 transition cursor-pointer">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* LIVE COMMENTARY FEED & GAME CHAT */}
        <div className="bg-neutral-900 p-4 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
              <span>Live Courtside Play-By-Play & Notes</span>
            </span>
            <span className="text-[10px] font-bold text-orange-400 uppercase">
              Arusha Regional Live Feed
            </span>
          </div>

          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
            {commentaryFeed.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs">
                <span className="text-[10px] font-mono font-bold text-neutral-400 bg-neutral-800 px-1.5 py-0.2 rounded shrink-0">
                  {item.time}
                </span>
                <span className="text-neutral-200">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
