import React, { useState } from 'react';
import { X, Lock, Mail, UserCheck, KeyRound, AlertCircle, Shield } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onAdminSuccess }) {
  const [role, setRole] = useState('fan'); // 'fan' | 'player' | 'official' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (role === 'admin') {
      const activePasscode = localStorage.getItem('arba_admin_passcode') || 'ADMINISTRATOR';
      if (adminPasscode !== activePasscode) {
        setErrorMsg('Invalid Admin Passcode. Please check your passcode and try again.');
        return;
      }

      if (onAdminSuccess) {
        onAdminSuccess();
      }
      onClose();
      return;
    }

    // Non-admin roles standard flow
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn select-none">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-[#FFFFFF] text-[#111827] p-5 flex items-center justify-between border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex items-center justify-center shrink-0">
              <img
                src="/arba-logo.jpg"
                alt="Official ARBA Crest"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F97316]">
                ARBA PORTAL
              </span>
              <h3 className="font-black text-base text-[#111827]">
                {role === 'admin' ? 'Admin Portal Authentication' : 'Sign In to Your Account'}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-[#111827] transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* 4 SELECTABLE ROLES */}
          <div>
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 block mb-1.5">
              Select Your ARBA Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'fan', label: 'Fan / Spectator' },
                { id: 'player', label: 'Player' },
                { id: 'official', label: 'Coach / Ref' },
                { id: 'admin', label: 'Admin' }
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => handleRoleChange(r.id)}
                  className={`py-2 px-2 text-[11px] font-bold rounded border transition text-center cursor-pointer ${
                    role === r.id
                      ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-2xs'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* ADMIN PASSCODE FIELD (CONDITIONALLY DISPLAYED) */}
          {role === 'admin' ? (
            <div className="space-y-4">
              <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800 text-white">
                <div className="flex items-center space-x-2 text-orange-400 text-xs font-black uppercase">
                  <Shield className="w-4 h-4" />
                  <span>ARBA Secretarial Security</span>
                </div>
                <p className="text-[11px] text-neutral-300 mt-1">
                  Access restricted to authorized ARBA administrators. Passcode verification required.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-700 block mb-1">
                  ADMIN PASSCODE *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter Passcode (Case-Sensitive)"
                    value={adminPasscode}
                    onChange={(e) => {
                      setAdminPasscode(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2.5 pl-9 pr-3 text-xs text-gray-900 font-mono tracking-wider focus:outline-none focus:border-black focus:bg-white transition"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Strictly case-sensitive security credential.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* NON-ADMIN EMAIL FIELD */}
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 block mb-1">
                  Arusha Basketball ID or Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. player@arba.tz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-xs text-gray-800 focus:outline-none focus:border-black focus:bg-white transition"
                  />
                </div>
              </div>

              {/* NON-ADMIN PASSWORD FIELD */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600">
                    Password
                  </label>
                  <a href="#forgot" className="text-[11px] font-semibold text-orange-600 hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-xs text-gray-800 focus:outline-none focus:border-black focus:bg-white transition"
                  />
                </div>
              </div>
            </>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitted}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center space-x-1.5"
          >
            {isSubmitted ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>{role === 'admin' ? 'Verify Passcode & Enter Admin' : 'Sign In to Portal'}</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-[11px] text-gray-500">
              New to Arusha Basketball Association?{' '}
              <a href="#register" className="font-bold text-black underline">
                Register Club or Player
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
