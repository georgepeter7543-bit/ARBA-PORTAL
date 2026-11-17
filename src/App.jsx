import React, { useState, useEffect } from 'react';
import HeaderNav from './components/HeaderNav';
import HomeView from './components/HomeView';
import TeamsView from './components/TeamsView';
import PlayersView from './components/PlayersView';
import WomenView from './components/WomenView';
import DLeagueView from './components/DLeagueView';
import CoachesView from './components/CoachesView';
import OfficialsView from './components/OfficialsView';
import AcademiesView from './components/AcademiesView';
import AdminPortal from './components/AdminPortal';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import { INITIAL_PLAYERS, TEAMS } from './data/basketballData';

export default function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const [selectedTeamModal, setSelectedTeamModal] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return (
        localStorage.getItem('arba_is_admin_authenticated') === 'true' ||
        localStorage.getItem('arba_is_admin') === 'true'
      );
    } catch {
      return false;
    }
  });

  // Direct Access Block: Automatically redirect to Home if unauthenticated attempts to access Dashboard
  useEffect(() => {
    const verifyAuth = () => {
      const isAuth =
        localStorage.getItem('arba_is_admin_authenticated') === 'true' ||
        localStorage.getItem('arba_is_admin') === 'true';

      setIsAdminAuthenticated(isAuth);

      if (activeNav === 'Dashboard' && !isAuth) {
        window.location.replace('/');
      }
    };

    window.addEventListener('popstate', verifyAuth);
    window.addEventListener('storage', verifyAuth);
    window.addEventListener('arba_sign_out', verifyAuth);

    if (activeNav === 'Dashboard' && !isAdminAuthenticated) {
      window.location.replace('/');
    }

    return () => {
      window.removeEventListener('popstate', verifyAuth);
      window.removeEventListener('storage', verifyAuth);
      window.removeEventListener('arba_sign_out', verifyAuth);
    };
  }, [activeNav, isAdminAuthenticated]);

  // Custom Registered Players State
  const [customPlayers, setCustomPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem('arba_players') || localStorage.getItem('arba_custom_players');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    // Seed with INITIAL_PLAYERS if empty, and write to localStorage under arba_players
    try {
      localStorage.setItem('arba_players', JSON.stringify(INITIAL_PLAYERS));
      localStorage.setItem('arba_custom_players', JSON.stringify(INITIAL_PLAYERS));
    } catch {
      // ignore
    }
    return INITIAL_PLAYERS;
  });

  // Real-time synchronization listener for players across components / tabs
  useEffect(() => {
    const handleSyncPlayers = () => {
      try {
        const saved = localStorage.getItem('arba_players') || localStorage.getItem('arba_custom_players');
        if (saved) {
          setCustomPlayers(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error syncing players in App:', err);
      }
    };

    window.addEventListener('storage', handleSyncPlayers);
    window.addEventListener('arba_players_updated', handleSyncPlayers);
    window.addEventListener('arba_player_updated', handleSyncPlayers);
    return () => {
      window.removeEventListener('storage', handleSyncPlayers);
      window.removeEventListener('arba_players_updated', handleSyncPlayers);
      window.removeEventListener('arba_player_updated', handleSyncPlayers);
    };
  }, []);

  // News Articles / Bulletins State
  const [newsArticles, setNewsArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('arba_bulletins') || localStorage.getItem('arba_news_articles');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const initialNews = [
      {
        id: 'news-init-1',
        title: '2026 Arusha Regional Basketball Championship Week 2 Fixtures Confirmed',
        category: 'Match Recap',
        date: 'November 7, 2026',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80',
        content: 'The ARBA Competitions Committee has ratified the official weekend fixture list for the Arusha Premier Division. Key showdowns include Arusha Kings defending their undefeated record against the surging Soweto Stars squad, followed by Sakina Hoops taking on Kaloleni Eagles.'
      },
      {
        id: 'news-init-2',
        title: 'ARBA Secretariat Announces Referee and Coaching Refresher Clinic',
        category: 'League Announcement',
        date: 'November 4, 2026',
        image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1600&q=80',
        content: 'In collaboration with the Tanzania Basketball Federation (TBF) and FIBA Africa Zone 5, ARBA is hosting a mandatory accreditation and rules update seminar for all active floor officials, table referees, and registered club coaches.'
      },
      {
        id: 'news-init-3',
        title: 'Arusha Kings and Soweto Stars Secure Top Seedings in Northern Zone Qualifiers',
        category: 'Roster Update',
        date: 'October 30, 2026',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80',
        content: 'Following stellar regular season performances, Arusha Kings and Soweto Stars have officially locked in the top seedings for the upcoming regional playoffs. Both clubs have submitted finalized active rosters.'
      }
    ];
    try {
      localStorage.setItem('arba_bulletins', JSON.stringify(initialNews));
      localStorage.setItem('arba_news_articles', JSON.stringify(initialNews));
    } catch {
      // ignore
    }
    return initialNews;
  });

  // Sync bulletins / news articles across tabs and components
  useEffect(() => {
    const handleSyncNews = () => {
      try {
        const saved = localStorage.getItem('arba_bulletins') || localStorage.getItem('arba_news_articles');
        if (saved) {
          setNewsArticles(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error syncing news in App:', err);
      }
    };

    window.addEventListener('storage', handleSyncNews);
    window.addEventListener('arba_bulletins_updated', handleSyncNews);
    window.addEventListener('arba_news_updated', handleSyncNews);
    return () => {
      window.removeEventListener('storage', handleSyncNews);
      window.removeEventListener('arba_bulletins_updated', handleSyncNews);
      window.removeEventListener('arba_news_updated', handleSyncNews);
    };
  }, []);

  // Persist custom players changes to localStorage (under arba_players and arba_custom_players)
  const handleAddPlayer = (newPlayer) => {
    const updated = [newPlayer, ...customPlayers];
    setCustomPlayers(updated);
    try {
      localStorage.setItem('arba_players', JSON.stringify(updated));
      localStorage.setItem('arba_custom_players', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_players_updated'));
      window.dispatchEvent(new Event('arba_player_updated'));
    } catch (err) {
      console.error('Failed to save player to localStorage', err);
    }
  };

  const handleUpdatePlayer = (updatedPlayer) => {
    const updated = customPlayers.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p));
    setCustomPlayers(updated);
    try {
      localStorage.setItem('arba_players', JSON.stringify(updated));
      localStorage.setItem('arba_custom_players', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_players_updated'));
      window.dispatchEvent(new Event('arba_player_updated'));
    } catch (err) {
      console.error('Failed to update player in localStorage', err);
    }
  };

  const handleDeletePlayer = (playerId) => {
    const updated = customPlayers.filter((p) => p.id !== playerId);
    setCustomPlayers(updated);
    try {
      localStorage.setItem('arba_players', JSON.stringify(updated));
      localStorage.setItem('arba_custom_players', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_players_updated'));
      window.dispatchEvent(new Event('arba_player_updated'));
    } catch (err) {
      console.error('Failed to delete player from localStorage', err);
    }
  };

  // Persist news articles / bulletins changes to localStorage
  const handleAddNews = (newArticle) => {
    const updated = [newArticle, ...newsArticles];
    setNewsArticles(updated);
    try {
      localStorage.setItem('arba_bulletins', JSON.stringify(updated));
      localStorage.setItem('arba_news_articles', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_bulletins_updated'));
      window.dispatchEvent(new Event('arba_news_updated'));
    } catch (err) {
      console.error('Failed to save news to localStorage', err);
    }
  };

  const handleUpdateNews = (updatedArticle) => {
    const updated = newsArticles.map((a) => (a.id === updatedArticle.id ? updatedArticle : a));
    setNewsArticles(updated);
    try {
      localStorage.setItem('arba_bulletins', JSON.stringify(updated));
      localStorage.setItem('arba_news_articles', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_bulletins_updated'));
      window.dispatchEvent(new Event('arba_news_updated'));
    } catch (err) {
      console.error('Failed to update news in localStorage', err);
    }
  };

  const handleDeleteNews = (articleId) => {
    const updated = newsArticles.filter((a) => a.id !== articleId);
    setNewsArticles(updated);
    try {
      localStorage.setItem('arba_bulletins', JSON.stringify(updated));
      localStorage.setItem('arba_news_articles', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_bulletins_updated'));
      window.dispatchEvent(new Event('arba_news_updated'));
    } catch (err) {
      console.error('Failed to delete news from localStorage', err);
    }
  };

  // Coaches State
  const [coaches, setCoaches] = useState(() => {
    try {
      const saved = localStorage.getItem('arba_coaches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist coaches changes to localStorage
  const handleAddCoach = (newCoach) => {
    const updated = [newCoach, ...coaches];
    setCoaches(updated);
    try {
      localStorage.setItem('arba_coaches', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_coaches_updated'));
    } catch (err) {
      console.error('Failed to save coach to localStorage', err);
    }
  };

  const handleUpdateCoach = (updatedCoach) => {
    const updated = coaches.map((c) => (c.id === updatedCoach.id ? updatedCoach : c));
    setCoaches(updated);
    try {
      localStorage.setItem('arba_coaches', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_coaches_updated'));
    } catch (err) {
      console.error('Failed to update coach in localStorage', err);
    }
  };

  const handleDeleteCoach = (coachId) => {
    const updated = coaches.filter((c) => c.id !== coachId);
    setCoaches(updated);
    try {
      localStorage.setItem('arba_coaches', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_coaches_updated'));
    } catch (err) {
      console.error('Failed to delete coach from localStorage', err);
    }
  };

  // Officials State
  const [officials, setOfficials] = useState(() => {
    try {
      const saved = localStorage.getItem('arba_officials');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist officials changes to localStorage
  const handleAddOfficial = (newOfficial) => {
    const updated = [newOfficial, ...officials];
    setOfficials(updated);
    try {
      localStorage.setItem('arba_officials', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_officials_updated'));
    } catch (err) {
      console.error('Failed to save official to localStorage', err);
    }
  };

  const handleUpdateOfficial = (updatedOfficial) => {
    const updated = officials.map((o) => (o.id === updatedOfficial.id ? updatedOfficial : o));
    setOfficials(updated);
    try {
      localStorage.setItem('arba_officials', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_officials_updated'));
    } catch (err) {
      console.error('Failed to update official in localStorage', err);
    }
  };

  const handleDeleteOfficial = (officialId) => {
    const updated = officials.filter((o) => o.id !== officialId);
    setOfficials(updated);
    try {
      localStorage.setItem('arba_officials', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_officials_updated'));
    } catch (err) {
      console.error('Failed to delete official from localStorage', err);
    }
  };

  // Teams & Rosters State (persisted in localStorage under 'arba_teams')
  const [teams, setTeams] = useState(() => {
    try {
      const saved = localStorage.getItem('arba_teams');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    const initial = TEAMS.map(t => ({
      ...t,
      headCoach: t.headCoach || t.coach || '',
      coach: t.coach || t.headCoach || '',
      arena: t.arena || t.homeCourt || '',
      homeCourt: t.homeCourt || t.arena || '',
      record: t.record || '0-0',
      division: t.division || "Men's Premier Division",
      roster: Array.isArray(t.roster) ? t.roster : []
    }));
    try {
      localStorage.setItem('arba_teams', JSON.stringify(initial));
    } catch {
      // ignore
    }
    return initial;
  });

  // Sync teams across components / tabs via event listener
  useEffect(() => {
    const handleSyncTeams = () => {
      try {
        const saved = localStorage.getItem('arba_teams');
        if (saved) {
          setTeams(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error syncing teams in App:', err);
      }
    };
    window.addEventListener('storage', handleSyncTeams);
    window.addEventListener('arba_teams_updated', handleSyncTeams);
    return () => {
      window.removeEventListener('storage', handleSyncTeams);
      window.removeEventListener('arba_teams_updated', handleSyncTeams);
    };
  }, []);

  // Update Team Profile Details
  const handleUpdateTeam = (updatedTeam) => {
    const updated = teams.map((t) => (t.id === updatedTeam.id ? updatedTeam : t));
    setTeams(updated);
    try {
      localStorage.setItem('arba_teams', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_teams_updated'));
    } catch (err) {
      console.error('Failed to update team in localStorage', err);
    }
  };

  // Assign Player to Team Roster
  const handleAssignPlayerToTeam = (teamId, playerId) => {
    const team = teams.find(t => t.id === teamId);
    const player = customPlayers.find(p => p.id === playerId);
    if (!team || !player) return;

    // 1. Update player's team affiliation
    const updatedPlayer = { ...player, team: team.name };
    const updatedPlayers = customPlayers.map(p => p.id === playerId ? updatedPlayer : p);
    setCustomPlayers(updatedPlayers);

    // 2. Update team's active roster
    const currentRoster = Array.isArray(team.roster) ? team.roster : [];
    const playerAlreadyInRoster = currentRoster.some(p => (p.id || p) === playerId);
    const newRoster = playerAlreadyInRoster 
      ? currentRoster.map(p => (p.id || p) === playerId ? updatedPlayer : p)
      : [...currentRoster, updatedPlayer];

    const updatedTeam = { ...team, roster: newRoster };
    const updatedTeams = teams.map(t => t.id === teamId ? updatedTeam : t);
    setTeams(updatedTeams);

    // Persist both to localStorage
    try {
      localStorage.setItem('arba_players', JSON.stringify(updatedPlayers));
      localStorage.setItem('arba_custom_players', JSON.stringify(updatedPlayers));
      localStorage.setItem('arba_teams', JSON.stringify(updatedTeams));
      window.dispatchEvent(new Event('arba_players_updated'));
      window.dispatchEvent(new Event('arba_teams_updated'));
    } catch (err) {
      console.error('Failed to assign player to team in localStorage', err);
    }
  };

  // Remove Player from Team Roster
  const handleRemovePlayerFromTeam = (teamId, playerId) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    // 1. Remove from team roster
    const currentRoster = Array.isArray(team.roster) ? team.roster : [];
    const newRoster = currentRoster.filter(p => (p.id || p) !== playerId);
    const updatedTeam = { ...team, roster: newRoster };
    const updatedTeams = teams.map(t => t.id === teamId ? updatedTeam : t);
    setTeams(updatedTeams);

    // 2. Set player's team to 'Unassigned' if they belonged to this team
    const updatedPlayers = customPlayers.map(p => {
      if (p.id === playerId && (p.team === team.name || p.team === team.shortName)) {
        return { ...p, team: 'Unassigned' };
      }
      return p;
    });
    setCustomPlayers(updatedPlayers);

    // Persist both to localStorage
    try {
      localStorage.setItem('arba_players', JSON.stringify(updatedPlayers));
      localStorage.setItem('arba_custom_players', JSON.stringify(updatedPlayers));
      localStorage.setItem('arba_teams', JSON.stringify(updatedTeams));
      window.dispatchEvent(new Event('arba_players_updated'));
      window.dispatchEvent(new Event('arba_teams_updated'));
    } catch (err) {
      console.error('Failed to remove player from team in localStorage', err);
    }
  };

  // Handle Admin Login Success:
  // • Set isAdminAuthenticated to true
  // • Dynamically reveals Dashboard in navbar
  // • Automatically close Login modal
  // • Immediately redirect straight to Admin Dashboard
  const handleAdminSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem('arba_is_admin_authenticated', 'true');
      localStorage.setItem('arba_is_admin', 'true');
    } catch (err) {
      console.error('Failed to save admin state to localStorage', err);
    }
    setLoginModalOpen(false);
    setActiveNav('Dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Sign Out as Admin (overwrites history with window.location.replace to block Back button re-entry)
  const handleSignOut = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('arba_is_admin_authenticated');
      localStorage.removeItem('arba_is_admin');
      sessionStorage.clear();
      window.dispatchEvent(new Event('arba_sign_out'));
    } catch (err) {
      console.error('Failed to clear admin state from storage', err);
    }
    window.location.replace('/');
  };

  // Handle nav tab switching with security block for Dashboard
  const handleNavSelect = (navName) => {
    if (navName === 'Login') {
      setLoginModalOpen(true);
      return;
    }
    if (navName === 'Dashboard' && !isAdminAuthenticated) {
      setActiveNav('Home');
      setLoginModalOpen(true);
      return;
    }
    setActiveNav(navName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open team roster modal
  const handleOpenTeamModal = (team) => {
    setSelectedTeamModal(team);
    setActiveNav('Teams');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827] font-sans selection:bg-orange-500 selection:text-white">
      
      {/* 1. HEADER & NAVIGATION */}
      <HeaderNav
        activeNav={activeNav}
        onSelectNav={handleNavSelect}
        onOpenLogin={() => setLoginModalOpen(true)}
        isAdminAuthenticated={isAdminAuthenticated}
        onSignOut={handleSignOut}
      />

      {/* 2. PRIMARY CONTENT AREA */}
      <main className="flex-1">
        {activeNav === 'Home' && (
          <HomeView
            teams={teams}
            onSelectNav={handleNavSelect}
            onSelectTeam={handleOpenTeamModal}
            newsArticles={newsArticles}
          />
        )}

        {activeNav === 'Teams' && (
          <TeamsView
            teams={teams}
            selectedTeamModal={selectedTeamModal}
            onCloseTeamModal={() => setSelectedTeamModal(null)}
            onOpenTeamModal={handleOpenTeamModal}
          />
        )}

        {activeNav === 'Players' && (
          <PlayersView customPlayers={customPlayers} />
        )}

        {activeNav === 'Women' && (
          <WomenView />
        )}

        {activeNav === 'D-League' && (
          <DLeagueView />
        )}

        {activeNav === 'Coaches' && (
          <CoachesView coaches={coaches} />
        )}

        {activeNav === 'Officials' && (
          <OfficialsView officials={officials} />
        )}

        {activeNav === 'Academies' && (
          <AcademiesView />
        )}

        {(activeNav === 'Dashboard' || activeNav === 'Admin') && (
          isAdminAuthenticated ? (
            <AdminPortal
              customPlayers={customPlayers}
              onAddPlayer={handleAddPlayer}
              onUpdatePlayer={handleUpdatePlayer}
              onDeletePlayer={handleDeletePlayer}
              teams={teams}
              onUpdateTeam={handleUpdateTeam}
              onAssignPlayerToTeam={handleAssignPlayerToTeam}
              onRemovePlayerFromTeam={handleRemovePlayerFromTeam}
              newsArticles={newsArticles}
              onAddNews={handleAddNews}
              onUpdateNews={handleUpdateNews}
              onDeleteNews={handleDeleteNews}
              coaches={coaches}
              onAddCoach={handleAddCoach}
              onUpdateCoach={handleUpdateCoach}
              onDeleteCoach={handleDeleteCoach}
              officials={officials}
              onAddOfficial={handleAddOfficial}
              onUpdateOfficial={handleUpdateOfficial}
              onDeleteOfficial={handleDeleteOfficial}
              onSignOut={handleSignOut}
              onExitAdmin={() => {
                setActiveNav('Home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : null
        )}
      </main>

      {/* 3. FOOTER */}
      <Footer onSelectNav={handleNavSelect} />

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onAdminSuccess={handleAdminSuccess}
      />

    </div>
  );
}
