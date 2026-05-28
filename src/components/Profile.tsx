import React, { useState, useEffect } from 'react';
import { Save, User, ShieldAlert, LogOut, ChevronLeft, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

interface ProfileProps {
  onBack: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const { user, player, loading: authLoading, logout, refreshProfile } = useAuth();
  
  // Local state for editing
  const [formData, setFormData] = useState({
    nickname: '',
    uid: '',
    device: '',
    level: 1,
    kd: '',
    signatureWeapon: '',
    achievements: '',
    region: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (player) {
      setFormData({
        nickname: player.nickname || '',
        uid: player.uid || '',
        device: player.device || '',
        level: player.level || 1,
        kd: player.kd ? player.kd.toString() : '',
        signatureWeapon: player.signatureWeapon || '',
        achievements: player.achievements || '',
        region: player.region || '',
        description: player.description || ''
      });
    }
  }, [player]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
      const payload = {
        ...formData,
        level: parseInt(formData.level.toString(), 10) || 1,
        kd: formData.kd ? parseFloat(formData.kd) : null
      };
      
      const res = await fetch(`${apiUrl}/auth/update-profile/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'omit' // use omit for testing or include if session is configured fully
      });
      
      if (res.ok) {
        setMessage({ text: 'Профиль успешно сохранен', type: 'success' });
        await refreshProfile();
      } else {
        const data = await res.json();
        setMessage({ text: data.error || 'Ошибка при сохранении', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Ошибка сети', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div className="p-20 text-center text-gray-400">Загрузка...</div>;

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert size={64} className="text-pubg-orange mb-6" />
        <h2 className="text-3xl font-oswald font-bold mb-4">ДОСТУП ЗАПРЕЩЕН</h2>
        <p className="text-gray-400 font-mono mb-8 max-w-md">Вам необходимо авторизоваться в системе для доступа к редактированию профиля.</p>
        <button onClick={onBack} className="bg-battle-gray border border-gray-600 px-6 py-3 rounded hover:text-pubg-orange font-mono">Вернуться на главную</button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-pubg-orange mb-8 transition-colors font-mono text-sm"
      >
        <ChevronLeft size={16} className="mr-1" />
        ВЕРНУТЬСЯ
      </button>

      <div className="flex flex-col md:flex-row items-start justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-oswald font-black uppercase tracking-widest mb-2">
            ПРОФИЛЬ <span className="text-pubg-orange">ИГРОКА</span>
          </h1>
          <p className="text-gray-400 font-mono">
            Авторизован как: <strong className="text-white">{user}</strong>
          </p>
        </div>
        
        <button 
          onClick={() => { logout(); onBack(); }}
          className="flex items-center bg-red-500/10 text-red-400 border border-red-500/30 px-4 py-2 rounded hover:bg-red-500/20 transition-colors font-mono text-sm"
        >
          <LogOut size={16} className="mr-2" />
          ВЫЙТИ ИЗ АККАУНТА
        </button>
      </div>

      <div className="bg-battle-gray border-t border-b md:border border-white/5 md:rounded-lg p-6 md:p-8">
        {message.text && (
          <div className={`mb-6 p-4 rounded text-sm font-mono border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-mono ml-1 uppercase">Игровой никнейм</label>
              <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} className="w-full bg-battle-dark border border-gray-700 p-3 rounded text-white font-mono focus:border-pubg-orange outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-mono ml-1 uppercase">PUBG ID (UID)</label>
              <input type="text" name="uid" value={formData.uid} onChange={handleChange} className="w-full bg-battle-dark border border-gray-700 p-3 rounded text-white font-mono focus:border-pubg-orange outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-mono ml-1 uppercase">Игровое устройство</label>
              <input type="text" name="device" value={formData.device} onChange={handleChange} className="w-full bg-battle-dark border border-gray-700 p-3 rounded text-white font-mono focus:border-pubg-orange outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-mono ml-1 uppercase">Уровень аккаунта</label>
              <input type="number" name="level" value={formData.level} onChange={handleChange} className="w-full bg-battle-dark border border-gray-700 p-3 rounded text-white font-mono focus:border-pubg-orange outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-mono ml-1 uppercase">K/D Ratio</label>
              <input type="number" step="0.01" name="kd" value={formData.kd} onChange={handleChange} className="w-full bg-battle-dark border border-gray-700 p-3 rounded text-white font-mono focus:border-pubg-orange outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-mono ml-1 uppercase">Любимое оружие</label>
              <input type="text" name="signatureWeapon" value={formData.signatureWeapon} onChange={handleChange} className="w-full bg-battle-dark border border-gray-700 p-3 rounded text-white font-mono focus:border-pubg-orange outline-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs text-gray-400 font-mono ml-1 uppercase">Регион</label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full bg-battle-dark border border-gray-700 p-3 rounded text-white font-mono focus:border-pubg-orange outline-none" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs text-gray-400 font-mono ml-1 uppercase">Достижения (каждое с новой строки)</label>
              <textarea name="achievements" value={formData.achievements} onChange={handleChange} rows={4} className="w-full bg-battle-dark border border-gray-700 p-3 rounded text-white font-mono focus:border-pubg-orange outline-none resize-none"></textarea>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs text-gray-400 font-mono ml-1 uppercase">О себе</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-battle-dark border border-gray-700 p-3 rounded text-white font-mono focus:border-pubg-orange outline-none resize-none"></textarea>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-800 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-pubg-orange text-battle-dark font-oswald font-bold tracking-widest px-8 py-3 rounded hover:bg-white transition-colors flex items-center disabled:opacity-70"
            >
              {saving ? <Loader className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
              СОХРАНИТЬ ИЗМЕНЕНИЯ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
