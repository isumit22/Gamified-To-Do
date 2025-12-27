import { useStudyData } from './hooks/useStudyData';
import { ExamHeader } from './components/ExamHeader';
import { SubjectList } from './components/SubjectList';
import { Dashboard } from './components/Dashboard';
import { ExamTimetable } from './components/ExamTimetable';

function App() {
  const {
    data,
    setExamName,
    resetAll,
    addSubject,
    deleteSubject,
    addTopic,
    toggleTopic,
    deleteTopic,
    addExam,
    deleteExam,
    stats,
  } = useStudyData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <ExamHeader examName={data.examName} onExamNameChange={setExamName} />
        <div className="flex gap-2 mb-4">
          <button
            onClick={resetAll}
            className="text-sm bg-gray-800 text-white px-3 py-1 rounded hover:bg-black transition-colors"
            title="Clear all subjects/topics and reset data"
          >
            Reset All Data
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3 px-1">
              <span className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-lg">
                1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Study Topics</h2>
            </div>
            <SubjectList
              subjects={data.subjects}
              onAddSubject={addSubject}
              onDeleteSubject={deleteSubject}
              onAddTopic={addTopic}
              onToggleTopic={toggleTopic}
              onDeleteTopic={deleteTopic}
            />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 px-1">
              <span className="bg-gradient-to-br from-green-500 to-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-lg">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Progress</h2>
            </div>
            <Dashboard subjects={data.subjects} stats={stats} />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-3 px-1 mb-4">
            <span className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-lg">
              3
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Exam Timetable</h2>
          </div>
          <ExamTimetable
            exams={data.exams || []}
            onAddExam={addExam}
            onDeleteExam={deleteExam}
          />
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        body {
          background-attachment: fixed;
        }
      `}</style>
    </div>
  );
}

export default App;
