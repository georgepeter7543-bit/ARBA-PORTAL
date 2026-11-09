import React, { useState, useMemo, useEffect } from 'react';
import TeamCrest from './TeamCrest';
import { TEAMS } from '../data/basketballData';
import { 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Newspaper,
  Trophy,
  Sparkles,
  Flame,
  Users,
  X
} from 'lucide-react';

const DEFAULT_CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&w=1600&q=80'
];

export default function HomeView({ onSelectNav, onSelectTeam, newsArticles = [] }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Load articles from prop or fallback to localStorage
  const activeArticles = useMemo(() => {
    if (newsArticles && newsArticles.length > 0) return newsArticles;
    try {
      const saved = localStorage.getItem('arba_news_articles');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'default-news-1',
        title: '2026 Arusha Regional Basketball Championship Week 2 Fixtures Confirmed',
        category: 'Match Recap',
        date: 'November 7, 2026',
        content: 'The ARBA Competitions Committee has ratified the official weekend fixture list for the Arusha Premier Division. Key showdowns include Arusha Kings defending their undefeated record against the surging Soweto Stars squad, followed by Sakina Hoops taking on Kaloleni Eagles.',
        image: DEFAULT_CAROUSEL_IMAGES[0]
      },
      {
        id: 'default-news-2',
        title: 'ARBA Secretariat Announces Referee and Coaching Refresher Clinic',
        category: 'League Announcement',
        date: 'November 4, 2026',
        content: 'In collaboration with the Tanzania Basketball Federation (TBF) and FIBA Africa Zone 5, ARBA is hosting a mandatory accreditation and rules update seminar for all active floor officials, table referees, and registered club coaches.',
        image: DEFAULT_CAROUSEL_IMAGES[1]
      },
      {
        id: 'default-news-3',
        title: 'Arusha Kings and Soweto Stars Secure Top Seedings in Northern Zone Qualifiers',
        category: 'Roster Update',
        date: 'October 30, 2026',
        content: 'Following stellar regular season performances, Arusha Kings and Soweto Stars have officially locked in the top seedings for the upcoming regional playoffs. Both clubs have submitted finalized active rosters.',
        image: DEFAULT_CAROUSEL_IMAGES[2]
      }
    ];
  }, [newsArticles]);

  // Carousel slides with images
  const carouselSlides = useMemo(() => {
    return activeArticles.map((article, idx) => ({
      ...article,
      image: article.image || DEFAULT_CAROUSEL_IMAGES[idx % DEFAULT_CAROUSEL_IMAGES.length]
    }));
  }, [activeArticles]);

  // When news is updated or published from admin portal, reset carousel slide to 0
  useEffect(() => {
    const handleNewsSync = () => {
      setCurrentSlide(0);
    };
    window.addEventListener('arba_news_updated', handleNewsSync);
    return () => window.removeEventListener('arba_news_updated', handleNewsSync);
  }, []);

  // Autoplay carousel every 6 seconds
  useEffect(() => {
    if (carouselSlides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [carouselSlides.length, isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const activeSlideData = carouselSlides[currentSlide] || carouselSlides[0];

  return (
    <div className="space-y-12 pb-16 select-none bg-[#F9FAFB] text-[#111827]">
      
      {/* 1. STREAMLINED HERO BANNER WITH FULL-BLEED FIBA NEWS CAROUSEL */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#000000] via-[#090d16] to-[#000000] text-white pt-10 sm:pt-14 pb-12 border-b border-neutral-800">
        
        {/* Ambient basketball court glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10 space-y-8">
          
          {/* HERO TEXT: MAIN HEADLINE, DESCRIPTION & PRIMARY CTA ONLY */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-orange-400 text-xs font-bold tracking-wide shadow-sm">
              <img src="/arba-logo.jpg" alt="ARBA Crest" className="w-5 h-5 object-contain" />
              <span>OFFICIAL ARUSHA BASKETBALL • SINCE '01</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase font-sans leading-[1.08]">
              THE HEARTBEAT OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                ARUSHA BASKETBALL
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Welcome to the digital home of the Arusha Regional Basketball Association (ARBA). 
              Powering regional championships, grassroots academies, certified coaching, and elite player pathways across Northern Tanzania.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onSelectNav('Teams')}
                className="px-6 py-3.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-orange-500/25 active:scale-95 flex items-center space-x-2 cursor-pointer"
              >
                <span>Explore Teams & Rosters</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* FULL-BLEED FIBA NEWS IMAGE CAROUSEL */}
          <div 
            className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background Image with smooth transition */}
            <img
              src={activeSlideData?.image}
              alt={activeSlideData?.title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
            />

            {/* Dark FIBA Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none"></div>

            {/* Carousel Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10 flex flex-col justify-end space-y-3">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500 text-black shadow-md">
                  {activeSlideData?.category}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-300 flex items-center space-x-1.5 bg-black/60 px-2.5 py-1 rounded border border-neutral-800">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  <span>{activeSlideData?.date}</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-sans max-w-4xl drop-shadow-md leading-tight">
                {activeSlideData?.title}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 max-w-2xl drop-shadow leading-relaxed">
                {activeSlideData?.content}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setSelectedArticle(activeSlideData)}
                  className="px-5 py-2.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-orange-400 hover:text-white border border-neutral-700 text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2 cursor-pointer shadow-md"
                >
                  <span>Read Full Bulletin</span>
                  <ChevronRight className="w-4 h-4 text-orange-400" />
                </button>

                {/* SLIDE INDICATORS / DOTS */}
                <div className="flex items-center space-x-2 bg-black/60 px-3 py-1.5 rounded-full border border-neutral-800">
                  {carouselSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      title={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx 
                          ? 'w-7 bg-orange-500' 
                          : 'w-2 bg-neutral-600 hover:bg-neutral-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* PREV / NEXT ARROWS */}
            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black border border-neutral-700 text-white hover:text-orange-400 flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg z-20"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black border border-neutral-700 text-white hover:text-orange-400 flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg z-20"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      {/* 2. ARBA LIVE NEWS & ANNOUNCEMENTS SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                  PRESS & COMMUNICATIONS
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#111827] uppercase tracking-tight font-sans">
                  Latest ARBA News & Announcements
                </h2>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-400">
              {activeArticles.length} Live Bulletins
            </span>
          </div>

          {/* NEWS CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activeArticles.slice(0, 3).map((article) => (
              <div
                key={article.id}
                className="bg-[#F9FAFB] rounded-xl p-5 border border-[#E5E7EB] hover:border-orange-500/60 transition flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/25">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{article.date}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[#111827] group-hover:text-orange-600 transition leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {article.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Read Full Bulletin</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {activeArticles.length > 3 && (
            <div className="pt-2 text-center">
              <span className="text-xs text-gray-400">
                + {activeArticles.length - 3} more bulletins archived in association records.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 3. CLUB CRESTS STRIP (Quick Team Switcher) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB] gap-2">
            <div>
              <h2 className="text-lg font-black text-[#111827] uppercase tracking-tight font-sans">
                Arusha Premier Clubs & Crests
              </h2>
              <p className="text-xs text-gray-500">
                Select any club to view team details, roster stats, and home arena
              </p>
            </div>
            <button
              onClick={() => onSelectNav('Teams')}
              className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center space-x-1 cursor-pointer"
            >
              <span>Explore All Franchises</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {TEAMS.map((team) => (
              <button
                key={team.id}
                onClick={() => onSelectTeam(team)}
                className="flex flex-col items-center p-3 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] hover:border-orange-500/60 hover:bg-orange-50/50 hover:shadow-sm transition group cursor-pointer text-center"
              >
                <div className="w-14 h-14 p-1 flex items-center justify-center group-hover:scale-108 transition-transform mb-2">
                  <TeamCrest team={team} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-extrabold text-[#111827] group-hover:text-orange-600 transition truncate w-full">
                  {team.shortName}
                </span>
                <span className="text-[10px] font-bold text-gray-400">
                  {team.record}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ARBA REGIONAL DIVISIONS */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500">
            COMPETITION STRUCTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] uppercase tracking-tight font-sans mt-1">
            ARBA Leagues & Pathways
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            From grassroots junior hooper development to the Men's Premier League and Women's Championship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* DIVISION 1: MEN'S PREMIER */}
          <div 
            onClick={() => onSelectNav('Teams')}
            className="p-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-orange-500/60 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-black text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-[#E5E7EB]">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">Top Tier</span>
              <h3 className="text-base font-black text-[#111827] uppercase mt-0.5">Men's Premier Division</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Elite senior division competing for the Arusha Championship and national TBF playoff seedings.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-bold text-gray-500 group-hover:text-orange-500">
              <span>View Teams</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* DIVISION 2: WOMEN'S CHAMPIONSHIP */}
          <div 
            onClick={() => onSelectNav('Women')}
            className="p-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-orange-500/60 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-black text-pink-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-[#E5E7EB]">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">Women's</span>
              <h3 className="text-base font-black text-[#111827] uppercase mt-0.5">Women's Championship</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Dedicated regional championship showcasing top female basketball athletes across Arusha.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-bold text-gray-500 group-hover:text-orange-500">
              <span>Explore Women</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* DIVISION 3: D-LEAGUE */}
          <div 
            onClick={() => onSelectNav('D-League')}
            className="p-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-orange-500/60 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-black text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-[#E5E7EB]">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Development</span>
              <h3 className="text-base font-black text-[#111827] uppercase mt-0.5">D-League Circuit</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Development league bridging academy prospects into senior professional rosters.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-bold text-gray-500 group-hover:text-orange-500">
              <span>View D-League</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* DIVISION 4: ACADEMIES */}
          <div 
            onClick={() => onSelectNav('Academies')}
            className="p-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-orange-500/60 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-black text-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-[#E5E7EB]">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Grassroots</span>
              <h3 className="text-base font-black text-[#111827] uppercase mt-0.5">Junior Academies</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Foundational skills training for youth aged 7-16 led by certified FIBA development coaches.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-bold text-gray-500 group-hover:text-orange-500">
              <span>View Academies</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-2xl border border-[#E5E7EB] shadow-2xl overflow-hidden text-[#111827] space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image if available */}
            {selectedArticle.image && (
              <div className="relative w-full h-52 sm:h-60 bg-neutral-900 overflow-hidden">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-500 text-black shadow">
                    {selectedArticle.category}
                  </span>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-4">
              {!selectedArticle.image && (
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/25">
                    {selectedArticle.category}
                  </span>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="text-gray-400 hover:text-[#111827] transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs font-mono text-gray-500 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" />
                  <span>{selectedArticle.date}</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#111827] uppercase tracking-tight leading-snug">
                  {selectedArticle.title}
                </h2>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 leading-relaxed space-y-3 pt-3 border-t border-[#E5E7EB] max-h-[50vh] overflow-y-auto pr-1">
                <p className="whitespace-pre-line">{selectedArticle.content}</p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 bg-[#111827] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
                >
                  Close Bulletin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
