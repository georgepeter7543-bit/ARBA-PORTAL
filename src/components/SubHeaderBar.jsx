import React from 'react';
import { SUB_BAR_CATEGORIES } from '../data/basketballData';

export default function SubHeaderBar({ activeSubCategory, onSelectSubCategory }) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center h-12 overflow-x-auto no-scrollbar space-x-4 sm:space-x-6 text-[13px] font-semibold text-gray-700">
          
          {/* PRIMARY SECTION TITLE (NBA.com style) */}
          <div className="flex items-center shrink-0 pr-4 sm:pr-6 border-r border-gray-300">
            <span className="font-extrabold uppercase tracking-wider text-black text-sm font-sans flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>SCHEDULE</span>
            </span>
          </div>

          {/* HORIZONTAL CATEGORY LINKS */}
          <div className="flex items-center space-x-5 sm:space-x-7 shrink-0">
            {SUB_BAR_CATEGORIES.map((cat) => {
              const isSelected = activeSubCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectSubCategory(cat.id)}
                  className={`relative py-3 transition-colors duration-150 whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                    isSelected
                      ? 'text-black font-bold'
                      : 'text-gray-600 hover:text-black font-medium'
                  }`}
                >
                  {cat.isLiveBadge && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                  <span>{cat.label}</span>

                  {/* Active bottom border indicator */}
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black"></span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
