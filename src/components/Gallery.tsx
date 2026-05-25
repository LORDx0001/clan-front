import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '../types';
import { useClan } from '../context/ClanContext';
import { Play, Eye, Heart, Calendar, Plus, X, Upload, Grid, Video, Camera, Trophy, Sparkles, ArrowLeft } from 'lucide-react';

interface GalleryProps {
  onBack?: () => void;
}

export default function Gallery({ onBack }: GalleryProps) {
  const { gallery: contextGallery } = useClan();
  const [gallery, setGallery] = useState<GalleryItem[]>(contextGallery);

  useEffect(() => {
    setGallery(contextGallery);
  }, [contextGallery]);

  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (selectedItem) {
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
  }, [selectedItem]);

  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'screenshot' | 'trophy'>('all');
  
  // Custom video playback control or simulated clip view count state
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [likedList, setLikedList] = useState<{ [key: string]: boolean }>({});

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const alreadyLiked = likedList[id];
    setLikedList(prev => ({ ...prev, [id]: !alreadyLiked }));
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + (alreadyLiked ? -1 : 1)
    }));
  };

  const filteredGallery = gallery.filter(item => {
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
              АУДИОВИЗУАЛЬНАЯ ЛЕНТА ДОСТИЖЕНИЙ КЛАНА
            </span>
            <h2 className="text-4xl md:text-6xl font-oswald font-black uppercase tracking-tight">
              МЕДИА ИГРОВАЯ <span className="text-pubg-orange">ГАЛЕРЕЯ</span>
            </h2>
            <p className="text-gray-400 font-sans max-w-2xl text-xs sm:text-sm">
              Архив лучших хайлайтов основы, видеоклипов со скримов и скриншотов сквад-побед на турнирах СНГ. Все скриншоты и хайлайты управляются через панель джанго админ.
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div className="flex flex-wrap gap-2">
            {['all', 'video', 'screenshot', 'trophy'].map((tab) => {
              const labels: { [key: string]: string } = {
                all: 'ВСЕ ФАЙЛЫ',
                video: 'КЛИПЫ / ХАЙЛАЙТЫ',
                screenshot: 'СКРИНШОТЫ КВ',
                trophy: 'ПОБЕДНЫЕ КУБКИ'
              };
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 font-oswald text-xs tracking-widest uppercase rounded transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-pubg-orange text-battle-dark font-black'
                      : 'bg-battle-gray hover:bg-battle-light/40 text-gray-400'
                  }`}
                >
                  {tab === 'video' && <Video className="w-3" />}
                  {tab === 'screenshot' && <Camera className="w-3" />}
                  {tab === 'trophy' && <Trophy className="w-3" />}
                  <span>{labels[tab]}</span>
                </button>
              );
            })}
          </div>
        </div>



        {/* Media Grid Cards */}
        {filteredGallery.length === 0 ? (
          <div className="text-center py-16 bg-battle-gray border-2 border-dashed border-gray-800 rounded-lg space-y-3">
            <Camera className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="font-oswald text-xl uppercase text-gray-400">Галерея пуста</h3>
            <p className="text-xs text-gray-500 font-sans max-w-md mx-auto">
              В данном разделе пока нет опубликованных медиа-материалов. Все скриншоты и хайлайты загружаются через панель управления.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredGallery.map((item) => {
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedItem(item)}
                    className="bg-battle-gray border-2 border-gray-800 rounded-lg overflow-hidden cursor-pointer group relative transition-all duration-300"
                  >
                    {/* Thumbnail Cover */}
                    <div className="relative aspect-video overflow-hidden bg-battle-dark/50">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Dark gradient blur block over card bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-battle-gray/95 via-transparent to-transparent opacity-90" />

                      {/* Media Type badge overlays */}
                      <div className="absolute top-2.5 left-2.5 bg-battle-dark/80 border border-white/10 px-2.5 py-1 rounded text-[9px] font-cyber tracking-widest uppercase text-pubg-orange">
                        {item.category}
                      </div>

                      {/* Large glowing play button overlay for video content */}
                      {item.type === 'video' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-pubg-orange/90 text-battle-dark flex items-center justify-center shadow-[0_0_15px_rgba(255,152,0,0.5)] group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-battle-dark translate-x-0.5" />
                        </div>
                      )}
                    </div>

                    {/* Info text section */}
                    <div className="p-3.5 pb-5 space-y-1">
                      <h3 className="font-oswald text-sm font-bold tracking-wide uppercase line-clamp-1 group-hover:text-pubg-orange transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Cinematic Montage Lightbox Modal */}
        <AnimatePresence>
          {selectedItem && (
            <div 
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-24 md:pt-28 pb-10 bg-battle-dark/95 backdrop-blur-md cursor-pointer overflow-y-auto"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-battle-gray border-2 border-pubg-orange/40 text-white w-full max-w-4xl rounded-lg overflow-hidden relative shadow-[0_0_35px_rgba(255,152,0,0.2)] max-h-[85vh] overflow-y-auto cursor-default"
              >
                {/* Gunscope Style UI overlay anchors for cyber-montage look */}
                <div className="absolute top-2.5 left-2.5 z-10 w-4 h-4 border-l border-t border-pubg-orange/60" />
                <div className="absolute top-2.5 right-2.5 z-10 w-4 h-4 border-r border-t border-pubg-orange/60" />
                <div className="absolute bottom-2.5 left-2.5 z-10 w-4 h-4 border-l border-b border-pubg-orange/60" />
                <div className="absolute bottom-2.5 right-2.5 z-10 w-4 h-4 border-r border-b border-pubg-orange/60" />

                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-20 text-gray-400 hover:text-pubg-orange p-1.5 border border-white/10 rounded cursor-pointer transition-colors bg-battle-dark/90"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Media Container Box */}
                <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                  {selectedItem.type === 'video' ? (
                    <video 
                      src={selectedItem.fileUrl} 
                      controls 
                      autoPlay
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img 
                      src={selectedItem.fileUrl} 
                      alt={selectedItem.title} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {/* Scope Tactical Target Crosshairs (only subtle transparent visuals strictly fitting cyber aesthetics) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <div className="w-64 h-64 rounded-full border border-pubg-orange" />
                    <div className="w-0.5 h-12 bg-pubg-orange absolute" />
                    <div className="w-12 h-0.5 bg-pubg-orange absolute" />
                  </div>
                </div>

                <div className="p-5 md:p-6 bg-battle-gray space-y-3 border-t border-gray-800">
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                    <span className="font-cyber text-[10px] text-pubg-orange border border-pubg-orange/30 px-2 py-0.5 rounded">
                      {selectedItem.category.toUpperCase()}
                    </span>
                    {selectedItem.date && <span>ДОБАВЛЕНО: {selectedItem.date}</span>}
                  </div>

                  <h3 className="font-oswald text-xl sm:text-2xl font-black text-white uppercase tracking-wider leading-tight">
                    {selectedItem.title}
                  </h3>

                  {selectedItem.description && (
                    <p className="text-gray-300 font-sans text-xs sm:text-sm max-w-2xl leading-relaxed pt-1">
                      {selectedItem.description}
                    </p>
                  )}

                  {selectedItem.taggedPlayers && selectedItem.taggedPlayers.length > 0 && (
                    <div className="pt-2.5 border-t border-gray-850 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">ОТМЕЧЕННЫЕ УЧАСТНИКИ:</span>
                      {selectedItem.taggedPlayers.map((player: any) => (
                        <span 
                          key={player.id}
                          className="bg-battle-dark border border-white/10 hover:border-pubg-orange text-[10px] text-pubg-orange font-cyber px-2.5 py-0.5 rounded transition-colors"
                        >
                          @{player.nickname}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
