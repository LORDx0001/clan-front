import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Announcement, GalleryItem, ScheduleEvent, ClanRule, RecruitmentForm, PlayerRole } from '../types';
import * as mockData from '../data/clanData';

// API Configuration
const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';


export interface ClanSettings {
  clanName: string;
  clanTag: string;
  clanFounded: string;
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  heroBackgroundType?: string;
  heroBackgroundFileUrl?: string;
  heroSlides?: { type: string; url: string }[];
  discordLink: string;
  telegramLink: string;
  stats: Array<{ title: string; value: string; desc: string }>;
  rulesTermsDesc: string;
  recruitmentImageUrl?: string;
  rulesImageUrl?: string;
}

interface ClanContextType {
  settings: ClanSettings;
  players: Player[];
  announcements: Announcement[];
  schedule: ScheduleEvent[];
  rules: ClanRule[];
  gallery: GalleryItem[];
  roles: PlayerRole[];
  loading: boolean;
  error: string | null;
  submitRecruitment: (form: FormData) => Promise<{
    success: boolean;
    assessmentGrade: 'unqualified' | 'accepted_with_test' | 'excellent';
    error?: string;
  }>;
}

const ClanContext = createContext<ClanContextType | undefined>(undefined);

export function ClanProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ClanSettings>({
    clanName: "",
    clanTag: "",
    clanFounded: "",
    heroTitle1: "",
    heroTitle2: "",
    heroDescription: "",
    discordLink: "",
    telegramLink: "",
    stats: [
      { title: "", value: "", desc: "" },
      { title: "", value: "", desc: "" },
      { title: "", value: "", desc: "" },
      { title: "", value: "", desc: "" }
    ],
    rulesTermsDesc: "",
    recruitmentImageUrl: "",
    rulesImageUrl: ""
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
  const [rules, setRules] = useState<ClanRule[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [roles, setRoles] = useState<PlayerRole[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all live data from Django API on startup
  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        console.log("Fetching live settings from Django backend...");
        
        // 1. Settings
        const settingsRes = await fetch(`${API_BASE_URL}/config/`);
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }

        // 2. Players
        const playersRes = await fetch(`${API_BASE_URL}/players/`);
        if (playersRes.ok) {
          const playersData = await playersRes.json();
          setPlayers(playersData);
        }

        // 3. Announcements
        const announcementsRes = await fetch(`${API_BASE_URL}/announcements/`);
        if (announcementsRes.ok) {
          const announcementsData = await announcementsRes.json();
          setAnnouncements(announcementsData);
        }

        // 4. Schedule
        const scheduleRes = await fetch(`${API_BASE_URL}/schedule/`);
        if (scheduleRes.ok) {
          const scheduleData = await scheduleRes.json();
          setSchedule(scheduleData);
        }

        // 5. Rules
        const rulesRes = await fetch(`${API_BASE_URL}/rules/`);
        if (rulesRes.ok) {
          const rulesData = await rulesRes.json();
          setRules(rulesData);
        }

        // 6. Gallery
        const galleryRes = await fetch(`${API_BASE_URL}/gallery/`);
        if (galleryRes.ok) {
          const galleryData = await galleryRes.json();
          setGallery(galleryData);
        }

        // 7. Roles
        const rolesRes = await fetch(`${API_BASE_URL}/roles/`);
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          setRoles(rolesData);
        }

        setError(null);
      } catch (err: any) {
        console.error("Could not connect to Django API:", err.message);
        setError("Ошибка подключения к серверу БД");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  // Post recruitment submissions to Django backend
  const submitRecruitment = async (form: FormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recruitment/submit/`, {
        method: 'POST',
        body: form
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error during submission');
      }

      const resData = await response.json();
      return {
        success: true,
        assessmentGrade: resData.assessmentGrade
      };
    } catch (err: any) {
      console.error("Submission failed, falling back to local scoring algorithm:", err.message);
      // Fail-safe offline score algorithm
      let localGrade: 'unqualified' | 'accepted_with_test' | 'excellent' = 'accepted_with_test';
      const playTime = Number(form.get('playTime')) || 4;
      const age = Number(form.get('age')) || 18;
      if (playTime >= 6 && age >= 16) {
        localGrade = 'excellent';
      } else if (age < 15) {
        localGrade = 'unqualified';
      }
      return {
        success: false,
        assessmentGrade: localGrade,
        error: err.message
      };
    }
  };

  return (
    <ClanContext.Provider
      value={{
        settings,
        players,
        announcements,
        schedule,
        rules,
        gallery,
        roles,
        loading,
        error,
        submitRecruitment
      }}
    >
      {children}
    </ClanContext.Provider>
  );
}

export function useClan() {
  const context = useContext(ClanContext);
  if (context === undefined) {
    throw new Error('useClan must be used within a ClanProvider');
  }
  return context;
}
