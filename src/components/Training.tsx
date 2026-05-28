import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Zap, RotateCcw, Target, Trophy, Eye, ChevronLeft, Activity, Play } from 'lucide-react';

type GameMode = 'menu' | 'reaction' | 'aim' | 'tracking';

interface TrainingProps {
  onBack: () => void;
}

export default function Training({ onBack }: TrainingProps) {
  const [mode, setMode] = useState<GameMode>('menu');

  return (
    <div className="min-h-[85vh] flex flex-col p-4">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-cyber uppercase tracking-widest text-white flex items-center gap-3">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-pubg-orange" />
            Кибер-Тренировка
          </h1>
          <p className="text-sm sm:text-base text-gray-400 font-sans mt-2 max-w-xl">
            Комплекс мини-игр для развития киберспортивных навыков: реакции, точности наведения и визуального контроля.
          </p>
        </div>
        
        <div className="flex gap-3">
          {mode !== 'menu' && (
            <button 
              onClick={() => setMode('menu')}
              className="flex items-center gap-2 px-4 py-2 bg-battle-gray/80 hover:bg-battle-gray border border-white/10 rounded font-cyber text-sm text-gray-300 hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Меню
            </button>
          )}
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-transparent border border-gray-600 text-gray-400 hover:text-white hover:border-white rounded font-cyber uppercase tracking-widest text-sm transition-all"
          >
            На главную
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-6xl mx-auto relative flex flex-col">
        <AnimatePresence mode="wait">
          {mode === 'menu' && <MainMenu key="menu" onSelect={setMode} />}
          {mode === 'reaction' && <ReactionGame key="reaction" onExit={() => setMode('menu')} />}
          {mode === 'aim' && <AimGame key="aim" onExit={() => setMode('menu')} />}
          {mode === 'tracking' && <TrackingGame key="tracking" onExit={() => setMode('menu')} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==========================================
// MENU COMPONENT
// ==========================================
function MainMenu({ onSelect }: { onSelect: (m: GameMode) => void }) {
  const games = [
    {
      id: 'reaction' as GameMode,
      title: 'Реакция',
      icon: <Zap className="w-10 h-10 text-yellow-400" />,
      desc: 'Нажми как только цвет изменится. Тренирует скорость клика.',
      color: 'from-yellow-600/20 to-yellow-600/5',
      borderColor: 'border-yellow-500/30'
    },
    {
      id: 'aim' as GameMode,
      title: 'Аим Тренер',
      icon: <Target className="w-10 h-10 text-red-500" />,
      desc: 'Уничтожь как можно больше мишеней за 30 секунд. Тренирует точность.',
      color: 'from-red-600/20 to-red-600/5',
      borderColor: 'border-red-500/30'
    },
    {
      id: 'tracking' as GameMode,
      title: 'Слежение',
      icon: <Eye className="w-10 h-10 text-blue-400" />,
      desc: 'Следи за хаотично двигающейся точкой 30 секунд. Тренирует фокус.',
      color: 'from-blue-600/20 to-blue-600/5',
      borderColor: 'border-blue-500/30'
    }
  ];

  const getBestScore = (id: GameMode) => {
    if (id === 'reaction') {
      const saved = localStorage.getItem('bestReactionTime');
      return saved ? `${saved} ms` : null;
    }
    if (id === 'aim') {
      const saved = localStorage.getItem('bestAimScore');
      return saved ? `${saved} очков` : null;
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mt-4 sm:mt-12"
    >
      {games.map((game) => (
        <div 
          key={game.id}
          onClick={() => onSelect(game.id)}
          className={`group relative overflow-hidden bg-battle-gray rounded-xl p-6 border ${game.borderColor} cursor-pointer hover:scale-[1.02] transition-transform duration-300 flex flex-col items-center text-center`}
        >
          <div className={`absolute inset-0 bg-gradient-to-b ${game.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
          <div className="relative z-10 bg-black/40 p-4 rounded-full mb-4">
            {game.icon}
          </div>
          <h2 className="relative z-10 text-2xl font-black font-oswald text-white uppercase tracking-widest mb-3">
            {game.title}
          </h2>
          <p className="relative z-10 text-sm text-gray-400 font-sans mb-4">
            {game.desc}
          </p>
          {getBestScore(game.id) && (
            <div className="relative z-10 text-pubg-orange font-cyber text-sm tracking-widest mb-4 border border-pubg-orange/30 px-3 py-1 rounded bg-black/40">
              <Trophy className="inline w-3 h-3 mr-1 -mt-1" />
              Рекорд: {getBestScore(game.id)}
            </div>
          )}
          <button className="relative z-10 mt-auto px-6 py-2 bg-pubg-orange/20 text-pubg-orange border border-pubg-orange/50 rounded font-cyber text-sm uppercase tracking-widest group-hover:bg-pubg-orange group-hover:text-white transition-colors">
            Начать
          </button>
        </div>
      ))}
    </motion.div>
  );
}

// ==========================================
// 1. REACTION GAME
// ==========================================
function ReactionGame({ onExit }: { onExit: () => void }) {
  type RState = 'idle' | 'waiting' | 'ready' | 'result' | 'early';
  const [state, setState] = useState<RState>('idle');
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(() => {
    const saved = localStorage.getItem('bestReactionTime');
    return saved ? parseInt(saved, 10) : null;
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    setState('waiting');
    setResult(null);
    const delay = Math.floor(Math.random() * 3500) + 1500;
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (state === 'idle' || state === 'result' || state === 'early') {
      start();
    } else if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('early');
    } else if (state === 'ready') {
      const time = Date.now() - startTime;
      setResult(time);
      setState('result');
      if (!best || time < best) {
        setBest(time);
        localStorage.setItem('bestReactionTime', time.toString());
      }
    }
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const getBg = () => {
    if (state === 'waiting') return 'bg-red-600 hover:bg-red-700';
    if (state === 'ready') return 'bg-green-500 hover:bg-green-600';
    if (state === 'result' || state === 'early') return 'bg-blue-600 hover:bg-blue-700';
    return 'bg-battle-gray hover:bg-battle-gray/80 border-2 border-pubg-orange/30';
  };

  const getRank = (ms: number) => {
    if (ms < 200) return <span className="text-green-400">Киберспортсмен (Выше среднего)</span>;
    if (ms < 250) return <span className="text-yellow-400">Отлично (Топ 20%)</span>;
    if (ms < 300) return <span className="text-blue-400">Хорошо (Средний уровень)</span>;
    return <span className="text-red-400">Слабо (Ниже среднего)</span>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 select-none ${getBg()}`}
      onClick={handleClick}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onExit(); }} 
        className="absolute top-6 right-6 px-4 py-2 bg-black/40 hover:bg-black/60 border border-white/20 rounded font-cyber text-sm text-white uppercase tracking-widest transition-all z-50"
      >
        Закрыть ❌
      </button>

      {state === 'idle' && (
        <>
          <Zap className="w-16 h-16 sm:w-24 sm:h-24 text-pubg-orange mb-4 sm:mb-6 animate-pulse" />
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 sm:mb-4 uppercase font-oswald">Reaction Test</h2>
          <p className="text-base sm:text-xl text-gray-300">Кликните, чтобы начать</p>
          {best && <p className="text-pubg-orange font-cyber mt-4"><Trophy className="inline w-4 h-4 mr-1 -mt-1"/> Лучший: {best} ms</p>}
        </>
      )}
      {state === 'waiting' && (
        <>
          <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🔴</div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-oswald">Ждите зеленого...</h2>
        </>
      )}
      {state === 'ready' && (
        <>
          <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 animate-bounce">🟢</div>
          <h2 className="text-4xl sm:text-6xl font-black text-white uppercase font-oswald">КЛИКАЙ!</h2>
        </>
      )}
      {state === 'result' && (
        <>
          <Crosshair className="w-16 h-16 sm:w-24 sm:h-24 text-white mb-4 sm:mb-6" />
          <h2 className="text-4xl sm:text-6xl font-black text-white uppercase font-oswald mb-2 sm:mb-4">{result} ms</h2>
          <div className="mb-6 flex gap-2 items-center text-sm sm:text-base font-cyber bg-black/40 px-4 py-2 rounded border border-white/20">
            <Target className="w-4 h-4 text-pubg-orange" />
            Оценка: {result && getRank(result)}
          </div>
          <p className="text-base sm:text-xl text-white/80">Кликните, чтобы попробовать снова</p>
        </>
      )}
      {state === 'early' && (
        <>
          <RotateCcw className="w-16 h-16 sm:w-24 sm:h-24 text-white mb-4 sm:mb-6" />
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-oswald mb-2">Слишком рано!</h2>
          <p className="text-base sm:text-xl text-white/80 mt-2">Кликните, чтобы начать заново</p>
        </>
      )}
    </motion.div>
  );
}

// ==========================================
// 2. AIM GAME
// ==========================================
function AimGame({ onExit }: { onExit: () => void }) {
  const GAME_DURATION = 30; // 30 seconds
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [showResult, setShowResult] = useState(false);
  const [best, setBest] = useState<number | null>(() => {
    const saved = localStorage.getItem('bestAimScore');
    return saved ? parseInt(saved, 10) : null;
  });

  // Responsive target size: smaller on mobile to be harder, but clickable
  const targetSize = 40; 

  const moveTarget = () => {
    // Keep target within 10% to 90% bounds to avoid edges
    const x = Math.floor(Math.random() * 80) + 10;
    const y = Math.floor(Math.random() * 80) + 10;
    setTargetPos({ x, y });
  };

  const start = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setShowResult(false);
    setPlaying(true);
    moveTarget();
  };

  const handleHit = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!playing) return;
    setScore(s => s + 1);
    moveTarget();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (playing && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (playing && timeLeft === 0) {
      setPlaying(false);
      setShowResult(true);
      if (!best || score > best) {
        setBest(score);
        localStorage.setItem('bestAimScore', score.toString());
      }
    }
    return () => clearTimeout(timer);
  }, [playing, timeLeft]);

  const getAimRank = (score: number) => {
    if (score >= 40) return <span className="text-green-400">Киберспортсмен (Выше среднего)</span>;
    if (score >= 30) return <span className="text-yellow-400">Отлично (Топ 20%)</span>;
    if (score >= 20) return <span className="text-blue-400">Хорошо (Средний уровень)</span>;
    return <span className="text-red-400">Слабо (Ниже среднего)</span>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-battle-gray overflow-hidden flex flex-col select-none"
    >
      <button 
        onClick={onExit} 
        className="absolute top-6 right-6 px-4 py-2 bg-black/40 hover:bg-black/60 border border-white/20 rounded font-cyber text-sm text-white uppercase tracking-widest transition-all z-50"
      >
        Закрыть ❌
      </button>

      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 pointer-events-none mt-20 sm:mt-0">
        <div className="bg-black/50 backdrop-blur px-4 py-2 rounded text-white font-oswald text-xl sm:text-2xl border border-white/10">
          Время: <span className={timeLeft <= 5 ? "text-red-500" : "text-pubg-orange"}>{timeLeft}s</span>
        </div>
        <div className="bg-black/50 backdrop-blur px-4 py-2 rounded text-white font-oswald text-xl sm:text-2xl border border-white/10 hidden sm:block">
          Счет: <span className="text-green-400">{score}</span>
        </div>
      </div>

      {!playing && !showResult && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
          <Target className="w-20 h-20 text-red-500 mb-4" />
          <h2 className="text-3xl sm:text-5xl text-white font-black font-oswald mb-2 uppercase">Aim Тренер</h2>
          <p className="text-gray-300 text-center px-4 max-w-md mb-2">Нажимайте на появляющиеся мишени как можно быстрее. У вас 30 секунд.</p>
          {best !== null && <p className="text-pubg-orange font-cyber mb-6"><Trophy className="inline w-4 h-4 mr-1 -mt-1"/> Рекорд: {best} мишеней</p>}
          <button onClick={start} className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black font-oswald text-2xl uppercase rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            <Play className="w-6 h-6 fill-current" /> Старт
          </button>
        </div>
      )}

      {showResult && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-sm text-center">
          <Trophy className="w-24 h-24 text-yellow-400 mb-4" />
          <h2 className="text-4xl sm:text-6xl text-white font-black font-oswald mb-4 uppercase">Время вышло!</h2>
          <div className="text-xl sm:text-3xl text-gray-300 font-oswald mb-2">Ваш счет: <span className="text-pubg-orange font-black">{score}</span> мишеней</div>
          <div className="text-sm sm:text-lg text-gray-400 font-mono mb-4">({(score / GAME_DURATION).toFixed(2)} кликов/сек)</div>
          
          <div className="mb-8 flex gap-2 items-center text-sm sm:text-base font-cyber bg-black/40 px-4 py-2 rounded border border-white/20">
            <Target className="w-4 h-4 text-pubg-orange" />
            Оценка: {getAimRank(score)}
          </div>

          <button onClick={start} className="flex items-center gap-2 px-6 py-3 border-2 border-white/20 text-white font-bold font-cyber text-lg uppercase rounded-lg hover:bg-white/10 transition-colors">
            <RotateCcw className="w-5 h-5" /> Играть снова
          </button>
        </div>
      )}

      {/* Playable Area */}
      {playing && (
        <div className="flex-1 w-full relative cursor-crosshair active:bg-red-500/5 transition-colors" onClick={() => { /* Missed click penalty could go here */ }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={handleHit}
            onTouchStart={handleHit}
            className="absolute rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.8)] cursor-pointer hover:bg-red-400 border-2 border-white/50"
            style={{
              left: `calc(${targetPos.x}% - ${targetSize/2}px)`,
              top: `calc(${targetPos.y}% - ${targetSize/2}px)`,
              width: targetSize,
              height: targetSize,
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// ==========================================
// 3. EYE TRACKING GAME
// ==========================================
function TrackingGame({ onExit }: { onExit: () => void }) {
  const GAME_DURATION = 30; // 30 seconds
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [showResult, setShowResult] = useState(false);
  
  // Random speeds for unpredictability
  const [duration, setDuration] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    setTimeLeft(GAME_DURATION);
    setShowResult(false);
    setPlaying(true);
    setPos({ x: 50, y: 50 });
  };

  useEffect(() => {
    if (playing && timeLeft > 0) {
      const move = () => {
        // Next random position
        const nextX = Math.floor(Math.random() * 90) + 5;
        const nextY = Math.floor(Math.random() * 90) + 5;
        // Random transition duration between 0.3s and 1.5s
        const nextDuration = (Math.random() * 1.2 + 0.3);
        
        setPos({ x: nextX, y: nextY });
        setDuration(nextDuration);
        
        intervalRef.current = setTimeout(move, nextDuration * 1000);
      };
      
      move(); // Start moving
      
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setPlaying(false);
            setShowResult(true);
            if (intervalRef.current) clearTimeout(intervalRef.current);
            clearInterval(timer);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      
      return () => {
        if (intervalRef.current) clearTimeout(intervalRef.current);
        clearInterval(timer);
      };
    }
  }, [playing]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col select-none"
    >
      <button 
        onClick={onExit} 
        className="absolute top-6 right-6 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded font-cyber text-sm text-white uppercase tracking-widest transition-all z-50"
      >
        Закрыть ❌
      </button>

      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-center items-center z-10 pointer-events-none mt-20 sm:mt-0">
        <div className="bg-black/80 px-6 py-2 rounded-full text-white font-oswald text-xl sm:text-2xl border border-white/10 flex gap-3">
          <Eye className="w-6 h-6 text-blue-400" />
          <span className={timeLeft <= 5 ? "text-red-500" : "text-blue-400"}>00:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
      </div>

      {!playing && !showResult && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
          <Eye className="w-20 h-20 text-blue-400 mb-4" />
          <h2 className="text-3xl sm:text-5xl text-white font-black font-oswald mb-2 uppercase">Трекинг глаз</h2>
          <p className="text-gray-300 text-center px-4 max-w-md mb-6">Удерживайте взгляд на двигающейся точке. Скорость и направление будут постоянно меняться. (30 сек)</p>
          <button onClick={start} className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black font-oswald text-2xl uppercase rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
            <Play className="w-6 h-6 fill-current" /> Начать
          </button>
        </div>
      )}

      {showResult && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 backdrop-blur-sm">
          <h2 className="text-4xl sm:text-6xl text-white font-black font-oswald mb-4 uppercase">Отличная работа!</h2>
          <p className="text-gray-300 text-center px-4 max-w-md mb-8">Регулярная тренировка помогает быстрее фокусироваться на целях в игре.</p>
          <button onClick={start} className="flex items-center gap-2 px-6 py-3 border-2 border-blue-500/50 text-white font-bold font-cyber text-lg uppercase rounded-lg hover:bg-blue-600/20 transition-colors">
            <RotateCcw className="w-5 h-5" /> Повторить
          </button>
        </div>
      )}

      {/* Playable Area */}
      {playing && (
        <div className="flex-1 w-full relative">
          <motion.div
            animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            transition={{ duration, ease: "easeInOut" }}
            className="absolute w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-full shadow-[0_0_20px_rgba(96,165,250,1)] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="absolute inset-1 bg-white rounded-full opacity-80" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
