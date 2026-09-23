import React, { useEffect, useState } from 'react';
import { Sparkles, KeyRound, Lock, ShieldAlert } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface TreasureIslandGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

export const TreasureIslandGame: React.FC<TreasureIslandGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [isChestShaking, setIsChestShaking] = useState<boolean>(false);
  const [isKeyInserting, setIsKeyInserting] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [revealedStudent, setRevealedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsChestShaking(true);
      setIsKeyInserting(true);
      setIsUnlocked(false);
      setRevealedStudent(null);

      // Rattling sounds
      const tickInterval = setInterval(() => {
        sound.playTick(500 + Math.random() * 250);
      }, 240);

      // Key turns and chest bursts open
      const unlockTimer = setTimeout(() => {
        setIsChestShaking(false);
        setIsKeyInserting(false);
        setIsUnlocked(true);
        setRevealedStudent(selectedStudent);
        sound.playTreasureChest();
        sound.playExplosion();
      }, durationSeconds * 700);

      const finishTimer = setTimeout(() => {
        clearInterval(tickInterval);
        setTimeout(() => {
          onPlayComplete(selectedStudent);
        }, 800);
      }, durationSeconds * 1000);

      return () => {
        clearInterval(tickInterval);
        clearTimeout(unlockTimer);
        clearTimeout(finishTimer);
      };
    } else {
      setIsChestShaking(false);
      setIsKeyInserting(false);
      setIsUnlocked(false);
    }
  }, [isPlaying, selectedStudent]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-2">
      {/* Treasure Island Stage */}
      <div
        className={`relative w-full ${
          isProjectorMode ? 'h-[440px] sm:h-[480px]' : 'h-96 sm:h-[420px]'
        } rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-amber-950 border-4 border-amber-400 shadow-2xl flex flex-col justify-between p-6`}
      >
        {/* Mystic Island Spotlight and Mist */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/3 w-80 h-[500px] bg-gradient-to-b from-amber-400/20 via-yellow-500/10 to-transparent blur-3xl animate-spotlight" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-slate-900/80 rounded-2xl border border-amber-500/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-300 font-display font-black text-sm sm:text-base">
            <span className="text-2xl">🏴‍☠️</span>
            <span>RƯƠNG BÁU HOÀNG GIA ĐẠI DƯƠNG</span>
          </div>
          {isPlaying && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 rounded-full font-black text-xs animate-pulse">
              <KeyRound className="w-3.5 h-3.5 animate-spin" />
              <span>CHÌA KHÓA THẦN ĐANG MỞ KHÓA!</span>
            </div>
          )}
        </div>

        {/* Arena: The Grand Chest */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center min-h-[220px]">
          {/* Animated Treasure Chest */}
          <div
            className={`relative select-none transition-transform duration-300 ${
              isChestShaking ? 'animate-shake-suspense scale-110' : 'animate-float'
            } ${isUnlocked ? 'scale-115' : ''}`}
          >
            {/* Glowing Aura Behind Chest */}
            <div className={`absolute -inset-6 rounded-full blur-2xl transition-opacity duration-500 ${
              isPlaying ? 'bg-amber-500/50 opacity-100' : 'opacity-0'
            }`} />

            {/* Chest Graphic */}
            <div className="relative w-56 h-36 sm:w-72 sm:h-44 rounded-3xl bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950 border-4 border-yellow-400 shadow-2xl p-4 flex flex-col justify-between">
              {/* Copper Reinforcement Bands */}
              <div className="absolute top-0 bottom-0 left-10 w-5 bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-600 border-x border-yellow-300" />
              <div className="absolute top-0 bottom-0 right-10 w-5 bg-gradient-to-r from-yellow-600 via-amber-400 to-yellow-600 border-x border-yellow-300" />

              {/* Padlock Hub */}
              <div className="relative z-10 mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 border-2 border-amber-800 shadow-[0_0_15px_#f59e0b] flex items-center justify-center text-amber-950">
                {isKeyInserting ? (
                  <KeyRound className="w-6 h-6 animate-spin text-red-600" />
                ) : (
                  <Lock className="w-6 h-6 text-amber-950" />
                )}
              </div>

              {/* Jewels Shimmer */}
              <div className="relative z-10 flex justify-around text-2xl sm:text-3xl">
                <span className="animate-bounce">💎</span>
                <span className="animate-pulse">🪙</span>
                <span className="animate-bounce delay-150">👑</span>
                <span className="animate-pulse delay-200">💎</span>
              </div>
            </div>
          </div>

          {/* Reveal Modal */}
          {revealedStudent && (
            <div className="absolute inset-0 m-auto w-11/12 max-w-lg h-44 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-3xl border-4 border-white shadow-[0_0_50px_rgba(245,158,11,0.9)] flex flex-col items-center justify-center p-4 text-center z-40 animate-in zoom-in-50 duration-300">
              <Sparkles className="w-10 h-10 text-amber-950 animate-spin" />
              <p className="text-xs font-black uppercase text-red-600 tracking-wider">
                💎 KHO BÁU BẬT NẮP! CHÚC MỪNG BẠN 💎
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
            ? '🏴‍☠️ Chìa khóa vàng đang tra vào ổ khóa rương báu... Kho báu sắp mở ra!'
            : 'Nhấn "MỞ RƯƠNG BÁU" để khám phá viên ngọc quý được gọi tên!'}
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
              : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/40 text-xl sm:text-2xl hover:scale-105 animate-pulse-glow'
          }`}
        >
          <span className="text-2xl">🏴‍☠️</span>
          <span>{isPlaying ? 'ĐANG MỞ KHÓA...' : 'MỞ RƯƠNG BÁU HOÀNG GIA'}</span>
        </button>
      </div>
    </div>
  );
};
