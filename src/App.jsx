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

export default function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const [selectedTeamModal, setSelectedTeamModal] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('arba_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  // Direct Access Block: Automatically redirect to Home and launch Login modal if unauthenticated attempts to access Dashboard
  useEffect(() => {
    if (activeNav === 'Dashboard' && !isAdminAuthenticated) {
      const timer = setTimeout(() => {
        setActiveNav('Home');
        setLoginModalOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeNav, isAdminAuthenticated]);

  // Custom Registered Players State
  const [customPlayers, setCustomPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem('arba_custom_players');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // News Articles State
  const [newsArticles, setNewsArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('arba_news_articles');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
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
  });

  // Persist custom players changes to localStorage
  const handleAddPlayer = (newPlayer) => {
    const updated = [newPlayer, ...customPlayers];
    setCustomPlayers(updated);
    try {
      localStorage.setItem('arba_custom_players', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_player_updated'));
    } catch (err) {
      console.error('Failed to save player to localStorage', err);
    }
  };

  const handleDeletePlayer = (playerId) => {
    const updated = customPlayers.filter((p) => p.id !== playerId);
    setCustomPlayers(updated);
    try {
      localStorage.setItem('arba_custom_players', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_player_updated'));
    } catch (err) {
      console.error('Failed to delete player from localStorage', err);
    }
  };

  // Persist news articles changes to localStorage
  const handleAddNews = (newArticle) => {
    const updated = [newArticle, ...newsArticles];
    setNewsArticles(updated);
    try {
      localStorage.setItem('arba_news_articles', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_news_updated'));
    } catch (err) {
      console.error('Failed to save news to localStorage', err);
    }
  };

  const handleUpdateNews = (updatedArticle) => {
    const updated = newsArticles.map((a) => (a.id === updatedArticle.id ? updatedArticle : a));
    setNewsArticles(updated);
    try {
      localStorage.setItem('arba_news_articles', JSON.stringify(updated));
      window.dispatchEvent(new Event('arba_news_updated'));
    } catch (err) {
      console.error('Failed to update news in localStorage', err);
    }
  };

  const handleDeleteNews = (articleId) => {
    const updated = newsArticles.filter((a) => a.id !== articleId);
    setNewsArticles(updated);
    try {
      localStorage.setItem('arba_news_articles', JSON.stringify(updated));
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

  // Handle Admin Login Success:
  // • Set isAdminAuthenticated to true
  // • Dynamically reveals Dashboard in navbar
  // • Automatically close Login modal
  // • Immediately redirect straight to Admin Dashboard
  const handleAdminSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      localStorage.setItem('arba_is_admin', 'true');
    } catch (err) {
      console.error('Failed to save admin state to localStorage', err);
    }
    setLoginModalOpen(false);
    setActiveNav('Dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Sign Out as Admin
  const handleSignOut = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('arba_is_admin');
    } catch (err) {
      console.error('Failed to remove admin state from localStorage', err);
    }
    if (activeNav === 'Dashboard' || activeNav === 'Admin') {
      setActiveNav('Home');
    }
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
            onSelectNav={handleNavSelect}
            onSelectTeam={handleOpenTeamModal}
            newsArticles={newsArticles}
          />
        )}

        {activeNav === 'Teams' && (
          <TeamsView
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
              onDeletePlayer={handleDeletePlayer}
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
