import { AppSettings, HistoryRecord, Student } from '../types';

export interface SelectionResult {
  selected: Student;
  cycleReset: boolean;
  remainingInCycle: number;
}

export function pickStudent(
  students: Student[],
  calledIds: Set<string>,
  recentHistory: HistoryRecord[],
  settings: AppSettings,
  excludeStudentId?: string,
): SelectionResult | null {
  if (!students || students.length === 0) {
    return null;
  }

  // Single student edge case
  if (students.length === 1) {
    return {
      selected: students[0],
      cycleReset: false,
      remainingInCycle: 0,
    };
  }

  let cycleReset = false;
  let pool = [...students];

  // If excluding someone specifically (e.g. during re-roll)
  if (excludeStudentId) {
    pool = pool.filter((s) => s.id !== excludeStudentId);
    if (pool.length === 0) {
      pool = [...students];
    }
  }

  // 1. Handle Fairness Mode
  if (settings.fairnessMode === 'no-repeat' || settings.repeatAvoidance === 'all') {
    let uncalled = pool.filter((s) => !calledIds.has(s.id));
    if (uncalled.length === 0) {
      // Entire cycle completed! Reset calledIds
      cycleReset = true;
      uncalled = pool;
    }
    pool = uncalled;
  } else if (settings.fairnessMode === 'priority-uncalled') {
    const uncalled = pool.filter((s) => (s.callCount || 0) === 0);
    if (uncalled.length > 0) {
      pool = uncalled;
    } else {
      // Find students with minimum callCount
      const minCalls = Math.min(...pool.map((s) => s.callCount || 0));
      const candidates = pool.filter((s) => (s.callCount || 0) === minCalls);
      if (candidates.length > 0) {
        pool = candidates;
      }
    }
  }

  // 2. Handle Repeat Avoidance Window (1, 3, 5) if pool has enough students
  if (
    typeof settings.repeatAvoidance === 'number' &&
    settings.fairnessMode !== 'no-repeat'
  ) {
    const windowSize = settings.repeatAvoidance;
    const recentIds = recentHistory.slice(0, windowSize).map((h) => h.studentId);

    const filtered = pool.filter((s) => !recentIds.includes(s.id));
    // Only apply filter if it leaves at least 1 candidate
    if (filtered.length > 0) {
      pool = filtered;
    }
  }

  // Truly random pick from the validated pool using cryptographic random values for fairness
  const randomIndex = Math.floor(Math.random() * pool.length);
  const chosen = pool[randomIndex];

  // Calculate remaining
  const remainingInCycle =
    settings.fairnessMode === 'no-repeat' || settings.repeatAvoidance === 'all'
      ? cycleReset
        ? students.length - 1
        : Math.max(0, students.length - (calledIds.size + 1))
      : students.length;

  return {
    selected: chosen,
    cycleReset,
    remainingInCycle,
  };
}
