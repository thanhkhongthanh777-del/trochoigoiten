import React, { useState } from 'react';
import {
  X,
  UserPlus,
  ClipboardList,
  Trash2,
  Edit2,
  Check,
  Plus,
  Layers,
  FolderPlus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ClassRoom, Student } from '../types';
import { parseExcelStudentNames } from '../utils/storage';

interface StudentManagerModalProps {
  isOpen: boolean;
  classes: ClassRoom[];
  currentClassId: string;
  calledStudentIds: Set<string>;
  onClose: () => void;
  onSelectClass: (classId: string) => void;
  onAddStudent: (name: string) => void;
  onAddBatchStudents: (names: string[]) => void;
  onEditStudent: (studentId: string, newName: string) => void;
  onDeleteStudent: (studentId: string) => void;
  onClearAllStudents: () => void;
  onCreateClass: (className: string) => void;
  onRenameClass: (classId: string, newName: string) => void;
  onDeleteClass: (classId: string) => void;
  onResetCalledStatus: () => void;
}

export const StudentManagerModal: React.FC<StudentManagerModalProps> = ({
  isOpen,
  classes,
  currentClassId,
  calledStudentIds,
  onClose,
  onSelectClass,
  onAddStudent,
  onAddBatchStudents,
  onEditStudent,
  onDeleteStudent,
  onClearAllStudents,
  onCreateClass,
  onRenameClass,
  onDeleteClass,
  onResetCalledStatus,
}) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Excel paste mode toggle
  const [isPasteExcelOpen, setIsPasteExcelOpen] = useState(false);
  const [pasteExcelText, setPasteExcelText] = useState('');

  // Class creation mode
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  // Class editing mode
  const [isRenamingClass, setIsRenamingClass] = useState(false);
  const [renamedClassName, setRenamedClassName] = useState('');

  if (!isOpen) return null;

  const currentClass = classes.find((c) => c.id === currentClassId) || classes[0];
  const students = currentClass?.students || [];

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    onAddStudent(newStudentName.trim());
    setNewStudentName('');
  };

  const handleStartEdit = (student: Student) => {
    setEditingStudentId(student.id);
    setEditingName(student.name);
  };

  const handleSaveEdit = (studentId: string) => {
    if (editingName.trim()) {
      onEditStudent(studentId, editingName.trim());
    }
    setEditingStudentId(null);
    setEditingName('');
  };

  const handleApplyExcelPaste = () => {
    const parsedNames = parseExcelStudentNames(pasteExcelText);
    if (parsedNames.length > 0) {
      onAddBatchStudents(parsedNames);
      setPasteExcelText('');
      setIsPasteExcelOpen(false);
    }
  };

  const handleCreateNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim()) {
      onCreateClass(newClassName.trim());
      setNewClassName('');
      setIsCreatingClass(false);
    }
  };

  const handleSaveClassRename = () => {
    if (renamedClassName.trim() && currentClass) {
      onRenameClass(currentClass.id, renamedClassName.trim());
      setIsRenamingClass(false);
    }
  };

  // Live parsed count preview for Excel textarea
  const liveParsedCount = parseExcelStudentNames(pasteExcelText).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border-4 border-amber-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-800">
                👥 Quản lý danh sách học sinh
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {currentClass?.name}: {students.length} học sinh (
                {calledStudentIds.size} em đã được gọi trong vòng này)
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

        {/* Class Selection & Switcher Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Chọn lớp:
            </span>
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => onSelectClass(cls.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-sm shrink-0 transition-all ${
                  cls.id === currentClassId
                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/40'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cls.name} ({cls.students.length})
              </button>
            ))}

            <button
              onClick={() => setIsCreatingClass(true)}
              className="px-2.5 py-1.5 rounded-xl border border-dashed border-amber-500 text-amber-700 hover:bg-amber-50 text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Tạo lớp mới</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRenamedClassName(currentClass?.name || '');
                setIsRenamingClass(true);
              }}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200"
              title="Đổi tên lớp hiện tại"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Đổi tên lớp</span>
            </button>

            {classes.length > 1 && (
              <button
                onClick={() => {
                  if (confirm(`Bạn có chắc muốn xóa ${currentClass?.name} không?`)) {
                    onDeleteClass(currentClass.id);
                  }
                }}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 border border-rose-200"
                title="Xóa lớp này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Inline Create Class Input Form */}
        {isCreatingClass && (
          <form
            onSubmit={handleCreateNewClass}
            className="px-6 py-3 bg-amber-50/80 border-b border-amber-200 flex items-center gap-3 animate-in fade-in"
          >
            <span className="text-xs font-bold text-amber-800">Tên lớp mới:</span>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Ví dụ: Lớp 5/3..."
              className="py-1.5 px-3 rounded-lg border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-48"
              autoFocus
            />
            <button
              type="submit"
              className="py-1.5 px-3 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700"
            >
              Lưu lớp
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingClass(false)}
              className="py-1.5 px-3 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200"
            >
              Hủy
            </button>
          </form>
        )}

        {/* Inline Rename Class Input Form */}
        {isRenamingClass && (
          <div className="px-6 py-3 bg-blue-50/80 border-b border-blue-200 flex items-center gap-3 animate-in fade-in">
            <span className="text-xs font-bold text-blue-800">Đổi tên thành:</span>
            <input
              type="text"
              value={renamedClassName}
              onChange={(e) => setRenamedClassName(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-blue-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              autoFocus
            />
            <button
              onClick={handleSaveClassRename}
              className="py-1.5 px-3 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
            >
              Cập nhật
            </button>
            <button
              onClick={() => setIsRenamingClass(false)}
              className="py-1.5 px-3 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200"
            >
              Hủy
            </button>
          </div>
        )}

        {/* Add Student Controls */}
        <div className="p-4 sm:p-6 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          {/* Single Add Input */}
          <form onSubmit={handleAddSingle} className="flex-1 w-full flex items-center gap-2">
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="Nhập tên học sinh (ví dụ: Nguyễn Minh An)..."
              className="flex-1 py-2.5 px-4 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-semibold text-slate-800 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!newStudentName.trim()}
              className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-500/20 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Thêm</span>
            </button>
          </form>

          {/* Excel Paste Button */}
          <button
            onClick={() => setIsPasteExcelOpen(!isPasteExcelOpen)}
            className="w-full sm:w-auto py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            <ClipboardList className="w-4 h-4 text-emerald-600" />
            <span>📋 Dán danh sách từ Excel</span>
          </button>
        </div>

        {/* Excel Paste Box (Accordion) */}
        {isPasteExcelOpen && (
          <div className="p-4 sm:p-6 bg-emerald-50/50 border-b border-emerald-200 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-900">
                  Dán danh sách học sinh từ Excel hoặc văn bản:
                </span>
                <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Nhận diện: {liveParsedCount} học sinh
                </span>
              </div>
              <button
                onClick={() => setIsPasteExcelOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Đóng
              </button>
            </div>

            <textarea
              rows={4}
              value={pasteExcelText}
              onChange={(e) => setPasteExcelText(e.target.value)}
              placeholder="Dán nội dung từ cột Excel hoặc danh sách mỗi dòng 1 tên học sinh:&#10;1. Nguyễn Minh An&#10;2. Trần Gia Bảo&#10;3. Lê Hoàng Anh"
              className="w-full p-3 rounded-xl border border-emerald-300 bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                💡 Hệ thống tự động loại bỏ số thứ tự (1., 01-, STT), khoảng trắng thừa và tách mỗi dòng thành 1 học sinh.
              </p>
              <button
                onClick={handleApplyExcelPaste}
                disabled={liveParsedCount === 0}
                className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Nhập {liveParsedCount} học sinh vào lớp</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Toolbar: Reset Cycle & Clear All */}
        <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <span>Tiến độ vòng gọi:</span>
            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md font-bold">
              {calledStudentIds.size}/{students.length} em đã gọi
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetCalledStatus}
              className="text-amber-700 hover:text-amber-900 flex items-center gap-1 font-bold hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm mới vòng gọi</span>
            </button>

            {students.length > 0 && (
              <button
                onClick={() => {
                  if (confirm(`Bạn có chắc muốn xóa toàn bộ ${students.length} học sinh trong lớp không?`)) {
                    onClearAllStudents();
                  }
                }}
                className="text-rose-600 hover:text-rose-800 flex items-center gap-1 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa toàn bộ</span>
              </button>
            )}
          </div>
        </div>

        {/* Students List Display */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {students.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-base font-bold mb-1">Chưa có học sinh nào trong lớp này.</p>
              <p className="text-xs">Hãy nhập từng tên hoặc dán danh sách từ Excel ở phía trên nhé!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {students.map((student, index) => {
                const isCalled = calledStudentIds.has(student.id);
                const isEditing = editingStudentId === student.id;

                return (
                  <div
                    key={student.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                      isCalled
                        ? 'bg-slate-50 border-slate-200 opacity-70'
                        : 'bg-white border-amber-200/80 shadow-sm hover:border-amber-400'
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-1 w-full">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 py-1 px-2 text-sm font-bold border border-amber-400 rounded-lg outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(student.id);
                            if (e.key === 'Escape') setEditingStudentId(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveEdit(student.id)}
                          className="p-1 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-800 truncate">
                            {student.name}
                          </span>
                          {isCalled && (
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold shrink-0">
                              Đã gọi
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEdit(student)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Sửa tên"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteStudent(student.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Dữ liệu được lưu tự động trên trình duyệt, không lo mất khi tải lại trang.
          </span>
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-colors"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};
