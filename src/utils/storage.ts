import { AppSettings, ClassRoom, HistoryRecord, Student } from '../types';

const STORAGE_KEY_CLASSES = 'vuihoc_classes_v1';
const STORAGE_KEY_CURRENT_CLASS = 'vuihoc_current_class_v1';
const STORAGE_KEY_HISTORY = 'vuihoc_history_v1';
const STORAGE_KEY_SETTINGS = 'vuihoc_settings_v1';
const STORAGE_KEY_CALLED_STUDENTS = 'vuihoc_called_students_v1';

export const INITIAL_STUDENTS_LOP_3_4: string[] = [
  'Nguyễn Minh An',
  'Trần Gia Bảo',
  'Lê Hoàng Anh',
  'Nguyễn Khánh Linh',
  'Phạm Minh Quân',
  'Vũ Thảo My',
  'Đặng Quốc Tuấn',
  'Bùi Ngọc Ánh',
  'Đỗ Hải Đăng',
  'Hoàng Bảo Châu',
  'Ngô Phương Thảo',
  'Võ Thành Nam',
  'Dương Thu Trang',
  'Lý Gia Huy',
  'Trịnh Hoài An',
  'Phan Đức Trí',
  'Nguyễn Thùy Chi',
  'Đinh Tiến Dũng',
  'Lâm Gia Linh',
  'Trần Phúc Khang',
  'Hà Quỳnh Anh',
  'Mai Tuấn Kiệt',
  'Chu Minh Triết',
  'Nguyễn Ngọc Diệp',
  'Tạ Quang Vinh',
  'Phùng Diệu Linh',
  'Đoàn Bảo Ngọc',
  'Vương Quốc Hưng',
];

export const INITIAL_STUDENTS_LOP_4_1: string[] = [
  'Bùi Minh Khang',
  'Đỗ Thu Thảo',
  'Nguyễn Hoàng Bách',
  'Trần Bảo Trâm',
  'Lê Tuấn Hưng',
  'Phạm Hà My',
  'Vũ Đức Anh',
  'Đặng Ngọc Mai',
  'Hoàng Minh Trí',
  'Ngô Thanh Hằng',
  'Dương Nhật Minh',
  'Võ Quỳnh Nga',
  'Lý Văn Hậu',
  'Trần Ngọc Hân',
  'Phan Quốc Đạt',
  'Nguyễn Cẩm Ly',
  'Đinh Quang Huy',
  'Bùi Yến Nhi',
  'Mai Anh Tú',
  'Lâm Mỹ Duyên',
];

export const DEFAULT_CLASSES: ClassRoom[] = [
  {
    id: 'class-3-4',
    name: 'Lớp 3/4',
    students: INITIAL_STUDENTS_LOP_3_4.map((name, idx) => ({
      id: `std-34-${idx + 1}`,
      name,
      callCount: 0,
    })),
  },
  {
    id: 'class-4-1',
    name: 'Lớp 4/1',
    students: INITIAL_STUDENTS_LOP_4_1.map((name, idx) => ({
      id: `std-41-${idx + 1}`,
      name,
      callCount: 0,
    })),
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'rainbow',
  fairnessMode: 'no-repeat',
  repeatAvoidance: 'all',
  soundEnabled: true,
  effectsEnabled: true,
  confettiEnabled: true,
  durationSeconds: 3.5,
  projectorMode: false,
};

// Excel paste parser
export function parseExcelStudentNames(rawText: string): string[] {
  if (!rawText) return [];

  const lines = rawText.split(/\r?\n/);
  const result: string[] = [];

  for (const rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    // If tab-delimited (like STT \t Tên or STT \t Họ và tên \t Ngày sinh), find the name part
    if (line.includes('\t')) {
      const parts = line.split('\t').map((p) => p.trim()).filter(Boolean);
      // Usually the second column is name if first is number, or find the part that looks like a name
      const textParts = parts.filter((p) => !/^\d+$/.test(p) && !/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(p));
      if (textParts.length > 0) {
        line = textParts[0];
      }
    }

    // Strip leading numbers: "1. Nguyễn Văn A", "01/ Nguyễn Văn A", "1 - Nguyễn Văn A", "1) Nguyễn Văn A", "STT 1: Nguyễn Văn A"
    line = line.replace(/^(stt\s*)?\d+[\.\/\)\-\:\s]+/i, '').trim();

    // Strip trailing remarks or numbers
    line = line.replace(/[\t]+.*$/, '').trim();

    if (line && line.length >= 2) {
      result.push(line);
    }
  }

  return result;
}

// LocalStorage helpers
export function loadClasses(): ClassRoom[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CLASSES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load classes from storage', err);
  }
  return DEFAULT_CLASSES;
}

export function saveClasses(classes: ClassRoom[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
  } catch (err) {
    console.error('Failed to save classes to storage', err);
  }
}

export function loadCurrentClassId(classes: ClassRoom[]): string {
  try {
    const currentId = localStorage.getItem(STORAGE_KEY_CURRENT_CLASS);
    if (currentId && classes.some((c) => c.id === currentId)) {
      return currentId;
    }
  } catch (err) {
    console.error('Failed to load current class id', err);
  }
  return classes[0]?.id || 'class-3-4';
}

export function saveCurrentClassId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_CLASS, id);
  } catch (err) {
    console.error('Failed to save current class id', err);
  }
}

export function loadHistory(): HistoryRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load history', err);
  }
  return [];
}

export function saveHistory(history: HistoryRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save history', err);
  }
}

export function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Failed to load settings', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

// Track which students have been called in current cycle per class
export function loadCalledStudentIds(classId: string): Set<string> {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_CALLED_STUDENTS}_${classId}`);
    if (data) {
      const arr = JSON.parse(data);
      if (Array.isArray(arr)) {
        return new Set(arr);
      }
    }
  } catch (err) {
    console.error('Failed to load called student ids', err);
  }
  return new Set<string>();
}

export function saveCalledStudentIds(classId: string, ids: Set<string>) {
  try {
    localStorage.setItem(
      `${STORAGE_KEY_CALLED_STUDENTS}_${classId}`,
      JSON.stringify(Array.from(ids)),
    );
  } catch (err) {
    console.error('Failed to save called student ids', err);
  }
}
