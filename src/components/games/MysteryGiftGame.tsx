import React, { useEffect, useState } from 'react';
import { Gift, Sparkles, Play, Flame } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface MysteryGiftGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

const GIFT_THEMES = [
  { bg: 'from-pink-500 via-rose-600 to-red-600', ribbon: 'bg-amber-300', icon: '🎁', shadow: 'shadow-pink-500/40' },
  { bg: 'from-amber-400 via-orange-500 to-amber-600', ribbon: 'bg-red-600', icon: '🎀', shadow: 'shadow-orange-500/40' },
  { bg: 'from-blue-500 via-indigo-600 to-blue-700', ribbon: 'bg-yellow-300', icon: '✨', shadow: 'shadow-blue-500/40' },
  { bg: 'from-emerald-400 via-teal-600 to-green-600', ribbon: 'bg-amber-400', icon: '🍀', shadow: 'shadow-emerald-500/40' },
  { bg: 'from-purple-500 via-fuchsia-600 to-purple-700', ribbon: 'bg-cyan-300', icon: '⭐', shadow: 'shadow-purple-500/40' },
  { bg: 'from-cyan-400 via-blue-500 to-teal-600', ribbon: 'bg-pink-400', icon: '🎈', shadow: 'shadow-cyan-500/40' },
  { bg: 'from-yellow-400 via-amber-500 to-yellow-600', ribbon: 'bg-indigo-600', icon: '💎', shadow: 'shadow-yellow-500/40' },
  { bg: 'from-red-500 via-rose-600 to-red-700', ribbon: 'bg-yellow-300', icon: '🎉', shadow: 'shadow-red-500/40' },
];

export const MysteryGiftGame: React.FC<MysteryGiftGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [activeBoxIndex, setActiveBoxIndex] = useState<number | null>(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [revealedStudent, setRevealedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsOpened(false);
      setRevealedStudent(null);
      const randomBox = Math.floor(Math.random() * GIFT_THEMES.length);
      setActiveBoxIndex(randomBox);

      // Box rattle & ticking sounds
      const interval = setInterval(() => {
        sound.playTick(480 + Math.random() * 220);
      }, 250);

      const timer = setTimeout(() => {
        clearInterval(interval);
        sound.playGiftOpen();
        sound.playExplosion();
        setIsOpened(true);
        setRevealedStudent(selectedStudent);

        setTimeout(() => {
          onPlayComplete(selectedStudent);
        }, 800);
      }, durationSeconds * 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    } else {
      setActiveBoxIndex(null);
      setIsOpened(false);
    }
  }, [isPlaying, selectedStudent]);

  const handleBoxClick = (idx: number) => {
    if (!isPlaying && students.length > 0) {
      setActiveBoxIndex(idx);
      onPlayStart();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-2">
      {/* Game Stage Arena */}
      <div
        className={`relative w-full ${
          isProjectorMode ? 'h-[440px] sm:h-[480px]' : 'h-96 sm:h-[420px]'
        } rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 border-4 border-amber-400 shadow-2xl flex flex-col justify-between p-4 sm:p-6`}
      >
        {/* Spotlight Sweeps in Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 left-1/4 w-80 h-[500px] bg-gradient-to-b from-yellow-300/25 via-amber-400/10 to-transparent blur-3xl animate-spotlight" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-slate-900/80 rounded-2xl border border-amber-400/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-yellow-300 font-display font-black text-sm sm:text-base">
            <span className="text-2xl">🎁</span>
            <span>HỘP QUÀ BÍ ẨN - AI LÀ CHỦ NHÂN?</span>
          </div>
          {isPlaying && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-full font-black text-xs animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>HỘP ĐANG RUNG LẮC DỮ DỘI!</span>
            </div>
          )}
        </div>

        {/* Gift Grid */}
        <div className="relative z-10 grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-4 w-full px-2 my-auto">
          {GIFT_THEMES.map((theme, idx) => {
            const isChosenBox = activeBoxIndex === idx;
            const shaking = isPlaying && isChosenBox && !isOpened;
            const opened = isPlaying && isChosenBox && isOpened;

            return (
              <div
                key={idx}
                onClick={() => handleBoxClick(idx)}
                className={`relative cursor-pointer transition-all duration-300 select-none group ${
                  shaking ? 'animate-shake-suspense scale-125 z-30' : ''
                } ${opened ? 'scale-135 z-40' : 'hover:-translate-y-2'}`}
              >
                <div
                  className={`relative aspect-square rounded-2xl sm:rounded-3xl p-2 sm:p-3 flex flex-col items-center justify-center bg-gradient-to-br ${
                    theme.bg
                  } shadow-xl border-2 sm:border-4 ${
                    isChosenBox
                      ? 'border-yellow-300 ring-4 ring-yellow-400/70 shadow-[0_0_25px_#f59e0b]'
                      : 'border-white/50'
                  }`}
                >
                  {/* Cross Ribbons */}
                  <div className={`absolute top-0 bottom-0 w-3 sm:w-4 ${theme.ribbon} shadow-sm`} />
                  <div className={`absolute left-0 right-0 h-3 sm:h-4 ${theme.ribbon} shadow-sm`} />

                  {/* Ribbon Bow */}
                  <div className="absolute -top-3 sm:-top-4 z-10 text-xl sm:text-2xl">
                    {theme.icon}
                  </div>

                  {/* Number Tag */}
                  <div className="relative z-10 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/95 text-slate-900 font-display font-black text-xs sm:text-base flex items-center justify-center shadow-md">
                    {idx + 1}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Reveal Modal */}
          {revealedStudent && (
            <div className="absolute inset-0 m-auto w-11/12 max-w-lg h-44 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-3xl border-4 border-white shadow-[0_0_50px_rgba(245,158,11,0.9)] flex flex-col items-center justify-center p-4 text-center z-40 animate-in zoom-in-50 duration-300">
              <Sparkles className="w-10 h-10 text-amber-950 animate-spin" />
              <p className="text-xs font-black uppercase text-red-600 tracking-wider">
                🎁 MỞ HỘP QUÀ RỒI! CHÚC MỪNG BẠN 🎁
              </p>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 mt-1 truncate max-w-full drop-shadow-sm">
                {revealedStudent.name}
              </h2>
            </div>
          )}
        </div>

        {/* Bottom Banner */}
        <div className="relative z-10 text-center text-xs sm:text-sm font-extrabold text-slate-300">
          {isPlaying
            ? '🎁 Nắp hộp quà đang rung rinh... Điều kỳ diệu sắp nổ tung!'
            : 'Chọn 1 hộp quà bất kỳ hoặc bấm nút "MỞ HỘP QUÀ BÍ ẨN"'}
        </div>
      </div>

      {/* Button */}
      <div className="mt-4">
        <button
          onClick={onPlayStart}
          disabled={isPlaying || students.length === 0}
          className={`py-4 px-12 rounded-full font-display font-black text-white shadow-2xl flex items-center gap-3 transition-transform active:scale-95 border-2 border-yellow-300 ${
            isPlaying || students.length === 0
              ? 'bg-slate-400 cursor-not-allowed opacity-75'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 shadow-orange-500/40 text-xl sm:text-2xl hover:scale-105 animate-pulse-glow'
          }`}
        >
          <Gift className="w-7 h-7" />
          <span>{isPlaying ? 'ĐANG MỞ HỘP...' : 'MỞ HỘP QUÀ BÍ ẨN'}</span>
        </button>
      </div>
    </div>
  );
};
