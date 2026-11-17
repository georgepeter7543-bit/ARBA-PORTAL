import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  RotateCcw, 
  Trophy, 
  Users, 
  UserMinus, 
  Plus, 
  Camera, 
  User,
  LogOut,
  FileText,
  FileCheck
} from 'lucide-react';
import { TEAMS } from '../data/basketballData';
import PlayerAvatar from './PlayerAvatar';
import TeamCrest from './TeamCrest';

/**
 * Client-side canvas compression utility to convert image files into lightweight
 * Base64 JPEG strings (max 300x300px, ~20-35KB), avoiding localStorage quota limits.
 */
const compressImageFile = (file, maxWidth = 300, maxHeight = 300, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};

/**
 * Read certificate document/badge (image or PDF) into Base64 Data URL,
 * applying lightweight compression if it's an image.
 */
const readCertificateFile = (file) => {
  return new Promise((resolve, reject) => {
    if (file.size > 3 * 1024 * 1024) {
      reject(new Error('Certificate document exceeds 3MB limit. Please upload a smaller file.'));
      return;
    }
    if (file.type && file.type.startsWith('image/')) {
      compressImageFile(file, 900, 900, 0.85)
        .then(resolve)
        .catch(() => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = () => reject(new Error('Failed to read certificate image.'));
          reader.readAsDataURL(file);
        });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read certificate document.'));
      reader.readAsDataURL(file);
    }
  });
};

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
  onUpdatePlayer,
  onDeletePlayer,
  teams = [],
  onUpdateTeam,
  onAssignPlayerToTeam,
  onRemovePlayerFromTeam,
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
  onExitAdmin,
  onSignOut
}) {
  // Security Guard: Check authentication on mount and on popstate (browser Back/Forward navigation)
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const isAuth =
        localStorage.getItem('arba_is_admin_authenticated') === 'true' ||
        localStorage.getItem('arba_is_admin') === 'true';

      if (!isAuth) {
        setIsLocked(true);
        window.location.replace('/');
      }
    };

    // Immediate check on mount
    checkAuthStatus();

    // Intercept browser back/forward navigation and sign-out events
    window.addEventListener('popstate', checkAuthStatus);
    window.addEventListener('storage', checkAuthStatus);
    window.addEventListener('arba_sign_out', checkAuthStatus);

    return () => {
      window.removeEventListener('popstate', checkAuthStatus);
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('arba_sign_out', checkAuthStatus);
    };
  }, []);

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
  const [editingPlayerId, setEditingPlayerId] = useState(null);
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
  const playerPhotoFileRef = useRef(null);
  const playerFormRef = useRef(null);
  const newsFormRef = useRef(null);

  // Coach Form State
  const [coachName, setCoachName] = useState('');
  const [coachPhotoUrl, setCoachPhotoUrl] = useState('');
  const [coachTeam, setCoachTeam] = useState('Arusha Kings');
  const [coachRole, setCoachRole] = useState('Head Coach');
  const [coachLicense, setCoachLicense] = useState('FIBA Level 1 Coach');
  const [coachExp, setCoachExp] = useState('8 Years');
  const [coachRecord, setCoachRecord] = useState('');
  const [coachCertFile, setCoachCertFile] = useState('');
  const [coachCertFileName, setCoachCertFileName] = useState('');
  const [editingCoachId, setEditingCoachId] = useState(null);
  const [coachSuccessMsg, setCoachSuccessMsg] = useState('');
  const [coachErrorMsg, setCoachErrorMsg] = useState('');
  const coachFormRef = useRef(null);
  const coachPhotoFileRef = useRef(null);
  const coachCertFileRef = useRef(null);

  // Official Form State
  const [officialName, setOfficialName] = useState('');
  const [officialPhotoUrl, setOfficialPhotoUrl] = useState('');
  const [officialRole, setOfficialRole] = useState('Senior Floor Referee');
  const [officialCert, setOfficialCert] = useState('TBF National Referee License');
  const [officialZone, setOfficialZone] = useState('Central Arusha Zone');
  const [officialStatus, setOfficialStatus] = useState('Active Licensed');
  const [officialExp, setOfficialExp] = useState('6 Years');
  const [officialCertFile, setOfficialCertFile] = useState('');
  const [officialCertFileName, setOfficialCertFileName] = useState('');
  const [editingOfficialId, setEditingOfficialId] = useState(null);
  const [officialSuccessMsg, setOfficialSuccessMsg] = useState('');
  const [officialErrorMsg, setOfficialErrorMsg] = useState('');
  const officialFormRef = useRef(null);
  const officialPhotoFileRef = useRef(null);
  const officialCertFileRef = useRef(null);

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

  // Handle Player Submission (Add or Update)
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

    if (editingPlayerId) {
      // UPDATE existing player
      const updatedPlayer = {
        id: editingPlayerId,
        name: playerName.trim(),
        photoUrl: playerPhotoUrl.trim() || '',
        avatar: playerPhotoUrl.trim() || '',
        image: playerPhotoUrl.trim() || null,
        team: playerTeam,
        position: playerPosition,
        pos: playerPosition,
        jersey: jerseyNum,
        age: ageNum,
        height: heightStr,
        ppg: ppgNum,
        status: 'Active',
        isCustom: true,
        updatedAt: new Date().toISOString()
      };

      if (onUpdatePlayer) onUpdatePlayer(updatedPlayer);
      setPlayerSuccessMsg(`Player "${playerName.trim()}" successfully updated!`);
      setEditingPlayerId(null);
    } else {
      // ADD new player
      const newPlayer = {
        id: 'player-' + Date.now(),
        name: playerName.trim(),
        photoUrl: playerPhotoUrl.trim() || '',
        avatar: playerPhotoUrl.trim() || '',
        image: playerPhotoUrl.trim() || null,
        team: playerTeam,
        position: playerPosition,
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
    }

    // Reset Form
    setPlayerName('');
    setPlayerPhotoUrl('');
    if (playerPhotoFileRef.current) {
      playerPhotoFileRef.current.value = '';
    }
    setPlayerJersey('');
    setPlayerAge('');
    setPlayerHeight('');
    setPlayerPpg('');

    setTimeout(() => setPlayerSuccessMsg(''), 4000);
  };

  // Start Editing Player
  const handleStartEditPlayer = (player) => {
    setEditingPlayerId(player.id);
    setPlayerName(player.name || '');
    setPlayerPhotoUrl(player.photoUrl || player.avatar || player.image || '');
    setPlayerTeam(player.team || 'Arusha Kings');
    setPlayerPosition(player.position || player.pos || 'SF');
    setPlayerJersey(player.jersey !== undefined && player.jersey !== '' ? String(player.jersey) : '');
    setPlayerAge(player.age ? String(player.age) : '');
    setPlayerHeight(player.height || '');
    setPlayerPpg(player.ppg !== undefined && player.ppg !== '' ? String(player.ppg) : '');
    setPlayerErrorMsg('');
    setPlayerSuccessMsg('');
    if (playerFormRef.current) {
      playerFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cancel Editing Player
  const handleCancelEditPlayer = () => {
    setEditingPlayerId(null);
    setPlayerName('');
    setPlayerPhotoUrl('');
    if (playerPhotoFileRef.current) {
      playerPhotoFileRef.current.value = '';
    }
    setPlayerTeam('Arusha Kings');
    setPlayerPosition('SF');
    setPlayerJersey('');
    setPlayerAge('');
    setPlayerHeight('');
    setPlayerPpg('');
    setPlayerErrorMsg('');
    setPlayerSuccessMsg('');
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

  // Player Photo File Upload Handler (auto-compresses to 300x300 Base64 Data URL)
  const handlePlayerPhotoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPlayerErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    // Client-side file size check (5MB raw limit, compressed to ~25KB)
    if (file.size > 5 * 1024 * 1024) {
      setPlayerErrorMsg('Player photo file size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    try {
      const compressedBase64 = await compressImageFile(file, 300, 300, 0.85);
      setPlayerPhotoUrl(compressedBase64);
      setPlayerErrorMsg('');
    } catch (err) {
      console.error('Error compressing player image:', err);
      setPlayerErrorMsg('Failed to process and compress player photo file.');
    }
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
  const handleCoachPhotoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoachErrorMsg('');
    try {
      const compressedDataUrl = await compressImageFile(file, 300, 300, 0.85);
      setCoachPhotoUrl(compressedDataUrl);
    } catch (err) {
      setCoachErrorMsg(err.message || 'Failed to process coach profile photo.');
    }
  };

  const handleCoachCertFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoachErrorMsg('');
    try {
      const dataUrl = await readCertificateFile(file);
      setCoachCertFile(dataUrl);
      setCoachCertFileName(file.name);
    } catch (err) {
      setCoachErrorMsg(err.message || 'Failed to upload certificate document.');
    }
  };

  const handleStartEditCoach = (coach) => {
    setEditingCoachId(coach.id);
    setCoachName(coach.name || '');
    setCoachPhotoUrl(coach.photoUrl || coach.image || coach.avatar || '');
    setCoachTeam(coach.teamOrZone || coach.team || 'Arusha Kings');
    setCoachRole(coach.role || 'Head Coach');
    setCoachLicense(coach.certificateTitle || coach.certification || coach.license || 'FIBA Level 1 Coach');
    setCoachExp(coach.experience || coach.exp || '8 Years');
    setCoachRecord(coach.record || '');
    setCoachCertFile(coach.certificateFile || '');
    setCoachCertFileName(coach.certificateFileName || '');
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
    setCoachLicense('FIBA Level 1 Coach');
    setCoachExp('8 Years');
    setCoachRecord('');
    setCoachCertFile('');
    setCoachCertFileName('');
    if (coachPhotoFileRef.current) coachPhotoFileRef.current.value = '';
    if (coachCertFileRef.current) coachCertFileRef.current.value = '';
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

    const certTitle = coachLicense.trim() || 'FIBA Level 1 Coach';
    const coachExpVal = coachExp.trim() || '5 Years';

    if (editingCoachId) {
      const updated = {
        id: editingCoachId,
        name: coachName.trim(),
        photoUrl: coachPhotoUrl.trim() || '',
        image: coachPhotoUrl.trim() || null,
        avatar: coachPhotoUrl.trim() || null,
        teamOrZone: coachTeam,
        team: coachTeam,
        role: coachRole,
        certificateTitle: certTitle,
        certification: certTitle,
        license: certTitle,
        certificateFile: coachCertFile || '',
        certificateFileName: coachCertFileName || '',
        experience: coachExpVal,
        exp: coachExpVal,
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
        photoUrl: coachPhotoUrl.trim() || '',
        image: coachPhotoUrl.trim() || null,
        avatar: coachPhotoUrl.trim() || null,
        teamOrZone: coachTeam,
        team: coachTeam,
        role: coachRole,
        certificateTitle: certTitle,
        certification: certTitle,
        license: certTitle,
        certificateFile: coachCertFile || '',
        certificateFileName: coachCertFileName || '',
        experience: coachExpVal,
        exp: coachExpVal,
        record: coachRecord.trim() || 'Active Staff',
        createdAt: new Date().toISOString()
      };
      if (onAddCoach) onAddCoach(newCoach);
      setCoachSuccessMsg(`Coach "${coachName.trim()}" registered to live directory!`);
    }

    setCoachName('');
    setCoachPhotoUrl('');
    setCoachRecord('');
    setCoachCertFile('');
    setCoachCertFileName('');
    if (coachPhotoFileRef.current) coachPhotoFileRef.current.value = '';
    if (coachCertFileRef.current) coachCertFileRef.current.value = '';
    setTimeout(() => setCoachSuccessMsg(''), 4000);
  };

  // OFFICIAL CRUD HANDLERS
  const handleOfficialPhotoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOfficialErrorMsg('');
    try {
      const compressedDataUrl = await compressImageFile(file, 300, 300, 0.85);
      setOfficialPhotoUrl(compressedDataUrl);
    } catch (err) {
      setOfficialErrorMsg(err.message || 'Failed to process official profile photo.');
    }
  };

  const handleOfficialCertFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOfficialErrorMsg('');
    try {
      const dataUrl = await readCertificateFile(file);
      setOfficialCertFile(dataUrl);
      setOfficialCertFileName(file.name);
    } catch (err) {
      setOfficialErrorMsg(err.message || 'Failed to upload certificate document.');
    }
  };

  const handleStartEditOfficial = (official) => {
    setEditingOfficialId(official.id);
    setOfficialName(official.name || '');
    setOfficialPhotoUrl(official.photoUrl || official.image || official.avatar || '');
    setOfficialRole(official.role || 'Senior Floor Referee');
    setOfficialCert(official.certificateTitle || official.certification || official.badge || 'TBF National Referee License');
    setOfficialZone(official.teamOrZone || official.zone || 'Central Arusha Zone');
    setOfficialStatus(official.status || 'Active Licensed');
    setOfficialExp(official.experience || official.exp || '6 Years');
    setOfficialCertFile(official.certificateFile || '');
    setOfficialCertFileName(official.certificateFileName || '');
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
    setOfficialCert('TBF National Referee License');
    setOfficialZone('Central Arusha Zone');
    setOfficialStatus('Active Licensed');
    setOfficialExp('6 Years');
    setOfficialCertFile('');
    setOfficialCertFileName('');
    if (officialPhotoFileRef.current) officialPhotoFileRef.current.value = '';
    if (officialCertFileRef.current) officialCertFileRef.current.value = '';
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

    const certTitle = officialCert.trim() || 'TBF National Referee License';
    const zoneVal = officialZone.trim() || 'Central Arusha Zone';
    const expVal = officialExp.trim() || '6 Years';

    if (editingOfficialId) {
      const updated = {
        id: editingOfficialId,
        name: officialName.trim(),
        photoUrl: officialPhotoUrl.trim() || '',
        image: officialPhotoUrl.trim() || null,
        avatar: officialPhotoUrl.trim() || null,
        teamOrZone: zoneVal,
        zone: zoneVal,
        role: officialRole,
        certificateTitle: certTitle,
        certification: certTitle,
        badge: certTitle,
        certificateFile: officialCertFile || '',
        certificateFileName: officialCertFileName || '',
        experience: expVal,
        exp: expVal,
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
        photoUrl: officialPhotoUrl.trim() || '',
        image: officialPhotoUrl.trim() || null,
        avatar: officialPhotoUrl.trim() || null,
        teamOrZone: zoneVal,
        zone: zoneVal,
        role: officialRole,
        certificateTitle: certTitle,
        certification: certTitle,
        badge: certTitle,
        certificateFile: officialCertFile || '',
        certificateFileName: officialCertFileName || '',
        experience: expVal,
        exp: expVal,
        status: officialStatus,
        createdAt: new Date().toISOString()
      };
      if (onAddOfficial) onAddOfficial(newOfficial);
      setOfficialSuccessMsg(`Official "${officialName.trim()}" registered to live directory!`);
    }

    setOfficialName('');
    setOfficialPhotoUrl('');
    setOfficialCertFile('');
    setOfficialCertFileName('');
    if (officialPhotoFileRef.current) officialPhotoFileRef.current.value = '';
    if (officialCertFileRef.current) officialCertFileRef.current.value = '';
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

  // Teams & Rosters Management State
  const teamsList = useMemo(() => {
    return Array.isArray(teams) && teams.length > 0 ? teams : TEAMS;
  }, [teams]);

  const [selectedTeamId, setSelectedTeamId] = useState(() => {
    return teamsList[0]?.id || 'arusha-kings';
  });

  const currentSelectedTeam = useMemo(() => {
    return teamsList.find((t) => t.id === selectedTeamId) || teamsList[0] || null;
  }, [teamsList, selectedTeamId]);

  const [teamHeadCoach, setTeamHeadCoach] = useState(() => currentSelectedTeam?.headCoach || currentSelectedTeam?.coach || '');
  const [teamArena, setTeamArena] = useState(() => currentSelectedTeam?.arena || currentSelectedTeam?.homeCourt || '');
  const [teamRecord, setTeamRecord] = useState(() => currentSelectedTeam?.record || '');
  const [teamDivision, setTeamDivision] = useState(() => currentSelectedTeam?.division || "Men's Premier Division");
  const [teamSuccessMsg, setTeamSuccessMsg] = useState('');
  const [teamErrorMsg, setTeamErrorMsg] = useState('');

  const [playerToAssignId, setPlayerToAssignId] = useState('');
  const [rosterSuccessMsg, setRosterSuccessMsg] = useState('');
  const [rosterErrorMsg, setRosterErrorMsg] = useState('');

  // Switch team and populate form inputs
  const handleSelectTeamToEdit = (teamId) => {
    setSelectedTeamId(teamId);
    const targetTeam = teamsList.find((t) => t.id === teamId);
    if (targetTeam) {
      setTeamHeadCoach(targetTeam.headCoach || targetTeam.coach || '');
      setTeamArena(targetTeam.arena || targetTeam.homeCourt || '');
      setTeamRecord(targetTeam.record || '');
      setTeamDivision(targetTeam.division || "Men's Premier Division");
      setTeamSuccessMsg('');
      setTeamErrorMsg('');
    }
  };

  // Derive current team roster from team.roster and customPlayers
  const currentTeamRoster = useMemo(() => {
    if (!currentSelectedTeam) return [];
    const rosterMap = new Map();

    // 1. From currentSelectedTeam.roster
    if (Array.isArray(currentSelectedTeam.roster)) {
      currentSelectedTeam.roster.forEach((p) => {
        if (!p) return;
        const id = p.id || p;
        const fullPlayer = customPlayers.find((cp) => cp.id === id) || (typeof p === 'object' ? p : null);
        if (fullPlayer) {
          rosterMap.set(fullPlayer.id, fullPlayer);
        }
      });
    }

    // 2. From customPlayers where player.team matches currentSelectedTeam
    customPlayers.forEach((p) => {
      const pTeam = (p.team || '').toLowerCase();
      const tName = (currentSelectedTeam.name || '').toLowerCase();
      const tShort = (currentSelectedTeam.shortName || '').toLowerCase();
      if (pTeam === tName || (tShort && pTeam === tShort) || (tShort && pTeam.includes(tShort))) {
        rosterMap.set(p.id, p);
      }
    });

    return Array.from(rosterMap.values());
  }, [currentSelectedTeam, customPlayers]);

  // Registered players available to be assigned to this team
  const availablePlayers = useMemo(() => {
    const rosterIds = new Set(currentTeamRoster.map((p) => p.id));
    return customPlayers.filter((p) => !rosterIds.has(p.id));
  }, [customPlayers, currentTeamRoster]);

  // Save Team Details
  const handleSaveTeamDetails = (e) => {
    e.preventDefault();
    setTeamSuccessMsg('');
    setTeamErrorMsg('');

    if (!currentSelectedTeam) return;

    if (!teamHeadCoach.trim() && !teamArena.trim() && !teamRecord.trim()) {
      setTeamErrorMsg('Please fill in at least one team profile field.');
      return;
    }

    const updated = {
      ...currentSelectedTeam,
      headCoach: teamHeadCoach.trim(),
      coach: teamHeadCoach.trim(),
      arena: teamArena.trim(),
      homeCourt: teamArena.trim(),
      record: teamRecord.trim() || '0-0',
      division: teamDivision.trim() || "Men's Premier Division"
    };

    if (onUpdateTeam) {
      onUpdateTeam(updated);
    }
    setTeamSuccessMsg(`Team details for "${updated.name}" saved successfully! Synced across all public modals.`);
    setTimeout(() => setTeamSuccessMsg(''), 4500);
  };

  // Assign Player to Team Roster
  const handleAssignPlayer = (e) => {
    e.preventDefault();
    setRosterSuccessMsg('');
    setRosterErrorMsg('');

    if (!playerToAssignId) {
      setRosterErrorMsg('Please select a registered athlete to assign.');
      return;
    }

    const player = customPlayers.find((p) => p.id === playerToAssignId);
    if (!player) {
      setRosterErrorMsg('Athlete not found in registry.');
      return;
    }

    if (onAssignPlayerToTeam) {
      onAssignPlayerToTeam(currentSelectedTeam.id, playerToAssignId);
    }
    setRosterSuccessMsg(`"${player.name}" assigned to ${currentSelectedTeam.name} active roster!`);
    setPlayerToAssignId('');
    setTimeout(() => setRosterSuccessMsg(''), 4500);
  };

  // Remove Player from Team Roster
  const handleRemovePlayer = (playerId, playerName) => {
    if (window.confirm(`Remove ${playerName} from ${currentSelectedTeam.name} active roster?`)) {
      if (onRemovePlayerFromTeam) {
        onRemovePlayerFromTeam(currentSelectedTeam.id, playerId);
      }
      setRosterSuccessMsg(`"${playerName}" removed from ${currentSelectedTeam.name} active roster.`);
      setTimeout(() => setRosterSuccessMsg(''), 4500);
    }
  };

  // Immediate lock check: prevent rendering any admin controls if locked
  if (isLocked) {
    return null;
  }

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
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="px-3.5 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-200 border border-red-800/60 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                title="Sign out of Admin Session"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Sign Out</span>
              </button>
            )}
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
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition border-b-2 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'teams'
                ? 'border-orange-500 text-orange-400 bg-neutral-900/40'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Manage Teams & Rosters ({teamsList.length})</span>
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
            <div ref={playerFormRef} className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-orange-500">
                    {editingPlayerId ? 'EDIT PLAYER PROFILE' : 'ROSTER REGISTRATION'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans mt-1">
                    {editingPlayerId ? 'Update Player Details' : 'Add Player to Live Directory'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    {editingPlayerId
                      ? 'Update the player details below. Changes immediately sync to the public Players table and Team Roster modals.'
                      : 'Registered players immediately become visible across the platform\'s Live Player Directory, search index, and statistical leaderboards.'}
                  </p>
                </div>

                {editingPlayerId && (
                  <button
                    type="button"
                    onClick={handleCancelEditPlayer}
                    className="ml-4 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-[10px] font-bold rounded-lg transition flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                )}
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
                {/* 1. PLAYER NAME */}
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

                {/* 2. DEDICATED PLAYER PROFILE PHOTO (DIRECT FILE UPLOAD DROPZONE / INPUT + LIVE CIRCULAR PREVIEW) */}
                <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 flex items-center space-x-1.5">
                      <Camera className="w-3.5 h-3.5 text-orange-500" />
                      <span>Player Profile Photo</span>
                    </label>
                    <span className="text-[10px] text-neutral-500">
                      Auto-compressed Base64 Data URL (Max 5MB input)
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* LIVE CIRCULAR THUMBNAIL PREVIEW */}
                    <div className="relative shrink-0">
                      {playerPhotoUrl ? (
                        <div className="relative group">
                          <img
                            src={playerPhotoUrl}
                            alt="Player Preview"
                            className="w-16 h-16 rounded-full object-cover border-2 border-[#F97316] shadow-md shadow-orange-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPlayerPhotoUrl('');
                              if (playerPhotoFileRef.current) {
                                playerPhotoFileRef.current.value = '';
                              }
                            }}
                            title="Remove photo"
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition cursor-pointer shadow-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-black border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center text-neutral-500">
                          <User className="w-6 h-6 text-neutral-600" />
                          <span className="text-[8px] uppercase tracking-wider font-bold text-neutral-500 mt-0.5">No Photo</span>
                        </div>
                      )}
                    </div>

                    {/* UPLOAD CONTROLS */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={playerPhotoFileRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePlayerPhotoFileUpload}
                          className="hidden"
                          id="player-photo-upload-input"
                        />
                        <label
                          htmlFor="player-photo-upload-input"
                          className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-orange-500/50 text-white rounded-lg text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-orange-400" />
                          <span>{playerPhotoUrl ? 'Change Photo' : 'Upload Profile Photo'}</span>
                        </label>

                        {playerPhotoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setPlayerPhotoUrl('');
                              if (playerPhotoFileRef.current) {
                                playerPhotoFileRef.current.value = '';
                              }
                            }}
                            className="px-3 py-2 bg-neutral-800/80 hover:bg-red-950/60 border border-neutral-700 hover:border-red-500/40 text-neutral-400 hover:text-red-400 rounded-lg text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </div>

                      <div className="relative">
                        <LinkIcon className="w-3 h-3 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Or paste external image URL (e.g. https://...)"
                          value={playerPhotoUrl.startsWith('data:image') ? '' : playerPhotoUrl}
                          onChange={(e) => setPlayerPhotoUrl(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 pl-7 pr-3 text-[11px] text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-orange-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. CURRENT TEAM & POSITION */}
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

                {/* 5. ACTION BUTTONS */}
                {editingPlayerId ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="submit"
                      className="py-3 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Update Player</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditPlayer}
                      className="py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 font-extrabold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow-md active:scale-98 cursor-pointer flex items-center justify-center space-x-2 mt-4"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register Player to Live Roster</span>
                  </button>
                )}
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
                    {customPlayers.map((p) => {
                      const isCurrentlyEditing = editingPlayerId === p.id;

                      return (
                        <div
                          key={p.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition ${
                            isCurrentlyEditing
                              ? 'bg-orange-950/20 border-orange-500/80 ring-1 ring-orange-500/50'
                              : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <PlayerAvatar
                              photoUrl={p.photoUrl || p.avatar || p.image}
                              name={p.name}
                              size="w-9 h-9"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-mono text-orange-400 font-bold text-xs">#{p.jersey || '00'}</span>
                                <h5 className="text-xs font-black text-white truncate">{p.name}</h5>
                              </div>
                              <p className="text-[10px] text-neutral-400 truncate">
                                {p.team} • {p.pos} • {p.age ? `${p.age} yrs` : '24 yrs'} • {p.height || '196 cm'} • {p.ppg} PPG
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            {isCurrentlyEditing ? (
                              <span className="text-[10px] font-bold text-orange-400 flex items-center space-x-1 mr-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Editing</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStartEditPlayer(p)}
                                title="Edit Player"
                                className="p-1.5 text-neutral-500 hover:text-orange-400 hover:bg-neutral-800 rounded transition cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => onDeletePlayer(p.id)}
                              title="Remove Player from Directory"
                              className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* SECTION: MANAGE TEAMS & ROSTERS */}
        {activeTab === 'teams' && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. TOP TEAM SELECTION BANNER */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    <span className="text-xs font-black uppercase tracking-widest text-orange-500">
                      TEAM PROFILE & ROSTER CONFIGURATION
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-sans mt-1">
                    Manage Franchise Details & Rosters
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Select any club to modify head coach, home venue, season record, and roster assignments.
                  </p>
                </div>

                {/* Team Dropdown Selector */}
                <div className="flex items-center space-x-3 bg-neutral-900 border border-neutral-800 rounded-xl p-2.5">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider pl-2">
                    Select Club:
                  </span>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => handleSelectTeamToEdit(e.target.value)}
                    className="bg-black border border-neutral-700 text-white text-xs font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 cursor-pointer min-w-[200px]"
                  >
                    {teamsList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.record || '0-0'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-neutral-900">
                {teamsList.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTeamToEdit(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                      selectedTeamId === t.id
                        ? 'bg-orange-500 text-black shadow-md'
                        : 'bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                    }`}
                  >
                    {t.logoUrl && (
                      <img
                        src={t.logoUrl}
                        alt={t.name}
                        className="w-4 h-4 object-contain rounded-xs"
                      />
                    )}
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. TWO-COLUMN SPLIT: LEFT (PROFILE FORM) & RIGHT (ROSTER MANAGEMENT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: TEAM PROFILE FORM (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div className="flex items-center space-x-3.5">
                    {currentSelectedTeam ? (
                      <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center border border-neutral-700 shrink-0">
                        <TeamCrest 
                          team={currentSelectedTeam} 
                          className="w-full h-full object-contain drop-shadow-xs" 
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0">
                        <Trophy className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 block">
                        FRANCHISE METADATA
                      </span>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">
                        {currentSelectedTeam?.name || 'Team Details'}
                      </h3>
                    </div>
                  </div>
                </div>

                {teamSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-start space-x-2.5 text-emerald-300 text-xs animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{teamSuccessMsg}</span>
                  </div>
                )}

                {teamErrorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start space-x-2.5 text-red-300 text-xs animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{teamErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveTeamDetails} className="space-y-4">
                  {/* Head Coach Name */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-1.5">
                      Head Coach Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Coach Hamisi Mussa"
                      value={teamHeadCoach}
                      onChange={(e) => setTeamHeadCoach(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    />
                  </div>

                  {/* Home Arena Name */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-1.5">
                      Home Arena / Stadium *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sheikh Amri Abeid Stadium"
                      value={teamArena}
                      onChange={(e) => setTeamArena(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    />
                  </div>

                  {/* Team Record */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-1.5">
                      Team Record (W-L) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 18-4"
                      value={teamRecord}
                      onChange={(e) => setTeamRecord(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    />
                  </div>

                  {/* Division / Category */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block mb-1.5">
                      Division / Category *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Men's Premier Division"
                      value={teamDivision}
                      onChange={(e) => setTeamDivision(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    />
                  </div>

                  {/* Action Button: Save Team Details */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#F97316] hover:bg-orange-600 text-black font-black uppercase text-xs tracking-wider rounded-xl transition shadow-lg shadow-orange-500/20 active:scale-[0.99] cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>Save Team Details</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT: ROSTER MANAGEMENT & PLAYER ASSIGNMENT (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. ASSIGN PLAYER TO TEAM FORM */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">
                        Assign Player to {currentSelectedTeam?.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        Map registered athletes from the global registry to this club roster
                      </p>
                    </div>
                  </div>

                  {rosterSuccessMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-start space-x-2.5 text-emerald-300 text-xs animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rosterSuccessMsg}</span>
                    </div>
                  )}

                  {rosterErrorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start space-x-2.5 text-red-300 text-xs animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{rosterErrorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleAssignPlayer} className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={playerToAssignId}
                      onChange={(e) => setPlayerToAssignId(e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="">-- Choose Registered Player --</option>
                      {availablePlayers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (#{p.jersey !== undefined && p.jersey !== '' ? p.jersey : (p.num || '00')}, {p.pos || p.position || 'G'}) — Current: {p.team || 'Unassigned'}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      disabled={!playerToAssignId}
                      className="px-5 py-2.5 bg-[#F97316] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black uppercase text-xs tracking-wider rounded-xl transition shadow-md flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Player to Team</span>
                    </button>
                  </form>
                </div>

                {/* 2. CURRENT ACTIVE ROSTER TABLE */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <div className="flex items-center space-x-2.5">
                      <Users className="w-4 h-4 text-orange-500" />
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">
                        Active Roster ({currentSelectedTeam?.name})
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {currentTeamRoster.length} Athletes
                    </span>
                  </div>

                  {currentTeamRoster.length === 0 ? (
                    <div className="py-12 text-center text-neutral-500 text-xs space-y-1">
                      <p className="font-semibold text-neutral-400">
                        No players currently assigned to {currentSelectedTeam?.name}.
                      </p>
                      <p className="text-[11px]">
                        Select a registered player above and click "Add Player to Team" to populate this roster.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-neutral-900/60 font-black text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                          <tr>
                            <th className="py-2.5 px-3 text-center">#</th>
                            <th className="py-2.5 px-3">Athlete</th>
                            <th className="py-2.5 px-2 text-center">POS</th>
                            <th className="py-2.5 px-2 text-center">Age</th>
                            <th className="py-2.5 px-3 text-right text-orange-400">PPG</th>
                            <th className="py-2.5 px-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60 font-medium">
                          {currentTeamRoster.map((player) => (
                            <tr key={player.id} className="hover:bg-neutral-900/40 transition">
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-neutral-400">
                                #{player.jersey !== undefined && player.jersey !== '' ? player.jersey : (player.num || '00')}
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center space-x-2.5">
                                  <PlayerAvatar
                                    photoUrl={player.photoUrl || player.avatar || player.image}
                                    name={player.name}
                                    size="w-7 h-7"
                                  />
                                  <span className="font-bold text-white text-xs">
                                    {player.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-2 text-center">
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-900 text-orange-400 border border-neutral-800">
                                  {player.pos || player.position || 'G'}
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-center font-mono text-neutral-400">
                                {player.age ? `${player.age}y` : '24y'}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-orange-400">
                                {Number(player.ppg || 0).toFixed(1)}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemovePlayer(player.id, player.name)}
                                  title="Remove from team roster"
                                  className="p-1.5 rounded-lg bg-neutral-900 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 transition cursor-pointer"
                                >
                                  <UserMinus className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

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
