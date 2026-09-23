import React from 'react';
import { X, Trash2, RotateCcw, Clock, Award } from 'lucide-react';
import { HistoryRecord } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  history: HistoryRecord[];
  currentClassName: string;
  onClose: () => void;
  onClearHistory: () => void;
  onResetCycle: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  currentClassName,
  onClose,
  onClearHistory,
  onResetCycle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-amber-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800">
                📜 Lịch sử gọi tên
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {currentClassName} · Tổng cộng {history.length} lượt gọi
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

        {/* Toolbar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">
            Danh sách các lượt gọi gần nhất
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetCycle}
              className="py-1.5 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Làm mới để bắt đầu lượt gọi từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm mới vòng gọi</span>
            </button>

            {history.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xóa sạch toàn bộ lịch sử gọi tên không?')) {
                    onClearHistory();
                  }
                }}
                className="py-1.5 px-3 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa lịch sử</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {history.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Award className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="text-base font-bold mb-1">Chưa có lượt gọi tên nào hôm nay.</p>
              <p className="text-xs">Hãy bắt đầu quay vòng hoặc chọn trò chơi để gọi học sinh nhé!</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-700 text-xs font-extrabold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4 text-center w-16">STT</th>
                    <th className="py-3 px-4">Học sinh</th>
                    <th className="py-3 px-4 text-center w-28">Thời gian</th>
                    <th className="py-3 px-4">Trò chơi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {history.map((record, idx) => (
                    <tr
                      key={record.id}
                      className="hover:bg-amber-50/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        ⭐ {record.studentName}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-xs font-semibold text-slate-600">
                        {record.time}
                      </td>
                      <td className="py-3 px-4 font-semibold text-amber-700">
                        {record.gameName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
