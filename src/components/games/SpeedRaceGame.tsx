import React, { useEffect, useState, useRef } from 'react';
import { Flag, Trophy, Flame, Zap } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface SpeedRaceGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

const CARS = [
  { id: 1, name: 'Tia Chớp Đỏ', color: 'from-red-600 to-rose-700', icon: '🏎️', border: 'border-red-400' },
  { id: 2, name: 'Thần Tốc Vàng', color: 'from-amber-500 to-yellow-600', icon: '🏎️', border: 'border-yellow-400' },
  { id: 3, name: 'Hải Âu Lam', color: 'from-blue-600 to-cyan-700', icon: '🏎️', border: 'border-blue-400' },
  { id: 4, name: 'Lốc Xoáy Lục', color: 'from-emerald-600 to-teal-700', icon: '🏎️', border: 'border-emerald-400' },
];

export const SpeedRaceGame: React.FC<SpeedRaceGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [carPositions, setCarPositions] = useState<number[]>([8, 8, 8, 8]);
  const [trafficLight, setTrafficLight] = useState<'red' | 'yellow' | 'green'>('red');
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [winnerIdx, setWinnerIdx] = useState<number>(0);
  const raceInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsFinished(false);
      setTrafficLight('red');
      setCarPositions([8, 8, 8, 8]);
      const chosenWinner = Math.floor(Math.random() * CARS.length);
      setWinnerIdx(chosenWinner);

      // Traffic light countdown sequence
      setTimeout(() => setTrafficLight('yellow'), 400);
      setTimeout(() => {
        setTrafficLight('green');
        sound.playEngineRev();
      }, 800);

      // High speed race loop with dramatic overtakes
      raceInterval.current = setInterval(() => {
        setCarPositions((prev) =>
          prev.map((pos, idx) => {
            const isFavored = idx === chosenWinner;
            const boost = Math.random() * (isFavored ? 9 : 7) + 2;
            const next = pos + boost;
            return next > 83 ? 83 : next;
          })
        );
        sound.playEngineRev();
      }, 160);

      // Final photo-finish climax
      const finishTimer = setTimeout(() => {
        if (raceInterval.current) clearInterval(raceInterval.current);
        setCarPositions((prev) => {
          const finished = [...prev];
          finished[chosenWinner] = 87; // Clearly crosses the finish line
          return finished;
        });
        setIsFinished(true);
        sound.playExplosion();

        setTimeout(() => {
          onPlayComplete(selectedStudent);
        }, 800);
      }, durationSeconds * 1000);

      return () => {
        if (raceInterval.current) clearInterval(raceInterval.current);
        clearTimeout(finishTimer);
      };
    } else {
      setIsFinished(false);
      setTrafficLight('red');
      setCarPositions([8, 8, 8, 8]);
    }
  }, [isPlaying, selectedStudent]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-2">
      {/* Race Track Arena */}
      <div
        className={`relative w-full ${
          isProjectorMode ? 'h-[440px] sm:h-[480px]' : 'h-96 sm:h-[420px]'
        } rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-zinc-950 border-4 border-amber-400 shadow-2xl flex flex-col justify-between p-4 sm:p-5`}
      >
        {/* Speed motion lines in background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Stadium Banner & Traffic Lights */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-slate-900/90 rounded-2xl border border-slate-700 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🏁</span>
            <span className="font-display font-black text-amber-300 text-sm sm:text-base tracking-wider">
              GIẢI ĐUA F1 SIÊU TỐC - TÌM NHÀ VÔ ĐỊCH
            </span>
          </div>

          {/* F1 3-stage starting lights */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-700 shadow-inner">
            <div
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                trafficLight === 'red' ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' : 'bg-red-950'
              }`}
            />
            <div
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                trafficLight === 'yellow' ? 'bg-amber-400 shadow-[0_0_12px_#f59e0b]' : 'bg-amber-950'
              }`}
            />
            <div
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                trafficLight === 'green' ? 'bg-emerald-400 shadow-[0_0_12px_#10b981]' : 'bg-emerald-950'
              }`}
            />
          </div>
        </div>

        {/* 4 Asphalt Racing Tracks */}
        <div className="relative z-10 flex-1 my-2 flex flex-col justify-around py-1">
          {/* Finish Line Checkers Ribbon */}
          <div className="absolute top-0 bottom-0 right-14 w-6 bg-[repeating-conic-gradient(#fff_0_90deg,#000_0_180deg)] bg-[length:14px_14px] shadow-lg z-10 rounded-sm border-y border-amber-400 opacity-90" />

          {CARS.map((car, idx) => (
            <div
              key={car.id}
              className="relative h-13 sm:h-14 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-slate-700/80 flex items-center px-3 overflow-hidden shadow-inner"
            >
              {/* Animated Road Dash Lines */}
              <div className="absolute inset-x-0 bottom-0 border-b-2 border-dashed border-yellow-400/40" />

              {/* Lane number & Flag */}
              <div className="flex items-center gap-1.5 z-10 w-12">
                <span className="text-amber-400 font-mono font-black text-xs">
                  #{idx + 1}
                </span>
                {isPlaying && <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />}
              </div>

              {/* Race Car with Exhaust Flame */}
              <div
                className="absolute transition-all duration-150 flex items-center gap-1 z-20"
                style={{
                  left: `${carPositions[idx]}%`,
                }}
              >
                {/* Exhaust flame */}
                {isPlaying && (
                  <div className="text-sm -mr-1 animate-pulse">
                    🔥
                  </div>
                )}
                <div
                  className={`px-3 py-1 rounded-xl text-white font-black text-xs flex items-center gap-1.5 shadow-xl border-2 ${car.border} bg-gradient-to-r ${car.color}`}
                >
                  <span className="text-lg">{car.icon}</span>
                  <span className="hidden sm:inline text-xs font-display tracking-wide">{car.name}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Winner Celebration Modal */}
          {isFinished && selectedStudent && (
            <div className="absolute inset-0 m-auto w-11/12 max-w-lg h-44 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-3xl border-4 border-white shadow-[0_0_50px_rgba(245,158,11,0.9)] flex flex-col items-center justify-center p-4 text-center z-40 animate-in zoom-in-50 duration-300">
              <Trophy className="w-10 h-10 text-amber-950 animate-bounce" />
              <p className="text-xs font-black uppercase text-red-600 tracking-wider">
                🏆 CÁN ĐÍCH VÔ ĐỊCH! CHÚC MỪNG BẠN 🏆
              </p>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 mt-1 truncate max-w-full drop-shadow-sm">
                {selectedStudent.name}
              </h2>
            </div>
          )}
        </div>

        {/* Bottom Banner */}
        <div className="relative z-10 text-center text-xs sm:text-sm font-extrabold text-slate-300">
          {isPlaying
            ? '🏎️ Động cơ gầm rú! Các tay đua nhí đang rượt đuổi nghẹt thở từng centimet...'
            : 'Nhấn "XUẤT PHÁT ĐUA" để bắt đầu màn rượt đuổi tốc độ gay cấn!'}
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
              : 'bg-gradient-to-r from-red-600 via-amber-500 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-orange-600/40 text-xl sm:text-2xl hover:scale-105 animate-pulse-glow'
          }`}
        >
          <Flag className="w-7 h-7" />
          <span>{isPlaying ? 'ĐANG ĐUA KỊCH TÍNH...' : 'XUẤT PHÁT ĐUA SIÊU TỐC'}</span>
        </button>
      </div>
    </div>
  );
};
