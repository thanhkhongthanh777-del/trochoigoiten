import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';

interface ConfirmRerollModalProps {
  isOpen: boolean;
  studentName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmRerollModal: React.FC<ConfirmRerollModalProps> = ({
  isOpen,
  studentName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-white rounded-3xl shadow-2xl border-4 border-amber-300 text-center">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
          <RotateCcw className="w-9 h-9 animate-spin-slow" />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 font-display mb-2">
          Xác nhận gọi lại?
        </h3>

        <p className="text-slate-600 text-base mb-2">
          Bạn có chắc muốn chọn lại học sinh khác không?
        </p>

        {studentName && (
          <div className="mb-6 p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-900 font-semibold">
            Học sinh hiện tại: <span className="underline">{studentName}</span> sẽ không bị trùng trong lượt tiếp theo.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onCancel}
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-transform active:scale-95"
          >
            Chọn lại
          </button>
        </div>
      </div>
    </div>
  );
};
