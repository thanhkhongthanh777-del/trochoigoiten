import React from 'react';
import { Sparkles, RotateCcw, Play, X, Award, CheckCircle2 } from 'lucide-react';
import { Student } from '../types';

interface ResultCelebrationModalProps {
  isOpen: boolean;
  student: Student | null;
  gameTitle: string;
  orderNumber: number;
  isProjectorMode: boolean;
  onClose: () => void;
  onCallAgain: () => void;
  onReroll: () => void;
}

export const ResultCelebrationModal: React.FC<ResultCelebrationModalProps> = ({
  isOpen,
  student,
  gameTitle,
  orderNumber,
  isProjectorMode,
  onClose,
  onCallAgain,
  onReroll,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full ${
          isProjectorMode ? 'max-w-4xl p-8 sm:p-12' : 'max-w-2xl p-6 sm:p-8'
        } bg-gradient-to-b from-amber-50 via-white to-amber-50 rounded-3xl sm:rounded-[2.5rem] shadow-2xl border-4 sm:border-8 border-amber-400 text-center overflow-hidden`}
      >
        {/* Decorative corner stars */}
        <div className="absolute top-4 left-4 text-3xl sm:text-4xl animate-bounce">
          ⭐
        </div>
        <div className="absolute top-4 right-4 text-3xl sm:text-4xl animate-bounce delay-150">
          🎉
        </div>
        <div className="absolute bottom-4 left-4 text-2xl sm:text-3xl animate-pulse">
          🎈
        </div>
        <div className="absolute bottom-4 right-4 text-2xl sm:text-3xl animate-pulse delay-200">
          ✨
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
          title="Đóng"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Ribbon */}
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold text-sm sm:text-lg shadow-md mb-4 sm:mb-6 uppercase tracking-wider">
          <Sparkles className="w-5 h-5 animate-spin-slow" />
          <span>Ai sẽ được gọi? · {gameTitle}</span>
          <Sparkles className="w-5 h-5 animate-spin-slow" />
        </div>

        {/* Big student name badge */}
        <div className="my-3 sm:my-6 py-6 sm:py-10 px-4 bg-gradient-to-r from-amber-100/70 via-yellow-100/90 to-amber-100/70 rounded-3xl border-2 sm:border-4 border-amber-300 shadow-inner">
          <p className="text-amber-700 font-extrabold text-lg sm:text-2xl mb-2 flex items-center justify-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            BẠN ĐƯỢC CHỌN LÀ:
          </p>

          <h2
            className={`font-display font-black text-amber-950 tracking-tight leading-tight select-all drop-shadow-sm ${
              isProjectorMode
                ? 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'
                : 'text-3xl sm:text-5xl md:text-6xl'
            }`}
          >
            ⭐ {student.name} ⭐
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2 text-emerald-700 font-bold text-base sm:text-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>Xin chúc mừng! Chúc bạn hoàn thành thật tốt câu hỏi!</span>
          </div>
        </div>

        {/* Metadata info */}
        <div className="text-slate-500 text-sm sm:text-base font-semibold mb-6 sm:mb-8 flex items-center justify-center gap-4">
          <span>Lượt gọi thứ #{orderNumber}</span>
          <span>•</span>
          <span>Đã gọi {student.callCount} lần</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onReroll}
            className="flex-1 min-w-[140px] max-w-[220px] py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Gọi lại</span>
          </button>

          <button
            onClick={onCallAgain}
            className="flex-1 min-w-[180px] max-w-[280px] py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base sm:text-xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Gọi tiếp bạn khác</span>
          </button>

          <button
            onClick={onClose}
            className="py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-base sm:text-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
