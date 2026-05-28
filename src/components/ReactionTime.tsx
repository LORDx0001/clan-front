import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Zap, RotateCcw, Target, Trophy } from 'lucide-react';

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'early';

interface ReactionTimeProps {
  onBack: () => void;
}

export default function ReactionTime({ onBack }: ReactionTimeProps) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('bestReactionTime');
    return saved ? parseInt(saved, 10) : null;
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(null);
    
    // Random delay between 1.5s and 5s
    const delay = Math.floor(Math.random() * 3500) + 1500;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'idle' || gameState === 'result' || gameState === 'early') {
      startGame();
    } else if (gameState === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('early');
    } else if (gameState === 'ready') {
      // Clicked on time
      const time = Date.now() - startTime;
      setReactionTime(time);
      setGameState('result');
      
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('bestReactionTime', time.toString());
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getBgColor = () => {
    switch (gameState) {
      case 'waiting': return 'bg-red-600 hover:bg-red-700';
      case 'ready': return 'bg-green-500 hover:bg-green-600';
      case 'result': return 'bg-blue-600 hover:bg-blue-700';
      case 'early': return 'bg-blue-600 hover:bg-blue-700';
      default: return 'bg-battle-gray hover:bg-battle-gray/80 border-2 border-pubg-orange/30';
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-cyber uppercase tracking-widest text-white mb-2 flex items-center gap-3">
            <Zap className="w-8 h-8 text-pubg-orange" />
            Тренировка реакции
          </h1>
          <p className="text-gray-400 font-sans max-w-lg">
            Проверьте скорость своей реакции. Это критически важный навык для киберспорта. Нажимайте, как только цвет изменится на зеленый.
          </p>
        </div>
        {bestTime && (
          <div className="hidden sm:flex flex-col items-end bg-black/30 p-4 rounded-lg border border-white/10">
            <span className="text-gray-500 text-xs font-cyber tracking-widest uppercase mb-1">Ваш рекорд</span>
            <span className="text-2xl font-black text-pubg-orange flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              {bestTime} ms
            </span>
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <div 
          onClick={handleClick}
          className={`relative w-full h-[500px] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 shadow-2xl overflow-hidden ${getBgColor()}`}
        >
          {/* Subtle grid overlay for tech feel */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />

          {gameState === 'idle' && (
            <div className="text-center z-10 flex flex-col items-center">
              <Zap className="w-24 h-24 text-pubg-orange mb-6 animate-pulse" />
              <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-wider font-oswald">Reaction Time Test</h2>
              <p className="text-xl text-gray-300 font-sans">Кликните в любую область, чтобы начать</p>
            </div>
          )}

          {gameState === 'waiting' && (
            <div className="text-center z-10 flex flex-col items-center">
              <div className="text-8xl mb-6">🔴</div>
              <h2 className="text-5xl font-black text-white uppercase tracking-wider font-oswald">Ждите зеленого...</h2>
            </div>
          )}

          {gameState === 'ready' && (
            <div className="text-center z-10 flex flex-col items-center">
              <div className="text-8xl mb-6 animate-bounce">🟢</div>
              <h2 className="text-6xl font-black text-white uppercase tracking-wider font-oswald">КЛИКАЙ!</h2>
            </div>
          )}

          {gameState === 'result' && (
            <div className="text-center z-10 flex flex-col items-center">
              <Crosshair className="w-24 h-24 text-white mb-6" />
              <h2 className="text-6xl font-black text-white uppercase tracking-wider font-oswald mb-4">
                {reactionTime} ms
              </h2>
              <p className="text-xl text-white/80 font-sans mb-8">Кликните, чтобы попробовать снова</p>
              
              <div className="flex gap-2 items-center text-sm font-cyber bg-black/40 px-4 py-2 rounded border border-white/20">
                <Target className="w-4 h-4 text-pubg-orange" />
                Оценка: {
                  reactionTime! < 200 ? <span className="text-green-400">Киберспортсмен (Top 1%)</span> :
                  reactionTime! < 250 ? <span className="text-yellow-400">Отличная реакция (Top 20%)</span> :
                  reactionTime! < 300 ? <span className="text-blue-400">Хорошая (Средний уровень)</span> :
                  <span className="text-red-400">Ниже среднего</span>
                }
              </div>
            </div>
          )}

          {gameState === 'early' && (
            <div className="text-center z-10 flex flex-col items-center">
              <RotateCcw className="w-24 h-24 text-white mb-6" />
              <h2 className="text-5xl font-black text-white uppercase tracking-wider font-oswald mb-4">Слишком рано!</h2>
              <p className="text-xl text-white/80 font-sans">Вы нажали до появления зеленого цвета.</p>
              <p className="text-lg text-white/60 font-sans mt-2">Кликните, чтобы начать заново</p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="mt-8">
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-transparent border border-gray-600 text-gray-400 hover:text-white hover:border-white rounded font-cyber uppercase tracking-widest text-sm transition-all"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}
