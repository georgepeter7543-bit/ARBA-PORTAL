import React, { useState, useMemo } from 'react';
import { User } from 'lucide-react';

/**
 * PlayerAvatar - Renders a crisp circular player photo or ARBA orange/dark fallback badge
 * 
 * Props:
 * - photoUrl: string (URL or base64)
 * - name: string (Player's full name)
 * - size: string (Tailwind width/height classes, e.g. "w-10 h-10")
 * - className: string (additional classes)
 */
export default function PlayerAvatar({
  photoUrl,
  name = '',
  size = 'w-10 h-10',
  className = ''
}) {
  const [hasError, setHasError] = useState(false);
  const [prevPhotoUrl, setPrevPhotoUrl] = useState(photoUrl);

  // Synchronously reset error when photoUrl changes during render
  if (photoUrl !== prevPhotoUrl) {
    setPrevPhotoUrl(photoUrl);
    setHasError(false);
  }

  // Compute initials (e.g., "Kelvin Mwita" -> "KM", "Baraka" -> "BA")
  const initials = useMemo(() => {
    if (!name || typeof name !== 'string') return '';
    const cleaned = name.trim();
    if (!cleaned) return '';
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }, [name]);

  const cleanUrl = typeof photoUrl === 'string' ? photoUrl.trim() : '';

  // Render valid image if available and not errored
  if (cleanUrl && !hasError) {
    return (
      <img
        src={cleanUrl}
        alt={name || 'Player'}
        onError={() => setHasError(true)}
        className={`${size} rounded-full object-cover border border-slate-200 shadow-xs shrink-0 ${className}`}
        loading="lazy"
      />
    );
  }

  // Fallback Avatar: ARBA orange/dark theme badge
  return (
    <div
      className={`${size} rounded-full bg-[#0F172A] border border-orange-500/40 text-orange-400 flex items-center justify-center font-black text-xs uppercase tracking-wider shrink-0 shadow-xs select-none ${className}`}
      title={name || 'Player Avatar'}
      aria-label={name || 'Player Avatar'}
    >
      {initials ? (
        <span>{initials}</span>
      ) : (
        <User className="w-4 h-4 text-orange-400" />
      )}
    </div>
  );
}
