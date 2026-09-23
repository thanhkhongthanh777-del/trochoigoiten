import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCw, Sparkles } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface WheelGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onSpinStart: () => void;
  onSpinComplete: (student: Student) => void;
}

const SECTOR_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e',
];

export const WheelGame: React.FC<WheelGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onSpinStart,
  onSpinComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const currentAngleRef = useRef<number>(0);
  const isSpinningRef = useRef<boolean>(false);
  const targetStudentRef = useRef<Student | null>(null);
  const [currentTickName, setCurrentTickName] = useState<string>('');
  const [pointerWobble, setPointerWobble] = useState<boolean>(false);
  const [ledPhase, setLedPhase] = useState<number>(0);

  // Slices to render
  const slices = students.length > 0 ? students : [{ id: 'empty', name: 'Chưa có học sinh', callCount: 0 }];

  // Chasing LED bulbs around wheel
  useEffect(() => {
    const interval = setInterval(() => {
      setLedPhase((p) => (p + 1) % 4);
    }, isPlaying ? 100 : 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Draw the wheel on canvas
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 24;
    const sliceCount = slices.length;
    const arcSize = (2 * Math.PI) / sliceCount;

    ctx.clearRect(0, 0, width, height);

    // Draw wheel shadow & outer glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = isPlaying ? 'rgba(245, 158, 11, 0.35)' : 'rgba(0, 0, 0, 0.12)';
    ctx.shadowColor = isPlaying ? '#f59e0b' : 'transparent';
    ctx.shadowBlur = isPlaying ? 25 : 0;
    ctx.fill();
    ctx.restore();

    // Draw slices
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    for (let i = 0; i < sliceCount; i++) {
      const sliceStart = i * arcSize;
      const sliceEnd = sliceStart + arcSize;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, sliceStart, sliceEnd);
      ctx.closePath();

      ctx.fillStyle = SECTOR_COLORS[i % SECTOR_COLORS.length];
      ctx.fill();

      // White separation lines
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Outer metallic peg at edge of each slice
      const pegX = Math.cos(sliceStart) * (radius - 5);
      const pegY = Math.sin(sliceStart) * (radius - 5);
      ctx.beginPath();
      ctx.arc(pegX, pegY, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Text rendering
      ctx.save();
      ctx.rotate(sliceStart + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = sliceCount > 24 ? 'bold 12px Nunito, sans-serif' : 'bold 15px Nunito, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;

      const rawName = slices[i].name;
      const displayName = rawName.length > 15 ? rawName.slice(0, 13) + '..' : rawName;
      ctx.fillText(displayName, radius - 22, 5);
      ctx.restore();
    }

    // Outer Heavy Gold Bezel
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius - 4, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    // Center Gold Medal Hub
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, 2 * Math.PI);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#b45309';
    ctx.stroke();

    // Inner Jewel
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#ea580c';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', 0, 1);

    ctx.restore();
  };

  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [students]);

  // Handle spin execution
  useEffect(() => {
    if (isPlaying && selectedStudent && !isSpinningRef.current) {
      isSpinningRef.current = true;
      targetStudentRef.current = selectedStudent;

      const sliceCount = slices.length;
      const targetIndex = slices.findIndex((s) => s.id === selectedStudent.id);
      const safeIndex = targetIndex >= 0 ? targetIndex : 0;
      const arcSize = (2 * Math.PI) / sliceCount;

      // Pointer is at top (3*PI/2)
      const targetSliceCenter = safeIndex * arcSize + arcSize / 2;
      const desiredFinalAngle = (1.5 * Math.PI - targetSliceCenter + 2 * Math.PI) % (2 * Math.PI);

      // Multiple high-speed rotations + exact alignment
      const fullRotations = (4 + Math.floor(durationSeconds * 2)) * 2 * Math.PI;
      const startAngle = currentAngleRef.current % (2 * Math.PI);
      const totalDelta = fullRotations + ((desiredFinalAngle - (startAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));

      const startTime = performance.now();
      const spinDuration = durationSeconds * 1000;
      let lastTickIndex = -1;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / spinDuration);

        // Dramatic ease-out quintic curve (fast spin, dramatic slow down)
        const easeOut = 1 - Math.pow(1 - progress, 4);
        const currentAngle = startAngle + totalDelta * easeOut;
        currentAngleRef.current = currentAngle;
        drawWheel(currentAngle);

        // Highlighted slice under pointer
        const normalizedAngle = (1.5 * Math.PI - (currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const currentSliceIndex = Math.floor(normalizedAngle / arcSize) % sliceCount;

        if (currentSliceIndex !== lastTickIndex && currentSliceIndex >= 0 && currentSliceIndex < sliceCount) {
          lastTickIndex = currentSliceIndex;
          setCurrentTickName(slices[currentSliceIndex].name);
          setPointerWobble(true);
          setTimeout(() => setPointerWobble(false), 80);

          // Variable pitch tick sound that deepens as it slows
          const speedFactor = 1 - progress;
          sound.playTick(500 + speedFactor * 400);
        }

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          isSpinningRef.current = false;
          drawWheel(currentAngle);
          sound.playExplosion();
          onSpinComplete(selectedStudent);
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, selectedStudent]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-2">
      {/* Pointer Pin at top with Wobble */}
      <div className={`relative z-20 -mb-7 flex flex-col items-center transition-transform ${
        pointerWobble ? '-rotate-12 scale-110' : 'rotate-0'
      }`}>
        <div className="w-9 h-9 bg-red-600 rounded-full border-4 border-yellow-300 shadow-[0_0_15px_rgba(239,68,68,0.8)] flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-ping" />
        </div>
        <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[26px] border-t-red-600 -mt-1.5 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" />
      </div>

      {/* Wheel Canvas Frame with Chasing Stadium LED Lights */}
      <div className="relative p-4 sm:p-5 rounded-full bg-gradient-to-b from-amber-600 via-yellow-500 to-amber-700 shadow-2xl border-4 border-yellow-300">
        {/* 20 Stadium LED Bulbs around the bezel */}
        {[...Array(20)].map((_, i) => {
          const deg = i * (360 / 20);
          const isLit = (i + ledPhase) % 2 === 0;
          return (
            <div
              key={i}
              className={`absolute w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-amber-950 transition-colors duration-100 ${
                isLit
                  ? 'bg-yellow-200 shadow-[0_0_10px_#fef08a]'
                  : 'bg-amber-900 opacity-60'
              }`}
              style={{
                top: `calc(50% - 6px + ${Math.sin((deg * Math.PI) / 180) * (isProjectorMode ? 260 : 210)}px)`,
                left: `calc(50% - 6px + ${Math.cos((deg * Math.PI) / 180) * (isProjectorMode ? 260 : 210)}px)`,
              }}
            />
          );
        })}

        <canvas
          ref={canvasRef}
          width={isProjectorMode ? 500 : 400}
          height={isProjectorMode ? 500 : 400}
          className="max-w-full h-auto aspect-square rounded-full transition-transform bg-slate-900"
        />
      </div>

      {/* Live ticker banner */}
      <div className="mt-4 h-11 flex items-center justify-center">
        {isPlaying && currentTickName ? (
          <div className="px-8 py-2 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 text-white font-display font-black rounded-full shadow-lg text-xl animate-pulse flex items-center gap-2 border-2 border-yellow-300">
            <Sparkles className="w-5 h-5 animate-spin text-yellow-200" />
            <span>KIM ĐANG CHỈ:</span>
            <span className="underline decoration-yellow-300 text-yellow-100 text-2xl">
              {currentTickName}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-600 font-extrabold text-sm sm:text-base">
            <span>🎡 {slices.length} học sinh sẵn sàng trong vòng quay kỳ diệu</span>
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="mt-4">
        <button
          onClick={onSpinStart}
          disabled={isPlaying || students.length === 0}
          className={`py-4 px-12 rounded-full font-display font-black text-white shadow-2xl flex items-center gap-3 transition-transform active:scale-95 border-2 border-yellow-200 ${
            isPlaying || students.length === 0
              ? 'bg-slate-400 cursor-not-allowed opacity-75'
              : 'bg-gradient-to-r from-red-500 via-amber-500 to-orange-600 hover:from-red-600 hover:to-orange-600 shadow-orange-500/40 text-xl sm:text-2xl hover:scale-105 animate-pulse-glow'
          }`}
        >
          {isPlaying ? (
            <>
              <RotateCw className="w-7 h-7 animate-spin" />
              <span>ĐANG QUAY THẦN TỐC...</span>
            </>
          ) : (
            <>
              <Play className="w-7 h-7 fill-current" />
              <span>QUAY VÒNG MAY MẮN</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
