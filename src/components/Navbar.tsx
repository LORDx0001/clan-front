import React, { useState } from 'react';
import { Menu, X, ShieldAlert, Award, Radio, Disc, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useClan } from '../context/ClanContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { settings } = useClan();
  const { user } = useAuth();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { id: 'main', label: 'ГЛАВНАЯ' },
    { id: 'roster', label: 'СОСТАВ' },
    { id: 'gallery', label: 'ГАЛЕРЕЯ' },
    { id: 'news', label: 'НОВОСТИ' },
    { id: 'rules', label: 'ПРАВИЛА И РЕКРУТИНГ' },
    { id: 'reaction', label: 'ТРЕНИРОВКА' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
    
    // Quick synth sound feed for cyber gaming montage vibe
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // AudioContext not allowed or not supported
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-battle-dark/95 border-b-2 border-pubg-orange/20 backdrop-blur-md px-2 sm:px-4 md:px-6">
      <div className="max-w-[96%] lg:max-w-[1550px] mx-auto">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Clan Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('main')}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-pubg-orange rounded-lg blur-xs opacity-40 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-battle-gray border-2 border-pubg-orange text-pubg-orange px-3 py-1.5 rounded font-cyber font-black tracking-widest text-lg sm:text-xl flex items-center gap-2">
                <Disc className="w-5 h-5 animate-spin-slow text-pubg-orange" />
                <span>{settings.clanTag || "TAG"}</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span className="text-white font-oswald text-xl tracking-wider block font-bold group-hover:text-pubg-orange transition-colors">
                {settings.clanName || "КЛАН"}
              </span>
              <span className="text-xs text-pubg-orange/60 font-mono block tracking-widest uppercase -mt-1">
                CIS MOBILE TEAM
              </span>
            </div>
          </div>

          {/* Desktop Right Side Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded text-sm font-oswald font-medium tracking-widest transition-all duration-300 overflow-hidden ${
                    isActive
                      ? 'text-pubg-orange font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-battle-light/40'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-pubg-orange"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                  {isActive && (
                    <div className="absolute inset-0 bg-pubg-orange/5 blur-md" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Social Icons & Status indicator */}
          <div className="hidden lg:flex items-center space-x-4 border-l border-gray-800 pl-6">
            <div className="flex items-center space-x-2 bg-pubg-orange/10 px-3 py-1.5 rounded border border-pubg-orange/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green"></span>
              </span>
              <span className="text-xs text-cyber-green font-cyber font-medium tracking-wider">RECRUITING OPEN</span>
            </div>
            {user ? (
              <button onClick={() => setActiveTab('profile')} className="flex items-center space-x-2 border border-pubg-orange/30 text-pubg-orange hover:bg-pubg-orange hover:text-white px-3 py-1.5 rounded transition-colors font-oswald tracking-widest text-sm">
                <User size={16} />
                <span>ПРОФИЛЬ</span>
              </button>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center space-x-2 border border-gray-600 text-gray-400 hover:text-white hover:border-pubg-orange hover:bg-pubg-orange/10 px-3 py-1.5 rounded transition-colors font-oswald tracking-widest text-sm">
                <User size={16} />
                <span>ВХОД</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-battle-light focus:outline-none border border-gray-800"
            >
              {isOpen ? <X className="h-6 w-6 text-pubg-orange" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-battle-gray border-b border-pubg-orange/10 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-md font-oswald text-base tracking-widest ${
                      isActive
                        ? 'bg-pubg-orange/15 text-pubg-orange border-l-4 border-pubg-orange font-bold'
                        : 'text-gray-300 hover:bg-battle-light/50 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
                <div className="pt-4 pb-2 px-4 border-t border-gray-800 flex items-center justify-between">
                <div className="text-xs text-gray-500 font-mono">EST. {settings.clanFounded || new Date().getFullYear()} • REGION: CIS</div>
                
                {user ? (
                  <button onClick={() => { handleNavClick('profile') }} className="text-pubg-orange font-mono text-xs hover:underline">ПРОФИЛЬ</button>
                ) : (
                  <button onClick={() => { setIsAuthModalOpen(true); setIsOpen(false); }} className="text-gray-400 font-mono text-xs hover:text-pubg-orange">ВХОД</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}
