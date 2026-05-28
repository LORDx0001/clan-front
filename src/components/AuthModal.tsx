import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, User as UserIcon, Loader, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
      
      if (mode === 'login') {
        const res = await fetch(`${apiUrl}/auth/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          credentials: 'include',
        });

        const data = await res.json();

        if (res.ok && data.success) {
          const profileRes = await fetch(`${apiUrl}/auth/me/`, { credentials: 'include' });
          let profile = null;
          if (profileRes.ok) {
            const pData = await profileRes.json();
            profile = pData.player;
          }
          login(data.username, profile);
          setUsername('');
          setPassword('');
          onClose();
        } else {
          setError(data.error || 'Неверный логин или пароль');
        }
      } else {
        // Register mode
        const res = await fetch(`${apiUrl}/auth/register/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, nickname }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setSuccessMsg('Регистрация успешна! Ожидайте активации аккаунта администратором.');
          setUsername('');
          setPassword('');
          setNickname('');
          setTimeout(() => setMode('login'), 3000);
        } else {
          setError(data.error || 'Ошибка при регистрации');
        }
      }
    } catch {
      setError('Ошибка сети. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  // Reset state when opening/closing
  useEffect(() => {
    if (!isOpen) {
      setMode('login');
      setUsername('');
      setPassword('');
      setNickname('');
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
          />

          {/* Modal — perfectly centered on all screen sizes */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
            style={{ zIndex: 9999 }}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card */}
              <div className="bg-[#111318] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(255,107,0,0.12)]">

                {/* Top accent line */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

                {/* Header */}
                <div className="px-6 pt-7 pb-5 text-center relative">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X size={16} />
                  </button>

                  {/* Icon badge */}
                  <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Shield size={26} className="text-orange-400" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black tracking-widest text-white uppercase font-oswald">
                    {mode === 'login' ? 'Авторизация' : 'Регистрация'}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-mono mt-1 tracking-wider">
                    {mode === 'login' ? 'SECURE SYSTEM ACCESS' : 'NEW MEMBER ONBOARDING'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 pb-7 space-y-4">

                  {/* Success */}
                  <AnimatePresence>
                    {successMsg && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-xs font-mono text-center">
                          {successMsg}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-xs font-mono text-center">
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono text-gray-400 tracking-widest uppercase ml-0.5">
                      Логин
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <UserIcon size={15} className="text-gray-600" />
                      </div>
                      <input
                        type="text"
                        required
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Введите логин"
                        className="w-full bg-white/5 border border-white/10 text-white text-sm pl-10 pr-4 py-3 rounded-xl
                          placeholder:text-gray-600 font-mono outline-none
                          focus:border-orange-500/60 focus:bg-orange-500/5 focus:ring-1 focus:ring-orange-500/20
                          transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono text-gray-400 tracking-widest uppercase ml-0.5">
                      Пароль
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock size={15} className="text-gray-600" />
                      </div>
                      <input
                        type="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 text-white text-sm pl-10 pr-4 py-3 rounded-xl
                          placeholder:text-gray-600 font-mono outline-none
                          focus:border-orange-500/60 focus:bg-orange-500/5 focus:ring-1 focus:ring-orange-500/20
                          transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Nickname (only for register) */}
                  {mode === 'register' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5 overflow-hidden"
                    >
                      <label className="block text-[11px] font-mono text-gray-400 tracking-widest uppercase ml-0.5">
                        Никнейм в игре
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-600 font-mono text-sm">
                          <UserIcon size={15} />
                        </div>
                        <input
                          type="text"
                          required
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          placeholder="Ваш никнейм"
                          className="w-full bg-white/5 border border-white/10 text-white text-sm pl-10 pr-4 py-3 rounded-xl
                            placeholder:text-gray-600 font-mono outline-none
                            focus:border-orange-500/60 focus:bg-orange-500/5 focus:ring-1 focus:ring-orange-500/20
                            transition-all duration-200"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !!successMsg}
                    className="mt-2 w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600
                      text-black font-oswald font-black tracking-widest uppercase text-sm
                      py-3.5 rounded-xl transition-all duration-200
                      flex items-center justify-center gap-2
                      disabled:opacity-60 disabled:cursor-not-allowed
                      shadow-[0_4px_20px_rgba(255,107,0,0.3)]"
                  >
                    {loading ? (
                      <><Loader className="animate-spin" size={17} /> <span>Отправка...</span></>
                    ) : (
                      mode === 'login' ? 'Войти в систему' : 'Создать аккаунт'
                    )}
                  </button>

                  {/* Toggle mode */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode(mode === 'login' ? 'register' : 'login');
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="text-[11px] text-gray-400 hover:text-white font-mono transition-colors tracking-wide"
                    >
                      {mode === 'login' 
                        ? 'Нет аккаунта? Зарегистрироваться на сайте' 
                        : 'Уже есть аккаунт? Войти в систему'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
