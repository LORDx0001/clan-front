import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Announcement } from '../types';
import { useClan } from '../context/ClanContext';
import { Eye, Clock, Calendar, User, Radio, ArrowRight, Share2, Plus, X, Globe, MessageSquare, ArrowLeft } from 'lucide-react';

interface NewsProps {
  onBack?: () => void;
}

export default function NewsAnnouncements({ onBack }: NewsProps) {
  const { announcements: contextAnnouncements, settings } = useClan();
  const [announcements, setAnnouncements] = useState<Announcement[]>(contextAnnouncements);

  useEffect(() => {
    setAnnouncements(contextAnnouncements);
  }, [contextAnnouncements]);

  const [selectedNews, setSelectedNews] = useState<Announcement | null>(null);

  useEffect(() => {
    if (selectedNews) {
      document.body.classList.add('overflow-hidden');
      document.documentElement.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      document.documentElement.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      document.documentElement.classList.remove('overflow-hidden');
    };
  }, [selectedNews]);

  const [activeTab, setActiveTab] = useState<'all' | 'tournament' | 'scrim' | 'news'>('all');

  // Local timers status map helper
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedCountdowns: { [key: string]: string } = {};
      announcements.forEach((item) => {
        if (item.countdownDate) {
          const distance = new Date(item.countdownDate).getTime() - Date.now();
          if (distance < 0) {
            updatedCountdowns[item.id] = "МАТЧ ОНЛАЙН!";
          } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            updatedCountdowns[item.id] = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
          }
        }
      });
      setCountdowns(updatedCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [announcements]);

  const filteredNews = announcements.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  return (
    <div className="bg-battle-dark min-h-screen py-16 text-white px-2 sm:px-4 md:px-6">
      <div className="max-w-[96%] lg:max-w-[1550px] mx-auto space-y-8">
        
        {onBack && (
          <div className="flex justify-start">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-2 text-[10px] font-cyber tracking-widest text-gray-400 hover:text-pubg-orange bg-battle-gray hover:bg-pubg-orange/10 px-4 py-2 rounded border border-white/5 hover:border-pubg-orange/30 transition-all duration-300 cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>НАЗАД НА ГЛАВНУЮ</span>
            </button>
          </div>
        )}

        {/* Title Hub */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[10px] text-pubg-orange font-cyber tracking-widest uppercase block border-l-2 border-pubg-orange pl-2">
              ИНФОРМАЦИОННЫЙ ЦЕНТР КОНТРОЛЯ
            </span>
            <h2 className="text-4xl md:text-6xl font-oswald font-black uppercase tracking-tight">
              НОВОСТИ И <span className="text-pubg-orange">АНОНСЫ</span>
            </h2>
            <p className="text-gray-400 font-sans max-w-2xl text-xs sm:text-sm">
              Важнейшие вехи из жизни {settings.clanName || 'нашего клана'}. Следите за анонсами тренировочных игр, киберспортивных лиг и зачетами внутриклановых собраний.
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-5">
          {['all', 'tournament', 'scrim', 'news'].map((tab) => {
            const labels: { [key: string]: string } = {
              all: 'ВСЕ СВОДКИ',
              tournament: 'ТУРНИРЫ',
              scrim: 'СКРИМЫ И КВ',
              news: 'НОВОСТИ И ЖИЗНЬ'
            };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 font-oswald text-xs tracking-widest uppercase rounded transition-all ${
                  isActive
                    ? 'bg-pubg-orange text-battle-dark font-black'
                    : 'bg-battle-gray hover:bg-battle-light/40 text-gray-400 font-medium'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>



        {/* News Feed Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-battle-gray border-2 border-dashed border-gray-800 rounded-lg space-y-3">
            <Radio className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="font-oswald text-xl uppercase text-gray-400">Сводки отсутствуют</h3>
            <p className="text-xs text-gray-500 font-sans max-w-md mx-auto">
              В данном разделе пока нет активных новостей или анонсов. Все публикации настраиваются в панели администратора.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredNews.map((item) => {
                const categoryColors = {
                  tournament: 'bg-cyber-yellow text-battle-dark',
                  scrim: 'bg-pubg-orange text-battle-dark',
                  news: 'bg-cyan-500 text-battle-dark'
                };

                const categoryLabels = {
                  tournament: 'ЧЕМПИОНАТ',
                  scrim: 'ПРАК / КВ',
                  news: 'НОВОСТИ'
                };

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -4 }}
                    className="bg-battle-gray border border-gray-800 rounded-lg overflow-hidden flex flex-col justify-between group transition-all duration-300"
                  >
                    {/* News Image Block */}
                    {item.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute top-3 left-3 z-10">
                          <span className={`font-cyber text-[10px] font-black tracking-widest px-2.5 py-1 uppercase rounded ${categoryColors[item.type]}`}>
                            {categoryLabels[item.type]}
                          </span>
                        </div>
                        {item.imageUrl?.toLowerCase().match(/\.(mp4|mov|webm)/) || item.imageUrl?.toLowerCase().includes('mp4') ? (
                          <video 
                            src={item.imageUrl} 
                            autoPlay loop muted playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-battle-gray via-transparent to-transparent opacity-80" />
                      </div>
                    )}

                    {/* Body Text Info */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5" /> {item.date}</span>
                          <span className="flex items-center gap-1"><User className="w-3.5" /> BY {item.author.split(' ')[0]}</span>
                        </div>

                        <h3 className="font-oswald text-lg font-bold leading-tight uppercase group-hover:text-pubg-orange transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-400 font-sans line-clamp-3 leading-relaxed">
                          {item.content}
                        </p>
                      </div>

                      {/* Countdown Timer Widget for match tension */}
                      {item.countdownDate && countdowns[item.id] && (
                        <div className="bg-battle-dark/80 border border-pubg-orange/30 p-3 rounded flex items-center justify-between mt-4">
                          <div className="flex items-center gap-1.5">
                            <Radio className="w-4 h-4 text-cyber-red animate-pulse" />
                            <span className="text-[10px] text-gray-400 font-cyber font-medium tracking-tight">ДО ЗАМЕСА:</span>
                          </div>
                          <span className="text-sm font-cyber font-black text-pubg-orange tracking-widest bg-pubg-orange/5 px-2 py-0.5 rounded">
                            {countdowns[item.id]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer Stats summary bar */}
                    <div className="border-t border-gray-800/80 px-5 py-3.5 bg-battle-dark/40 flex items-center justify-between text-xs text-gray-500 font-mono">
                      <span className="flex items-center gap-1"><Eye className="w-4 text-gray-600" /> {item.views} КЛИКОВ</span>
                      <button 
                        onClick={() => setSelectedNews(item)}
                        className="text-pubg-orange hover:text-white transition-colors flex items-center gap-0.5 group/btn"
                      >
                        ЧИТАТЬ СВОДКУ <ArrowRight className="w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Read News Full Expanded Lightbox Dialogue */}
        <AnimatePresence>
          {selectedNews && (
            <div 
              onClick={() => setSelectedNews(null)}
              className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-24 md:pt-28 pb-10 bg-battle-dark/95 backdrop-blur-md cursor-pointer overflow-y-auto"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-battle-gray border-2 border-pubg-orange/40 text-white w-full max-w-3xl rounded-lg overflow-hidden relative shadow-[0_0_30px_rgba(255,152,0,0.15)] max-h-[85vh] overflow-y-auto cursor-default"
              >
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white p-2 border border-white/10 rounded cursor-pointer transition-colors bg-battle-dark/80"
                >
                  <X className="w-5" />
                </button>

                {selectedNews.imageUrl && (
                  <div className="relative h-64 sm:h-80">
                    {selectedNews.imageUrl?.toLowerCase().match(/\.(mp4|mov|webm)/) || selectedNews.imageUrl?.toLowerCase().includes('mp4') ? (
                      <video 
                        src={selectedNews.imageUrl} 
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={selectedNews.imageUrl} 
                        alt={selectedNews.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-battle-gray via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <span className="font-cyber text-[10px] bg-pubg-orange text-battle-dark px-3 py-1 uppercase rounded font-bold tracking-widest">
                        {selectedNews.type}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 md:p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Опубликовано: {selectedNews.date}</span>
                    <span className="flex items-center gap-1"><User className="w-4 h-4" />Автор статьи: {selectedNews.author}</span>
                  </div>

                  <h3 className="font-oswald text-2xl sm:text-3xl font-black text-white uppercase leading-tight tracking-wider">
                    {selectedNews.title}
                  </h3>

                  <p className="text-xs sm:text-sm md:text-base text-gray-300 font-sans leading-relaxed whitespace-pre-wrap">
                    {selectedNews.content}
                  </p>

                  <div className="border-t border-gray-800 pt-4 flex flex-wrap items-center justify-between text-xs font-mono text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="bg-battle-dark px-3 py-1 rounded border border-white/5 font-cyber tracking-widest text-[9px] uppercase flex items-center gap-1">
                        <Globe className="w-3 text-cyan-400" /> РЕСУРС: CIS LEAGUE
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`[VTX NEWS] ${selectedNews.title} - Ссылка: ${window.location.href}`);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="text-pubg-orange hover:text-white font-cyber tracking-widest text-[10px] flex items-center gap-1 transition-colors"
                    >
                      <Share2 className="w-3.5" /> {copiedLink ? "СКОПИРОВАНО!" : "СКОПИРОВАТЬ ССЫЛКУ СТАТЬИ"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
