import React, { useEffect, useState } from 'react';
import { Star, Sparkles, Wand2 } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface StarCatcherGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

export const StarCatcherGame: React.FC<StarCatcherGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [isCatching, setIsCatching] = useState<boolean>(false);
  const [starCaught, setStarCaught] = useState<boolean>(false);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsCatching(true);
      setStarCaught(false);

      sound.playStarTwinkle();
      const tickInterval = setInterval(() => {
        sound.playTick(900 + Math.random() * 200);
      }, 350);

      const catchTimer = setTimeout(() => {
        clearInterval(tickInterval);
        setIsCatching(false);
        setStarCaught(true);
        sound.playFanfare();

        setTimeout(() => {
          onPlayComplete(selectedStudent);
        }, 600);
      }, durationSeconds * 1000);

      return () => {
        clearInterval(tickInterval);
        clearTimeout(catchTimer);
      };
    } else {
      setIsCatching(false);
      setStarCaught(false);
    }
  }, [isPlaying, selectedStudent]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-4">
      {/* Sky Canvas View */}
      <div
        className={`relative w-full ${
          isProjectorMode ? 'h-96 sm:h-[420px]' : 'h-80 sm:h-96'
        } rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 border-4 border-yellow-300/40 shadow-2xl flex flex-col items-center justify-center p-6 text-center`}
      >
        {/* Constellation background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-200/80 animate-pulse"
              style={{
                top: `${(i * 19 + 7) % 85}%`,
                left: `${(i * 23 + 11) % 92}%`,
                fontSize: `${12 + (i % 4) * 6}px`,
                animationDelay: `${(i * 0.2)}s`,
              }}
            >
              ★
            </div>
          ))}
        </div>

        {/* Center Star Feature */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div
            className={`transition-all duration-700 ${
              starCaught
                ? 'scale-125 text-yellow-300 drop-shadow-[0_0_40px_rgba(253,224,71,0.9)] animate-bounce'
                : isCatching
                ? 'scale-110 text-amber-300 drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] animate-spin-slow'
                : 'scale-100 text-yellow-200/90 animate-float'
            }`}
          >
            <Star className={`w-28 h-28 sm:w-36 sm:h-36 fill-current`} />
          </div>

          {/* Text inside/below the star */}
          <div className="mt-4">
            {starCaught && selectedStudent ? (
              <div className="py-2 px-6 bg-yellow-400 text-slate-950 rounded-2xl font-display font-black text-2xl sm:text-4xl shadow-xl animate-in zoom-in">
                ⭐ {selectedStudent.name} ⭐
              </div>
            ) : isCatching ? (
              <div className="py-2 px-6 bg-purple-900/80 text-yellow-200 rounded-full font-bold text-lg border border-yellow-400/40 animate-pulse flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Ngôi sao may mắn đang hạ xuống...</span>
              </div>
            ) : (
              <div className="text-yellow-100 font-semibold text-base sm:text-lg">
                Bầu trời có {students.length} vì sao rực rỡ
              </div>
            )}
          </div>
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
              : 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-600 shadow-yellow-500/30 text-xl sm:text-2xl hover:scale-105'
          }`}
        >
          <Wand2 className="w-7 h-7" />
          <span>{isPlaying ? 'Đang bắt ngôi sao...' : 'BẮT NGÔI SAO'}</span>
        </button>
      </div>
    </div>
  );
};
