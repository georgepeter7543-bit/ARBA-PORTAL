import React, { useState } from 'react';
import { X, Calendar, Download, Check, ExternalLink } from 'lucide-react';

export default function CalendarModal({ isOpen, onClose, matchesCount }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadICS = () => {
    // Generate simple ICS calendar file
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ARBA//Arusha Regional Basketball Association//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:ARBA Basketball 2026 Season
BEGIN:VEVENT
UID:arba-2026-spurs-stars@arba.tz
DTSTAMP:20261024T100000Z
DTSTART:20261024T160000Z
DTEND:20261024T180000Z
SUMMARY:Arusha Spurs vs Soweto Stars (ARBA Premier League)
DESCRIPTION:Arusha Regional Basketball Association Championship Match
LOCATION:Arusha, Tanzania
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'ARBA_2026_Schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('webcal://arba.tz/feed/schedule.ics');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-neutral-700 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0b0f19] text-white p-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h3 className="font-black text-sm uppercase tracking-wide">Add Games to Calendar</h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Never miss tip-off! Sync all <strong>{matchesCount} ARBA schedule fixtures</strong> directly to your personal calendar with automatic venue reminders and live score updates.
          </p>

          <div className="space-y-2.5">
            <button
              onClick={handleDownloadICS}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50/50 transition cursor-pointer text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-orange-600">Download .ICS Calendar File</div>
                  <div className="text-[11px] text-gray-500">For Apple Calendar, Outlook, and devices</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
            </button>

            <button
              onClick={() => window.open('https://calendar.google.com', '_blank')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition cursor-pointer text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                  G
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-blue-600">Google Calendar</div>
                  <div className="text-[11px] text-gray-500">Subscribe with your Google account</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
            </button>
          </div>

          <div className="pt-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block mb-1">
              Direct CalDAV / iCal Subscription URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value="webcal://arba.tz/feed/schedule.ics"
                className="flex-1 bg-gray-100 border border-gray-200 rounded px-2.5 py-1.5 text-xs font-mono text-gray-700 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded hover:bg-neutral-800 transition flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : null}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
