import React, { useEffect, useState } from 'react';
import { Sparkles, Gamepad, HelpCircle } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface ClawMachineGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

export const ClawMachineGame: React.FC<ClawMachineGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [clawX, setClawX] = useState<number>(50);
  const [clawY, setClawY] = useState<number>(10);
  const [isCatching, setIsCatching] = useState<boolean>(false);
  const [hasPrizeInClaw, setHasPrizeInClaw] = useState<boolean>(false);
  const [isHatched, setIsHatched] = useState<boolean>(false);
  const [revealedStudent, setRevealedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsCatching(true);
      setHasPrizeInClaw(false);
      setIsHatched(false);
      setRevealedStudent(null);
      setClawY(10);

      // Swing crane left and right
      const swingInterval = setInterval(() => {
        setClawX((prev) => (prev > 68 ? 32 : prev + 9));
        sound.playClawSound();
      }, 180);

      // Descend claw to grab egg
      const dropTimer = setTimeout(() => {
        clearInterval(swingInterval);
        setClawY(65);
        sound.playClawSound();

        // Grip egg and lift up
        setTimeout(() => {
          setHasPrizeInClaw(true);
          setClawY(15);
        }, 600);
      }, durationSeconds * 400);

      // Egg hatches
      const finishTimer = setTimeout(() => {
        setIsHatched(true);
        setRevealedStudent(selectedStudent);
        sound.playExplosion();

        setTimeout(() => {
          onPlayComplete(selectedStudent);
        }, 800);
      }, durationSeconds * 1000);

      return () => {
        clearInterval(swingInterval);
        clearTimeout(dropTimer);
        clearTimeout(finishTimer);
      };
    } else {
      setIsCatching(false);
      setHasPrizeInClaw(false);
      setIsHatched(false);
      setClawX(50);
      setClawY(10);
    }
  }, [isPlaying, selectedStudent]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-2">
      {/* Arcade Machine Cabinet */}
      <div
        className={`relative w-full ${
          isProjectorMode ? 'h-[440px] sm:h-[480px]' : 'h-96 sm:h-[420px]'
        } rounded-3xl overflow-hidden bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950 border-4 border-purple-400 shadow-2xl flex flex-col justify-between p-4 sm:p-5`}
      >
        {/* Arcade Neon Marquee */}
        <div className="relative z-10 w-full flex items-center justify-between px-4 py-2 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 rounded-2xl shadow-lg border-2 border-white/50">
          <div className="flex items-center gap-2 text-yellow-300 font-display font-black text-sm sm:text-base tracking-wider">
            <span className="text-xl animate-spin-slow">⭐</span>
            <span>MÁY GẮP THÚ BÔNG ARCADE THẦN KỲ</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        </div>

        {/* Glass Chamber Area */}
        <div className="relative z-10 w-full flex-1 my-2 rounded-2xl bg-indigo-950/60 border-2 border-purple-300/40 overflow-hidden flex flex-col justify-between p-3 backdrop-blur-sm">
          {/* Top Crane Track & Metallic Cable */}
          <div
            className="absolute top-0 transition-all duration-300 flex flex-col items-center pointer-events-none z-20"
            style={{
              left: `${clawX}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Crane cable wire */}
            <div
              className="w-1.5 bg-gradient-to-b from-slate-200 via-slate-400 to-slate-200 shadow-md transition-all duration-500"
              style={{ height: `${clawY * 2.3}px` }}
            />
            {/* Claw Prongs */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-4 bg-yellow-400 rounded-t-lg border border-amber-600 shadow-md flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <div className="flex gap-2 -mt-1 text-3xl">
                <span className="rotate-12 select-none">🦾</span>
              </div>
              {/* Prize caught in claw */}
              {hasPrizeInClaw && !isHatched && (
                <div className="text-3xl -mt-2 animate-bounce">
                  🥚
                </div>
              )}
            </div>
          </div>

          {/* Bottom Prize Pile: Golden Eggs & Plushies */}
          <div className="mt-auto w-full pt-8 flex justify-around items-end px-4">
            {['🧸', '🥚', '🎁', '⭐', '🐰', '🥚', '🦁', '🥚', '🐼'].map((toy, idx) => (
              <div
                key={idx}
                className="text-3xl sm:text-4xl transition-transform hover:scale-125 select-none animate-float"
                style={{ animationDelay: `${idx * 0.25}s` }}
              >
                {toy}
              </div>
            ))}
          </div>

          {/* Egg Hatch Reveal Modal */}
          {revealedStudent && (
            <div className="absolute inset-0 m-auto w-11/12 max-w-lg h-44 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-3xl border-4 border-white shadow-[0_0_50px_rgba(245,158,11,0.9)] flex flex-col items-center justify-center p-4 text-center z-40 animate-in zoom-in-50 duration-300">
              <Sparkles className="w-10 h-10 text-amber-950 animate-spin" />
              <p className="text-xs font-black uppercase text-red-600 tracking-wider">
                🎉 GẮP TRÚNG RỒI! CHÚC MỪNG BẠN 🎉
              </p>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 mt-1 truncate max-w-full drop-shadow-sm">
                {revealedStudent.name}
              </h2>
            </div>
          )}
        </div>

        {/* Chute Status */}
        <div className="relative z-10 flex items-center justify-between text-xs text-purple-200 font-bold px-2">
          <span>{isCatching ? '🕹️ Càng gắp đang hạ xuống gắp quả trứng vàng...' : '🕹️ Đã nạp xu, sẵn sàng gắp quà'}</span>
          <span>{students.length} phần quà may mắn</span>
        </div>
      </div>

      {/* Button */}
      <div className="mt-4">
        <button
          onClick={onPlayStart}
          disabled={isPlaying || students.length === 0}
          className={`py-4 px-12 rounded-full font-display font-black text-white shadow-2xl flex items-center gap-3 transition-transform active:scale-95 border-2 border-purple-300 ${
            isPlaying || students.length === 0
              ? 'bg-slate-400 cursor-not-allowed opacity-75'
              : 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-600/40 text-xl sm:text-2xl hover:scale-105 animate-pulse-glow'
          }`}
        >
          <Gamepad className="w-7 h-7" />
          <span>{isPlaying ? 'ĐANG GẮP QUÀ...' : 'HẠ CÀNG GẮP THẦN KỲ'}</span>
        </button>
      </div>
    </div>
  );
};
