import React, { useEffect, useState } from 'react';
import { Bot, Search, Sparkles, Cpu, Target, Zap } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface RobotGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

export const RobotGame: React.FC<RobotGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [robotSpeech, setRobotSpeech] = useState<string>(
    'Để xem hôm nay mình sẽ gọi bạn nào nhé!'
  );
  const [currentScanningName, setCurrentScanningName] = useState<string>('Sẵn sàng');
  const [isFound, setIsFound] = useState<boolean>(false);
  const [revealedStudent, setRevealedStudent] = useState<Student | null>(null);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsFound(false);
      setRevealedStudent(null);
      setRobotSpeech('🔍 Đang khởi động cảm biến radar quét danh sách...');

      const scanSteps = [
        '⚡ Khởi động radar vệ tinh...',
        '🎯 Đang khóa tọa độ lớp học...',
        '✨ Đang phân tích năng lượng siêu vui...',
      ];

      let stepIdx = 0;
      const speechInterval = setInterval(() => {
        stepIdx = (stepIdx + 1) % scanSteps.length;
        setRobotSpeech(scanSteps[stepIdx]);
      }, 900);

      const nameInterval = setInterval(() => {
        const randomIdx = Math.floor(Math.random() * students.length);
        setCurrentScanningName(students[randomIdx]?.name || 'Học sinh');
        sound.playRobotScan();
      }, 80);

      const foundTimer = setTimeout(() => {
        clearInterval(speechInterval);
        clearInterval(nameInterval);

        setIsFound(true);
        setCurrentScanningName(selectedStudent.name);
        setRevealedStudent(selectedStudent);
        setRobotSpeech(`🎉 TING! Đã quét trúng bạn ${selectedStudent.name}!`);
        sound.playRobotSuccess();
        sound.playExplosion();

        setTimeout(() => {
          onPlayComplete(selectedStudent);
        }, 800);
      }, durationSeconds * 1000);

      return () => {
        clearInterval(speechInterval);
        clearInterval(nameInterval);
        clearTimeout(foundTimer);
      };
    } else {
      setIsFound(false);
      setRobotSpeech('Để xem hôm nay mình sẽ gọi bạn nào nhé!');
    }
  }, [isPlaying, selectedStudent]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-2">
      {/* Comic Speech Bubble */}
      <div className="relative mb-3 max-w-lg w-full px-4">
        <div className="p-3.5 sm:p-4 bg-white rounded-3xl border-4 border-cyan-400 shadow-xl text-center relative">
          <p className="text-base sm:text-xl font-display font-black text-slate-800">
            {robotSpeech}
          </p>
          <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-cyan-400" />
        </div>
      </div>

      {/* Robot Stage */}
      <div
        className={`relative w-full ${
          isProjectorMode ? 'h-[440px] sm:h-[480px]' : 'h-96 sm:h-[420px]'
        } rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-cyan-950 to-slate-950 border-4 border-cyan-400 shadow-2xl flex flex-col items-center justify-between p-5`}
      >
        {/* Laser Sweep Scanline */}
        {isPlaying && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser pointer-events-none z-20" />
        )}

        {/* Top HUD bar */}
        <div className="relative z-10 w-full flex items-center justify-between px-4 py-1.5 bg-slate-900/80 rounded-2xl border border-cyan-500/40 text-xs font-mono text-cyan-300">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>AI SCANNER V4.0</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ONLINE</span>
          </div>
        </div>

        {/* Robot Visual */}
        <div className="relative z-10 flex flex-col items-center my-auto">
          {/* Antenna */}
          <div className="flex flex-col items-center mb-1">
            <div
              className={`w-7 h-7 rounded-full ${
                isPlaying ? 'bg-red-500 animate-ping shadow-[0_0_15px_#ef4444]' : 'bg-cyan-400'
              } border-2 border-white`}
            />
            <div className="w-1.5 h-4 bg-slate-400" />
          </div>

          {/* Robot Head */}
          <div className="w-40 h-30 sm:w-48 sm:h-34 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-3xl border-4 border-cyan-300 shadow-2xl flex flex-col items-center justify-center p-3 relative">
            {/* LED Eyes */}
            <div className="flex items-center gap-6 mb-2">
              <div
                className={`w-8 h-8 rounded-full border-2 border-slate-700 flex items-center justify-center shadow-inner ${
                  isPlaying ? 'bg-cyan-300 shadow-[0_0_12px_#22d3ee]' : 'bg-emerald-400'
                }`}
              >
                <div className="w-3 h-3 bg-slate-900 rounded-full" />
              </div>
              <div
                className={`w-8 h-8 rounded-full border-2 border-slate-700 flex items-center justify-center shadow-inner ${
                  isPlaying ? 'bg-cyan-300 shadow-[0_0_12px_#22d3ee]' : 'bg-emerald-400'
                }`}
              >
                <div className="w-3 h-3 bg-slate-900 rounded-full" />
              </div>
            </div>

            {/* Speaker Grill */}
            <div className="w-20 h-3 bg-slate-800 rounded-full flex items-center justify-around px-2">
              <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping" />
              <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full" />
              <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping delay-100" />
              <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full" />
            </div>
          </div>

          {/* Screen with Scanning Name */}
          <div className="mt-3 px-8 py-2 rounded-2xl bg-slate-950 border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400 animate-spin" />
            <span className="font-display font-black text-xl sm:text-2xl text-cyan-200 tracking-wider">
              {currentScanningName}
            </span>
          </div>
        </div>

        {/* Reveal Modal */}
        {revealedStudent && (
          <div className="absolute inset-0 m-auto w-11/12 max-w-lg h-44 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 rounded-3xl border-4 border-white shadow-[0_0_50px_rgba(34,211,238,0.9)] flex flex-col items-center justify-center p-4 text-center z-40 animate-in zoom-in-50 duration-300">
            <Sparkles className="w-10 h-10 text-cyan-950 animate-spin" />
            <p className="text-xs font-black uppercase text-red-600 tracking-wider">
              🤖 ĐÃ KHÓA MỤC TIÊU! CHÚC MỪNG BẠN 🤖
            </p>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-950 mt-1 truncate max-w-full drop-shadow-sm">
              {revealedStudent.name}
            </h2>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="relative z-10 text-center text-xs sm:text-sm font-extrabold text-cyan-300">
          {isPlaying
            ? '⚡ Robot đang quét ma trận tên học sinh với tốc độ 1000 lượt/giây...'
            : 'Nhấn "ROBOT QUÉT TÊN" để kích hoạt chế độ dò tìm tự động'}
        </div>
      </div>

      {/* Button */}
      <div className="mt-4">
        <button
          onClick={onPlayStart}
          disabled={isPlaying || students.length === 0}
          className={`py-4 px-12 rounded-full font-display font-black text-white shadow-2xl flex items-center gap-3 transition-transform active:scale-95 border-2 border-cyan-300 ${
            isPlaying || students.length === 0
              ? 'bg-slate-400 cursor-not-allowed opacity-75'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 shadow-cyan-500/40 text-xl sm:text-2xl hover:scale-105 animate-pulse-glow'
          }`}
        >
          <Bot className="w-7 h-7" />
          <span>{isPlaying ? 'ĐANG QUÉT MỤC TIÊU...' : 'ROBOT QUÉT TÊN'}</span>
        </button>
      </div>
    </div>
  );
};
