import { BookOpen } from 'lucide-react';

interface ExamHeaderProps {
  examName: string;
  onExamNameChange: (name: string) => void;
}

export const ExamHeader = ({ examName, onExamNameChange }: ExamHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-5 sm:p-8 rounded-xl shadow-xl mb-6 hover:shadow-2xl transition-shadow duration-300 animate-header-slide">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <BookOpen size={32} />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black">StudyXP</h1>
          <p className="text-white/70 text-xs sm:text-sm font-medium">Master Your Exams</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6">
        <label className="text-sm font-semibold opacity-90 flex-shrink-0">Exam Name:</label>
        <input
          type="text"
          value={examName}
          onChange={(e) => onExamNameChange(e.target.value)}
          placeholder="e.g., Mid Semester, Final Exam"
          className="flex-1 w-full bg-white/20 border-2 border-white/30 rounded-lg px-4 py-3 placeholder-white/60 text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/80 focus:border-white/50 transition-all duration-200 backdrop-blur-sm"
        />
      </div>

      <style>{`
        @keyframes header-slide {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-header-slide {
          animation: header-slide 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
