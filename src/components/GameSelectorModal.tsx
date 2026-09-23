import React, { useState } from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { GameId } from '../types';
import { GAMES } from '../utils/games';

interface GameSelectorModalProps {
  isOpen: boolean;
  activeGameId: GameId;
  onSelectGame: (id: GameId) => void;
  onClose: () => void;
}

type CategoryType = 'all' | 'classic' | 'adventure' | 'fun';

const CATEGORIES: { id: CategoryType; label: string; icon: string }[] = [
  { id: 'all', label: 'Tất cả (13 trò chơi)', icon: '🎮' },
  { id: 'classic', label: 'May mắn & Hồi hộp', icon: '⭐' },
  { id: 'adventure', label: 'Khám phá & Phiêu lưu', icon: '🚀' },
  { id: 'fun', label: 'Vui nhộn & Sôi động', icon: '🎈' },
];

export const GameSelectorModal: React.FC<GameSelectorModalProps> = ({
  isOpen,
  activeGameId,
  onSelectGame,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

  if (!isOpen) return null;

  const filteredGames = GAMES.filter((game) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'classic') {
      return ['wheel', 'mystery-gift', 'secret-door', 'star-catcher'].includes(game.id);
    }
    if (selectedCategory === 'adventure') {
      return ['space-names', 'treasure-island', 'train-express', 'robot-helper'].includes(game.id);
    }
    if (selectedCategory === 'fun') {
      return ['balloon-pop', 'claw-machine', 'speed-race', 'apple-tree', 'cloud-sky'].includes(game.id);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800 flex items-center gap-2">
              <span>🎮 Kho 13 trò chơi gọi tên học sinh</span>
              <span className="text-xs bg-amber-500 text-white px-2.5 py-0.5 rounded-full font-bold">
                Mới cập nhật
              </span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Thiết kế hoạt hình phong phú, tối ưu cho màn hình máy tính và máy chiếu lớp học
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-6 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-1.5 px-3.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/40'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body - Game Grid (Responsive 1 -> 2 -> 3 columns on desktop) */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredGames.map((game) => {
            const isSelected = activeGameId === game.id;
            const isNew = game.badge.includes('Mới');

            return (
              <div
                key={game.id}
                onClick={() => {
                  onSelectGame(game.id);
                  onClose();
                }}
                className={`group relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/90 shadow-md ring-2 ring-amber-400/50 scale-[1.01]'
                    : 'border-slate-200 hover:border-amber-400 hover:bg-slate-50/80 hover:shadow-sm'
                }`}
              >
                {/* Icon Box */}
                <div className="w-13 h-13 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  {game.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="font-display font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors truncate">
                      {game.title}
                    </h3>
                    {isSelected && (
                      <span className="shrink-0 p-1 bg-amber-500 text-white rounded-full">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
                    {game.description}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        isNew
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {game.badge}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            💡 Mẹo: Giáo viên có thể bấm phím <kbd className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-[11px] font-bold">Space</kbd> để gọi tên ngay trên máy tính!
          </span>
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
