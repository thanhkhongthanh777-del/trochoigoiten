import React from 'react';
import {
  Monitor,
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  Users,
  ChevronDown,
} from 'lucide-react';
import { ClassRoom } from '../types';

interface HeaderProps {
  currentClass: ClassRoom;
  allClasses: ClassRoom[];
  calledCount: number;
  soundEnabled: boolean;
  isProjectorMode: boolean;
  onSelectClass: (classId: string) => void;
  onToggleSound: () => void;
  onToggleProjector: () => void;
  onOpenSettings: () => void;
  onOpenStudentManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentClass,
  allClasses,
  calledCount,
  soundEnabled,
  isProjectorMode,
  onSelectClass,
  onToggleSound,
  onToggleProjector,
  onOpenSettings,
  onOpenStudentManager,
}) => {
  const totalStudents = currentClass.students.length;
  const remainingStudents = Math.max(0, totalStudents - calledCount);

  // In projector mode, render a sleek minimalist presentation top-bar
  if (isProjectorMode) {
    return (
      <header className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-lg shadow-md">
            🎓
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
              VUI HỌC – GỌI TÊN HỌC SINH
            </h1>
            <p className="text-xs font-bold text-slate-600">
              {currentClass.name} · {totalStudents} học sinh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow-sm border border-slate-200 transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          <button
            onClick={onToggleProjector}
            className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105"
          >
            <Monitor className="w-4 h-4 text-amber-400" />
            <span>Thoát trình chiếu (Esc)</span>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-40 rounded-b-2xl shadow-sm">
      {/* Brand & Class Details */}
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl shadow-md shadow-orange-500/20">
            ⭐
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-black tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>VUI HỌC</span>
              <span className="text-amber-500">—</span>
              <span className="text-amber-600">GỌI TÊN HỌC SINH</span>
            </h1>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-0.5">
              <span>Ứng dụng hỗ trợ giáo viên tiểu học</span>
            </div>
          </div>
        </div>

        {/* Quick Class Picker badge (mobile view) */}
        <button
          onClick={onOpenStudentManager}
          className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-amber-100/80 text-amber-900 rounded-xl font-bold text-xs"
        >
          <Users className="w-3.5 h-3.5" />
          <span>{currentClass.name}</span>
        </button>
      </div>

      {/* Center class indicator & Progress badge */}
      <div className="hidden sm:flex items-center gap-3">
        <div
          onClick={onOpenStudentManager}
          className="cursor-pointer py-1.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-2 transition-colors"
          title="Bấm để đổi lớp hoặc chỉnh sửa danh sách"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-sm text-amber-950">
            {currentClass.name}
          </span>
          <span className="text-xs text-amber-700 font-semibold">
            ({totalStudents} học sinh · Còn {remainingStudents} chưa gọi)
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
        </div>
      </div>

      {/* Right Quick Controls */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-colors"
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-amber-600" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {/* Projector Mode Toggle */}
        <button
          onClick={onToggleProjector}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 flex items-center gap-2 transition-transform active:scale-95"
          title="Bật giao diện máy chiếu toàn màn hình tối ưu 16:9"
        >
          <Monitor className="w-4 h-4 text-amber-300" />
          <span className="whitespace-nowrap">🖥️ Máy chiếu</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-colors"
          title="Cài đặt"
        >
          <Settings className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
};
