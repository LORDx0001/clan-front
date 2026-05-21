import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScheduleEvent } from '../types';
import { useClan } from '../context/ClanContext';
import { Calendar, Clock, Trophy, MapPin, Users, Heart, AlertTriangle, Play, HelpCircle, BellRing, Check, Plus, Trash } from 'lucide-react';

export default function Schedule() {
  const { schedule, settings } = useClan();
  const [events, setEvents] = useState<ScheduleEvent[]>(schedule);

  useEffect(() => {
    setEvents(schedule);
  }, [schedule]);
  const [reminders, setReminders] = useState<{ [key: string]: boolean }>({});
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});

  // Dynamic add event drawer rules
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'scrim' | 'training' | 'tournament' | 'meeting'>('scrim');
  const [newTime, setNewTime] = useState('');
  const [newSize, setNewSize] = useState('4x4 Squad');
  const [opponent, setOpponent] = useState('');
  const [prize, setPrize] = useState('');

  // Ticking timers
  useEffect(() => {
    const handler = setInterval(() => {
      const datesObj: { [key: string]: string } = {};
      events.forEach((ev) => {
        const diff = new Date(ev.datetime).getTime() - Date.now();
        if (diff < 0) {
          datesObj[ev.id] = "ИДЕТ ТРАНСЛЯЦИЯ";
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          
          if (hours > 24) {
            datesObj[ev.id] = `${Math.floor(hours / 24)}д ${hours % 24}ч ${mins}м`;
          } else {
            datesObj[ev.id] = `${hours}ч ${mins}м ${secs}с`;
          }
        }
      });
      setCountdowns(datesObj);
    }, 1000);

    return () => clearInterval(handler);
  }, [events]);

  const toggleReminder = (id: string) => {
    setReminders(prev => {
      const active = !prev[id];
      if (active) {
        // Simple Audio visual confirm sound
        try {
          const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, actx.currentTime);
          osc.frequency.setValueAtTime(1040, actx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.05, actx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(actx.destination);
          osc.start();
          osc.stop(actx.currentTime + 0.15);
        } catch (e) {}
      }
      return { ...prev, [id]: active };
    });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTime) return;

    const added: ScheduleEvent = {
      id: Date.now().toString(),
      title: newTitle.toUpperCase(),
      type: newType,
      datetime: new Date(newTime).toISOString(),
      teamSize: newSize,
      slotsFilled: 0,
      slotsTotal: newType === 'scrim' ? 18 : newType === 'tournament' ? 16 : 4,
      opponent: opponent || undefined,
      prizePool: prize || undefined
    };

    setEvents([...events, added]);
    setShowAddEvent(false);
    setNewTitle('');
    setNewType('scrim');
    setNewTime('');
    setNewSize('4x4 Squad');
    setOpponent('');
    setPrize('');
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleBookSlot = (id: string) => {
    setEvents(events.map(ev => {
      if (ev.id === id && ev.slotsFilled < ev.slotsTotal) {
        return { ...ev, slotsFilled: ev.slotsFilled + 1 };
      }
      return ev;
    }));
  };

  return (
    <div className="bg-battle-dark min-h-screen py-16 text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Title Hub */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[10px] text-pubg-orange font-cyber tracking-widest uppercase block border-l-2 border-pubg-orange pl-2">
              ПЛАН СЕТКИ ТРЕНИРОВОК И ЧЕМПИОНАТОВ
            </span>
            <h2 className="text-4xl md:text-6xl font-oswald font-black uppercase tracking-tight">
              КАЛЕНДАРЬ И <span className="text-pubg-orange">РАСПИСАНИЕ</span>
            </h2>
            <p className="text-gray-400 font-sans max-w-2xl text-xs sm:text-sm">
              Подробный график боевой подготовки {settings.clanName || 'нашего клана'}. Следите за временем праков (Scrims) и болейте за наши составы на официальных квалификациях PMGC и CIS Cup.
            </p>
          </div>

          <button
            onClick={() => setShowAddEvent(!showAddEvent)}
            className="bg-battle-light hover:bg-pubg-orange/25 border border-pubg-orange/30 px-5 py-3 rounded text-xs font-cyber tracking-widest text-pubg-orange transition-all uppercase block shrink-0"
          >
            {showAddEvent ? 'СКРЫТЬ ДОБАВЛЕНИЕ' : 'ЗАПЛАНИРОВАТЬ ПРАК/ТУРНИР'}
          </button>
        </div>

        {/* Create Schedule Admin Panel Drawer */}
        <AnimatePresence>
          {showAddEvent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-battle-gray border-2 border-pubg-orange/40 rounded p-6 overflow-hidden max-w-2xl mx-auto"
            >
              <form onSubmit={handleAddEvent} className="space-y-4">
                <h3 className="text-sm font-cyber font-bold text-pubg-orange uppercase">
                  ✓ КОМАНДНАЯ СЕТКА ШЕДУЛЕРА АДМИНА
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Гейм-название прака/турнира</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-oswald tracking-wide focus:border-pubg-orange focus:outline-hidden text-sm"
                      placeholder="Например: VORTEX VS CYBER CHAMPIONSHIP"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Тип события</label>
                    <select
                      value={newType}
                      onChange={(e: any) => setNewType(e.target.value)}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-sans focus:border-pubg-orange focus:outline-hidden text-sm"
                    >
                      <option value="scrim">Прак / Скрим матч</option>
                      <option value="tournament">Официальный Турнир</option>
                      <option value="training">Тактическое Занятие (Треня)</option>
                      <option value="meeting">Собрание в Discord</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Дата и Время</label>
                    <input
                      type="datetime-local"
                      required
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-mono focus:border-pubg-orange focus:outline-hidden text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Формат зачистки (Лобби)</label>
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-mono focus:border-pubg-orange focus:outline-hidden text-sm"
                      placeholder="4x4 Squad / 2x2 Duo / Solo custom"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Соперники или Клан-Тэги</label>
                    <input
                      type="text"
                      value={opponent}
                      onChange={(e) => setOpponent(e.target.value)}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-sans focus:border-pubg-orange focus:outline-hidden text-sm"
                      placeholder="Например: Top-15 СНГ Кланы "
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-mono uppercase mb-1">Призовой фонд (если есть)</label>
                    <input
                      type="text"
                      value={prize}
                      onChange={(e) => setPrize(e.target.value)}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-sans focus:border-pubg-orange focus:outline-hidden text-sm"
                      placeholder="Например: 15,000 руб / 50$ US"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 text-right pt-2 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="bg-transparent hover:bg-white/5 border border-white/20 px-4 py-2 rounded text-xs text-gray-400 uppercase font-oswald"
                  >
                    Отменить
                  </button>
                  <button
                    type="submit"
                    className="bg-pubg-orange text-battle-dark px-6 py-2 rounded text-xs font-oswald font-black uppercase tracking-widest transition-all"
                  >
                    Зарезервировать слот
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Schedule Event Timeline Layout */}
        <div className="space-y-4">
          <AnimatePresence>
            {events.length === 0 ? (
              <div className="text-center py-16 bg-battle-gray border-2 border-dashed border-gray-800 rounded-lg space-y-3">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto" />
                <h3 className="font-oswald text-xl uppercase text-gray-400">Нет запланированных матчей</h3>
                <p className="text-xs text-gray-500 font-sans max-w-md mx-auto">
                  На данный момент в расписании нет активных праков или квалификационных встреч. Все события планируются через панель управления.
                </p>
              </div>
            ) : (
              events.map((event) => {
                const typesData: Record<string, { label: string, color: string }> = {
                  scrim: { label: 'СКРИМ • КЛАНВАР', color: 'border-pubg-orange text-pubg-orange bg-pubg-orange/10' },
                  tournament: { label: 'ТУРНИРНЫЙ ОФИЦИАЛ', color: 'border-cyber-yellow text-cyber-yellow bg-cyber-yellow/10 animate-pulse' },
                  training: { label: 'ТРЕНИРОВКА ТАКТИКИ', color: 'border-cyber-green text-cyber-green bg-cyber-green/10' },
                  meeting: { label: 'МИДБРИФ Discord', color: 'border-cyber-blue text-cyber-blue bg-cyber-blue/10' }
                };

                const typeInfo = typesData[event.type] || { label: (event.type || 'СОБЫТИЕ').toUpperCase(), color: 'border-gray-500 text-gray-500 bg-gray-500/10' };

                const remActive = reminders[event.id];

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="bg-battle-gray border-2 border-gray-800 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-pubg-orange/30 group transition-all duration-300"
                  >
                    
                    {/* Left Column: Date & Type indicators */}
                    <div className="flex items-start sm:items-center gap-4 w-full md:w-auto">
                      {/* Big Visual Calendar Frame design */}
                      <div className="bg-battle-dark border-2 border-gray-700 rounded p-2.5 text-center min-w-[70px] shrink-0">
                        <Calendar className="w-5 h-5 mx-auto text-pubg-orange mb-1" />
                        <span className="text-xs text-gray-400 font-mono block uppercase">
                          {new Date(event.datetime).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] font-cyber tracking-widest px-2 py-0.5 rounded border ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">{event.teamSize}</span>
                        </div>
                        <h3 className="font-oswald text-lg sm:text-xl font-bold tracking-wider text-white group-hover:text-pubg-orange transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-mono"><Clock className="w-3.5" /> СТАPT: {new Date(event.datetime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}</span>
                          {event.opponent && <span className="flex items-center gap-1 font-sans text-xs text-gray-400">• Соперник: <strong className="text-white font-semibold">{event.opponent}</strong></span>}
                        </div>
                      </div>
                    </div>

                    {/* Middle Column: Live Status & Countdown & Arena Details */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto">
                      
                      {event.prizePool && (
                        <div className="bg-cyber-yellow/10 border border-cyber-yellow/30 px-3 py-1.5 rounded">
                          <span className="text-[10px] text-cyber-yellow font-cyber block tracking-wider uppercase">Призовой фонд</span>
                          <strong className="text-xs sm:text-sm font-oswald text-white uppercase tracking-tight">{event.prizePool}</strong>
                        </div>
                      )}

                      {/* Interactive Slots visual filling indicator */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                          <span>ЛОББИ СЛОТЫ:</span>
                          <span className="text-white font-bold">{event.slotsFilled} / {event.slotsTotal}</span>
                        </div>
                        <div className="w-32 h-1.5 bg-battle-dark rounded overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-pubg-orange to-yellow-500" 
                            style={{ width: `${(event.slotsFilled / event.slotsTotal) * 100}%` }} 
                          />
                        </div>
                      </div>

                      {/* Dynamic counting ticker */}
                      <div className="bg-battle-dark/90 px-3 py-2 rounded border border-white/5 min-w-[130px] text-center">
                        <span className="text-[9px] text-gray-500 font-cyber tracking-widest block mb-0.5">ОТСЧЕТ ЗАПУСКА:</span>
                        <strong className={`text-xs sm:text-sm font-cyber font-semibold tracking-wider ${countdowns[event.id] === 'ИДЕТ ТРАНСЛЯЦИЯ' ? 'text-cyber-red animate-pulse' : 'text-pubg-orange'}`}>
                          {countdowns[event.id] || "ЖДУ ИНФУ..."}
                        </strong>
                      </div>

                    </div>

                    {/* Right Column: Interaction Action Buttons */}
                    <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t border-gray-800/60 md:border-0 justify-end">
                      
                      <button
                        onClick={() => handleBookSlot(event.id)}
                        disabled={event.slotsFilled >= event.slotsTotal}
                        className={`px-4 py-2.5 rounded text-xs font-oswald tracking-widest uppercase transition-all flex items-center gap-1.5 ${
                          event.slotsFilled >= event.slotsTotal
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                            : 'bg-battle-light hover:bg-pubg-orange hover:text-battle-dark text-white border border-gray-700'
                        }`}
                      >
                        <span>{event.slotsFilled >= event.slotsTotal ? 'ФУЛЛ СЛОТЫ' : 'ЗАБИТЬ СЛОТ'}</span>
                      </button>

                      <button
                        onClick={() => toggleReminder(event.id)}
                        className={`p-2.5 rounded transition-all flex items-center justify-center border ${
                          remActive
                            ? 'bg-cyber-green/10 border-cyber-green text-cyber-green'
                            : 'bg-battle-dark hover:bg-battle-light border-gray-800 text-gray-400 hover:text-white'
                        }`}
                        title={remActive ? "Будильник настроен!" : "Напоминалка в Discord"}
                      >
                        {remActive ? <Check className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
                      </button>

                      {event.id !== "1" && event.id !== "2" && event.id !== "3" && (
                        <button
                          onClick={() => removeEvent(event.id)}
                          className="p-2.5 rounded bg-red-950/20 hover:bg-red-900/40 text-red-500 border border-red-900/30 transition-colors"
                          title="Удалить лобби"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}

                    </div>

                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
