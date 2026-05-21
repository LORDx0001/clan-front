export interface Player {
  id: string;
  nickname: string;
  role: string;
  device: string;
  kd?: number; // K/D Ratio
  level: number;
  signatureWeapon: string;
  avatar: string;
  profileMedia?: string;
  achievements: string[];
  region: string;
  joinedDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  type: 'tournament' | 'training' | 'scrim' | 'news';
  date: string;
  content: string;
  countdownDate?: string; // ISO String to countdown to
  author: string;
  imageUrl?: string;
  views: number;
}

export interface GalleryItem {
  id: string;
  type: 'video' | 'screenshot' | 'trophy';
  title: string;
  category: string;
  fileUrl: string; // Video URL or image URL
  thumbnail: string;
  description?: string;
  taggedPlayers?: { id: string; nickname: string }[];
  views: number;
  likes: number;
  date: string;
  author: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'scrim' | 'training' | 'tournament' | 'meeting';
  datetime: string; // ISO date-time
  teamSize: string; // "Squad", "Duo", "Solo"
  prizePool?: string;
  slotsFilled: number;
  slotsTotal: number;
  opponent?: string;
}

export interface ClanRule {
  id: string;
  category: string;
  title: string;
  content: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RecruitmentForm {
  nickname: string;
  gameId: string;
  age: number;
  device: string;
  kd?: number;
  role: string;
  playTime: number; // Hours per day
  discordTelegram: string;
  about: string;
}
