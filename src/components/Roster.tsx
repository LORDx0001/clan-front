import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../types';
import { useClan } from '../context/ClanContext';
import { Shield, Sparkles, User, Crosshair, Award, Smartphone, Check, UserPlus, Trash, ChevronRight, ChevronLeft, Image, ArrowLeft } from 'lucide-react';

interface RosterProps {
  onBack?: () => void;
}

export default function Roster({ onBack }: RosterProps) {
  const { players: contextPlayers, settings, gallery, roles } = useClan();
  const [players, setPlayers] = useState<Player[]>(contextPlayers);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeModalMedia, setActiveModalMedia] = useState<string | null>(null);

  useEffect(() => {
    if (contextPlayers) {
      setPlayers(contextPlayers);
    }
  }, [contextPlayers]);

  useEffect(() => {
    if (selectedPlayer) {
      setActiveModalMedia(selectedPlayer.profileMedia || selectedPlayer.avatar);
      document.body.classList.add('overflow-hidden');
    } else {
      setActiveModalMedia(null);
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedPlayer]);

  // Gather all unique media files (avatar, profile media, and tagged gallery photos/videos)
  const getPlayerMediaFiles = (player: Player) => {
    const playerHighlights = (gallery || []).filter(item => 
      item.taggedPlayers?.some((p: any) => String(p.id) === String(player.id) || p.nickname === player.nickname)
    );
    const files = [
      ...(player.profileMedia ? [player.profileMedia] : []),
      player.avatar,
      ...(player.additionalMedia || []),
      ...playerHighlights.map(item => item.fileUrl)
    ];
    return Array.from(new Set(files)).filter(Boolean);
  };

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

  // Dynamic roles loaded from the backend PlayerRole model
  const uniqueRoles = (roles || []).map(r => r.name);

  const filteredPlayers = players.filter(player => {
    if (activeFilter === 'All') return true;
    return player.role === activeFilter;
  });

  return (
    <div className="bg-battle-dark min-h-screen py-10 text-white px-2 sm:px-4 md:px-6">
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
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-pubg-orange/15 px-3 py-1 rounded text-xs font-cyber tracking-widest text-pubg-orange uppercase">
            ВЕРШИНА ТАБЛИЦЫ ЛИДЕРОВ
          </div>
          <h2 className="text-4xl md:text-6xl font-oswald font-black uppercase tracking-tight">
            ОФИЦИАЛЬНЫЙ СОСТАВ <span className="text-pubg-orange">{settings.clanName || "КЛАНА"}</span>
          </h2>
          <p className="text-gray-400 font-sans max-w-2xl mx-auto text-sm sm:text-base">
            Действующие киберспортсмены и стримеры нашей организации. Каждое имя прошло сито суровейшего отбора и доказало право носить префикс {settings.clanTag || settings.clanName?.substring(0, 5) || "Клана"}.
          </p>
        </div>

        {/* Filter Navigation Menu */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('All')}
              className={`px-4 py-2 font-oswald text-xs tracking-widest uppercase transition-all rounded ${
                activeFilter === 'All'
                  ? 'bg-pubg-orange text-battle-dark font-black shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-battle-gray text-gray-400 hover:text-white hover:bg-battle-light/40 border border-white/5'
              }`}
            >
              Все
            </button>
            {uniqueRoles.map((role) => {
              const isActive = activeFilter === role;
              return (
                <button
                  key={role}
                  onClick={() => setActiveFilter(role)}
                  className={`px-4 py-2 font-oswald text-xs tracking-widest uppercase transition-all rounded ${
                    isActive
                      ? 'bg-pubg-orange text-battle-dark font-black shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                      : 'bg-battle-gray text-gray-400 hover:text-white hover:bg-battle-light/40 border border-white/5'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Players Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPlayers.map((player) => {
              return (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.15)' }}
                  onClick={() => setSelectedPlayer(player)}
                  className="bg-battle-gray border border-gray-800 rounded-lg cursor-pointer relative group transition-all duration-300 overflow-hidden aspect-[3/4]"
                >
                  {/* Portrait photo backdrop */}
                  <img 
                    src={player.avatar} 
                    alt={`${player.nickname}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle dark gradient overlay at the bottom half */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent transition-opacity duration-300" />
                  
                  {/* Clan Rank Badge in top left corner */}
                  {player.clanRole && (
                    <div className="absolute top-3 left-3 z-10">
                      {getClanRoleBadge(player.clanRole, player.clanRoleDisplay)}
                    </div>
                  )}

                  {/* Level Badge in top right corner */}
                  <span className="absolute top-3 right-3 bg-pubg-orange/80 backdrop-blur-md text-battle-dark text-[10px] px-2 py-0.5 font-mono font-bold rounded z-10">
                    Lv.{player.level}
                  </span>

                  {/* Left bottom corner info overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
                    <h3 className="font-oswald text-2xl font-black uppercase tracking-wider text-white group-hover:text-pubg-orange transition-colors drop-shadow-md">
                      {player.nickname}
                    </h3>
                    {player.achievements && player.achievements.length > 0 && player.achievements[0] && (
                      <p className="text-xs text-gray-300 font-sans line-clamp-2 leading-relaxed drop-shadow-sm">
                        {player.achievements[0]}
                      </p>
                    )}
                    <span className="text-[9px] font-cyber tracking-widest text-pubg-orange uppercase block pt-1">
                      // {player.role}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Detailed Stats Lightbox Modal of Selected Player */}
        <AnimatePresence>
          {selectedPlayer && (
            <div 
              onClick={() => setSelectedPlayer(null)}
              className="fixed inset-0 z-[150] bg-battle-dark/95 backdrop-blur-md overflow-y-auto scroll-smooth cursor-pointer"
            >
              <div className="flex items-start justify-center min-h-screen py-8 px-2 sm:px-4">
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  className="bg-battle-gray border-2 border-pubg-orange text-white w-full max-w-3xl rounded-lg overflow-hidden relative cursor-default my-auto"
                >
                {/* Tactical glowing corner designs */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-pubg-orange z-10" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-pubg-orange z-10" />

                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="absolute top-4 right-4 text-white hover:text-pubg-orange bg-black/60 backdrop-blur-md font-bold border border-white/20 p-2 rounded z-20 cursor-pointer text-xs"
                >
                  ЗАКРЫТЬ [ESC]
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12">
                  {/* Left Column - media showcase & interactive gallery carousel */}
                  <div className="md:col-span-7 border-b md:border-b-0 md:border-r border-gray-800 bg-black/40 flex flex-col justify-between p-4 space-y-4">
                    <div className="relative h-64 sm:h-80 w-full bg-black rounded-lg overflow-hidden border border-white/5 flex items-center justify-center group">
                      {(() => {
                        const mediaUrl = activeModalMedia || selectedPlayer.profileMedia || selectedPlayer.avatar;
                        const isVideo = mediaUrl?.toLowerCase().match(/\.(mp4|mov|webm)/) || mediaUrl?.toLowerCase().includes('mp4');
                        if (isVideo) {
                          return (
                            <video 
                              key={mediaUrl}
                              src={mediaUrl} 
                              autoPlay loop controls
                              className="w-full h-full object-contain"
                            />
                          );
                        }
                        return (
                          <img 
                            key={mediaUrl}
                            src={mediaUrl} 
                            alt={`${selectedPlayer.nickname} Showcase`} 
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        );
                      })()}

                      {/* Left and Right navigation arrows */}
                      {(() => {
                        const allFiles = getPlayerMediaFiles(selectedPlayer);
                        if (allFiles.length <= 1) return null;
                        
                        const currentIndex = allFiles.indexOf(activeModalMedia || '');
                        
                        return (
                          <>
                            {/* Left Arrow Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const prevIndex = (currentIndex - 1 + allFiles.length) % allFiles.length;
                                setActiveModalMedia(allFiles[prevIndex]);
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-pubg-orange text-white hover:text-black border border-white/20 p-2 rounded-full z-20 cursor-pointer transition-all active:scale-90"
                              title="Предыдущее медиа"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Right Arrow Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextIndex = (currentIndex + 1) % allFiles.length;
                                setActiveModalMedia(allFiles[nextIndex]);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-pubg-orange text-white hover:text-black border border-white/20 p-2 rounded-full z-20 cursor-pointer transition-all active:scale-90"
                              title="Следующее медиа"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Dynamic page indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-gray-300 font-mono tracking-widest border border-white/10 select-none">
                              {currentIndex !== -1 ? currentIndex + 1 : 1} / {allFiles.length}
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Horizontal slider of other media files */}
                    {(() => {
                      const allFiles = getPlayerMediaFiles(selectedPlayer);
                      if (allFiles.length <= 1) return null;
                      return (
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">
                            МЕДИАТЕКА ИГРОКА ({allFiles.length} ФАЙЛОВ)
                          </span>
                          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-pubg-orange">
                            {allFiles.map((fileUrl, index) => {
                              const isActive = activeModalMedia === fileUrl;
                              const isVid = fileUrl.toLowerCase().match(/\.(mp4|mov|webm)/) || fileUrl.toLowerCase().includes('mp4');
                              return (
                                <button
                                  key={index}
                                  onClick={() => setActiveModalMedia(fileUrl)}
                                  className={`relative w-20 h-16 rounded overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                                    isActive ? 'border-pubg-orange scale-95 shadow-[0_0_10px_rgba(255,152,0,0.5)]' : 'border-gray-800 opacity-60 hover:opacity-100'
                                  }`}
                                >
                                  {isVid ? (
                                    <div className="w-full h-full bg-battle-gray flex items-center justify-center relative">
                                      <video src={fileUrl} className="w-full h-full object-cover pointer-events-none" />
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-[8px] bg-pubg-orange text-battle-dark px-1 py-0.5 rounded font-cyber font-bold">VIDEO</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <img src={fileUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right Column - specs list */}
                  <div className="md:col-span-5 p-6 space-y-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-oswald text-3xl font-black text-white tracking-widest">
                          {selectedPlayer.nickname}
                        </h3>
                        <div className="flex gap-2 items-center mt-2 flex-wrap">
                          <span className="bg-pubg-orange/20 px-2.5 py-1 text-[10px] text-pubg-orange font-cyber rounded tracking-widest uppercase border border-pubg-orange/30">
                            {selectedPlayer.role}
                          </span>
                          {selectedPlayer.clanRole && (
                            getClanRoleBadge(selectedPlayer.clanRole, selectedPlayer.clanRoleDisplay)
                          )}
                          <span className="text-xs text-gray-400 font-mono">Level {selectedPlayer.level}</span>
                        </div>
                      </div>

                      <h4 className="font-cyber text-xs text-pubg-orange tracking-widest border-b border-gray-800 pb-1.5 uppercase">
                        ✓ ХАРАКТЕРИСТИКИ КИБЕРСПОРТСМЕНА
                      </h4>

                      <div className="space-y-3 pt-1">
                        {selectedPlayer.uid && (
                          <div className="bg-battle-dark/40 border border-white/5 p-3 rounded flex items-center justify-between">
                            <span className="text-xs text-gray-400 font-mono uppercase">ИГРОВОЙ UID</span>
                            <span className="text-xs text-white font-cyber font-semibold tracking-wider">{selectedPlayer.uid}</span>
                          </div>
                        )}
                        <div className="bg-battle-dark/40 border border-white/5 p-3 rounded flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-mono uppercase">ОСНОВНОЙ ДЕВАЙС</span>
                          <span className="text-xs text-white font-cyber font-semibold">{selectedPlayer.device}</span>
                        </div>
                        <div className="bg-battle-dark/40 border border-white/5 p-3 rounded flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-mono uppercase">КОРОННОЕ ОРУЖИЕ</span>
                          <span className="text-xs text-white font-cyber font-semibold">{selectedPlayer.signatureWeapon}</span>
                        </div>
                        <div className="bg-battle-dark/40 border border-white/5 p-3 rounded flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-mono uppercase">РЕГИОН</span>
                          <span className="text-xs text-white font-cyber font-semibold">{selectedPlayer.region}</span>
                        </div>
                      </div>

                      {/* Optional Player Biography Description */}
                      {selectedPlayer.description && (
                        <div className="space-y-1.5 pt-1">
                          <h4 className="text-xs text-gray-400 font-mono uppercase">БИОГРАФИЯ / ОПИСАНИЕ:</h4>
                          <div className="bg-battle-dark/50 border border-white/5 p-3 rounded text-xs text-gray-300 font-mono leading-relaxed max-h-[100px] overflow-y-auto whitespace-pre-wrap">
                            {selectedPlayer.description}
                          </div>
                        </div>
                      )}

                      {/* List of achievements */}
                      <div className="space-y-2 pt-1">
                        <h4 className="text-xs text-gray-400 font-mono uppercase">ЛИСТ НАГРАД И ОТЛИЧИЙ:</h4>
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                          {selectedPlayer.achievements.map((achievement, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-pubg-orange/5 p-2 rounded border border-pubg-orange/10 text-xs text-gray-200">
                              <Sparkles className="w-3.5 h-3.5 text-pubg-orange shrink-0" />
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 pt-3 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                      <span>ВСТУПЛЕНИЕ: {selectedPlayer.joinedDate}</span>
                      <span>ID CARD #{selectedPlayer.id}</span>
                    </div>
                  </div>
                </div>

                {/* Tagged Highlights of this player */}
                {(() => {
                  const playerHighlights = (gallery || []).filter(item => 
                    item.taggedPlayers?.some((p: any) => String(p.id) === String(selectedPlayer.id) || p.nickname === selectedPlayer.nickname)
                  );
                  if (playerHighlights.length === 0) return null;
                  return (
                    <div className="p-6 border-t border-gray-800 space-y-4 bg-battle-dark/55">
                      <h4 className="font-oswald text-lg font-bold tracking-widest text-pubg-orange uppercase flex items-center gap-2">
                        <Image className="w-5 h-5 text-pubg-orange" /> МЕДИЙНЫЕ ХАЙЛАЙТЫ ИГРОКА ({playerHighlights.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {playerHighlights.map(item => (
                          <div key={item.id} className="relative group border border-gray-800 rounded overflow-hidden aspect-video bg-black">
                            <img
                              src={item.thumbnail || item.fileUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-left">
                              <p className="text-[9px] text-pubg-orange font-bold uppercase tracking-wider">{item.category}</p>
                              <p className="text-[10px] text-white font-sans truncate font-semibold mt-0.5">{item.title}</p>
                              {item.description && (
                                <p className="text-[9px] text-gray-400 font-sans line-clamp-1 mt-0.5">{item.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

              </motion.div>
            </div>
          </div>
        )}
        </AnimatePresence>

      </div>
    </div>
  );
}
