import React from 'react';
import {
  Gamepad2,
  Users,
  Dices,
  RotateCcw,
  History,
  Settings,
} from 'lucide-react';

interface NavigationProps {
  isPlaying: boolean;
  canReroll: boolean;
  onOpenGameSelector: () => void;
  onOpenStudentManager: () => void;
  onTriggerCall: () => void;
  onRequestReroll: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isPlaying,
  canReroll,
  onOpenGameSelector,
  onOpenStudentManager,
  onTriggerCall,
  onRequestReroll,
  onOpenHistory,
  onOpenSettings,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
      <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-amber-200/80 shadow-lg shadow-amber-900/5">
        {/* 1. Chọn trò chơi */}
        <button
          onClick={onOpenGameSelector}
          className="flex-1 min-w-[100px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-100/70 text-slate-700 hover:text-amber-950 font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Gamepad2 className="w-5 h-5 text-amber-600" />
          <span className="whitespace-nowrap">🎮 Trò chơi</span>
        </button>

        {/* 2. Danh sách học sinh */}
        <button
          onClick={onOpenStudentManager}
          className="flex-1 min-w-[100px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-100/70 text-slate-700 hover:text-amber-950 font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Users className="w-5 h-5 text-blue-600" />
          <span className="whitespace-nowrap">👥 Học sinh</span>
        </button>

        {/* 3. Gọi tên (PRIMARY HIGHLIGHT BUTTON) */}
        <button
          onClick={onTriggerCall}
          disabled={isPlaying}
          className="flex-[1.5] min-w-[130px] py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 disabled:opacity-75 disabled:cursor-not-allowed text-white font-display font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 ring-2 ring-amber-300"
        >
          <Dices className="w-6 h-6 animate-pulse" />
          <span className="whitespace-nowrap">🎲 GỌI TÊN</span>
        </button>

        {/* 4. Gọi lại */}
        <button
          onClick={onRequestReroll}
          disabled={isPlaying || !canReroll}
          className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
            canReroll && !isPlaying
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 active:scale-95'
              : 'bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed'
          }`}
          title={canReroll ? 'Chọn lại học sinh khác' : 'Chưa có học sinh vừa được gọi'}
        >
          <RotateCcw className="w-4 h-4 text-amber-600" />
          <span className="whitespace-nowrap">🔄 Gọi lại</span>
        </button>

        {/* 5. Lịch sử */}
        <button
          onClick={onOpenHistory}
          className="flex-1 min-w-[90px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-100/70 text-slate-700 hover:text-amber-950 font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <History className="w-4 h-4 text-purple-600" />
          <span className="whitespace-nowrap">📜 Lịch sử</span>
        </button>

        {/* 6. Cài đặt */}
        <button
          onClick={onOpenSettings}
          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-100/70 text-slate-700 hover:text-amber-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
          title="Cài đặt"
        >
          <Settings className="w-4 h-4 text-slate-600" />
          <span className="hidden md:inline whitespace-nowrap">⚙️ Cài đặt</span>
        </button>
      </nav>
    </div>
  );
};
