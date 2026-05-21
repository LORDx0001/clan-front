import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClanRule, RecruitmentForm } from '../types';
import { useClan } from '../context/ClanContext';
import { Shield, FileText, CheckCircle2, ChevronDown, ChevronUp, Copy, Landmark, Sparkles, Terminal, BookOpen, Clock, Gamepad2, HeartCrack, Upload, ArrowLeft } from 'lucide-react';

interface RulesProps {
  onBack?: () => void;
}

export default function RulesRecruitment({ onBack }: RulesProps) {
  const { rules: contextRules, settings, submitRecruitment } = useClan();
  const [rules, setRules] = useState<ClanRule[]>(contextRules);

  useEffect(() => {
    if (contextRules) {
      setRules(contextRules);
    }
  }, [contextRules]);

  const [openRuleId, setOpenRuleId] = useState<string | null>("1");
  const [recruitmentForm, setRecruitmentForm] = useState<Omit<RecruitmentForm, 'kd'>>({
    nickname: '',
    gameId: '',
    age: 18,
    device: '',
    role: 'Assaulter',
    playTime: 4,
    discordTelegram: '',
    about: ''
  });

  const [statPhotos, setStatPhotos] = useState<(File | null)[]>([null, null, null, null]);

  const [simulationStep, setSimulationStep] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [ticketCopied, setTicketCopied] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [assessmentGrade, setAssessmentGrade] = useState<'unqualified' | 'accepted_with_test' | 'excellent'>('accepted_with_test');

  const toggleRule = (id: string) => {
    setOpenRuleId(openRuleId === id ? null : id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecruitmentForm(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'playTime' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruitmentForm.nickname || !recruitmentForm.gameId || !recruitmentForm.discordTelegram) {
      return;
    }

    // Enforce uploading at least 3 photos
    const loadedCount = statPhotos.filter(x => x !== null).length;
    if (loadedCount < 3) {
      alert("Пожалуйста, загрузите от 3 до 4 скриншотов вашей статистики (первые 3 слота обязательны)!");
      return;
    }

    // Begin cinematic montage sci-fi stats scan
    setSimulationStep('scanning');
    setScanProgress(0);

    // Dynamic assessment grade based on playTime & age!
    const finalPlayTime = Number(recruitmentForm.playTime) || 4;
    const finalAge = Number(recruitmentForm.age) || 18;
    if (finalPlayTime >= 6 && finalAge >= 16) {
      setAssessmentGrade('excellent');
    } else if (finalAge < 15) {
      setAssessmentGrade('unqualified');
    } else {
      setAssessmentGrade('accepted_with_test');
    }

    // Compile FormData for multipart upload
    const formData = new FormData();
    formData.append('nickname', recruitmentForm.nickname);
    formData.append('gameId', recruitmentForm.gameId);
    formData.append('role', recruitmentForm.role);
    formData.append('device', recruitmentForm.device);
    formData.append('age', String(finalAge));
    formData.append('playTime', String(finalPlayTime));
    formData.append('discordTelegram', recruitmentForm.discordTelegram);
    formData.append('about', recruitmentForm.about);

    // Append stat photos
    if (statPhotos[0]) formData.append('stat_photo_1', statPhotos[0]);
    if (statPhotos[1]) formData.append('stat_photo_2', statPhotos[1]);
    if (statPhotos[2]) formData.append('stat_photo_3', statPhotos[2]);
    if (statPhotos[3]) formData.append('stat_photo_4', statPhotos[3]);

    // Submit via ClanContext multipart action
    const res = await submitRecruitment(formData);
    
    if (res.error) {
      alert(res.error);
      setSimulationStep('idle');
      return;
    }

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulationStep('success');
          triggerSynthAlert();
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const triggerSynthAlert = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  const getFormTicketText = () => {
    return `============= Interstellar CLAN TICKET =============
🎮 Никнейм: ${recruitmentForm.nickname.toUpperCase()}
🆔 PUBG ID: ${recruitmentForm.gameId}
🏆 Игровая Роль: ${recruitmentForm.role}
📱 Устройство: ${recruitmentForm.device || 'Смартфон'}
⚡ Время в игре: ${recruitmentForm.playTime} ч/день
📧 Контакт: ${recruitmentForm.discordTelegram}
📝 О себе: ${recruitmentForm.about || 'Нет описания'}
🎖️ Автоматический статус: ${assessmentGrade === 'excellent' ? 'ВЫСОКИЙ ПРИОРИТЕТ(PRO)' : assessmentGrade === 'unqualified' ? 'РЕЗЕРВ (ПОВЫСЬТЕ СПОРТ-ОПЫТ)' : 'ДОПУЩЕН К ДУЭЛИ'}
===================================================`;
  };

  const copyTicketToClipboard = () => {
    const text = getFormTicketText();
    navigator.clipboard.writeText(text);
    setTicketCopied(true);
    setTimeout(() => setTicketCopied(false), 2000);
  };

  return (
    <div className="bg-battle-dark min-h-screen py-10 text-white px-2 sm:px-4 md:px-6 font-sans">
      <div className="max-w-[96%] lg:max-w-[1550px] mx-auto space-y-6">
        
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Col: Accordion of Clan Rules (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          {settings.rulesImageUrl && (
            <div className="w-full h-44 rounded-lg overflow-hidden border border-pubg-orange/30 mb-6 bg-black relative">
              <img 
                src={settings.rulesImageUrl} 
                alt="Rules Banner" 
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-battle-dark via-transparent to-black/10" />
            </div>
          )}

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-pubg-orange/10 border border-pubg-orange/30 px-2.5 py-1 rounded text-[10px] font-cyber tracking-widest text-pubg-orange uppercase">
              <BookOpen className="w-3" /> Устав Организации
            </div>
            <h3 className="text-3xl font-oswald font-black uppercase tracking-tight">
              КОДЕКС И <span className="text-pubg-orange font-cyber">ПРАВИЛА КЛАНА</span>
            </h3>
            <p className="text-gray-400 font-sans text-xs sm:text-sm leading-relaxed">
              Незнание устава не освобождает от немедленного исключения из гильдии. Мы ценим личные человеческие качества так же высоко, как и ваш уровень игры.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {rules.map((rule) => {
              const isOpen = openRuleId === rule.id;
              
              const severityStyles = {
                high: 'border-cyber-red text-cyber-red bg-cyber-red/5',
                medium: 'border-pubg-orange text-pubg-orange bg-pubg-orange/5',
                low: 'border-purple-400 text-purple-400 bg-purple-400/5'
              };

              const severityLabels = {
                high: 'КРИТИЧЕСКОЕ • ИСКЛЮЧЕНИЕ',
                medium: 'ВАЖНО • ВЫГОВОР',
                low: 'ТАКТИЧЕСКОЕ • ПРЕДУПРЕЖДЕНИЕ'
              };

              return (
                <div 
                  key={rule.id}
                  className="bg-battle-gray border border-gray-800 rounded-md overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-battle-light/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className={`text-[9px] font-cyber tracking-widest px-1.5 py-0.5 rounded border inline-block ${severityStyles[rule.severity]}`}>
                        {severityLabels[rule.severity]}
                      </span>
                      <h4 className="font-oswald text-base tracking-wider text-white">
                        {rule.title}
                      </h4>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 text-pubg-orange" /> : <ChevronDown className="w-5 text-gray-500" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 border-t border-gray-800 pt-3 text-xs sm:text-sm text-gray-400 leading-relaxed font-sans"
                      >
                        <p>{rule.content}</p>
                        <div className="mt-2.5 text-[10px] text-pubg-orange/60 font-mono">
                          РАЗДЕЛ: {rule.category}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="bg-battle-gray border border-white/5 rounded p-4 text-xs space-y-2">
            <span className="text-pubg-orange font-cyber block tracking-wider uppercase text-[10px]">🗣️ ОБРАТИТЕ ВНИМАНИЕ:</span>
            <p className="text-gray-400 font-sans leading-relaxed">
              Все участники клана обязаны сменить игровой никнейм на ник с префиксом <strong className="text-white font-cyber">Inter・</strong> в течение 7 дней после успешного тестирования. Карту смены ника клан предоставляет лучшим кандидатам!
            </p>
          </div>
        </div>

        {/* Right Col: Recruitment Form / Interactive evaluation result (7 columns) */}
        <div className="lg:col-span-7 bg-battle-gray border-2 border-gray-800 rounded-lg p-6 relative">
          
          {simulationStep === 'idle' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] text-pubg-orange font-cyber tracking-widest uppercase flex items-center gap-1">
                  <Terminal className="w-3" /> ЭЛЕКТРОННАЯ ПРИЕМНАЯ КАНЦЕЛЯРИЯ
                </span>
                <h3 className="text-3xl font-oswald font-black uppercase tracking-tight">
                  СТАТЬ ЧАСТЬЮ СОЮЗА <span className="text-pubg-orange">{settings.clanName || "Interstellar"}</span>
                </h3>
                <p className="text-gray-400 font-sans text-xs sm:text-sm">
                  Заполните анкету игровых показателей. Наш алгоритм проведет автоматический скоринг по уровню активности и распределит вас на подходящий этап отбора.
                </p>
              </div>

              {settings.recruitmentImageUrl && (
                <div className="w-full h-44 rounded-lg overflow-hidden border border-pubg-orange/30 mb-4 bg-black relative">
                  <img 
                    src={settings.recruitmentImageUrl} 
                    alt="Recruitment Banner" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-battle-gray via-transparent to-black/10" />
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase font-mono mb-1">Ваш Игровой Никнейм <span className="text-pubg-orange">*</span></label>
                    <input
                      type="text"
                      name="nickname"
                      required
                      value={recruitmentForm.nickname}
                      onChange={handleInputChange}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-cyber text-sm focus:border-pubg-orange focus:outline-hidden"
                      placeholder="Например: PREDATOR"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase font-mono mb-1">PUBG Mobile ID <span className="text-pubg-orange">*</span></label>
                    <input
                      type="text"
                      name="gameId"
                      required
                      pattern="[0-9]*"
                      value={recruitmentForm.gameId}
                      onChange={handleInputChange}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:border-pubg-orange focus:outline-hidden"
                      placeholder="Например: 5194825920"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase font-mono mb-1">Игровая Роль <span className="text-pubg-orange">*</span></label>
                    <select
                      name="role"
                      value={recruitmentForm.role}
                      onChange={handleInputChange}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:border-pubg-orange focus:outline-hidden"
                    >
                      <option value="Assaulter">Штурмовик (Assaulter)</option>
                      <option value="Sniper">Снайпер (Sniper)</option>
                      <option value="Scout">Разведчик (Scout)</option>
                      <option value="Support">Прикрытие (Support)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase font-mono mb-1">Игровое Устройство <span className="text-pubg-orange">*</span></label>
                    <input
                      type="text"
                      name="device"
                      required
                      value={recruitmentForm.device}
                      onChange={handleInputChange}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:border-pubg-orange focus:outline-hidden"
                      placeholder="iPad Pro 11, Poco F5, etc"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase font-mono mb-1">Ваш Возраст <span className="text-pubg-orange">*</span></label>
                    <input
                      type="number"
                      name="age"
                      min="10"
                      max="60"
                      required
                      value={recruitmentForm.age}
                      onChange={handleInputChange}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:border-pubg-orange focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase font-mono mb-1">Активность (часов/день) <span className="text-pubg-orange">*</span></label>
                    <input
                      type="number"
                      name="playTime"
                      min="1"
                      max="18"
                      required
                      value={recruitmentForm.playTime}
                      onChange={handleInputChange}
                      className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:border-pubg-orange focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 uppercase font-mono mb-1">Discord-тэг или Telegram @username <span className="text-pubg-orange">*</span></label>
                  <input
                    type="text"
                    name="discordTelegram"
                    required
                    value={recruitmentForm.discordTelegram}
                    onChange={handleInputChange}
                    className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-sans text-sm focus:border-pubg-orange focus:outline-hidden"
                    placeholder="Пример: @interstellar_warrior или predator#1234"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 uppercase font-mono mb-1">Пару слов о вашем опыте на турнирах</label>
                  <textarea
                    name="about"
                    rows={3}
                    value={recruitmentForm.about}
                    onChange={handleInputChange}
                    className="w-full bg-battle-dark border border-gray-700 rounded px-3 py-2 text-white font-sans text-xs sm:text-sm focus:border-pubg-orange focus:outline-hidden"
                    placeholder="Например: играл праки в PMCO, состоял в CIS-сквадах, умею давать четкий инфо-поток"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] text-gray-400 uppercase font-mono mb-2 tracking-wider">
                    ЗАГРУЗИТЕ СКРИНШОТЫ СТАТИСТИКИ (3-4 ФОТО) <span className="text-pubg-orange">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[0, 1, 2, 3].map((index) => (
                      <div 
                        key={index} 
                        className="relative bg-battle-dark border border-dashed border-gray-700 hover:border-pubg-orange rounded flex flex-col items-center justify-center aspect-square cursor-pointer transition-colors p-2 text-center"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setStatPhotos(prev => {
                              const next = [...prev];
                              next[index] = file;
                              return next;
                            });
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        {statPhotos[index] ? (
                          <div className="w-full h-full relative">
                            <img
                              src={URL.createObjectURL(statPhotos[index]!)}
                              alt={`Stat Screenshot ${index + 1}`}
                              className="w-full h-full object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatPhotos(prev => {
                                  const next = [...prev];
                                  next[index] = null;
                                  return next;
                                });
                              }}
                              className="absolute top-1 right-1 bg-black/80 hover:bg-pubg-orange text-white rounded p-0.5 z-20 cursor-pointer text-[10px] font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1 text-gray-500 pointer-events-none">
                            <Upload className="w-5 h-5 mx-auto" />
                            <span className="text-[10px] block font-mono">ФОТО {index + 1} {index < 3 ? '*' : '(опц)'}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 font-mono">
                    * Загрузите скриншоты вашего профиля PUBG, K/D, карьеры и результатов последних матчей (не менее 3 шт).
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full bg-pubg-orange text-battle-dark font-oswald font-black py-3.5 rounded text-base tracking-widest uppercase cursor-pointer hover:bg-purple-600 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all transform active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Gamepad2 className="w-5 h-5" /> 
                    ОТПРАВИТЬ СТАТИСТИКУ НА АНАЛИЗ
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SCREEN SCANNING ANIMATION IN ACTION */}
          {simulationStep === 'scanning' && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-dashed border-pubg-orange animate-spin flex items-center justify-center" />
                <Terminal className="w-8 h-8 text-pubg-orange absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-2">
                <h4 className="font-cyber text-lg font-bold tracking-widest text-pubg-orange animate-pulse">
                  АНАЛИЗ ИГРОВОГО ТАКТИЧЕСКОГО ПРОФИЛЯ
                </h4>
                <div className="w-64 h-2 bg-battle-dark rounded overflow-hidden mx-auto border border-white/5">
                  <div className="h-full bg-pubg-orange transition-all duration-150" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
              <div className="max-w-md font-mono text-xs text-gray-500 space-y-1">
                <div>[COM] ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ PUBG API...</div>
                <div>[OK] СКАНИРОВАНИЕ ВОЗРАСТНОГО ХАРАКТЕРА ({recruitmentForm.age} ЛЕТ)</div>
                <div>[SYS] РАЗБОР АКТИВНОСТИ ({recruitmentForm.playTime} ЧАСОВ В ДЕНЬ)</div>
                <div>[SYS] РАСЧЕТ ОПТИМАЛЬНОЙ ПОЗИЦИИ: {recruitmentForm.role.toUpperCase()}</div>
              </div>
            </div>
          )}

          {/* SUCCESS BREIFING SCREEN */}
          {simulationStep === 'success' && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyber-green/20 rounded-full blur-xl animate-pulse" />
                <div className="w-20 h-20 rounded-full border-4 border-cyber-green flex items-center justify-center relative z-10 bg-battle-dark">
                  <CheckCircle2 className="w-12 h-12 text-cyber-green" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-cyber-green font-cyber tracking-widest uppercase block">
                  SYSTEM STATUS: DELIVERED
                </span>
                <h3 className="text-3xl sm:text-4xl font-oswald font-black uppercase text-white tracking-wide">
                  ЗАЯВКА УСПЕШНО <span className="text-cyber-green">ОТПРАВЛЕНА!</span>
                </h3>
              </div>

              <div className="bg-battle-dark/50 border border-cyber-green/30 p-6 rounded-lg max-w-md shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <p className="text-gray-200 font-oswald text-xl uppercase tracking-wider mb-2">
                  Мы свяжемся с вами!
                </p>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  Ваша анкета и скриншоты статистики были успешно зарегистрированы и отправлены руководству. Пожалуйста, держите контакты Discord/Telegram открытыми.
                </p>
              </div>

              <button
                onClick={() => {
                  setStatPhotos([null, null, null, null]);
                  setSimulationStep('idle');
                }}
                className="bg-transparent hover:bg-cyber-green/10 border border-cyber-green/50 hover:border-cyber-green text-cyber-green font-oswald px-6 py-2.5 rounded text-xs uppercase cursor-pointer transition-all tracking-widest"
              >
                Заполнить анкету заново
              </button>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  </div>
  );
}
