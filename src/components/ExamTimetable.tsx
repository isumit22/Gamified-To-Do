import { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Exam } from '../hooks/useStudyData';

interface ExamTimetableProps {
  exams: Exam[];
  onAddExam: (subject: string, examDate: string, examTime: string) => void;
  onDeleteExam: (id: string) => void;
}

export const ExamTimetable = ({ exams, onAddExam, onDeleteExam }: ExamTimetableProps) => {
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddExam = () => {
    if (subject.trim() && examDate && examTime) {
      onAddExam(subject.trim(), examDate, examTime);
      setSubject('');
      setExamDate('');
      setExamTime('');
      // Keep form open for quick multiple entries
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && subject.trim() && examDate && examTime) {
      e.preventDefault();
      handleAddExam();
    }
  };

  const getExamStatus = (exam: Exam) => {
    const now = new Date();
    const examDateTime = new Date(`${exam.examDate}T${exam.examTime}`);
    const today = new Date().toDateString();
    const examDay = examDateTime.toDateString();

    if (exam.status === 'completed') {
      return { color: 'gray', label: '✓ Completed', icon: CheckCircle2 };
    }
    if (examDay === today) {
      return { color: 'yellow', label: '🔥 Today', icon: AlertCircle };
    }
    if (examDateTime < now) {
      return { color: 'gray', label: 'Past', icon: CheckCircle2 };
    }
    
    const diffDays = Math.ceil((examDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) {
      return { color: 'red', label: '⚠️ Tomorrow', icon: AlertCircle };
    }
    return { color: 'blue', label: `${diffDays}d left`, icon: Calendar };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const upcomingExams = (exams || []).filter((e) => e.status === 'pending');
  const completedExams = (exams || []).filter((e) => e.status === 'completed');

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={24} className="text-purple-600" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Exam Timetable</h2>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowForm(!showForm);
          }}
          type="button"
          className={`p-2 rounded-lg active:scale-95 transition-all duration-150 flex items-center gap-2 ${
            showForm
              ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
          title={showForm ? 'Close form' : 'Add exam'}
        >
          <Plus size={20} className={showForm ? 'rotate-45' : ''} />
          <span className="text-sm font-medium hidden sm:inline">
            {showForm ? 'Close' : 'Add Exam'}
          </span>
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 shadow-sm relative z-40" style={{ animation: 'slide-in 0.3s ease-out' }}>
          <h3 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
            <Calendar size={16} />
            Add New Exam
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Subject Name</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., DBMS, Operating Systems"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Exam Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  onKeyDown={handleKeyDown}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1 block">Time</label>
                <input
                  type="time"
                  value={examTime}
                  onChange={(e) => setExamTime(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddExam();
                }}
                type="button"
                disabled={!subject.trim() || !examDate || !examTime}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  subject.trim() && examDate && examTime
                    ? 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95 shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Plus size={16} />
                Add Exam
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowForm(false);
                  setSubject('');
                  setExamDate('');
                  setExamTime('');
                }}
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-500 italic">Tip: Press Enter to quickly add multiple exams</p>
          </div>
        </div>
      )}

      {(!exams || exams.length === 0) && (
        <div className="text-center py-8 text-gray-400">
          <Calendar size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No exams scheduled yet</p>
        </div>
      )}

      {upcomingExams.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-orange-500" />
            Upcoming Exams
          </h3>
          <div className="space-y-2">
            {upcomingExams.map((exam) => {
              const status = getExamStatus(exam);
              const Icon = status.icon;
              return (
                <div
                  key={exam.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${
                    status.color === 'yellow'
                      ? 'bg-yellow-50 border-yellow-500'
                      : status.color === 'red'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <Icon size={20} className={`flex-shrink-0 ${
                    status.color === 'yellow' ? 'text-yellow-600' :
                    status.color === 'red' ? 'text-red-600' : 'text-blue-600'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 text-sm sm:text-base truncate">
                      {exam.subject}
                    </div>
                    <div className="text-xs text-gray-700 font-medium flex items-center gap-2">
                      <span>{formatDate(exam.examDate)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(exam.examTime)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      status.color === 'yellow'
                        ? 'bg-yellow-200 text-yellow-800'
                        : status.color === 'red'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-blue-200 text-blue-800'
                    }`}>
                      {status.label}
                    </span>
                    <button
                      onClick={() => onDeleteExam(exam.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {completedExams.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            Completed Exams
          </h3>
          <div className="space-y-2">
            {completedExams.slice(0, 3).map((exam) => (
              <div
                key={exam.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border-l-4 border-gray-300 opacity-60"
              >
                <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-600 line-through truncate">{exam.subject}</div>
                  <div className="text-xs text-gray-600 font-medium">
                    {formatDate(exam.examDate)} • {formatTime(exam.examTime)}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteExam(exam.id)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .rotate-45 {
          transform: rotate(45deg);
          transition: transform 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};
