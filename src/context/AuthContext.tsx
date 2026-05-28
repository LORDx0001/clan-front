import React, { createContext, useState, useEffect, useContext } from 'react';

type PlayerProfile = {
  id: string;
  nickname: string;
  uid: string;
  role: string;
  clanRole: string;
  device: string;
  level: number;
  kd: number | null;
  signatureWeapon: string;
  avatar: string;
  profileMedia: string;
  achievements: string;
  region: string;
  description: string;
};

type AuthContextType = {
  user: string | null;
  player: PlayerProfile | null;
  loading: boolean;
  login: (username: string, playerProfile: any) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  player: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshProfile: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
      const res = await fetch(`${apiUrl}/auth/me/`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setPlayer(data.player);
      } else {
        setUser(null);
        setPlayer(null);
      }
    } catch (e) {
      console.error("Profile fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = (username: string, playerProfile: any) => {
    setUser(username);
    setPlayer(playerProfile);
  };

  const logout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
      await fetch(`${apiUrl}/auth/logout/`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setPlayer(null);
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider value={{ user, player, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
