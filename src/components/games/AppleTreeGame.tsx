import React, { useEffect, useState } from 'react';
import { Sparkles, Wind } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface AppleTreeGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

export const AppleTreeGame: React.FC<AppleTreeGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [isTreeShaking, setIsTreeShaking] = useState<boolean>(false);
  const [appleFallen, setAppleFallen] = useState<boolean>(false);
  const [revealedStudent, setRevealedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsTreeShaking(true);
      setAppleFallen(false);
      setRevealedStudent(null);

      const tickInterval = setInterval(() => {
        sound.playTick(520 + Math.random() * 200);
      }, 250);

      const dropTimer = setTimeout(() => {
        setIsTreeShaking(false);
        setAppleFallen(true);
        sound.playAppleDrop();
        sound.playExplosion();
        setRevealedStudent(selectedStudent);
      }, durationSeconds * 650);

      const finishTimer = setTimeout(() => {
        clearInterval(tickInterval);
        setTimeout(() => {
          onPlayComplete(selectedStudent);
        }, 800);
      }, durationSeconds * 1000);

      return () => {
        clearInterval(tickInterval);
        clearTimeout(dropTimer);
        clearTimeout(finishTimer);
      };
    } else {
      setIsTreeShaking(false);
      setAppleFallen(false);
    }
  }, [isPlaying, selectedStudent]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-2">
      {/* Orchard Meadow Stage */}
      <div
        className={`relative w-full ${
          isProjectorMode ? 'h-[440px] sm:h-[480px]' : 'h-96 sm:h-[420px]'
        } rounded-3xl overflow-hidden bg-gradient-to-b from-sky-400 via-emerald-100 to-emerald-300 border-4 border-emerald-400 shadow-2xl flex flex-col justify-between p-6 text-center`}
      >
        {/* Sun & Floating Clouds */}
        <div className="relative z-10 flex justify-between items-center px-4 pointer-events-none">
          <span className="text-3xl animate-spin-slow">☀️</span>
          {isPlaying ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-full font-black text-xs animate-pulse">
              <Wind className="w-4 h-4 animate-bounce" />
              <span>GIÓ BÃO ĐANG RUNG CÂY TÁO VÀNG!</span>
            </div>
          ) : (
            <span className="text-2xl animate-float">🦋</span>
          )}
          <span className="text-2xl animate-float delay-200">🌈</span>
        </div>

        {/* Tree Canopy & Fruit */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center my-auto">
          {/* Foliage Canopy */}
          <div
            className={`relative w-80 h-48 sm:w-[420px] sm:h-56 bg-gradient-to-b from-emerald-400 via-green-500 to-emerald-700 rounded-[50%_50%_45%_45%] shadow-2xl border-4 border-emerald-300 flex items-center justify-center transition-transform ${
              isTreeShaking ? 'animate-shake-suspense scale-105' : 'animate-float'
            }`}
          >
            {/* Apples on branches */}
            <div className="absolute top-4 left-10 text-3xl animate-bounce">🍎</div>
            <div className="absolute top-12 right-12 text-3xl animate-bounce delay-150">🍎</div>
            <div className="absolute top-6 right-28 text-3xl animate-bounce delay-300">🍎</div>
            <div className="absolute bottom-8 left-16 text-3xl animate-bounce delay-100">🍎</div>
            <div className="absolute bottom-10 right-20 text-3xl animate-bounce delay-200">🍎</div>

            {/* The Special Golden Apple */}
            <div
              className={`absolute text-5xl sm:text-6xl transition-all duration-700 select-none ${
                appleFallen
                  ? 'translate-y-40 scale-125 drop-shadow-[0_0_25px_#f59e0b]'
                  : isTreeShaking
                  ? 'animate-ping scale-135'
                  : 'animate-pulse'
              }`}
            >
              🍏
            </div>
          </div>

          {/* Tree Trunk */}
          <div className="w-14 h-16 bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-xl border-2 border-amber-950 shadow-inner -mt-1" />

          {/* Golden Reveal Plaque */}
          {revealedStudent && (
            <div className="absolute inset-0 m-auto w-11/12 max-w-lg h-44 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-3xl border-4 border-white shadow-[0_0_50px_rgba(245,158,11,0.9)] flex flex-col items-center justify-center p-4 text-center z-40 animate-in zoom-in-50 duration-300">
              <Sparkles className="w-10 h-10 text-amber-950 animate-spin" />
              <p className="text-xs font-black uppercase text-red-600 tracking-wider">
                🍏 TÁO VÀNG RƠI VÀO GIỎ! CHÚC MỪNG BẠN 🍏
              </p>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 mt-1 truncate max-w-full drop-shadow-sm">
                {revealedStudent.name}
              </h2>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="relative z-10 text-xs sm:text-sm text-emerald-950 font-extrabold">
          {isPlaying ? '🌳 Cơn gió thần đang rung cành táo... Quả táo vàng sắp rơi!' : 'Nhấn "RUNG CÂY TÁO VÀNG" để đón quả táo may mắn'}
        </div>
      </div>

      {/* Button */}
      <div className="mt-4">
        <button
          onClick={onPlayStart}
          disabled={isPlaying || students.length === 0}
          className={`py-4 px-12 rounded-full font-display font-black text-white shadow-2xl flex items-center gap-3 transition-transform active:scale-95 border-2 border-emerald-300 ${
            isPlaying || students.length === 0
              ? 'bg-slate-400 cursor-not-allowed opacity-75'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/40 text-xl sm:text-2xl hover:scale-105 animate-pulse-glow'
          }`}
        >
          <span className="text-2xl">🍎</span>
          <span>{isPlaying ? 'ĐANG RUNG CÂY...' : 'RUNG CÂY TÁO VÀNG'}</span>
        </button>
      </div>
    </div>
  );
};
