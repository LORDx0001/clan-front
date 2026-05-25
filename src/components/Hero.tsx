import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Trophy, Activity, Users, Flame, Zap, Play, 
  Volume2, ShieldAlert, ChevronRight, Image as ImageIcon, 
  Calendar, FileText, Smartphone, Crosshair, Award, Eye, Heart 
} from 'lucide-react';
import { useClan } from '../context/ClanContext';

interface HeroProps {
  onTabChange: (tab: string) => void;
}

export default function Hero({ onTabChange }: HeroProps) {
  const { settings, players, announcements, schedule, rules, gallery } = useClan();
  const [glitchActive, setGlitchActive] = useState(false);
  const [montageMode, setMontageMode] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0); // 0 to 3
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const hasBackground = !!settings.heroBackgroundFileUrl;
  const isVideo = settings.heroBackgroundType === 'video';
  const slides = settings.heroSlides || [];

  const goToNextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  // Slideshow transition interval: 5 seconds for photos, video plays to completion
  useEffect(() => {
    if (slides.length <= 1) return;
    const currentSlide = slides[currentSlideIndex];
    
    // Only set automatic transition timer if current slide is a photo
    if (currentSlide && currentSlide.type !== 'video') {
      const timer = setTimeout(() => {
        goToNextSlide();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [slides, currentSlideIndex]);

  // Glitch effect logic
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getClanRoleBadge = (role?: string, displayName?: string) => {
    if (!role) return null;
    let colorClass = "";
    if (role === 'leader') {
      colorClass = "bg-yellow-500/90 text-black border border-yellow-400 font-bold shadow-[0_0_15px_rgba(234,179,8,0.6)]";
    } else if (role === 'deputy') {
      colorClass = "bg-orange-600/90 text-white border border-orange-500 font-bold shadow-[0_0_15px_rgba(249,115,22,0.6)]";
    } else if (role === 'elite') {
      colorClass = "bg-purple-600/90 text-white border border-purple-500 font-bold shadow-[0_0_15px_rgba(168,85,247,0.6)]";
    } else {
      colorClass = "bg-battle-gray/80 text-gray-400 border border-white/10";
    }
    return (
      <span className={`px-2.5 py-0.5 text-[9px] font-cyber tracking-widest uppercase rounded ${colorClass}`}>
        {displayName || role}
      </span>
    );
  };

  return (
    <div className="w-full">
      
      {/* 1. HERO HOME BANNER */}
      <section className="relative min-h-[calc(100vh-80px)] bg-battle-dark text-white overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            {slides.length > 0 ? (
              slides.map((slide, idx) => {
                if (idx !== currentSlideIndex) return null;
                const isSlideVideo = slide.type === 'video';
                return (
                  <motion.div
                    key={`slide-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.55 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                  >
                    {isSlideVideo ? (
                      <video
                        src={slide.url}
                        autoPlay muted playsInline
                        loop={false}
                        onEnded={goToNextSlide}
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.url})` }}
                      />
                    )}
                  </motion.div>
                );
              })
            ) : (
              <>
                {hasBackground && isVideo && (
                  <motion.video
                    key="bg-video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    src={settings.heroBackgroundFileUrl}
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {hasBackground && !isVideo && (
                  <motion.div
                    key="bg-img"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${settings.heroBackgroundFileUrl})` }}
                  />
                )}
              </>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.4)_0%,rgba(5,5,5,0.95)_100%)] z-1" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:32px_32px] z-1" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pubg-orange/10 to-transparent w-full h-1/2 animate-scanline z-2 pointer-events-none" />
        </div>

        {glitchActive && (
          <div className="absolute inset-0 z-4 bg-pubg-orange/10 mix-blend-color-dodge opacity-80 pointer-events-none flex items-center justify-center">
            <div className="w-full h-1 bg-cyber-red/30 absolute top-1/4 animate-bounce" />
            <div className="w-full h-2 bg-pubg-orange/40 absolute top-2/3 animate-bounce" />
          </div>
        )}

        <div className="relative z-10 max-w-[96%] lg:max-w-[1550px] mx-auto px-2 sm:px-4 md:px-6 py-12 md:py-24 flex flex-col justify-between min-h-[calc(100vh-80px)] w-full">
          
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="bg-pubg-orange text-battle-dark font-cyber font-black text-xs px-3 py-1 tracking-widest uppercase skewed-badge">
              PRO LEAGUE SQUAD • EST {settings.clanFounded}
            </div>
            <div className="border border-white/10 bg-battle-gray/80 px-3 py-1 rounded text-xs text-gray-400 font-mono tracking-wider flex items-center gap-1.5 backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-cyber-green animate-pulse"></span>
              PING: 18ms СЕРВЕР: CIS ELITE
            </div>
          </div>

          <div className="my-auto max-w-4xl pt-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pubg-orange/30 to-transparent px-4 py-1.5 rounded-l border-l-4 border-pubg-orange">
                <Flame className="w-4 h-4 text-pubg-orange animate-pulse" />
                <span className="text-xs sm:text-sm font-cyber font-bold tracking-widest text-pubg-orange uppercase">{settings.clanName ? "МЫ — КЛАН " + settings.clanName.toUpperCase() : "ОФИЦИАЛЬНЫЙ КЛАН"}</span>
              </div>

              {(settings.heroTitle1 || settings.heroTitle2) && (
              <h1 className="text-3xl sm:text-7xl lg:text-8xl font-oswald font-black leading-none tracking-tight uppercase">
                {settings.heroTitle1 && <><span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">{settings.heroTitle1}</span><br /></>}
                {settings.heroTitle2 && <span className="relative inline-block text-pubg-orange animate-glitch-pulse">
                  {settings.heroTitle2}
                  <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-pubg-orange/20 blur-xs" />
                </span>}
              </h1>
              )}

              {settings.heroDescription && (
              <p className="text-gray-400 font-sans text-sm sm:text-lg lg:text-xl max-w-2xl leading-relaxed">
                {settings.heroDescription}
              </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                  onClick={() => onTabChange('rules')}
                  className="relative px-6 sm:px-8 py-3.5 sm:py-4 bg-pubg-orange text-battle-dark font-oswald font-black text-base sm:text-lg tracking-widest uppercase rounded cursor-pointer transform hover:scale-105 active:scale-95 transition-all outline-hidden border border-pubg-orange shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] group overflow-hidden w-full sm:w-auto text-center"
                >
                  <div className="absolute inset-0 w-1/4 h-full bg-white/25 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-out" />
                  ПОДАТЬ ЗАЯВКУ
                </button>

                <button 
                  onClick={() => onTabChange('roster')}
                  className="px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent hover:bg-white/5 text-white font-oswald font-medium text-base sm:text-lg tracking-widest uppercase rounded border-2 border-white/20 hover:border-pubg-orange/80 cursor-pointer transform hover:scale-102 active:scale-98 transition-all w-full sm:w-auto text-center"
                >
                  СОСТАВ КЛАНА
                </button>
              </div>
            </motion.div>
          </div>

          {/* Dynamic Clan Scoreboard Stat Panels (WITHOUT K/D RATIO) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 bg-battle-gray/60 border border-white/10 p-6 rounded backdrop-blur-md"
          >
            {(settings.stats || []).filter(stat => stat.title || stat.value || stat.desc).map((stat, idx) => {
              const icons = [
                <Trophy key="trophy" className="w-3.5 h-3.5" />,
                <Activity key="activity" className="w-3.5 h-3.5" />,
                <Users key="users" className="w-3.5 h-3.5" />,
                <Zap key="zap" className="w-3.5 h-3.5" />
              ];
              return (
                <div key={idx} className="p-4 border-r border-dashed border-white/10 last:border-0">
                  <div className="text-xs text-pubg-orange font-cyber tracking-widest mb-1.5 flex items-center gap-1">
                    {icons[idx] || icons[0]} {stat.title}
                  </div>
                  <div className="text-2xl sm:text-3xl font-oswald font-black">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 font-sans mt-1">
                    {stat.desc}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 2. ROSTER (СОСТАВ) PREVIEW */}
      <section className="py-16 bg-battle-dark border-t border-gray-900 px-2 sm:px-4 md:px-6">
        <div className="max-w-[96%] lg:max-w-[1550px] mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs text-pubg-orange font-cyber tracking-widest uppercase block mb-1">ОПЕРАТИВНИКИ_ИНФО</span>
              <h2 className="text-3xl sm:text-4xl font-oswald font-black uppercase">ВЕДУЩИЕ ИГРОКИ СОСТАВА</h2>
            </div>
            <button 
              onClick={() => onTabChange('roster')}
              className="group flex items-center gap-2 text-pubg-orange font-cyber text-xs uppercase tracking-widest border border-pubg-orange/30 px-3.5 py-2 rounded hover:bg-pubg-orange/15 transition-all"
            >
              <span>Показать весь состав</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Roster cards preview - 4 compact cards matching the beautiful roster styles */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {players.slice(0, 4).map((player) => (
              <motion.div
                key={player.id}
                onClick={() => onTabChange('roster')}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.15)' }}
                className="bg-battle-gray border border-gray-800 rounded-lg cursor-pointer relative group transition-all duration-300 overflow-hidden aspect-[3/4]"
              >
                {/* Portrait photo backdrop */}
                <img 
                  src={player.avatar} 
                  alt={player.nickname} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                {/* Subtle dark gradient overlay at the bottom half */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent transition-opacity duration-300" />
                
                {/* Clan Rank Badge in top left corner */}
                {player.clanRole && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 scale-90 sm:scale-100 origin-top-left">
                    {getClanRoleBadge(player.clanRole, player.clanRoleDisplay)}
                  </div>
                )}

                {/* Level Badge in top right corner */}
                <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-pubg-orange/80 backdrop-blur-md text-battle-dark text-[8px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-0.5 font-mono font-bold rounded z-10">
                  Lv.{player.level}
                </span>

                {/* Left bottom corner info overlay */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 z-10 space-y-0.5 sm:space-y-1">
                  <h3 className="font-oswald text-sm sm:text-lg md:text-2xl font-black tracking-wider text-white group-hover:text-pubg-orange transition-colors drop-shadow-md line-clamp-1">
                    {player.nickname}
                  </h3>
                  {player.achievements && player.achievements.length > 0 && player.achievements[0] && (
                    <p className="text-[10px] sm:text-xs text-gray-300 font-sans line-clamp-1 leading-relaxed drop-shadow-sm">
                      {player.achievements[0]}
                    </p>
                  )}
                  <span className="text-[8px] sm:text-[9px] font-cyber tracking-widest text-pubg-orange uppercase block pt-0.5 sm:pt-1">
                    // {player.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. GALLERY (ГАЛЕРЕЯ) PREVIEW */}
      <section className="py-16 bg-battle-gray border-t border-gray-900 px-2 sm:px-4 md:px-6">
        <div className="max-w-[96%] lg:max-w-[1550px] mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs text-pubg-orange font-cyber tracking-widest uppercase block mb-1">МЕДИАТЕКА CLAN.iso</span>
              <h2 className="text-3xl sm:text-4xl font-oswald font-black uppercase">ХОФЫ И ХАЙЛАЙТЫ</h2>
            </div>
            <button 
              onClick={() => onTabChange('gallery')}
              className="group flex items-center gap-2 text-pubg-orange font-cyber text-xs uppercase tracking-widest border border-pubg-orange/30 px-3.5 py-2 rounded hover:bg-pubg-orange/15 transition-all"
            >
              <span>Показать всю галерею</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gallery.slice(0, 2).map((item) => (
              <div 
                key={item.id}
                onClick={() => onTabChange('gallery')}
                className="bg-battle-dark border border-gray-800 rounded-lg overflow-hidden group hover:border-pubg-orange/50 transition-all duration-300 cursor-pointer relative"
              >
                <div className="h-64 w-full overflow-hidden relative">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-pubg-orange text-battle-dark text-[9px] font-cyber tracking-widest uppercase px-2 py-0.5 rounded occurrence-badge font-bold">
                      {item.category}
                    </span>
                    <h3 className="font-oswald text-lg font-bold text-white mt-1 group-hover:text-pubg-orange transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <span className="absolute top-3 right-3 bg-black/60 border border-white/10 text-[10px] text-gray-300 font-mono px-2 py-1 flex items-center gap-1 select-none">
                    <Eye className="w-3" /> {item.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NEWS (НОВОСТИ) PREVIEW */}
      <section className="py-16 bg-battle-dark border-t border-gray-900 px-2 sm:px-4 md:px-6">
        <div className="max-w-[96%] lg:max-w-[1550px] mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs text-pubg-orange font-cyber tracking-widest uppercase block mb-1">СВЕЖИЕ СВОДКИ</span>
              <h2 className="text-3xl sm:text-4xl font-oswald font-black uppercase">ПОСЛЕДНИЕ СОБЫТИЯ И НОВОСТИ</h2>
            </div>
            <button 
              onClick={() => onTabChange('news')}
              className="group flex items-center gap-2 text-pubg-orange font-cyber text-xs uppercase tracking-widest border border-pubg-orange/30 px-3.5 py-2 rounded hover:bg-pubg-orange/15 transition-all"
            >
              <span>Показать все новости</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {announcements.slice(0, 1).map((announcement) => (
              <div 
                key={announcement.id}
                onClick={() => onTabChange('news')}
                className="lg:col-span-8 bg-battle-gray border border-gray-800 rounded-lg overflow-hidden group hover:border-pubg-orange/50 transition-all duration-300 cursor-pointer p-6 flex flex-col md:flex-row gap-6"
              >
                {announcement.imageUrl && (
                  <div className="md:w-1/2 h-48 md:h-auto overflow-hidden rounded relative shrink-0">
                    <img 
                      src={announcement.imageUrl} 
                      alt={announcement.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-pubg-orange/20 text-pubg-orange font-cyber border border-pubg-orange/30 px-2 py-0.5 rounded tracking-widest uppercase">
                        {announcement.type}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">{announcement.date}</span>
                    </div>

                    <h3 className="font-oswald text-xl font-bold tracking-wide text-white group-hover:text-pubg-orange transition-colors">
                      {announcement.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-sans line-clamp-3 leading-relaxed">
                      {announcement.content}
                    </p>
                  </div>

                  <span className="text-xs text-pubg-orange font-cyber tracking-widest uppercase inline-flex items-center gap-1 select-none">
                    Читать полностью <ChevronRight className="w-4" />
                  </span>
                </div>
              </div>
            ))}

            <div className="lg:col-span-4 bg-battle-gray border border-gray-800 rounded-lg p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] text-pubg-orange font-cyber tracking-widest block uppercase">// НАБОР В КЛАН</span>
                <h3 className="text-xl font-oswald font-black uppercase text-white">ВСТУПЛЕНИЕ В ОРГАНИЗАЦИЮ</h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  Ищете сильный и сыгранный сквад? Мы регулярно участвуем в престижных турнирах и проводим тренировки. Отправьте анкету в рекрутинге прямо сейчас!
                </p>
              </div>
              <button 
                onClick={() => onTabChange('rules')}
                className="w-full bg-pubg-orange/10 hover:bg-pubg-orange/20 text-pubg-orange border border-pubg-orange/30 py-2 rounded text-xs font-cyber tracking-widest uppercase transition-all"
              >
                Подать заявку
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RULES & RECRUITMENT (ПРАВИЛА И РЕКРУТИНГ) PREVIEW */}
      <section className="py-16 bg-battle-dark border-t border-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="space-y-3">
            <span className="text-xs text-pubg-orange font-cyber tracking-widest uppercase block">// НАБОР В КОМАНДУ ОТКРЫТ</span>
            <h2 className="text-4xl md:text-5xl font-oswald font-black uppercase">ГОТОВ ПРИНЯТЬ ВЫЗОВ?</h2>
            <p className="text-gray-400 font-sans text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Мы ищем командных, активных и верных игроков на киберспортивные турниры и праки. Ознакомься со строгими правилами нашего ордена и подайте электронную анкету на тестирование.
            </p>
          </div>

          <div className="bg-battle-gray border border-gray-800 p-6 rounded-md text-left grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
            <div className="space-y-3">
              <span className="text-xs font-cyber text-pubg-orange tracking-widest uppercase block">УСЛОВИЯ ПРИЕМА:</span>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-300 font-mono">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pubg-orange rounded-full" /> Возраст: от 15 лет включительно</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pubg-orange rounded-full" /> Устройство: Смартфон / Планшет (60FPS+)</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pubg-orange rounded-full" /> Прайм-тайм: 4-6 часов стабильной активности</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pubg-orange rounded-full" /> Обязательно: Наличие Discord и вежливость</li>
              </ul>
            </div>

            <div className="flex flex-col justify-center items-center md:items-end space-y-4">
              <button 
                onClick={() => onTabChange('rules')}
                className="w-full md:w-auto px-6 py-3.5 bg-pubg-orange text-battle-dark font-oswald font-black text-sm tracking-widest uppercase rounded cursor-pointer transform hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
              >
                ЗАПОЛНИТЬ АНКЕТУ ИГРОКА
              </button>
              <button 
                onClick={() => onTabChange('rules')}
                className="text-xs text-gray-400 hover:text-white font-mono tracking-widest uppercase flex items-center gap-1 transition-colors"
              >
                Читать кодекс устава <ChevronRight className="w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
