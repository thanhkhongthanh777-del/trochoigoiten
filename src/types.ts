export type GameId =
  | 'wheel'
  | 'mystery-gift'
  | 'space-names'
  | 'star-catcher'
  | 'train-express'
  | 'secret-door'
  | 'cloud-sky'
  | 'robot-helper'
  | 'balloon-pop'
  | 'claw-machine'
  | 'speed-race'
  | 'apple-tree'
  | 'treasure-island';

export type FairnessMode = 'pure-random' | 'no-repeat' | 'priority-uncalled';

export type RepeatAvoidance = 1 | 3 | 5 | 'all';

export type ThemeId = 'rainbow' | 'space' | 'nature' | 'ocean' | 'dino' | 'robot';

export interface Student {
  id: string;
  name: string;
  callCount: number;
  lastCalledAt?: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  students: Student[];
}

export interface HistoryRecord {
  id: string;
  classId: string;
  studentId: string;
  studentName: string;
  time: string; // e.g. "08:15"
  date: string; // e.g. "23/09/2026"
  timestamp: number;
  gameId: GameId;
  gameName: string;
}

export interface AppSettings {
  theme: ThemeId;
  fairnessMode: FairnessMode;
  repeatAvoidance: RepeatAvoidance;
  soundEnabled: boolean;
  effectsEnabled: boolean;
  confettiEnabled: boolean;
  durationSeconds: number; // Duration of suspense before reveal (e.g. 2, 3.5, 5)
  projectorMode: boolean;
}

export interface GameInfo {
  id: GameId;
  title: string;
  icon: string;
  badge: string;
  description: string;
  actionText: string;
  bgAccent: string;
}
