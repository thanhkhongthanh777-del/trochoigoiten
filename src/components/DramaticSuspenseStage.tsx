import React, { useEffect, useState } from 'react';
import { Flame, Heart, Sparkles, Volume2 } from 'lucide-react';
import { Student } from '../types';
import { sound } from '../utils/audio';

interface DramaticSuspenseStageProps {
  isPlaying: boolean;
  students: Student[];
  durationSeconds: number;
}

export const DramaticSuspenseStage: React.FC<DramaticSuspenseStageProps> = ({
  isPlaying,
  students,
  durationSeconds,
}) => {
  const [bpm, setBpm] = useState<number>(90);
  const [progress, setProgress] = useState<number>(0);
  const [tickerName, setTickerName] = useState<string>('???');

  useEffect(() => {
    if (isPlaying) {
      setProgress(0);
      setBpm(100);

      // Play dramatic riser & drumroll
      sound.playDramaticRiser(durationSeconds);
      sound.playDrumroll(durationSeconds * 0.9);

      // Heartbeat intervals that accelerate
      let heartCount = 0;
      const heartInterval = setInterval(() => {
        heartCount++;
        sound.playHeartbeat(1 + heartCount * 0.1);
        setBpm((prev) => Math.min(195, prev + 12));
      }, 450);

      // Ticker rapid shuffle
      const tickerInterval = setInterval(() => {
        if (students.length > 0) {
          const rand = Math.floor(Math.random() * students.length);
          setTickerName(students[rand]?.name || '???');
        }
      }, 70);

      // Progress bar fill
      const startTime = Date.now();
      const totalMs = durationSeconds * 1000;
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(100, Math.floor((elapsed / totalMs) * 100));
        setProgress(p);
      }, 50);

      return () => {
        clearInterval(heartInterval);
        clearInterval(tickerInterval);
        clearInterval(progressInterval);
      };
    } else {
      setProgress(0);
      setBpm(90);
    }
  }, [isPlaying, durationSeconds, students]);

  if (!isPlaying) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-3 px-2 animate-in fade-in zoom-in-95 duration-200">
      {/* High-Octane Suspense Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-amber-500 to-rose-600 p-1 shadow-2xl border-2 border-yellow-300">
        <div className="bg-slate-950/90 rounded-[22px] p-3 sm:p-4 backdrop-blur-md flex flex-col items-center">
          {/* Top Dramatic Tension Headline */}
          <div className="w-full flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
              <span className="font-display font-black text-amber-300 text-sm sm:text-base tracking-wide uppercase">
                🔥 HỒI HỘP TỘT ĐỘ... CẢ LỚP NÍN THỞ!
              </span>
            </div>

            {/* Heartbeat Rate Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-950/80 rounded-full border border-red-500/50 shadow-inner">
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-heartbeat-fast" />
              <span className="font-mono font-black text-red-300 text-xs sm:text-sm">
                {bpm} BPM
              </span>
            </div>
          </div>

          {/* Rapid Name Shuffler Box with Neon Glow */}
          <div className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-yellow-400/50 flex items-center justify-between shadow-[0_0_20px_rgba(234,179,8,0.25)]">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              ĐANG RÀ SOÁT:
            </span>
            <span className="font-display font-black text-xl sm:text-2xl text-white tracking-wide truncate max-w-[280px] drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
              {tickerName}
            </span>
          </div>

          {/* Suspense Tension Meter Progress Bar */}
          <div className="w-full mt-2.5">
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700 relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-red-500 transition-all duration-75 shadow-[0_0_12px_#ef4444]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1">
              <span>Khởi động</span>
              <span className="text-amber-400 font-extrabold animate-pulse">
                {progress < 70 ? 'Đang tăng tốc...' : 'SẮP CÔNG BỐ!'}
              </span>
              <span>100% Cực đỉnh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
