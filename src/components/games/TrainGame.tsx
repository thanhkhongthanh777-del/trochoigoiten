import React, { useEffect, useState, useRef } from 'react';
import { Train, Square, Play } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface TrainGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

export const TrainGame: React.FC<TrainGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [trainOffset, setTrainOffset] = useState<number>(0);
  const [currentCarName, setCurrentCarName] = useState<string>('Đoàn tàu tri thức');
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsStopped(false);
      sound.playTrainWhistle();

      // Sound chugging loop & moving cars
      intervalRef.current = setInterval(() => {
        setTrainOffset((prev) => (prev + 12) % 400);
        const randomIdx = Math.floor(Math.random() * students.length);
        setCurrentCarName(students[randomIdx]?.name || 'Học sinh');
        sound.playTrainChug();
      }, 90);

      timeoutRef.current = setTimeout(() => {
        handleStopTrain();
      }, durationSeconds * 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    } else {
      setIsStopped(false);
    }
  }, [isPlaying, selectedStudent]);

  const handleStopTrain = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (selectedStudent) {
      setIsStopped(true);
      setCurrentCarName(selectedStudent.name);
      sound.playTrainWhistle();
      sound.playFanfare();

      setTimeout(() => {
        onPlayComplete(selectedStudent);
      }, 650);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-4">
      {/* Railroad Stage */}
      <div
        className={`relative w-full ${
          isProjectorMode ? 'h-96 sm:h-[420px]' : 'h-80 sm:h-96'
        } rounded-3xl overflow-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 border-4 border-emerald-400 shadow-2xl flex flex-col justify-between p-6`}
      >
        {/* Sky with clouds */}
        <div className="flex justify-between items-center px-4 pointer-events-none">
          <div className="text-3xl animate-float">☁️</div>
          <div className="text-2xl animate-float delay-300">🌤️</div>
          <div className="text-3xl animate-float delay-150">☁️</div>
        </div>

        {/* Train Track & Station */}
        <div className="relative w-full flex flex-col items-center justify-center my-auto">
          {/* Station sign */}
          <div className="mb-4 px-6 py-2 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-emerald-500 shadow-lg text-center">
            <p className="text-xs uppercase tracking-wider font-extrabold text-emerald-700 mb-0.5">
              {isStopped ? '🎉 TOA TÀU MAY MẮN 🎉' : isPlaying ? 'TÀU ĐANG CHẠY QUA GA...' : 'GA TRƯỜNG TIỂU HỌC'}
            </p>
            <h3
              className={`font-display font-black text-slate-800 ${
                isStopped ? 'text-2xl sm:text-4xl text-emerald-800' : 'text-xl sm:text-3xl'
              }`}
            >
              {currentCarName}
            </h3>
          </div>

          {/* Animated Train Visual */}
          <div className="flex items-center gap-2 transition-transform duration-100 overflow-hidden w-full justify-center">
            {/* Locomotive */}
            <div className={`flex flex-col items-center text-5xl sm:text-6xl ${isPlaying ? 'animate-bounce' : ''}`}>
              <span>🚂</span>
              {isPlaying && <span className="text-xs -mt-1 font-bold text-slate-600">xình xịch...</span>}
            </div>

            {/* Passenger Cars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((car) => (
                <div
                  key={car}
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 font-display font-bold text-xs sm:text-sm flex items-center justify-center shadow-md ${
                    isStopped && car === 2
                      ? 'bg-amber-400 text-amber-950 border-amber-500 scale-110 animate-bounce'
                      : 'bg-emerald-500 text-white border-emerald-600'
                  }`}
                >
                  <span>Toa {car}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rails & Sleepers */}
          <div className="w-full mt-3 h-4 bg-slate-700 rounded-full relative flex items-center justify-around border-t-2 border-slate-900 shadow-inner">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="w-2 h-5 bg-amber-900 rounded-sm -mt-0.5 shadow-sm" />
            ))}
          </div>
        </div>

        {/* Hills Footer */}
        <div className="text-xs text-emerald-800 font-bold text-center">
          Chuyến tàu hạnh phúc chở theo {students.length} bạn nhỏ chăm ngoan
        </div>
      </div>

      {/* Button Controls */}
      <div className="mt-6">
        {isPlaying ? (
          <button
            onClick={handleStopTrain}
            className="py-4 px-10 rounded-full font-display font-extrabold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-xl shadow-red-500/30 text-xl sm:text-2xl flex items-center gap-3 transition-transform active:scale-95 animate-pulse"
          >
            <Square className="w-7 h-7 fill-current" />
            <span>DỪNG TÀU</span>
          </button>
        ) : (
          <button
            onClick={onPlayStart}
            disabled={students.length === 0}
            className={`py-4 px-10 rounded-full font-display font-extrabold text-white shadow-xl flex items-center gap-3 transition-transform active:scale-95 ${
              students.length === 0
                ? 'bg-slate-400 cursor-not-allowed opacity-75'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/30 text-xl sm:text-2xl hover:scale-105'
            }`}
          >
            <Train className="w-7 h-7" />
            <span>CHẠY TÀU HỎA</span>
          </button>
        )}
      </div>
    </div>
  );
};
