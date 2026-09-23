import React, { useEffect, useState } from 'react';
import { Sparkles, Target, Zap } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface BalloonPopGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

const BALLOONS = [
  { id: 1, name: 'Bóng Hồng', color: 'from-pink-400 via-rose-500 to-red-600', shadow: 'shadow-pink-500/50', border: 'border-pink-300' },
  { id: 2, name: 'Bóng Cam', color: 'from-amber-400 via-orange-500 to-amber-600', shadow: 'shadow-orange-500/50', border: 'border-amber-300' },
  { id: 3, name: 'Bóng Lục', color: 'from-emerald-400 via-teal-500 to-green-600', shadow: 'shadow-emerald-500/50', border: 'border-emerald-300' },
  { id: 4, name: 'Bóng Lam', color: 'from-sky-400 via-blue-500 to-indigo-600', shadow: 'shadow-blue-500/50', border: 'border-sky-300' },
  { id: 5, name: 'Bóng Tím', color: 'from-purple-400 via-fuchsia-500 to-purple-700', shadow: 'shadow-purple-500/50', border: 'border-purple-300' },
  { id: 6, name: 'Bóng Vàng', color: 'from-yellow-300 via-amber-400 to-yellow-600', shadow: 'shadow-amber-500/50', border: 'border-yellow-200' },
  { id: 7, name: 'Bóng Đỏ', color: 'from-red-400 via-rose-600 to-red-700', shadow: 'shadow-red-500/50', border: 'border-rose-300' },
  { id: 8, name: 'Bóng Neon', color: 'from-cyan-400 via-teal-400 to-blue-500', shadow: 'shadow-cyan-500/50', border: 'border-cyan-300' },
];

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [activeBalloonIdx, setActiveBalloonIdx] = useState<number>(0);
  const [balloonScale, setBalloonScale] = useState<number>(1);
  const [isPopped, setIsPopped] = useState<boolean>(false);
  const [revealedStudent, setRevealedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsPopped(false);
      setRevealedStudent(null);
      const chosen = Math.floor(Math.random() * BALLOONS.length);
      setActiveBalloonIdx(chosen);

      // Heartbeat & rapid tension builder
      let step = 0;
      const totalSteps = 12;
      const stepDuration = (durationSeconds * 1000) / totalSteps;

      const inflateInterval = setInterval(() => {
        step++;
        const currentScale = 1 + (step / totalSteps) * 1.35; // grows up to 2.35x
        setBalloonScale(currentScale);
        sound.playTick(400 + step * 70);
      }, stepDuration);

      const popTimer = setTimeout(() => {
        clearInterval(inflateInterval);
        setIsPopped(true);
        setRevealedStudent(selectedStudent);
        sound.playExplosion();

        setTimeout(() => {
          onPlayComplete(selectedStudent);
        }, 800);
      }, durationSeconds * 1000);

      return () => {
        clearInterval(inflateInterval);
        clearTimeout(popTimer);
      };
    } else {
      setBalloonScale(1);
      setIsPopped(false);
    }
  }, [isPlaying, selectedStudent]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-2">
      {/* Stadium Stage */}
      <div
        className={`relative w-full ${
          isProjectorMode ? 'h-[440px] sm:h-[480px]' : 'h-96 sm:h-[420px]'
        } rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-sky-950 border-4 border-rose-400 shadow-2xl flex flex-col justify-between p-6`}
      >
        {/* Theatrical Spotlight Sweep Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-72 h-[600px] bg-gradient-to-b from-yellow-300/25 via-pink-400/10 to-transparent transform -rotate-12 blur-2xl animate-spotlight" />
          <div className="absolute -top-24 right-1/4 w-72 h-[600px] bg-gradient-to-b from-cyan-300/20 via-blue-500/10 to-transparent transform rotate-12 blur-2xl animate-spotlight delay-500" />
        </div>

        {/* Stage Header Info */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2 bg-slate-900/80 rounded-2xl border border-rose-500/40 backdrop-blur-md">
          <div className="flex items-center gap-2 text-yellow-300 font-display font-black text-sm sm:text-base">
            <span className="text-xl">🎈</span>
            <span>ĐẠI HỘI BONG BÓNG BÙNG NỔ</span>
          </div>
          {isPlaying && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-full font-black text-xs animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>BÓNG ĐANG PHỒNG CỰC ĐẠI!</span>
            </div>
          )}
        </div>

        {/* Floating Arena / Giant Inflating Balloon */}
        <div className="relative z-10 my-auto flex items-center justify-center min-h-[220px]">
          {isPlaying ? (
            /* Tension Focal Point: The Inflating Monster Balloon */
            <div className="relative flex flex-col items-center">
              {/* Aiming Reticle */}
              <div className="absolute -top-12 z-30 flex items-center gap-2 bg-yellow-400 text-slate-950 font-black px-4 py-1 rounded-full text-xs animate-bounce shadow-lg">
                <Target className="w-4 h-4 text-red-600 animate-spin" />
                <span>PHI TIÊU ĐANG NGẮM BẮN!</span>
              </div>

              {/* The balloon itself */}
              {!isPopped ? (
                <div
                  className={`transition-transform duration-100 ease-linear rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] bg-gradient-to-br ${
                    BALLOONS[activeBalloonIdx].color
                  } shadow-2xl border-4 ${BALLOONS[activeBalloonIdx].border} flex flex-col items-center justify-center cursor-pointer relative animate-shake-suspense`}
                  style={{
                    width: `${75 * balloonScale}px`,
                    height: `${95 * balloonScale}px`,
                    maxHeight: '260px',
                    maxWidth: '220px',
                  }}
                >
                  <div className="w-4 h-6 bg-white/50 rounded-full absolute top-3 left-4 rotate-45" />
                  <span className="text-2xl font-black text-white drop-shadow-md">
                    💣
                  </span>
                  <div className="w-3 h-3 bg-slate-900 rounded-full absolute -bottom-1.5" />
                  <div className="w-1 h-8 bg-white/70 absolute -bottom-8" />
                </div>
              ) : (
                /* Explosion effect */
                <div className="relative flex items-center justify-center animate-camera-shake">
                  <div className="w-44 h-44 rounded-full bg-gradient-to-r from-yellow-300 via-rose-500 to-amber-400 flex items-center justify-center animate-ping" />
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    💥
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Idle: 8 Floating Balloons */
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 w-full px-2">
              {BALLOONS.map((b, idx) => (
                <div
                  key={b.id}
                  onClick={onPlayStart}
                  className="relative cursor-pointer transition-all duration-300 flex flex-col items-center hover:scale-125 select-none animate-float group"
                  style={{ animationDelay: `${idx * 0.2}s` }}
                >
                  <div
                    className={`w-12 h-16 sm:w-16 sm:h-20 rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] bg-gradient-to-br ${
                      b.color
                    } shadow-lg ${b.shadow} border-2 border-white/60 flex flex-col items-center justify-center relative group-hover:shadow-[0_0_20px_#f43f5e]`}
                  >
                    <div className="w-2.5 h-4 bg-white/40 rounded-full absolute top-2 left-2 rotate-45" />
                    <span className="text-xs font-black text-white">{idx + 1}</span>
                    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full absolute -bottom-1" />
                    <div className="w-0.5 h-4 bg-slate-400/80 absolute -bottom-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reveal Modal */}
          {revealedStudent && (
            <div className="absolute inset-0 m-auto w-11/12 max-w-lg h-44 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 rounded-3xl border-4 border-white shadow-[0_0_50px_rgba(251,191,36,0.9)] flex flex-col items-center justify-center p-4 text-center z-40 animate-in zoom-in-50 duration-300">
              <Sparkles className="w-8 h-8 text-amber-900 animate-spin" />
              <p className="text-sm font-black uppercase text-red-600 tracking-wider">
                💥 NỔ TUNG RỒI! CHÚC MỪNG BẠN 💥
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
            ? '🔥 Nín thở! Quả bóng sắp nổ tung để tìm bạn học sinh may mắn...'
            : 'Bấm nút hoặc click vào 1 quả bóng bất kỳ để bắt đầu cuộc kích nổ!'}
        </div>
      </div>

      {/* Button */}
      <div className="mt-4">
        <button
          onClick={onPlayStart}
          disabled={isPlaying || students.length === 0}
          className={`py-4 px-12 rounded-full font-display font-black text-white shadow-2xl flex items-center gap-3 transition-transform active:scale-95 border-2 border-rose-300 ${
            isPlaying || students.length === 0
              ? 'bg-slate-400 cursor-not-allowed opacity-75'
              : 'bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-700 hover:to-red-700 shadow-rose-600/40 text-xl sm:text-2xl hover:scale-105 animate-pulse-glow'
          }`}
        >
          <span className="text-2xl">🎈</span>
          <span>{isPlaying ? 'ĐANG KÍCH NỔ...' : 'KÍCH NỔ BÓNG BAY'}</span>
        </button>
      </div>
    </div>
  );
};
