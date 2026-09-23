import React, { useEffect, useState } from 'react';
import { DoorClosed, Sparkles, Play } from 'lucide-react';
import { Student } from '../../types';
import { sound } from '../../utils/audio';

interface SecretDoorGameProps {
  students: Student[];
  isPlaying: boolean;
  selectedStudent: Student | null;
  durationSeconds: number;
  isProjectorMode: boolean;
  onPlayStart: () => void;
  onPlayComplete: (student: Student) => void;
}

const DOORS = [
  { id: 1, color: 'from-blue-600 to-indigo-700', border: 'border-blue-300' },
  { id: 2, color: 'from-amber-500 to-orange-600', border: 'border-amber-300' },
  { id: 3, color: 'from-emerald-500 to-teal-700', border: 'border-emerald-300' },
  { id: 4, color: 'from-pink-500 to-rose-600', border: 'border-pink-300' },
  { id: 5, color: 'from-purple-600 to-fuchsia-700', border: 'border-purple-300' },
  { id: 6, color: 'from-cyan-500 to-teal-600', border: 'border-cyan-300' },
];

export const SecretDoorGame: React.FC<SecretDoorGameProps> = ({
  students,
  isPlaying,
  selectedStudent,
  durationSeconds,
  isProjectorMode,
  onPlayStart,
  onPlayComplete,
}) => {
  const [activeDoorIndex, setActiveDoorIndex] = useState<number | null>(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    if (isPlaying && selectedStudent) {
      setIsOpened(false);
      const chosenDoor = Math.floor(Math.random() * DOORS.length);
      setActiveDoorIndex(chosenDoor);

      sound.playDoorOpen();
      const knockInterval = setInterval(() => {
        sound.playTick(500);
      }, 350);

      const openTimer = setTimeout(() => {
        clearInterval(knockInterval);
        setIsOpened(true);
        sound.playFanfare();

        setTimeout(() => {
          onPlayComplete(selectedStudent);
        }, 650);
      }, durationSeconds * 1000);

      return () => {
        clearInterval(knockInterval);
        clearTimeout(openTimer);
      };
    } else {
      setActiveDoorIndex(null);
      setIsOpened(false);
    }
  }, [isPlaying, selectedStudent]);

  const handleSelectDoor = (idx: number) => {
    if (!isPlaying && students.length > 0) {
      setActiveDoorIndex(idx);
      onPlayStart();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-4">
      {/* Prompt header */}
      <div className="mb-6 text-center">
        <p className="text-slate-600 font-bold text-base sm:text-lg">
          {isPlaying
            ? '🚪 Cốc cốc... Ai đang trốn sau cánh cửa thần kỳ thế nhỉ?'
            : 'Chọn một cánh cửa bí ẩn hoặc nhấn "MỞ CỬA NGẪU NHIÊN"'}
        </p>
      </div>

      {/* Doors Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 w-full px-4 mb-6">
        {DOORS.map((door, idx) => {
          const isTarget = activeDoorIndex === idx;
          const isShaking = isPlaying && isTarget && !isOpened;
          const isDoorOpen = isPlaying && isTarget && isOpened;

          return (
            <div
              key={door.id}
              onClick={() => handleSelectDoor(idx)}
              className={`relative cursor-pointer transition-transform select-none ${
                isShaking ? 'animate-shake-suspense scale-110 z-20' : ''
              } ${isDoorOpen ? 'scale-115 z-30' : 'hover:-translate-y-2'}`}
            >
              {/* Door Frame */}
              <div
                className={`relative aspect-[1/2] rounded-t-3xl rounded-b-lg p-2 flex flex-col items-center justify-between bg-gradient-to-b ${
                  door.color
                } shadow-xl border-4 ${
                  isTarget ? 'border-yellow-300 ring-4 ring-yellow-400/50' : 'border-amber-900/30'
                }`}
              >
                {/* Arch Top Window */}
                <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xs font-black text-white">
                  {door.id}
                </div>

                {/* Door Panels */}
                <div className="w-full flex-1 flex flex-col justify-around py-2">
                  <div className="w-full h-8 bg-black/10 rounded-md border border-white/20" />
                  <div className="w-full h-8 bg-black/10 rounded-md border border-white/20" />
                </div>

                {/* Brass Door Knob */}
                <div className="w-4 h-4 rounded-full bg-amber-300 border-2 border-amber-600 shadow-md self-end mr-1" />

                {/* Open reveal banner */}
                {isDoorOpen && (
                  <div className="absolute inset-0 bg-yellow-300 rounded-t-3xl rounded-b-lg border-4 border-amber-500 shadow-2xl flex flex-col items-center justify-center p-2 text-center animate-bounce z-20">
                    <Sparkles className="w-8 h-8 text-amber-600 animate-spin" />
                    <span className="text-[10px] font-bold text-amber-900 uppercase">TÌM THẤY RỒI!</span>
                    <span className="text-xs sm:text-sm font-black text-amber-950 truncate max-w-full">
                      {selectedStudent?.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Button */}
      <div className="mt-4">
        <button
          onClick={onPlayStart}
          disabled={isPlaying || students.length === 0}
          className={`py-4 px-10 rounded-full font-display font-extrabold text-white shadow-xl flex items-center gap-3 transition-transform active:scale-95 ${
            isPlaying || students.length === 0
              ? 'bg-slate-400 cursor-not-allowed opacity-75'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30 text-xl sm:text-2xl hover:scale-105'
          }`}
        >
          <DoorClosed className="w-7 h-7" />
          <span>{isPlaying ? 'Đang mở cửa...' : 'MỞ CỬA NGẪU NHIÊN'}</span>
        </button>
      </div>
    </div>
  );
};
