import React, { useEffect, useState } from 'react';
import { Cloud, Sparkles, Sun } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface CloudSkyGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

export const CloudSkyGame: React.FC<CloudSkyGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [currentCloudName, setCurrentCloudName] = useState<string>('Bầu trời tươi sáng');
  const [isLanded, setIsLanded] = useState<boolean>(false);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsLanded(false);
      sound.playCloudChime();

      const shuffleInterval = setInterval(() => {
        const randomIdx = Math.floor(Math.random() * students.length);
        setCurrentCloudName(students[randomIdx]?.name || 'Học sinh');
        sound.playTick(680 + Math.random() * 180);
      }, 110);

      const landTimer = setTimeout(() => {
        clearInterval(shuffleInterval);
        setCurrentCloudName(selectedStudent.name);
        setIsLanded(true);
        sound.playFanfare();

        setTimeout(() => {
          onPlayComplete(selectedStudent);
        }, 650);
      }, durationSeconds * 1000);

      return () => {
        clearInterval(shuffleInterval);
        clearTimeout(landTimer);
      };
    } else {
      setIsLanded(false);
    }
  }, [isPlaying, selectedStudent]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-4">
      {/* Sky Scene Canvas */}
      <div
        className={`relative w-full ${
          isProjectorMode ? 'h-96 sm:h-[420px]' : 'h-80 sm:h-96'
        } rounded-3xl overflow-hidden bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 border-4 border-sky-300 shadow-2xl flex flex-col items-center justify-center p-6 text-center`}
      >
        {/* Sun & Rainbow Elements */}
        <div className="absolute top-4 left-6 text-amber-400 animate-spin-slow pointer-events-none">
          <Sun className="w-12 h-12" />
        </div>
        <div className="absolute top-2 right-8 text-4xl animate-bounce pointer-events-none opacity-80">
          🌈
        </div>

        {/* Floating clouds in the background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 text-white/70 text-4xl animate-float">☁️</div>
          <div className="absolute bottom-12 right-1/4 text-white/60 text-5xl animate-float delay-300">☁️</div>
        </div>

        {/* Central Magical Cloud */}
        <div
          className={`relative z-10 transition-all duration-500 flex flex-col items-center ${
            isLanded
              ? 'scale-115 drop-shadow-[0_15px_30px_rgba(245,158,11,0.5)]'
              : isPlaying
              ? 'scale-105 animate-pulse'
              : 'animate-float'
          }`}
        >
          <div className="relative">
            <Cloud className={`w-36 h-36 sm:w-48 sm:h-48 text-white drop-shadow-xl fill-white`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl sm:text-4xl animate-bounce">
                {isLanded ? '🌟' : '☁️'}
              </span>
            </div>
          </div>

          {/* Cloud Name Plaque */}
          <div
            className={`-mt-6 py-3 px-8 rounded-3xl shadow-xl border-2 transition-all ${
              isLanded
                ? 'bg-amber-400 text-amber-950 border-amber-500 scale-110'
                : 'bg-white/95 text-slate-800 border-sky-300'
            }`}
          >
            <p className="text-[11px] uppercase tracking-wider font-extrabold text-sky-700 mb-0.5">
              {isLanded ? '🎉 MÂY ĐÃ CHỌN BẠN 🎉' : isPlaying ? 'ĐANG CHỌN MÂY...' : 'MÂY BỒNG BỀNH'}
            </p>
            <h2
              className={`font-display font-black tracking-tight ${
                isProjectorMode ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'
              }`}
            >
              {currentCloudName}
            </h2>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-4 flex items-center gap-2 text-sky-900 font-bold text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Những đám mây mang niềm vui tới {students.length} bạn nhỏ</span>
        </div>
      </div>

      {/* Button */}
      <div className="mt-6">
        <button
          onClick={onPlayStart}
          disabled={isPlaying || students.length === 0}
          className={`py-4 px-10 rounded-full font-display font-extrabold text-white shadow-xl flex items-center gap-3 transition-transform active:scale-95 ${
            isPlaying || students.length === 0
              ? 'bg-slate-400 cursor-not-allowed opacity-75'
              : 'bg-gradient-to-r from-sky-400 via-blue-500 to-sky-600 hover:from-sky-500 hover:to-blue-600 shadow-blue-500/30 text-xl sm:text-2xl hover:scale-105'
          }`}
        >
          <Cloud className="w-7 h-7" />
          <span>{isPlaying ? 'Đang chọn mây...' : 'CHỌN ĐÁM MÂY'}</span>
        </button>
      </div>
    </div>
  );
};
