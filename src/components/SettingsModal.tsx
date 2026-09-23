import React from 'react';
import {
  X,
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  PartyPopper,
  Scale,
  Clock,
  Palette,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { AppSettings, FairnessMode, RepeatAvoidance, ThemeId } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  currentClassName: string;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onRenameClass: (newName: string) => void;
  onRestoreDefaults: () => void;
}

const THEMES: { id: ThemeId; name: string; icon: string; previewColor: string }[] = [
  { id: 'rainbow', name: 'Cầu vồng', icon: '🌈', previewColor: 'from-amber-300 via-pink-300 to-purple-300' },
  { id: 'space', name: 'Vũ trụ', icon: '🚀', previewColor: 'from-slate-900 via-indigo-950 to-purple-950' },
  { id: 'nature', name: 'Thiên nhiên', icon: '🌳', previewColor: 'from-emerald-400 via-teal-400 to-amber-200' },
  { id: 'ocean', name: 'Đại dương', icon: '🐳', previewColor: 'from-sky-400 via-blue-500 to-indigo-400' },
  { id: 'dino', name: 'Khủng long', icon: '🦖', previewColor: 'from-amber-500 via-orange-500 to-lime-500' },
  { id: 'robot', name: 'Robot', icon: '🤖', previewColor: 'from-blue-600 via-cyan-500 to-slate-400' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  currentClassName,
  onClose,
  onUpdateSettings,
  onRenameClass,
  onRestoreDefaults,
}) => {
  const [classNameInput, setClassNameInput] = React.useState(currentClassName);

  React.useEffect(() => {
    setClassNameInput(currentClassName);
  }, [currentClassName]);

  if (!isOpen) return null;

  const handleSaveClassName = (e: React.FormEvent) => {
    e.preventDefault();
    if (classNameInput.trim()) {
      onRenameClass(classNameInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-amber-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800">
                ⚙️ Cài đặt hệ thống
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Tùy chỉnh chế độ gọi tên công bằng, âm thanh và giao diện
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Class Name */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              🏷️ Tên lớp học hiện tại:
            </h3>
            <form onSubmit={handleSaveClassName} className="flex items-center gap-2">
              <input
                type="text"
                value={classNameInput}
                onChange={(e) => setClassNameInput(e.target.value)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-300 bg-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-colors"
              >
                Lưu tên
              </button>
            </form>
          </div>

          {/* Section 2: Theme Selector */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-500" />
              <span>Chủ đề giao diện (Màu sắc):</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEMES.map((theme) => {
                const isSelected = settings.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onUpdateSettings({ theme: theme.id })}
                    className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 text-left ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-400/40'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl">{theme.icon}</span>
                    <div>
                      <span className="block text-sm font-bold text-slate-800">
                        {theme.name}
                      </span>
                      <div
                        className={`w-10 h-1.5 rounded-full mt-1 bg-gradient-to-r ${theme.previewColor}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Fairness Mode */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-500" />
              <span>Chế độ gọi tên công bằng:</span>
            </h3>
            <div className="space-y-2">
              {[
                {
                  id: 'no-repeat' as FairnessMode,
                  title: 'Chế độ 2 – Không lặp lại (Khuyên dùng)',
                  desc: 'Sau khi học sinh được gọi, em đó tạm thời loại khỏi danh sách cho đến khi gọi đủ cả lớp.',
                },
                {
                  id: 'priority-uncalled' as FairnessMode,
                  title: 'Chế độ 3 – Ưu tiên học sinh chưa được gọi',
                  desc: 'Hệ thống ưu tiên gọi các em chưa được gọi lượt nào trong buổi học.',
                },
                {
                  id: 'pure-random' as FairnessMode,
                  title: 'Chế độ 1 – Ngẫu nhiên hoàn toàn',
                  desc: 'Có thể gọi ngẫu nhiên bất kỳ học sinh nào trong lớp.',
                },
              ].map((mode) => {
                const isSelected = settings.fairnessMode === mode.id;
                return (
                  <label
                    key={mode.id}
                    onClick={() => onUpdateSettings({ fairnessMode: mode.id })}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="fairnessMode"
                      checked={isSelected}
                      onChange={() => onUpdateSettings({ fairnessMode: mode.id })}
                      className="mt-1 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="block text-sm font-bold text-slate-800">
                        {mode.title}
                      </span>
                      <span className="text-xs text-slate-500 leading-relaxed">
                        {mode.desc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 4: Repeat Avoidance Filter */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Chống gọi trùng (Số lượt tránh lặp):</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: 1 as RepeatAvoidance, label: 'Tránh 1 lượt' },
                { val: 3 as RepeatAvoidance, label: 'Tránh 3 lượt' },
                { val: 5 as RepeatAvoidance, label: 'Tránh 5 lượt' },
                { val: 'all' as RepeatAvoidance, label: 'Cả vòng (32/32)' },
              ].map((opt) => {
                const isSelected = settings.repeatAvoidance === opt.val;
                return (
                  <button
                    key={opt.label}
                    onClick={() => onUpdateSettings({ repeatAvoidance: opt.val })}
                    className={`py-2 px-3 rounded-xl border-2 font-bold text-xs transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Suspense Duration */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Thời gian hiệu ứng hồi hộp trước khi mở tên:</span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { sec: 2, label: 'Nhanh (2 giây)' },
                { sec: 3.5, label: 'Vừa phải (3.5 giây)' },
                { sec: 5, label: 'Hồi hộp (5 giây)' },
              ].map((dur) => {
                const isSelected = settings.durationSeconds === dur.sec;
                return (
                  <button
                    key={dur.sec}
                    onClick={() => onUpdateSettings({ durationSeconds: dur.sec })}
                    className={`py-2.5 px-2 rounded-xl border-2 font-bold text-xs transition-all text-center ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {dur.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 6: Effects & Sounds Toggles */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-800">
              Hiệu ứng hình ảnh & âm thanh:
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-amber-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
                <span className="text-sm font-bold text-slate-700">Âm thanh vui nhộn (Web Audio)</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-bold text-slate-700">Hiệu ứng chuyển động rung lắc</span>
              </div>
              <input
                type="checkbox"
                checked={settings.effectsEnabled}
                onChange={(e) => onUpdateSettings({ effectsEnabled: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PartyPopper className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-bold text-slate-700">Pháo giấy chúc mừng (Confetti)</span>
              </div>
              <input
                type="checkbox"
                checked={settings.confettiEnabled}
                onChange={(e) => onUpdateSettings({ confettiEnabled: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Section 7: Restore defaults */}
          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                if (confirm('Khôi phục lại danh sách lớp và cài đặt mẫu ban đầu?')) {
                  onRestoreDefaults();
                  onClose();
                }
              }}
              className="text-slate-400 hover:text-slate-600 flex items-center gap-1 hover:underline font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục dữ liệu mẫu ban đầu</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-colors"
          >
            Đóng cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};
