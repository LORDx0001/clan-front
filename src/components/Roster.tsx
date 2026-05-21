import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../types';
import { useClan } from '../context/ClanContext';
import { Shield, Sparkles, User, Crosshair, Award, Smartphone, Check, UserPlus, Trash, ChevronRight, Image } from 'lucide-react';

export default function Roster() {
  const { players: contextPlayers, settings, gallery } = useClan();
  const [players, setPlayers] = useState<Player[]>(contextPlayers);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (contextPlayers) {
      setPlayers(contextPlayers);
    }
  }, [contextPlayers]);

  useEffect(() => {
    if (selectedPlayer) {
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
  }, [selectedPlayer]);

  // Extract unique roles dynamically from the actual players loaded from DB!
  const uniqueRoles = Array.from(new Set(players.map(p => p.role).filter(Boolean)));

  const filteredPlayers = players.filter(player => {
    if (activeFilter === 'All') return true;
    return player.role === activeFilter;
  });

  return (
    <div className="bg-battle-dark min-h-screen py-10 text-white px-2 sm:px-4 md:px-6">
      <div className="max-w-[96%] lg:max-w-[1550px] mx-auto space-y-12">
        
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
              const roleColors = {
                'Leader': 'border-cyber-yellow text-cyber-yellow',
                'Assaulter': 'border-cyber-red text-cyber-red',
                'Sniper': 'border-cyan-400 text-cyan-400',
                'Scout': 'border-purple-400 text-purple-400',
                'Support': 'border-cyber-green text-cyber-green',
                'Manager': 'border-pink-400 text-pink-400'
              };

              return (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.15)' }}
                  onClick={() => setSelectedPlayer(player)}
                  className="bg-battle-gray border-2 border-gray-800 rounded-lg cursor-pointer relative group transition-all duration-300 overflow-hidden"
                >
                  {/* Real Game Profile Screenshot Banner */}
                  <div className="relative h-48 w-full overflow-hidden border-b border-gray-800">
                    <img 
                      src={player.avatar} 
                      alt={`${player.nickname} Game Screenshot`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-battle-gray via-transparent to-black/25" />
                    <span className="absolute bottom-2.5 left-3.5 bg-black/75 border border-pubg-orange/30 text-[9px] px-2 py-0.5 font-mono text-pubg-orange font-bold uppercase tracking-wider rounded">
                      СКРИНШОТ ПРОФИЛЯ
                    </span>
                    <span className="absolute top-3 right-3 bg-pubg-orange text-battle-dark text-[10px] px-2 py-0.5 font-mono font-bold rounded">
                      Lv.{player.level}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-oswald text-xl font-bold tracking-wider text-white group-hover:text-pubg-orange transition-colors">
                          {player.nickname}
                        </h3>
                        <span className={`text-[10px] font-cyber tracking-widest uppercase border px-2 py-0.5 rounded inline-block mt-1 ${roleColors[player.role]}`}>
                          {player.role}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 text-sm border-t border-gray-850 pt-3">
                      <div className="flex justify-between text-xs text-gray-400 font-sans">
                        <span className="flex items-center gap-1 font-mono uppercase text-[10px]"><Smartphone className="w-3" /> УСТРОЙСТВО</span>
                        <strong className="text-white">{player.device}</strong>
                      </div>

                      <div className="flex justify-between text-xs text-gray-400 font-sans">
                        <span className="flex items-center gap-1 font-mono uppercase text-[10px]"><Crosshair className="w-3" /> ОРУЖИЕ</span>
                        <strong className="text-white">{player.signatureWeapon}</strong>
                      </div>
                    </div>

                    {/* Achievements Preview */}
                    {player.achievements.length > 0 && (
                      <div className="bg-battle-dark/50 border border-white/5 rounded p-2.5">
                        <div className="text-[9px] text-pubg-orange font-cyber tracking-widest uppercase mb-1 flex items-center gap-1">
                          <Award className="w-3 h-3 text-pubg-orange" /> ГЛАВНЫЙ ОПЫТ
                        </div>
                        <p className="text-xs text-gray-300 font-sans line-clamp-1 italic">
                          "{player.achievements[0]}"
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 text-[10px] text-gray-500 font-mono uppercase border-t border-gray-850 pt-2.5">
                      <span>{player.region}</span>
                      <span className="text-pubg-orange hover:text-white transition-colors flex items-center gap-0.5">
                        ПОДРОБНЕЕ <ChevronRight className="w-3" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Detailed Stats Lightbox Modal of Selected Player */}
        <AnimatePresence>
          {selectedPlayer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-battle-dark/95 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="bg-battle-gray border-2 border-pubg-orange text-white w-full max-w-3xl rounded-lg overflow-hidden relative max-h-[92vh] overflow-y-auto"
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
                  {/* Left Column - screenshot showcase */}
                  <div className="md:col-span-7 relative h-64 md:h-auto min-h-[300px] border-b md:border-b-0 md:border-r border-gray-800 bg-black flex items-center justify-center">
                    {(() => {
                      const mediaUrl = selectedPlayer.profileMedia || selectedPlayer.avatar;
                      const isVideo = mediaUrl?.toLowerCase().match(/\.(mp4|mov|webm)/) || mediaUrl?.toLowerCase().includes('mp4');
                      if (isVideo) {
                        return (
                          <video 
                            src={mediaUrl} 
                            autoPlay loop controls
                            className="w-full h-full object-cover"
                          />
                        );
                      }
                      return (
                        <img 
                          src={mediaUrl} 
                          alt={`${selectedPlayer.nickname} Full Game Profile`} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
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
                        <div className="flex gap-2 items-center mt-2">
                          <span className="bg-pubg-orange/20 px-2.5 py-1 text-[10px] text-pubg-orange font-cyber rounded tracking-widest uppercase border border-pubg-orange/30">
                            {selectedPlayer.role}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">Level {selectedPlayer.level}</span>
                        </div>
                      </div>

                      <h4 className="font-cyber text-xs text-pubg-orange tracking-widest border-b border-gray-800 pb-1.5 uppercase">
                        ✓ ХАРАКТЕРИСТИКИ КИБЕРСПОРТСМЕНА
                      </h4>

                      <div className="space-y-3 pt-1">
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
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
