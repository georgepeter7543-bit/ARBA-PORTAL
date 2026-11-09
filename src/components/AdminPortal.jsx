import React, { useState, useRef } from 'react';
import { 
  UserPlus, 
  Newspaper, 
  Trash2, 
  Pencil,
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Hash,
  Upload,
  Link as LinkIcon,
  X,
  Sparkles,
  Award,
  Shield,
  Image as ImageIcon,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import { TEAMS } from '../data/basketballData';

const PRESET_NEWS_IMAGES = [
  { label: 'Action Play', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Slam Dunk', url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Championship', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Team Huddle', url: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Outdoor Court', url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=1600&q=80' }
];

export default function AdminPortal({
  customPlayers,
  onAddPlayer,
  onDeletePlayer,
  newsArticles,
  onAddNews,
  onUpdateNews,
  onDeleteNews,
  coaches = [],
  onAddCoach,
  onUpdateCoach,
  onDeleteCoach,
  officials = [],
  onAddOfficial,
  onUpdateOfficial,
  onDeleteOfficial,
  onExitAdmin
}) {
  const [activeTab, setActiveTab] = useState('players'); // 'players' | 'news' | 'coaches' | 'officials'

  // Player Form State
  const [playerName, setPlayerName] = useState('');
  const [playerPhotoUrl, setPlayerPhotoUrl] = useState('');
  const [playerTeam, setPlayerTeam] = useState('Arusha Kings');
  const [playerPosition, setPlayerPosition] = useState('SF');
  const [playerJersey, setPlayerJersey] = useState('');
  const [playerAge, setPlayerAge] = useState('');
  const [playerHeight, setPlayerHeight] = useState('');
  const [playerPpg, setPlayerPpg] = useState('');
  const [playerSuccessMsg, setPlayerSuccessMsg] = useState('');
  const [playerErrorMsg, setPlayerErrorMsg] = useState('');

  // News Form State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Official Notice');
  const [newsDate, setNewsDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  });
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [newsSuccessMsg, setNewsSuccessMsg] = useState('');
  const [newsErrorMsg, setNewsErrorMsg] = useState('');

  const fileInputRef = useRef(null);
  const newsFormRef = useRef(null);

  // Coach Form State
  const [coachName, setCoachName] = useState('');
  const [coachPhotoUrl, setCoachPhotoUrl] = useState('');
  const [coachTeam, setCoachTeam] = useState('Arusha Kings');
  const [coachRole, setCoachRole] = useState('Head Coach');
  const [coachLicense, setCoachLicense] = useState('FIBA Level 2');
  const [coachExp, setCoachExp] = useState('8 Years');
  const [coachRecord, setCoachRecord] = useState('');
  const [editingCoachId, setEditingCoachId] = useState(null);
  const [coachSuccessMsg, setCoachSuccessMsg] = useState('');
  const [coachErrorMsg, setCoachErrorMsg] = useState('');
  const coachFormRef = useRef(null);

  // Official Form State
  const [officialName, setOfficialName] = useState('');
  const [officialPhotoUrl, setOfficialPhotoUrl] = useState('');
  const [officialRole, setOfficialRole] = useState('Senior Floor Referee');
  const [officialCert, setOfficialCert] = useState('National Grade A');
  const [officialZone, setOfficialZone] = useState('Central Arusha Zone');
  const [officialStatus, setOfficialStatus] = useState('Active Licensed');
  const [editingOfficialId, setEditingOfficialId] = useState(null);
  const [officialSuccessMsg, setOfficialSuccessMsg] = useState('');
  const [officialErrorMsg, setOfficialErrorMsg] = useState('');
  const officialFormRef = useRef(null);

  // Security / Passcode State
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmNewPasscode, setConfirmNewPasscode] = useState('');
  const [showPasscodes, setShowPasscodes] = useState(false);
  const [passcodeSuccessMsg, setPasscodeSuccessMsg] = useState('');
  const [passcodeErrorMsg, setPasscodeErrorMsg] = useState('');
  const [hasCustomPasscode, setHasCustomPasscode] = useState(() => {
    return !!localStorage.getItem('arba_admin_passcode');
  });

  // Handle Player Submission
  const handlePlayerSubmit = (e) => {
    e.preventDefault();
    setPlayerErrorMsg('');
    setPlayerSuccessMsg('');

    if (!playerName.trim()) {
      setPlayerErrorMsg('Please provide the player full name.');
      return;
    }

    const ppgNum = parseFloat(playerPpg) || 0;
    const jerseyNum = parseInt(playerJersey, 10) || 0;
    const ageNum = parseInt(playerAge, 10) || 24;
    const heightStr = playerHeight.trim() || '196 cm / 6\'5"';

    const newPlayer = {
      id: 'player-' + Date.now(),
      name: playerName.trim(),
      image: playerPhotoUrl.trim() || null,
      team: playerTeam,
      pos: playerPosition,
      jersey: jerseyNum,
      age: ageNum,
      height: heightStr,
      ppg: ppgNum,
      status: 'Active',
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    onAddPlayer(newPlayer);
    setPlayerSuccessMsg(`Player "${playerName.trim()}" successfully registered to live roster!`);

    // Reset Form
    setPlayerName('');
    setPlayerPhotoUrl('');
    setPlayerJersey('');
    setPlayerAge('');
    setPlayerHeight('');
    setPlayerPpg('');

    setTimeout(() => setPlayerSuccessMsg(''), 4000);
  };

  // Image Upload Handler
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNewsErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 4.5 * 1024 * 1024) {
      setNewsErrorMsg('Image size exceeds 4.5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setNewsImageUrl(reader.result);
      setNewsErrorMsg('');
    };
    reader.onerror = () => {
      setNewsErrorMsg('Failed to process image file.');
    };
    reader.readAsDataURL(file);
  };

  // Start Editing News
  const handleStartEditNews = (article) => {
    setEditingNewsId(article.id);
    setNewsTitle(article.title || '');
    setNewsCategory(article.category || 'Official Notice');
    setNewsDate(article.date || '');
    setNewsImageUrl(article.image || '');
    setNewsContent(article.content || '');
    setNewsErrorMsg('');
    setNewsSuccessMsg('');
    if (newsFormRef.current) {
      newsFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cancel Editing News
  const handleCancelEditNews = () => {
    setEditingNewsId(null);
    setNewsTitle('');
    setNewsCategory('Official Notice');
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    setNewsDate(today);
    setNewsImageUrl('');
    setNewsContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setNewsErrorMsg('');
    setNewsSuccessMsg('');
  };

  // Handle News Submission (Add or Update)
  const handleNewsSubmit = (e) => {
    e.preventDefault();
    setNewsErrorMsg('');
    setNewsSuccessMsg('');

    if (!newsTitle.trim() || !newsContent.trim()) {
      setNewsErrorMsg('Please provide both article title and content body.');
      return;
    }

    const fallbackImg = PRESET_NEWS_IMAGES[0].url;
    const finalImage = newsImageUrl.trim() || fallbackImg;

    if (editingNewsId) {
      const updatedArticle = {
        id: editingNewsId,
        title: newsTitle.trim(),
        category: newsCategory,
        date: newsDate.trim() || 'Official Notice',
        image: finalImage,
        content: newsContent.trim(),
        updatedAt: new Date().toISOString()
      };

      if (onUpdateNews) {
        onUpdateNews(updatedArticle);
      }
      setNewsSuccessMsg(`Announcement "${newsTitle.trim()}" updated successfully! Front-end carousel synced.`);
      setEditingNewsId(null);
    } else {
      const newArticle = {
        id: 'news-' + Date.now(),
        title: newsTitle.trim(),
        category: newsCategory,
        date: newsDate.trim() || 'Official Notice',
        image: finalImage,
        content: newsContent.trim(),
        publishedAt: new Date().toISOString()
      };

      onAddNews(newArticle);
      setNewsSuccessMsg(`Announcement "${newsTitle.trim()}" published live to Home hero carousel!`);
    }

    // Reset Form
    setNewsTitle('');
    setNewsCategory('Official Notice');
    setNewsDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    setNewsImageUrl('');
    setNewsContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => setNewsSuccessMsg(''), 4500);
  };

  // COACH CRUD HANDLERS
  const handleStartEditCoach = (coach) => {
    setEditingCoachId(coach.id);
    setCoachName(coach.name || '');
    setCoachPhotoUrl(coach.image || '');
    setCoachTeam(coach.team || 'Arusha Kings');
    setCoachRole(coach.role || 'Head Coach');
    setCoachLicense(coach.certification || coach.license || 'FIBA Level 2');
    setCoachExp(coach.exp || coach.experience || '8 Years');
    setCoachRecord(coach.record || '');
    setCoachErrorMsg('');
    setCoachSuccessMsg('');
    if (coachFormRef.current) {
      coachFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEditCoach = () => {
    setEditingCoachId(null);
    setCoachName('');
    setCoachPhotoUrl('');
    setCoachTeam('Arusha Kings');
    setCoachRole('Head Coach');
    setCoachLicense('FIBA Level 2');
    setCoachExp('8 Years');
    setCoachRecord('');
    setCoachErrorMsg('');
    setCoachSuccessMsg('');
  };

  const handleCoachSubmit = (e) => {
    e.preventDefault();
    setCoachErrorMsg('');
    setCoachSuccessMsg('');

    if (!coachName.trim()) {
      setCoachErrorMsg('Please provide the coach full name.');
      return;
    }

    if (editingCoachId) {
      const updated = {
        id: editingCoachId,
        name: coachName.trim(),
        image: coachPhotoUrl.trim() || null,
        team: coachTeam,
        role: coachRole,
        certification: coachLicense,
        license: coachLicense,
        exp: coachExp.trim() || '5 Years',
        experience: coachExp.trim() || '5 Years',
        record: coachRecord.trim() || 'Active Staff',
        updatedAt: new Date().toISOString()
      };
      if (onUpdateCoach) onUpdateCoach(updated);
      setCoachSuccessMsg(`Coach "${coachName.trim()}" successfully updated!`);
      setEditingCoachId(null);
    } else {
      const newCoach = {
        id: 'coach-' + Date.now(),
        name: coachName.trim(),
        image: coachPhotoUrl.trim() || null,
        team: coachTeam,
        role: coachRole,
        certification: coachLicense,
        license: coachLicense,
        exp: coachExp.trim() || '5 Years',
        experience: coachExp.trim() || '5 Years',
        record: coachRecord.trim() || 'Active Staff',
        createdAt: new Date().toISOString()
      };
      if (onAddCoach) onAddCoach(newCoach);
      setCoachSuccessMsg(`Coach "${coachName.trim()}" registered to live directory!`);
    }

    setCoachName('');
    setCoachPhotoUrl('');
    setCoachRecord('');
    setTimeout(() => setCoachSuccessMsg(''), 4000);
  };

  // OFFICIAL CRUD HANDLERS
  const handleStartEditOfficial = (official) => {
    setEditingOfficialId(official.id);
    setOfficialName(official.name || '');
    setOfficialPhotoUrl(official.image || '');
    setOfficialRole(official.role || 'Senior Floor Referee');
    setOfficialCert(official.certification || official.badge || 'National Grade A');
    setOfficialZone(official.zone || 'Central Arusha Zone');
    setOfficialStatus(official.status || 'Active Licensed');
    setOfficialErrorMsg('');
    setOfficialSuccessMsg('');
    if (officialFormRef.current) {
      officialFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEditOfficial = () => {
    setEditingOfficialId(null);
    setOfficialName('');
    setOfficialPhotoUrl('');
    setOfficialRole('Senior Floor Referee');
    setOfficialCert('National Grade A');
    setOfficialZone('Central Arusha Zone');
    setOfficialStatus('Active Licensed');
    setOfficialErrorMsg('');
    setOfficialSuccessMsg('');
  };

  const handleOfficialSubmit = (e) => {
    e.preventDefault();
    setOfficialErrorMsg('');
    setOfficialSuccessMsg('');

    if (!officialName.trim()) {
      setOfficialErrorMsg('Please provide the official full name.');
      return;
    }

    if (editingOfficialId) {
      const updated = {
        id: editingOfficialId,
        name: officialName.trim(),
        image: officialPhotoUrl.trim() || null,
        role: officialRole,
        certification: officialCert,
        badge: officialCert,
        zone: officialZone.trim() || 'Central Arusha Zone',
        status: officialStatus,
        updatedAt: new Date().toISOString()
      };
      if (onUpdateOfficial) onUpdateOfficial(updated);
      setOfficialSuccessMsg(`Official "${officialName.trim()}" successfully updated!`);
      setEditingOfficialId(null);
    } else {
      const newOfficial = {
        id: 'official-' + Date.now(),
        name: officialName.trim(),
        image: officialPhotoUrl.trim() || null,
        role: officialRole,
        certification: officialCert,
        badge: officialCert,
        zone: officialZone.trim() || 'Central Arusha Zone',
        status: officialStatus,
        createdAt: new Date().toISOString()
      };
      if (onAddOfficial) onAddOfficial(newOfficial);
      setOfficialSuccessMsg(`Official "${officialName.trim()}" registered to live directory!`);
    }

    setOfficialName('');
    setOfficialPhotoUrl('');
    setTimeout(() => setOfficialSuccessMsg(''), 4000);
  };

  // Handle Passcode Update
  const handleUpdatePasscode = (e) => {
    e.preventDefault();
    setPasscodeErrorMsg('');
    setPasscodeSuccessMsg('');

    const activePasscode = localStorage.getItem('arba_admin_passcode') || 'ADMINISTRATOR';

    if (!currentPasscode) {
      setPasscodeErrorMsg('Please enter your current passcode.');
      return;
    }

    if (currentPasscode !== activePasscode) {
      setPasscodeErrorMsg('Current passcode is incorrect. Please verify and try again.');
      return;
    }

    if (!newPasscode.trim()) {
      setPasscodeErrorMsg('Please enter a new passcode.');
      return;
    }

    if (newPasscode.length < 4) {
      setPasscodeErrorMsg('New passcode must be at least 4 characters long.');
      return;
    }

    if (newPasscode !== confirmNewPasscode) {
      setPasscodeErrorMsg('New passcode and confirmation do not match.');
      return;
    }

    // Persist new passcode to localStorage
    localStorage.setItem('arba_admin_passcode', newPasscode);
    setHasCustomPasscode(true);
    setPasscodeSuccessMsg('Passcode updated successfully! Future logins will require your new passcode.');

    // Clear form inputs
    setCurrentPasscode('');
    setNewPasscode('');
    setConfirmNewPasscode('');

    setTimeout(() => {
      setPasscodeSuccessMsg('');
    }, 5000);
  };

  // Reset Passcode to Default
  const handleResetToDefaultPasscode = () => {
    if (window.confirm('Reset administrative passcode back to default "ADMINISTRATOR"?')) {
      localStorage.removeItem('arba_admin_passcode');
      setHasCustomPasscode(false);
      setCurrentPasscode('');
      setNewPasscode('');
      setConfirmNewPasscode('');
      setPasscodeErrorMsg('');
      setPasscodeSuccessMsg('Passcode reset to default (ADMINISTRATOR).');
      setTimeout(() => setPasscodeSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-orange-500 selection:text-white pb-20 animate-fadeIn">
      
      {/* TOP ADMIN BANNER */}
      <div className="border-b border-neutral-800 bg-neutral-950/80 sticky top-14 z-40 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 flex items-center justify-center shrink-0">
              <img
                src="/arba-logo.jpg"
                alt="ARBA Crest"
                className="h-10 w-10 object-contain rounded-xs"
              />
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black tracking-widest uppercase text-orange-500">
                  ARBA SECRETARIAT
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AUTHENTICATED ADMINISTRATOR
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans mt-0.5">
                Admin Management Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-auto">
            <button
              onClick={onExitAdmin}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Admin Portal</span>
            </button>
          </div>
        </div>

        {/* ADMIN TAB SWITCHER */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-wrap gap-2 pt-2 border-t border-neutral-900">
          <button
            onClick={() => setActiveTab('players')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'players'
                ? 'border-orange-500 text-orange-400 bg-neutral-900/40'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Manage Players ({customPlayers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'news'
                ? 'border-orange-500 text-orange-400 bg-neutral-900/40'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Bulletins ({newsArticles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coaches')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'coaches'
                ? 'border-orange-500 text-orange-400 bg-neutral-900/40'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Coaches Registry ({coaches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('officials')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'officials'
                ? 'border-orange-500 text-orange-400 bg-neutral-900/40'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Match Officials ({officials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'security'
                ? 'border-orange-500 text-orange-400 bg-neutral-900/40'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Security & Passcode</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-8 space-y-8">

        {/* SECTION A: PLAYER MANAGEMENT */}
        {activeTab === 'players' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: FORM */}
            <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-orange-500">
                  ROSTER REGISTRATION
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans mt-1">
                  Add Player to Live Directory
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Registered players immediately become visible across the platform's Live Player Directory, search index, and statistical leaderboards.
                </p>
              </div>

              {playerSuccessMsg && (
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{playerSuccessMsg}</span>
                </div>
              )}

              {playerErrorMsg && (
                <div className="p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{playerErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handlePlayerSubmit} className="space-y-4">
                {/* 1. PLAYER NAME & PHOTO URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Player Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kelvin Mwita"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Photo URL (Avatar Image)
                    </label>
                    <div className="relative">
                      <ImageIcon className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. https://... or /players/name.jpg"
                        value={playerPhotoUrl}
                        onChange={(e) => setPlayerPhotoUrl(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CURRENT TEAM & POSITION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Current Team *
                    </label>
                    <select
                      value={playerTeam}
                      onChange={(e) => setPlayerTeam(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                    >
                      {TEAMS.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                      <option value="Independent / Free Agent">Independent / Free Agent</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Position (POS) *
                    </label>
                    <select
                      value={playerPosition}
                      onChange={(e) => setPlayerPosition(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                    >
                      <option value="PG">PG - Point Guard</option>
                      <option value="SG">SG - Shooting Guard</option>
                      <option value="SF">SF - Small Forward</option>
                      <option value="PF">PF - Power Forward</option>
                      <option value="C">C - Center</option>
                    </select>
                  </div>
                </div>

                {/* 3. JERSEY #, AGE & HEIGHT */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Jersey #
                    </label>
                    <div className="relative">
                      <Hash className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="0"
                        max="99"
                        placeholder="e.g. 23"
                        value={playerJersey}
                        onChange={(e) => setPlayerJersey(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      min="14"
                      max="55"
                      placeholder="e.g. 24"
                      value={playerAge}
                      onChange={(e) => setPlayerAge(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Height (cm / ft-in)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 198 cm / 6'6&quot;"
                      value={playerHeight}
                      onChange={(e) => setPlayerHeight(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                {/* 4. PPG METRIC */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400 block mb-1">
                    Points Per Game (PPG) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 24.5"
                    value={playerPpg}
                    onChange={(e) => setPlayerPpg(e.target.value)}
                    className="w-full sm:w-1/2 bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white font-mono focus:outline-none focus:border-orange-500 transition"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Player will be immediately published to the live FIBA Players Data Table.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center space-x-2 mt-4"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register Player to Live Roster</span>
                </button>
              </form>
            </div>

            {/* RIGHT: LIVE PREVIEW & MANAGED PLAYERS LIST */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* LIVE CARD PREVIEW */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-3">
                  LIVE FIBA ROSTER ROW PREVIEW
                </span>

                <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 relative overflow-hidden group">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-full bg-black border-2 border-orange-500/60 flex items-center justify-center text-orange-400 font-black text-sm overflow-hidden shrink-0">
                      {playerPhotoUrl ? (
                        <img src={playerPhotoUrl} alt={playerName || 'Player'} className="w-full h-full object-cover" />
                      ) : (
                        <span>#{playerJersey || '00'}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-neutral-800 text-orange-400 border border-orange-500/30">
                          {playerPosition}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400 font-mono">
                          #{playerJersey || '00'}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white truncate mt-0.5">
                        {playerName || 'Player Full Name'}
                      </h4>
                      <p className="text-xs font-semibold text-neutral-400 truncate">
                        {playerTeam}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-neutral-800 text-center">
                    <div className="bg-black/50 p-1.5 rounded">
                      <div className="text-[9px] text-neutral-500 font-bold uppercase">Age</div>
                      <div className="text-xs font-bold text-neutral-300">{playerAge ? `${playerAge} yrs` : '24 yrs'}</div>
                    </div>
                    <div className="bg-black/50 p-1.5 rounded">
                      <div className="text-[9px] text-neutral-500 font-bold uppercase">Height</div>
                      <div className="text-xs font-bold text-neutral-300">{playerHeight || '196 cm / 6\'5"'}</div>
                    </div>
                    <div className="bg-black/50 p-1.5 rounded">
                      <div className="text-[9px] text-neutral-500 font-bold uppercase">PPG</div>
                      <div className="text-xs font-black text-orange-400">{playerPpg || '0.0'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MANAGED PLAYERS LIST */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">
                      Custom Registered Players
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      {customPlayers.length} custom player profiles stored in browser memory
                    </p>
                  </div>
                </div>

                {customPlayers.length === 0 ? (
                  <p className="text-xs text-neutral-500 text-center py-6">
                    No custom players registered yet. Use the form on the left to add players.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {customPlayers.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-black text-orange-400 font-bold text-xs flex items-center justify-center border border-neutral-700 shrink-0">
                            #{p.jersey || '-'}
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-black text-white truncate">{p.name}</h5>
                            <p className="text-[10px] text-neutral-400 truncate">
                              {p.team} • {p.pos} • {p.age ? `${p.age} yrs` : '24 yrs'} • {p.height || '196 cm'} • {p.ppg} PPG
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeletePlayer(p.id)}
                          title="Remove Player from Directory"
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* SECTION B: ARBA NEWS & ANNOUNCEMENTS */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: FORM (Publish News / Bulletin) */}
            <div 
              ref={newsFormRef}
              className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase tracking-widest text-orange-500">
                      PRESS & COMMUNICATIONS
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      HERO CAROUSEL SYNC
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans mt-1">
                    {editingNewsId ? 'Edit Announcement Bulletin' : 'Publish News / Bulletin'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    {editingNewsId 
                      ? 'Update the bulletin details below. Changes sync live to the Home hero carousel and storage.' 
                      : 'Published announcements immediately update the Home Page hero carousel with your chosen cover image.'}
                  </p>
                </div>

                {editingNewsId && (
                  <button
                    type="button"
                    onClick={handleCancelEditNews}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold border border-neutral-800 transition cursor-pointer flex items-center space-x-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel Edit</span>
                  </button>
                )}
              </div>

              {newsSuccessMsg && (
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{newsSuccessMsg}</span>
                </div>
              )}

              {newsErrorMsg && (
                <div className="p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{newsErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleNewsSubmit} className="space-y-5">
                {/* 1. BULLETIN TITLE */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                    Bulletin Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026 Season Playoff Fixtures Confirmed"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                {/* 2. CATEGORY & DATE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      News Category / Tag *
                    </label>
                    <select
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition cursor-pointer"
                    >
                      <option value="Official Notice">Official Notice</option>
                      <option value="Match Result">Match Result</option>
                      <option value="Tournament Update">Tournament Update</option>
                      <option value="League Announcement">League Announcement</option>
                      <option value="Roster Update">Roster Update</option>
                      <option value="Youth Development">Youth Development</option>
                      <option value="Press Release">Press Release</option>
                      <option value="Referees & Clinics">Referees & Clinics</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block">
                        Publication Date
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                          setNewsDate(today);
                        }}
                        className="text-[10px] text-orange-400 hover:text-orange-300 font-bold transition cursor-pointer"
                      >
                        Set Today
                      </button>
                    </div>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. November 9, 2026"
                        value={newsDate}
                        onChange={(e) => setNewsDate(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. IMAGE ASSET SECTION (FILE UPLOAD OR URL + LIVE PREVIEW) */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-white flex items-center space-x-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                        <span>Featured Hero Cover Image Asset</span>
                      </span>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        Featured background image for this slide in the Home Page carousel.
                      </p>
                    </div>

                    {newsImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewsImageUrl('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-[10px] text-neutral-400 hover:text-red-400 flex items-center space-x-1 transition cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Remove Image</span>
                      </button>
                    )}
                  </div>

                  {/* DUAL INPUT OPTIONS: FILE UPLOAD & URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* (a) Hidden file input & styled upload button */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />

                    <div className="sm:col-span-5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-orange-400" />
                        <span>Upload File (JPG/PNG)</span>
                      </button>
                    </div>

                    <div className="hidden sm:block sm:col-span-1 text-center text-[10px] font-bold text-neutral-500 uppercase">
                      OR
                    </div>

                    {/* (b) Direct Image URL Input */}
                    <div className="sm:col-span-6">
                      <div className="relative">
                        <LinkIcon className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="url"
                          placeholder="Paste Image URL (https://...)"
                          value={newsImageUrl}
                          onChange={(e) => setNewsImageUrl(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* QUICK HIGH-RES PRESET BUTTONS */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Quick Basketball Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_NEWS_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewsImageUrl(preset.url)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border transition cursor-pointer ${
                            newsImageUrl === preset.url
                              ? 'bg-orange-500 text-black border-orange-500'
                              : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-600'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* LIVE IMAGE PREVIEW CARD */}
                  {newsImageUrl ? (
                    <div className="relative w-full h-44 rounded-lg overflow-hidden border border-neutral-700 bg-black group">
                      <img
                        src={newsImageUrl}
                        alt="Carousel Slide Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-neutral-700 text-[10px] font-black text-orange-400 uppercase tracking-wider">
                        Hero Carousel Preview
                      </div>
                      <div className="absolute bottom-2 left-3 right-3 text-white">
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-orange-500 text-black inline-block mb-1">
                          {newsCategory}
                        </span>
                        <p className="text-xs font-black truncate">
                          {newsTitle || 'Preview Headline Title'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border border-dashed border-neutral-800 bg-neutral-950/50 text-center">
                      <p className="text-[11px] text-neutral-500">
                        No image uploaded yet. If omitted, the default ARBA court hero banner will be applied.
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. BULLETIN SUMMARY / FULL CONTENT */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                    Bulletin Summary / Full Content *
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Provide the complete announcement statement, schedule dates, participating clubs, or official ARBA communications..."
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-orange-500 transition leading-relaxed"
                  ></textarea>
                </div>

                {/* 5. ACTION BUTTONS */}
                {editingNewsId ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="submit"
                      className="py-3 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Update Announcement</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditNews}
                      className="py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 font-extrabold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center space-x-2 mt-4"
                  >
                    <Newspaper className="w-4 h-4" />
                    <span>Publish Announcement</span>
                  </button>
                )}
              </form>
            </div>

            {/* RIGHT: ACTIVE BULLETINS MANAGEMENT LIST */}
            <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    Active Bulletins
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {newsArticles.length} live bulletins displaying on Home Carousel
                  </p>
                </div>
              </div>

              {newsArticles.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-8">
                  No news articles posted yet. Use the form to publish your first announcement.
                </p>
              ) : (
                <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
                  {newsArticles.map((article) => {
                    const isCurrentlyEditing = editingNewsId === article.id;
                    const previewThumb = article.image || PRESET_NEWS_IMAGES[0].url;

                    return (
                      <div
                        key={article.id}
                        className={`p-3.5 rounded-xl border transition space-y-3 relative ${
                          isCurrentlyEditing
                            ? 'bg-orange-950/20 border-orange-500/80 ring-1 ring-orange-500/50'
                            : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        {/* THUMBNAIL + METADATA */}
                        <div className="flex items-start space-x-3">
                          <img
                            src={previewThumb}
                            alt={article.title}
                            className="w-22 h-18 sm:w-26 sm:h-20 rounded-lg object-cover border border-neutral-800 shrink-0 bg-black"
                          />

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                {article.category}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {article.date}
                              </span>
                            </div>

                            <h4 className="text-xs font-black text-white line-clamp-2 leading-snug">
                              {article.title}
                            </h4>

                            <p className="text-[11px] text-neutral-400 line-clamp-2 leading-tight">
                              {article.content}
                            </p>
                          </div>
                        </div>

                        {/* ACTION BUTTONS (EDIT & DELETE) */}
                        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                          {isCurrentlyEditing ? (
                            <span className="text-[10px] font-bold text-orange-400 flex items-center space-x-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Currently Editing</span>
                            </span>
                          ) : (
                            <div className="text-[10px] text-neutral-500">
                              ARBA Bulletin
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleStartEditNews(article)}
                              title="Edit this bulletin"
                              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-bold flex items-center space-x-1 transition cursor-pointer"
                            >
                              <Pencil className="w-3 h-3 text-orange-400" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteNews(article.id)}
                              title="Delete this bulletin"
                              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 text-[10px] font-bold flex items-center space-x-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* SECTION C: COACHES REGISTRY */}
        {activeTab === 'coaches' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: FORM (Add / Edit Coach) */}
            <div 
              ref={coachFormRef}
              className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase tracking-widest text-orange-500">
                      TECHNICAL DIRECTORS &amp; TACTICIANS
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      FIBA ACCREDITED
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans mt-1">
                    {editingCoachId ? 'Edit Coach Profile' : 'Register Certified Coach'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    {editingCoachId 
                      ? 'Update the coach credentials below. Changes immediately reflect in the public Coaches table.' 
                      : 'Register certified tacticians holding FIBA and TBF credentials. Auto-syncs live to public Coaches directory.'}
                  </p>
                </div>

                {editingCoachId && (
                  <button
                    type="button"
                    onClick={handleCancelEditCoach}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold border border-neutral-800 transition cursor-pointer flex items-center space-x-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel Edit</span>
                  </button>
                )}
              </div>

              {coachSuccessMsg && (
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{coachSuccessMsg}</span>
                </div>
              )}

              {coachErrorMsg && (
                <div className="p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{coachErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCoachSubmit} className="space-y-4">
                {/* 1. COACH NAME & PHOTO URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Coach Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Coach Martin Mremi"
                      value={coachName}
                      onChange={(e) => setCoachName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Photo URL (Avatar Image)
                    </label>
                    <div className="relative">
                      <ImageIcon className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. https://... or /coaches/name.jpg"
                        value={coachPhotoUrl}
                        onChange={(e) => setCoachPhotoUrl(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CURRENT TEAM & ROLE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Current Team / Club *
                    </label>
                    <select
                      value={coachTeam}
                      onChange={(e) => setCoachTeam(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition cursor-pointer"
                    >
                      {TEAMS.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                      <option value="Independent / Free Agent">Independent / Free Agent</option>
                      <option value="ARBA Youth Academy">ARBA Youth Academy</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Role / Designation *
                    </label>
                    <select
                      value={coachRole}
                      onChange={(e) => setCoachRole(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition cursor-pointer"
                    >
                      <option value="Head Coach">Head Coach</option>
                      <option value="Assistant Coach">Assistant Coach</option>
                      <option value="Technical Director">Technical Director</option>
                      <option value="Development Coach">Development Coach</option>
                      <option value="Fitness & Conditioning">Fitness &amp; Conditioning</option>
                    </select>
                  </div>
                </div>

                {/* 3. CERTIFICATION & EXPERIENCE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Certification Level *
                    </label>
                    <select
                      value={coachLicense}
                      onChange={(e) => setCoachLicense(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition cursor-pointer"
                    >
                      <option value="FIBA Level 1">FIBA Level 1</option>
                      <option value="FIBA Level 2">FIBA Level 2</option>
                      <option value="FIBA Level 3">FIBA Level 3</option>
                      <option value="National Grade A">National Grade A</option>
                      <option value="TBF Certified">TBF Certified</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12 Years"
                      value={coachExp}
                      onChange={(e) => setCoachExp(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                {/* 4. CAREER RECORD / NOTES */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                    Career Record / Bio Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 142-38 career record • 2024 Arusha Championship Finalist"
                    value={coachRecord}
                    onChange={(e) => setCoachRecord(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                {editingCoachId ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="submit"
                      className="py-3 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Update Coach Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditCoach}
                      className="py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 font-extrabold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center space-x-2 mt-4"
                  >
                    <Award className="w-4 h-4" />
                    <span>Register Certified Coach</span>
                  </button>
                )}
              </form>
            </div>

            {/* RIGHT: REGISTERED COACHES LIST */}
            <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    Active Coaches Directory
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {coaches.length} licensed coaches active in directory
                  </p>
                </div>
              </div>

              {coaches.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-8">
                  No coaches registered yet. Use the form on the left to add a certified coach.
                </p>
              ) : (
                <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                  {coaches.map((c) => {
                    const isCurrentlyEditing = editingCoachId === c.id;

                    return (
                      <div
                        key={c.id}
                        className={`p-3.5 rounded-xl border transition space-y-3 relative ${
                          isCurrentlyEditing
                            ? 'bg-orange-950/20 border-orange-500/80 ring-1 ring-orange-500/50'
                            : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {c.image ? (
                            <img
                              src={c.image}
                              alt={c.name}
                              className="w-11 h-11 rounded-full object-cover border border-neutral-700 shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-black text-orange-400 font-bold text-sm flex items-center justify-center border border-neutral-700 shrink-0">
                              {c.name?.charAt(0) || 'C'}
                            </div>
                          )}

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                {c.certification || c.license || 'FIBA Level 1'}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {c.exp || c.experience || 'Active'}
                              </span>
                            </div>

                            <h4 className="text-xs font-black text-white truncate">
                              {c.name}
                            </h4>

                            <p className="text-[11px] text-neutral-400 truncate">
                              {c.team} • {c.role}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-500">
                            {c.record ? `Record: ${c.record}` : 'ARBA Certified'}
                          </span>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleStartEditCoach(c)}
                              title="Edit this coach"
                              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-bold flex items-center space-x-1 transition cursor-pointer"
                            >
                              <Pencil className="w-3 h-3 text-orange-400" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteCoach(c.id)}
                              title="Delete this coach"
                              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 text-[10px] font-bold flex items-center space-x-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* SECTION D: MATCH OFFICIALS REGISTRY */}
        {activeTab === 'officials' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: FORM (Add / Edit Official) */}
            <div 
              ref={officialFormRef}
              className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black uppercase tracking-widest text-orange-500">
                      MATCH INTEGRITY &amp; FLOOR ARBITRATION
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      FIBA COMPLIANT
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans mt-1">
                    {editingOfficialId ? 'Edit Official Profile' : 'Register Match Official'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    {editingOfficialId 
                      ? 'Update the official credentials below. Changes immediately sync to the public Officials table.' 
                      : 'Register licensed referees, table commissioners, and floor umpires. Auto-syncs live to public directory.'}
                  </p>
                </div>

                {editingOfficialId && (
                  <button
                    type="button"
                    onClick={handleCancelEditOfficial}
                    className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold border border-neutral-800 transition cursor-pointer flex items-center space-x-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel Edit</span>
                  </button>
                )}
              </div>

              {officialSuccessMsg && (
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{officialSuccessMsg}</span>
                </div>
              )}

              {officialErrorMsg && (
                <div className="p-3.5 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{officialErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleOfficialSubmit} className="space-y-4">
                {/* 1. OFFICIAL NAME & PHOTO URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Official Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Francis Shao"
                      value={officialName}
                      onChange={(e) => setOfficialName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Photo URL (Avatar Image)
                    </label>
                    <div className="relative">
                      <ImageIcon className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. https://... or /officials/name.jpg"
                        value={officialPhotoUrl}
                        onChange={(e) => setOfficialPhotoUrl(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. ROLE & CERTIFICATION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Role / Designation *
                    </label>
                    <select
                      value={officialRole}
                      onChange={(e) => setOfficialRole(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition cursor-pointer"
                    >
                      <option value="Senior Floor Referee">Senior Floor Referee</option>
                      <option value="Chief Referee / Evaluator">Chief Referee / Evaluator</option>
                      <option value="Floor Official & Umpire">Floor Official &amp; Umpire</option>
                      <option value="Table Commissioner & Scorer">Table Commissioner &amp; Scorer</option>
                      <option value="Lead Timekeeper & Official">Lead Timekeeper &amp; Official</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Certification / Badge *
                    </label>
                    <select
                      value={officialCert}
                      onChange={(e) => setOfficialCert(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition cursor-pointer"
                    >
                      <option value="FIBA International">FIBA International</option>
                      <option value="National Grade A">National Grade A</option>
                      <option value="National Grade B">National Grade B</option>
                      <option value="FIBA Table Official">FIBA Table Official</option>
                      <option value="Regional Candidate">Regional Candidate</option>
                    </select>
                  </div>
                </div>

                {/* 3. ASSIGNED ZONE & STATUS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      Assigned Zone / Region
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Central Arusha Zone"
                      value={officialZone}
                      onChange={(e) => setOfficialZone(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 block mb-1">
                      License Status
                    </label>
                    <select
                      value={officialStatus}
                      onChange={(e) => setOfficialStatus(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500 transition cursor-pointer"
                    >
                      <option value="Active Licensed">Active Licensed</option>
                      <option value="Accredited">Accredited</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                {editingOfficialId ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="submit"
                      className="py-3 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Update Official Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditOfficial}
                      className="py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 font-extrabold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center space-x-2 mt-4"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Register Match Official</span>
                  </button>
                )}
              </form>
            </div>

            {/* RIGHT: REGISTERED OFFICIALS LIST */}
            <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    Active Match Officials
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {officials.length} certified officials active in directory
                  </p>
                </div>
              </div>

              {officials.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-8">
                  No match officials registered yet. Use the form on the left to add an official.
                </p>
              ) : (
                <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                  {officials.map((o) => {
                    const isCurrentlyEditing = editingOfficialId === o.id;

                    return (
                      <div
                        key={o.id}
                        className={`p-3.5 rounded-xl border transition space-y-3 relative ${
                          isCurrentlyEditing
                            ? 'bg-orange-950/20 border-orange-500/80 ring-1 ring-orange-500/50'
                            : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {o.image ? (
                            <img
                              src={o.image}
                              alt={o.name}
                              className="w-11 h-11 rounded-full object-cover border border-neutral-700 shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-black text-orange-400 font-bold text-sm flex items-center justify-center border border-neutral-700 shrink-0">
                              {o.name?.charAt(0) || 'O'}
                            </div>
                          )}

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                {o.certification || o.badge || 'National Grade A'}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-mono">
                                {o.status || 'Active'}
                              </span>
                            </div>

                            <h4 className="text-xs font-black text-white truncate">
                              {o.name}
                            </h4>

                            <p className="text-[11px] text-neutral-400 truncate">
                              {o.role} • {o.zone || 'Central Arusha Zone'}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-500">
                            ARBA Floor Official
                          </span>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleStartEditOfficial(o)}
                              title="Edit this official"
                              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-bold flex items-center space-x-1 transition cursor-pointer"
                            >
                              <Pencil className="w-3 h-3 text-orange-400" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteOfficial(o.id)}
                              title="Delete this official"
                              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 text-[10px] font-bold flex items-center space-x-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* SECTION E: SECURITY / PASSCODE SETTINGS */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 animate-fadeIn">
            {/* LEFT COLUMN: CHANGE PASSCODE FORM */}
            <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block">
                    Security Credentials
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans">
                    Change Admin Passcode
                  </h2>
                </div>
              </div>

              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                Update the master credential required to sign into the ARBA Secretariat Admin Management Portal. 
                Changes take effect immediately across all active sessions.
              </p>

              {passcodeSuccessMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-start space-x-3 text-emerald-300 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Passcode Updated Successfully
                    </h4>
                    <p className="text-xs text-emerald-200 mt-0.5">{passcodeSuccessMsg}</p>
                  </div>
                </div>
              )}

              {passcodeErrorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start space-x-3 text-red-300 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">
                      Passcode Update Error
                    </h4>
                    <p className="text-xs text-red-200 mt-0.5">{passcodeErrorMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleUpdatePasscode} className="space-y-5">
                {/* Visibility Toggle */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPasscodes(!showPasscodes)}
                    className="text-xs text-neutral-400 hover:text-orange-400 flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    {showPasscodes ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide characters</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show characters</span>
                      </>
                    )}
                  </button>
                </div>

                {/* CURRENT PASSCODE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center justify-between">
                    <span>Current Passcode *</span>
                    <span className="text-[10px] text-neutral-500 lowercase font-mono">
                      (default: ADMINISTRATOR)
                    </span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPasscodes ? 'text' : 'password'}
                      required
                      placeholder="Enter current active passcode"
                      value={currentPasscode}
                      onChange={(e) => {
                        setCurrentPasscode(e.target.value);
                        setPasscodeErrorMsg('');
                      }}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 font-mono tracking-wider focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    />
                  </div>
                </div>

                {/* NEW PASSCODE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    New Passcode *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPasscodes ? 'text' : 'password'}
                      required
                      placeholder="Enter new passcode (min 4 characters)"
                      value={newPasscode}
                      onChange={(e) => {
                        setNewPasscode(e.target.value);
                        setPasscodeErrorMsg('');
                      }}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 font-mono tracking-wider focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    />
                  </div>
                </div>

                {/* CONFIRM NEW PASSCODE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Confirm New Passcode *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPasscodes ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new passcode to confirm"
                      value={confirmNewPasscode}
                      onChange={(e) => {
                        setConfirmNewPasscode(e.target.value);
                        setPasscodeErrorMsg('');
                      }}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 font-mono tracking-wider focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#F97316] hover:bg-orange-600 text-black font-black uppercase text-xs tracking-wider rounded-xl transition shadow-lg shadow-orange-500/20 active:scale-[0.99] cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Update Passcode</span>
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: SECURITY STATUS & INSTRUCTIONS */}
            <div className="lg:col-span-5 space-y-6">
              {/* CURRENT CREDENTIAL STATUS CARD */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight">
                      Authentication Status
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      Live local credential configuration
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Active Passcode:
                    </span>
                    {hasCustomPasscode ? (
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Custom Passcode Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Default: ADMINISTRATOR
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {hasCustomPasscode
                      ? 'A personalized administrative passcode is active and saved in your local browser storage (`arba_admin_passcode`).'
                      : 'The system is using the initial factory default passcode (`ADMINISTRATOR`). We strongly advise setting a personalized secret passcode.'}
                  </p>
                </div>

                {/* SECURITY BEST PRACTICES */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-300">
                    Security Specifications
                  </h4>
                  <ul className="space-y-2.5 text-xs text-neutral-400">
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 font-bold">•</span>
                      <span><strong>Case-Sensitive:</strong> Passcodes distinguish uppercase and lowercase letters strictly.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 font-bold">•</span>
                      <span><strong>Instant Synchronization:</strong> Updated passcodes protect all subsequent logins without requiring a restart.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 font-bold">•</span>
                      <span><strong>Local Persistence:</strong> The passcode key (`arba_admin_passcode`) is securely stored in your browser session.</span>
                    </li>
                  </ul>
                </div>

                {/* RESET DEFAULT OPTION */}
                {hasCustomPasscode && (
                  <div className="pt-4 border-t border-neutral-900">
                    <button
                      type="button"
                      onClick={handleResetToDefaultPasscode}
                      className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-500/30 text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Default (ADMINISTRATOR)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
