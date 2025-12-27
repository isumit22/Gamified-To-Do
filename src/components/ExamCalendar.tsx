import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Exam } from '../hooks/useStudyData';

interface ExamCalendarProps {
  exams: Exam[];
}

export const ExamCalendar = ({ exams }: ExamCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const examsMap = new Map<string, Exam[]>();
  exams.forEach((exam) => {
    const dateKey = exam.examDate;
    if (!examsMap.has(dateKey)) {
      examsMap.set(dateKey, []);
    }
    examsMap.get(dateKey)!.push(exam);
  });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getExamStatusColor = (exam: Exam) => {
    if (exam.status === 'completed') return 'bg-green-500';
    return 'bg-purple-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Previous month"
          >
            <ChevronLeft size={20} className="text-purple-600" />
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 min-w-[150px] text-center">
            {monthName} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            title="Next month"
          >
            <ChevronRight size={20} className="text-purple-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2 text-xs sm:text-sm">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dateStr = day
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : '';
          const dayExams = dateStr ? examsMap.get(dateStr) || [] : [];
          const isToday = day && new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <div
              key={index}
              className={`min-h-20 p-2 rounded-lg border-2 transition-all ${
                day
                  ? isToday
                    ? 'bg-yellow-50 border-yellow-400 shadow-md'
                    : dayExams.length > 0
                    ? 'bg-purple-50 border-purple-300'
                    : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                  : 'bg-white border-gray-100'
              }`}
            >
              {day && (
                <>
                  <div className={`text-sm font-bold ${isToday ? 'text-yellow-700' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  {dayExams.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {dayExams.slice(0, 2).map((exam) => (
                        <div
                          key={exam.id}
                          className={`text-xs font-semibold text-white px-2 py-1 rounded truncate ${getExamStatusColor(
                            exam
                          )}`}
                          title={exam.subject}
                        >
                          {exam.subject}
                        </div>
                      ))}
                      {dayExams.length > 2 && (
                        <div className="text-xs text-gray-600 px-2 font-semibold">
                          +{dayExams.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
          <span className="text-gray-600">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-500"></div>
          <span className="text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-yellow-400"></div>
          <span className="text-gray-600">Today</span>
        </div>
      </div>
    </div>
  );
};
