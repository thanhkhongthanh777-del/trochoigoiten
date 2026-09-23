import React, { useEffect, useState, useRef } from 'react';
import { Rocket, Square, Play, Sparkles } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface SpaceGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

export const SpaceGame: React.FC<SpaceGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [currentName, setCurrentName] = useState<string>('Khám phá vũ trụ');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsLocked(false);
      sound.playSpaceWarp();

      // Fast cycling names
      intervalRef.current = setInterval(() => {
        const randomIdx = Math.floor(Math.random() * students.length);
        setCurrentName(students[randomIdx]?.name || 'Học sinh');
        sound.playTick(750 + Math.random() * 300);
      }, 70);

      timeoutRef.current = setTimeout(() => {
        handleStop();
      }, durationSeconds * 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    } else {
      setIsLocked(false);
    }
  }, [isPlaying, selectedStudent]);

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (selectedStudent) {
      setCurrentName(selectedStudent.name);
      setIsLocked(true);
      sound.playFanfare();

      setTimeout(() => {
        onPlayComplete(selectedStudent);
      }, 600);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-4">
      {/* Cosmic Stage Window */}
      <div
        className={`relative w-full ${
          isProjectorMode ? 'h-96 sm:h-[440px]' : 'h-80 sm:h-96'
        } rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 border-4 border-indigo-400/50 shadow-2xl flex flex-col items-center justify-center p-6 text-center`}
      >
        {/* Animated stars background */}
        <div className="absolute inset-0 pointer-events-none opacity-80">
          <div className="absolute top-4 left-8 text-yellow-300 text-xs animate-ping">✦</div>
          <div className="absolute top-12 right-20 text-cyan-300 text-sm animate-pulse">★</div>
          <div className="absolute bottom-16 left-24 text-pink-300 text-xs animate-ping delay-300">✦</div>
          <div className="absolute top-1/2 left-12 text-yellow-100 text-lg animate-sparkle">⭐</div>
          <div className="absolute top-20 left-1/3 text-purple-300 text-xs animate-pulse">★</div>
          <div className="absolute bottom-10 right-16 text-yellow-300 text-xl animate-sparkle">🌟</div>
        </div>

        {/* Spaceship Icon */}
        <div className={`text-5xl sm:text-6xl mb-4 transition-transform duration-300 ${isPlaying ? 'animate-bounce' : 'animate-float'}`}>
          🚀
        </div>

        {/* Tractor Beam visual when locked */}
        {isLocked && (
          <div className="absolute top-1/3 w-72 h-44 bg-gradient-to-b from-cyan-400/40 via-yellow-300/30 to-transparent blur-md pointer-events-none rounded-full" />
        )}

        {/* Dynamic Name Display */}
        <div
          className={`relative z-10 py-5 px-8 rounded-3xl backdrop-blur-md border-2 transition-all duration-300 ${
            isLocked
              ? 'bg-gradient-to-r from-amber-400 to-yellow-300 border-white text-slate-950 scale-110 shadow-2xl'
              : isPlaying
              ? 'bg-indigo-900/80 border-cyan-400 text-cyan-200 scale-105 shadow-cyan-500/50 shadow-lg'
              : 'bg-indigo-950/60 border-indigo-500/40 text-slate-200'
          }`}
        >
          <p className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-1">
            {isLocked ? '🎉 PHI HÀNH GIA ĐƯỢC CHỌN 🎉' : isPlaying ? 'ĐANG DÒ TÌM TRONG KHÔNG GIAN...' : 'SẴN SÀNG KHỞI HÀNH'}
          </p>
          <h2
            className={`font-display font-black tracking-wide ${
              isProjectorMode ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-5xl'
            }`}
          >
            {currentName}
          </h2>
        </div>

        {/* Space dust ticker */}
        <div className="mt-6 flex items-center gap-2 text-indigo-300 text-xs sm:text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Hệ thống điều hướng vũ trụ đang kết nối {students.length} bạn nhỏ</span>
        </div>
      </div>

      {/* Button Controls */}
      <div className="mt-6 flex items-center gap-4">
        {isPlaying ? (
          <button
            onClick={handleStop}
            className="py-4 px-10 rounded-full font-display font-extrabold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-xl shadow-red-500/30 text-xl sm:text-2xl flex items-center gap-3 transition-transform active:scale-95 animate-pulse"
          >
            <Square className="w-7 h-7 fill-current" />
            <span>DỪNG LẠI</span>
          </button>
        ) : (
          <button
            onClick={onPlayStart}
            disabled={students.length === 0}
            className={`py-4 px-10 rounded-full font-display font-extrabold text-white shadow-xl flex items-center gap-3 transition-transform active:scale-95 ${
              students.length === 0
                ? 'bg-slate-400 cursor-not-allowed opacity-75'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 shadow-indigo-500/30 text-xl sm:text-2xl hover:scale-105'
            }`}
          >
            <Rocket className="w-7 h-7" />
            <span>PHÓNG TÀU VŨ TRỤ</span>
          </button>
        )}
      </div>
    </div>
  );
};
