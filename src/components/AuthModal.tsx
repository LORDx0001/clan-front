import React, { useState } from 'react';
import { X, Lock, User as UserIcon, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
      const res = await fetch(`${apiUrl}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'omit' // use omit if cross-origin without proper CORS setup, but normally include. 
        // For testing we will just fake login if it fails due to CORS, but let's try real first:
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // fetch profile immediately
        const profileRes = await fetch(`${apiUrl}/auth/me/`, { credentials: 'omit' });
        let profile = null;
        if (profileRes.ok) {
           const pData = await profileRes.json();
           profile = pData.player;
        }
        login(data.username, profile);
        onClose();
      } else {
        setError(data.error || "Ошибка авторизации");
      }
    } catch (err) {
      setError("Ошибка сети или сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-battle-gray border border-pubg-orange/30 p-6 rounded-lg w-full max-w-md shadow-[0_0_30px_rgba(255,107,0,0.15)] relative overflow-hidden"
        >
          {/* Cyber accents */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pubg-orange to-transparent opacity-50" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-oswald font-bold tracking-widest text-white mb-2">АВТОРИЗАЦИЯ</h2>
            <p className="text-xs text-gray-400 font-mono">SECURE SYSTEM ACCESS</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded text-sm font-mono text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400 ml-1">ЛОГИН</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-battle-dark border border-gray-700 text-white pl-10 pr-4 py-3 rounded focus:border-pubg-orange focus:ring-1 focus:ring-pubg-orange/50 transition-all font-mono outline-none"
                  placeholder="Введите логин"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-400 ml-1">ПАРОЛЬ</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-battle-dark border border-gray-700 text-white pl-10 pr-4 py-3 rounded focus:border-pubg-orange focus:ring-1 focus:ring-pubg-orange/50 transition-all font-mono outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pubg-orange text-battle-dark font-oswald font-bold tracking-widest py-3 rounded hover:bg-white transition-colors flex items-center justify-center mt-6 disabled:opacity-70"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : "ВОЙТИ В СИСТЕМУ"}
            </button>
            
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500 font-mono">
                Нет аккаунта? Регистрация проходит через официального Telegram бота.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
