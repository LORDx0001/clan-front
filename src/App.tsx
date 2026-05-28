import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Roster from './components/Roster';
import NewsAnnouncements from './components/NewsAnnouncements';
import RulesRecruitment from './components/RulesRecruitment';
import Gallery from './components/Gallery';
import Profile from './components/Profile';
import ReactionTime from './components/ReactionTime';
import { useClan } from './context/ClanContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Check URL hash first (e.g. #roster)
    const hash = window.location.hash.replace('#', '');
    if (['main', 'roster', 'news', 'rules', 'gallery', 'reaction'].includes(hash)) {
      return hash;
    }
    
    // Fallback to localStorage
    const cachedTab = localStorage.getItem('activeTab');
    if (cachedTab && ['main', 'roster', 'news', 'rules', 'gallery', 'profile', 'reaction'].includes(cachedTab)) {
      return cachedTab;
    }
    
    return 'main';
  });

  const { settings, error, loading } = useClan();

  // Sync active tab to URL hash and localStorage on change
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
    window.location.hash = activeTab;
  }, [activeTab]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-100 bg-battle-dark flex flex-col items-center justify-center text-white overflow-hidden select-none font-mono">
        {/* Futuristic tech grids */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
        
        {/* Rotating tech circle */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute w-24 h-24 border-2 border-dashed border-pubg-orange/40 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-20 h-20 border-2 border-double border-pubg-orange/20 rounded-full animate-[spin_6s_linear_infinite_reverse]" />
          <div className="absolute w-12 h-12 border border-pubg-orange/10 rounded-full animate-ping" />
          
          {/* Target crosshair center dot */}
          <div className="w-4 h-4 bg-pubg-orange rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-pulse flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
        </div>

        {/* Loading text with tech scanners */}
        <div className="mt-8 space-y-3 text-center z-10">
          <h2 className="text-sm font-cyber uppercase tracking-[0.3em] text-pubg-orange animate-pulse">
            Инициализация систем клана...
          </h2>
          
          {/* Faux tech console logging */}
          <div className="text-[9px] text-gray-500 font-mono tracking-wider h-4 overflow-hidden max-w-xs mx-auto uppercase">
            <span className="animate-[pulse_1s_infinite]">
              // Подключение к защищенной базе данных...
            </span>
          </div>

          {/* Glowing loading track */}
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10 relative mx-auto">
            <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-purple-600 to-pubg-orange rounded-full animate-loading-bar shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          </div>
        </div>
      </div>
    );
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'main':
        return <Hero onTabChange={setActiveTab} />;
      case 'roster':
        return <Roster onBack={() => setActiveTab('main')} />;
      case 'news':
        return <NewsAnnouncements onBack={() => setActiveTab('main')} />;
      case 'rules':
        return <RulesRecruitment onBack={() => setActiveTab('main')} />;
      case 'gallery':
        return <Gallery onBack={() => setActiveTab('main')} />;
      case 'profile':
        return <Profile onBack={() => setActiveTab('main')} />;
      case 'reaction':
        return <ReactionTime onBack={() => setActiveTab('main')} />;
      default:
        return <Hero onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-battle-dark text-white font-sans selection:bg-pubg-orange selection:text-battle-dark overflow-x-hidden">
      
      {/* Background Subtle Cyber-Fog Overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.06)_0%,transparent_60%)] pointer-events-none z-1" />
      <div className="fixed inset-0 scanline pointer-events-none opacity-10 z-1" />

      {/* Network Alert (Only visible if backend is offline/mock mode) */}
      {error && (
        <div className="bg-pubg-orange/80 text-battle-dark text-center py-1 px-4 text-xs font-cyber tracking-widest font-bold z-55 sticky top-0 uppercase flex items-center justify-center gap-1.5 shadow-md">
          <span>⚠ {error}</span>
        </div>
      )}

      {/* Primary Navigation System */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Router Frame */}
      <main className="relative z-10 transition-all duration-300">
        {renderActiveComponent()}
      </main>

      {/* Universal Tactical Footer Section */}
      <footer className="relative z-20 bg-battle-dark/95 border-t-2 border-pubg-orange/15 py-12 px-2 sm:px-4 md:px-6 mt-auto">
        <div className="max-w-[96%] lg:max-w-[1550px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="bg-pubg-orange text-battle-dark px-2 font-cyber font-black text-sm tracking-widest rounded py-0.5">
                {settings.clanTag}
              </span>
              <span className="font-oswald font-black uppercase text-xl text-white tracking-widest">
                {settings.clanName || "ОФИЦИАЛЬНЫЙ"} CLAN
              </span>
            </div>
            <p className="text-xs text-gray-500 font-sans leading-relaxed">
              Официальный портал мобильной киберспортивной организации {settings.clanName || "нашего клана"}. Мы строим дисциплинированное киберспортивное сообщество на территории СНГ с {settings.clanFounded || new Date().getFullYear()} года.
            </p>
            <div className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
              SECURE SYSTEM VERSION 3.0.0
            </div>
          </div>

          {/* Quick links & Sinks */}
          <div className="space-y-4">
            <h4 className="font-cyber text-xs text-pubg-orange font-bold tracking-widest uppercase">
              // ИГРОВЫЕ СВЯЗИ
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 font-mono">
              <button onClick={() => setActiveTab('main')} className="text-left hover:text-pubg-orange transition-colors">ГЛАВНАЯ</button>
              <button onClick={() => setActiveTab('roster')} className="text-left hover:text-pubg-orange transition-colors">СОСТАВ</button>
              <button onClick={() => setActiveTab('gallery')} className="text-left hover:text-pubg-orange transition-colors">ГАЛЕРЕЯ</button>
              <button onClick={() => setActiveTab('news')} className="text-left hover:text-pubg-orange transition-colors">НОВОСТИ</button>
              <button onClick={() => setActiveTab('rules')} className="text-left hover:text-pubg-orange transition-colors">РЕКРУТИНГ</button>
              <button onClick={() => setActiveTab('reaction')} className="text-left hover:text-pubg-orange transition-colors">ТРЕНИРОВКА</button>
            </div>
          </div>

          {/* Digital contact triggers */}
          <div className="space-y-4">
            <h4 className="font-cyber text-xs text-pubg-orange font-bold tracking-widest uppercase">
              // ОФИЦИАЛЬНАЯ ПОДДЕРЖКА
            </h4>
            <div className="space-y-2 text-xs">
              <div className="bg-battle-gray p-3 rounded-md border border-white/5 flex items-center justify-between">
                <span className="font-mono text-gray-400">DISCORD SERVER:</span>
                <strong className="text-white hover:text-pubg-orange transition-colors cursor-pointer">{settings.discordLink}</strong>
              </div>
              <div className="bg-battle-gray p-3 rounded-md border border-white/5 flex items-center justify-between">
                <span className="font-mono text-gray-400">TELEGRAM DIRECT:</span>
                <strong className="text-white hover:text-pubg-orange transition-colors cursor-pointer">{settings.telegramLink}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright block */}
        <div className="max-w-[96%] lg:max-w-[1550px] mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600 font-mono">
          <div>
            © {new Date().getFullYear()} {(settings.clanName || "CLAN").toUpperCase()} SYSTEMS ESPORTS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-pubg-orange cursor-pointer transition-colors">УСЛОВИЯ ИСПОЛЬЗОВАНИЯ</span>
            <span className="hover:text-pubg-orange cursor-pointer transition-colors">КОНФИДЕНЦИАЛЬНОСТЬ</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
