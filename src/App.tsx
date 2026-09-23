/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AppSettings,
  ClassRoom,
  GameId,
  HistoryRecord,
  Student,
} from './types';
import {
  DEFAULT_CLASSES,
  DEFAULT_SETTINGS,
  loadClasses,
  loadCurrentClassId,
  loadHistory,
  loadSettings,
  loadCalledStudentIds,
  saveClasses,
  saveCurrentClassId,
  saveHistory,
  saveSettings,
  saveCalledStudentIds,
} from './utils/storage';
import { pickStudent } from './utils/selection';
import { GAMES } from './utils/games';
import { sound } from './utils/audio';
import { fireCelebrationConfetti } from './utils/confetti';

// Components
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ResultCelebrationModal } from './components/ResultCelebrationModal';
import { ConfirmRerollModal } from './components/ConfirmRerollModal';
import { GameSelectorModal } from './components/GameSelectorModal';
import { StudentManagerModal } from './components/StudentManagerModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';

// Games
import { WheelGame } from './components/games/WheelGame';
import { MysteryGiftGame } from './components/games/MysteryGiftGame';
import { SpaceGame } from './components/games/SpaceGame';
import { StarCatcherGame } from './components/games/StarCatcherGame';
import { TrainGame } from './components/games/TrainGame';
import { SecretDoorGame } from './components/games/SecretDoorGame';
import { CloudSkyGame } from './components/games/CloudSkyGame';
import { RobotGame } from './components/games/RobotGame';
import { BalloonPopGame } from './components/games/BalloonPopGame';
import { ClawMachineGame } from './components/games/ClawMachineGame';
import { SpeedRaceGame } from './components/games/SpeedRaceGame';
import { AppleTreeGame } from './components/games/AppleTreeGame';
import { TreasureIslandGame } from './components/games/TreasureIslandGame';
import { DramaticSuspenseStage } from './components/DramaticSuspenseStage';

// Icons
import { Sparkles, Dices, RotateCcw, Monitor, Gamepad2, Users } from 'lucide-react';

export default function App() {
  // Application Data States
  const [classes, setClasses] = useState<ClassRoom[]>(() => loadClasses());
  const [currentClassId, setCurrentClassId] = useState<string>(() =>
    loadCurrentClassId(classes)
  );
  const [history, setHistory] = useState<HistoryRecord[]>(() => loadHistory());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [calledStudentIds, setCalledStudentIds] = useState<Set<string>>(() =>
    loadCalledStudentIds(currentClassId)
  );

  // Active Game State
  const [activeGameId, setActiveGameId] = useState<GameId>('wheel');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [targetStudent, setTargetStudent] = useState<Student | null>(null);
  const [justCalledStudent, setJustCalledStudent] = useState<Student | null>(null);

  // Modals & UI States
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [showConfirmReroll, setShowConfirmReroll] = useState<boolean>(false);
  const [isGameSelectorOpen, setIsGameSelectorOpen] = useState<boolean>(false);
  const [isStudentManagerOpen, setIsStudentManagerOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Banner message for cycle completion or alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Current Classroom
  const currentClass = useMemo(() => {
    return (
      classes.find((c) => c.id === currentClassId) ||
      classes[0] ||
      DEFAULT_CLASSES[0]
    );
  }, [classes, currentClassId]);

  // Sync sound engine enabled state
  useEffect(() => {
    sound.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Save changes to LocalStorage
  useEffect(() => {
    saveClasses(classes);
  }, [classes]);

  useEffect(() => {
    saveCurrentClassId(currentClassId);
    setCalledStudentIds(loadCalledStudentIds(currentClassId));
  }, [currentClassId]);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveCalledStudentIds(currentClassId, calledStudentIds);
  }, [currentClassId, calledStudentIds]);

  // Show temporary toast banner
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Handler to initiate calling a student
  const handleStartCall = useCallback(
    (excludeStudentId?: string) => {
      if (isPlaying) return;
      const students = currentClass.students;

      if (!students || students.length === 0) {
        setIsStudentManagerOpen(true);
        showToast('⚠️ Vui lòng thêm học sinh vào danh sách lớp trước khi gọi tên!');
        return;
      }

      // Selection algorithm
      const result = pickStudent(
        students,
        calledStudentIds,
        history,
        settings,
        excludeStudentId
      );

      if (!result) {
        showToast('⚠️ Chưa thể chọn học sinh, vui lòng kiểm tra danh sách!');
        return;
      }

      if (result.cycleReset) {
        showToast('🎉 Đã gọi đủ một vòng cả lớp! Tự động bắt đầu vòng gọi mới!');
        setCalledStudentIds(new Set());
      }

      setShowCelebration(false);
      setTargetStudent(result.selected);
      setIsPlaying(true);
    },
    [isPlaying, currentClass.students, calledStudentIds, history, settings, showToast]
  );

  // Handler when game finishes animation & reveals the student
  const handleGameComplete = useCallback(
    (chosen: Student) => {
      setIsPlaying(false);
      setJustCalledStudent(chosen);

      // Trigger celebratory audio and confetti
      if (settings.soundEnabled) {
        sound.playFanfare();
      }
      if (settings.confettiEnabled) {
        fireCelebrationConfetti();
      }

      // Update call count and called students set
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;
      const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(
        now.getMonth() + 1
      ).padStart(2, '0')}/${now.getFullYear()}`;

      // Update class students callCount
      setClasses((prev) =>
        prev.map((cls) => {
          if (cls.id !== currentClassId) return cls;
          return {
            ...cls,
            students: cls.students.map((std) =>
              std.id === chosen.id
                ? {
                    ...std,
                    callCount: (std.callCount || 0) + 1,
                    lastCalledAt: Date.now(),
                  }
                : std
            ),
          };
        })
      );

      // Update called set
      setCalledStudentIds((prev) => {
        const next = new Set(prev);
        next.add(chosen.id);
        return next;
      });

      // Append to history
      const activeGame = GAMES.find((g) => g.id === activeGameId);
      const newRecord: HistoryRecord = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        classId: currentClassId,
        studentId: chosen.id,
        studentName: chosen.name,
        time: timeStr,
        date: dateStr,
        timestamp: Date.now(),
        gameId: activeGameId,
        gameName: activeGame?.title || 'Gọi tên',
      };

      setHistory((prev) => [newRecord, ...prev]);
      setShowCelebration(true);
    },
    [activeGameId, currentClassId, settings]
  );

  // Reroll handler with confirmation
  const handleConfirmReroll = () => {
    setShowConfirmReroll(false);
    setShowCelebration(false);
    sound.playReroll();

    // If rerolling, exclude the student that was just called
    const excludedId = justCalledStudent?.id;
    handleStartCall(excludedId);
  };

  // Student Manager Handlers
  const handleAddStudent = (name: string) => {
    const newStudent: Student = {
      id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      callCount: 0,
    };
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === currentClassId
          ? { ...cls, students: [...cls.students, newStudent] }
          : cls
      )
    );
    showToast(`Đã thêm bạn "${name}" vào ${currentClass.name}`);
  };

  const handleAddBatchStudents = (names: string[]) => {
    const newStudents: Student[] = names.map((name, i) => ({
      id: `std-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      callCount: 0,
    }));
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === currentClassId
          ? { ...cls, students: [...cls.students, ...newStudents] }
          : cls
      )
    );
    showToast(`Đã thêm thành công ${names.length} học sinh từ Excel vào ${currentClass.name}!`);
  };

  const handleEditStudent = (studentId: string, newName: string) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === currentClassId
          ? {
              ...cls,
              students: cls.students.map((s) =>
                s.id === studentId ? { ...s, name: newName } : s
              ),
            }
          : cls
      )
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === currentClassId
          ? {
              ...cls,
              students: cls.students.filter((s) => s.id !== studentId),
            }
          : cls
      )
    );
    setCalledStudentIds((prev) => {
      const next = new Set(prev);
      next.delete(studentId);
      return next;
    });
  };

  const handleClearAllStudents = () => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === currentClassId ? { ...cls, students: [] } : cls
      )
    );
    setCalledStudentIds(new Set());
    showToast(`Đã xóa toàn bộ học sinh trong ${currentClass.name}`);
  };

  const handleCreateClass = (className: string) => {
    const newClass: ClassRoom = {
      id: `class-${Date.now()}`,
      name: className,
      students: [],
    };
    setClasses((prev) => [...prev, newClass]);
    setCurrentClassId(newClass.id);
    showToast(`Đã tạo lớp "${className}" mới! Hãy thêm danh sách học sinh nhé.`);
  };

  const handleRenameClass = (classId: string, newName: string) => {
    setClasses((prev) =>
      prev.map((cls) => (cls.id === classId ? { ...cls, name: newName } : cls))
    );
    showToast(`Đã đổi tên lớp thành "${newName}"`);
  };

  const handleDeleteClass = (classId: string) => {
    const remaining = classes.filter((c) => c.id !== classId);
    if (remaining.length > 0) {
      setClasses(remaining);
      setCurrentClassId(remaining[0].id);
      showToast('Đã xóa lớp học');
    }
  };

  const handleResetCalledStatus = () => {
    setCalledStudentIds(new Set());
    showToast(`Đã làm mới vòng gọi cho ${currentClass.name}! Tất cả các em đều có cơ hội gọi lại.`);
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast('Đã xóa toàn bộ lịch sử gọi tên');
  };

  const handleRestoreDefaults = () => {
    setClasses(DEFAULT_CLASSES);
    setCurrentClassId(DEFAULT_CLASSES[0].id);
    setHistory([]);
    setSettings(DEFAULT_SETTINGS);
    setCalledStudentIds(new Set());
    showToast('Đã khôi phục dữ liệu mẫu ban đầu thành công!');
  };

  // Keyboard Shortcuts (Spacebar to spin/call, Esc to exit modals/projector)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in an input or textarea, ignore shortcuts
      if (
        ['INPUT', 'TEXTAREA'].includes(
          (document.activeElement as HTMLElement)?.tagName
        )
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (showCelebration) {
          setShowCelebration(false);
          handleStartCall();
        } else if (!isPlaying && !showConfirmReroll) {
          handleStartCall();
        }
      } else if (e.code === 'Escape') {
        if (showConfirmReroll) setShowConfirmReroll(false);
        else if (showCelebration) setShowCelebration(false);
        else if (isGameSelectorOpen) setIsGameSelectorOpen(false);
        else if (isStudentManagerOpen) setIsStudentManagerOpen(false);
        else if (isHistoryOpen) setIsHistoryOpen(false);
        else if (isSettingsOpen) setIsSettingsOpen(false);
        else if (settings.projectorMode) {
          setSettings((prev) => ({ ...prev, projectorMode: false }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showCelebration,
    isPlaying,
    showConfirmReroll,
    isGameSelectorOpen,
    isStudentManagerOpen,
    isHistoryOpen,
    isSettingsOpen,
    settings.projectorMode,
    handleStartCall,
  ]);

  // Current Active Game Info
  const activeGameInfo = useMemo(() => {
    return GAMES.find((g) => g.id === activeGameId) || GAMES[0];
  }, [activeGameId]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 theme-${settings.theme} ${
        settings.projectorMode ? 'p-2 sm:p-4 bg-slate-950/5' : 'pb-12'
      }`}
      style={{
        background: 'var(--bg-gradient)',
      }}
    >
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 py-2.5 px-6 bg-slate-900/90 text-white rounded-full font-bold text-sm shadow-xl backdrop-blur-md animate-in slide-in-from-top-4 flex items-center gap-2 border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        currentClass={currentClass}
        allClasses={classes}
        calledCount={calledStudentIds.size}
        soundEnabled={settings.soundEnabled}
        isProjectorMode={settings.projectorMode}
        onSelectClass={setCurrentClassId}
        onToggleSound={() =>
          setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onToggleProjector={() =>
          setSettings((prev) => ({ ...prev, projectorMode: !prev.projectorMode }))
        }
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStudentManager={() => setIsStudentManagerOpen(true)}
      />

      {/* Main Center Stage */}
      <main
        className={`flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 ${
          settings.projectorMode ? 'my-auto py-2' : 'py-4'
        }`}
      >
        {/* Projector Mode Minimalist Floating Controls */}
        {settings.projectorMode ? (
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <button
              onClick={() => setIsGameSelectorOpen(true)}
              className="py-2 px-4 rounded-xl bg-white/90 hover:bg-white text-slate-800 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 border border-slate-200"
            >
              <Gamepad2 className="w-4 h-4 text-amber-600" />
              <span>Đổi trò chơi: {activeGameInfo.title}</span>
            </button>

            <div className="flex items-center gap-2">
              {justCalledStudent && (
                <button
                  onClick={() => setShowConfirmReroll(true)}
                  disabled={isPlaying}
                  className="py-2 px-3.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Gọi lại</span>
                </button>
              )}
              <span className="text-xs text-slate-500 font-bold bg-white/70 px-3 py-1.5 rounded-xl">
                Phím cách (Space): Gọi tên
              </span>
            </div>
          </div>
        ) : (
          /* Normal mode: Desktop game bar & mobile button */
          <div className="w-full flex flex-col items-center mb-2">
            {/* Desktop Game Quick Selector Strip */}
            <div className="hidden lg:flex items-center gap-1.5 p-1.5 bg-white/75 backdrop-blur-md rounded-2xl border border-amber-200/80 shadow-sm max-w-6xl overflow-x-auto mb-1">
              {GAMES.map((g) => {
                const isActive = activeGameId === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setActiveGameId(g.id)}
                    className={`py-1.5 px-3 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/40 scale-105'
                        : 'text-slate-700 hover:bg-amber-50 hover:text-amber-900'
                    }`}
                  >
                    <span className="text-base">{g.icon}</span>
                    <span className="whitespace-nowrap">{g.title}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setIsGameSelectorOpen(true)}
                className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs shrink-0 whitespace-nowrap ml-1 flex items-center gap-1"
                title="Xem danh mục tất cả trò chơi"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Kho 13 trò chơi</span>
              </button>
            </div>

            {/* Mobile / Tablet compact tag */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setIsGameSelectorOpen(true)}
                className="px-4 py-1.5 bg-white/80 hover:bg-white text-slate-700 hover:text-amber-800 rounded-full font-bold text-xs sm:text-sm border border-slate-200/80 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {activeGameInfo.icon}
                </span>
                <span>{activeGameInfo.title}</span>
                <span className="text-[11px] text-amber-600 font-extrabold underline ml-1">
                  (Đổi trong 13 trò chơi)
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Dramatic Tension / Suspense Stage Bar */}
        <DramaticSuspenseStage
          isPlaying={isPlaying}
          students={currentClass.students}
          durationSeconds={settings.durationSeconds}
        />

        {/* Selected Game Rendering */}
        <div className="w-full flex items-center justify-center">
          {activeGameId === 'wheel' && (
            <WheelGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onSpinStart={() => handleStartCall()}
              onSpinComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'mystery-gift' && (
            <MysteryGiftGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'space-names' && (
            <SpaceGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'star-catcher' && (
            <StarCatcherGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'train-express' && (
            <TrainGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'secret-door' && (
            <SecretDoorGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'cloud-sky' && (
            <CloudSkyGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'robot-helper' && (
            <RobotGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'balloon-pop' && (
            <BalloonPopGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'claw-machine' && (
            <ClawMachineGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'speed-race' && (
            <SpeedRaceGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'apple-tree' && (
            <AppleTreeGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}

          {activeGameId === 'treasure-island' && (
            <TreasureIslandGame
              students={currentClass.students}
              isPlaying={isPlaying}
              selectedStudent={targetStudent}
              durationSeconds={settings.durationSeconds}
              isProjectorMode={settings.projectorMode}
              onPlayStart={() => handleStartCall()}
              onPlayComplete={handleGameComplete}
            />
          )}
        </div>
      </main>

      {/* Main Navigation Bar (Hidden in projector mode for clean 16:9 presentation) */}
      {!settings.projectorMode && (
        <Navigation
          isPlaying={isPlaying}
          canReroll={!!justCalledStudent}
          onOpenGameSelector={() => setIsGameSelectorOpen(true)}
          onOpenStudentManager={() => setIsStudentManagerOpen(true)}
          onTriggerCall={() => handleStartCall()}
          onRequestReroll={() => setShowConfirmReroll(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Modals */}
      <ResultCelebrationModal
        isOpen={showCelebration}
        student={justCalledStudent}
        gameTitle={activeGameInfo.title}
        orderNumber={history.length}
        isProjectorMode={settings.projectorMode}
        onClose={() => setShowCelebration(false)}
        onCallAgain={() => {
          setShowCelebration(false);
          handleStartCall();
        }}
        onReroll={() => {
          setShowConfirmReroll(true);
        }}
      />

      <ConfirmRerollModal
        isOpen={showConfirmReroll}
        studentName={justCalledStudent?.name}
        onConfirm={handleConfirmReroll}
        onCancel={() => setShowConfirmReroll(false)}
      />

      <GameSelectorModal
        isOpen={isGameSelectorOpen}
        activeGameId={activeGameId}
        onSelectGame={(id) => setActiveGameId(id)}
        onClose={() => setIsGameSelectorOpen(false)}
      />

      <StudentManagerModal
        isOpen={isStudentManagerOpen}
        classes={classes}
        currentClassId={currentClassId}
        calledStudentIds={calledStudentIds}
        onClose={() => setIsStudentManagerOpen(false)}
        onSelectClass={setCurrentClassId}
        onAddStudent={handleAddStudent}
        onAddBatchStudents={handleAddBatchStudents}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
        onClearAllStudents={handleClearAllStudents}
        onCreateClass={handleCreateClass}
        onRenameClass={handleRenameClass}
        onDeleteClass={handleDeleteClass}
        onResetCalledStatus={handleResetCalledStatus}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        history={history}
        currentClassName={currentClass.name}
        onClose={() => setIsHistoryOpen(false)}
        onClearHistory={handleClearHistory}
        onResetCycle={handleResetCalledStatus}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        currentClassName={currentClass.name}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={(newVals) =>
          setSettings((prev) => ({ ...prev, ...newVals }))
        }
        onRenameClass={(newName) => handleRenameClass(currentClassId, newName)}
        onRestoreDefaults={handleRestoreDefaults}
      />
    </div>
  );
}
