import { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, BookOpen } from 'lucide-react';
import { Subject } from '../hooks/useStudyData';

interface SubjectListProps {
  subjects: Subject[];
  onAddSubject: (name: string) => void;
  onDeleteSubject: (id: string) => void;
  onAddTopic: (subjectId: string, title: string) => void;
  onToggleTopic: (subjectId: string, topicId: string) => void;
  onDeleteTopic: (subjectId: string, topicId: string) => void;
}

export const SubjectList = ({
  subjects,
  onAddSubject,
  onDeleteSubject,
  onAddTopic,
  onToggleTopic,
  onDeleteTopic,
}: SubjectListProps) => {
  const [newSubject, setNewSubject] = useState('');
  const [newTopics, setNewTopics] = useState<{ [key: string]: string }>({});

  const parseTopicsInput = (input: string): string[] => {
    const lines = input
      .split(/\r?\n/) // split by newlines
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines
      .map((line) =>
        // remove leading numbering patterns like "1.", "1)", "1 -", "1:"
        line.replace(/^\s*\d+\s*[\.\)\-:]\s*/, '').trim()
      )
      .filter((line) => line.length > 0);
  };

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      onAddSubject(newSubject.trim());
      setNewSubject('');
    }
  };

  const handleAddTopic = (subjectId: string) => {
    const input = newTopics[subjectId];
    if (!input || !input.trim()) return;

    const parsed = parseTopicsInput(input);
    if (parsed.length === 0) return;

    // Add all parsed topics (bulk or single)
    parsed.forEach((title) => onAddTopic(subjectId, title));
    setNewTopics((prev) => ({ ...prev, [subjectId]: '' }));
  };

  const handleDeleteSubject = (id: string) => {
    onDeleteSubject(id);
  };

  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    onDeleteTopic(subjectId, topicId);
  };

  return (
    <>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Add Subject</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
              placeholder="Subject name (e.g., DBMS, OS)"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
            <button
              onClick={handleAddSubject}
              disabled={!newSubject.trim()}
              className={`px-4 py-2 rounded-lg active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 font-medium ${
                newSubject.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12 text-gray-400 animate-fade-in">
            <BookOpen size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">Add your first subject to get started!</p>
          </div>
        )}

        {subjects.map((subject, index) => {
          const completedCount = subject.topics.filter((t) => t.done).length;
          const subjectProgress =
            subject.topics.length > 0
              ? Math.round((completedCount / subject.topics.length) * 100)
              : 0;

          return (
            <div
              key={subject.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl p-4 sm:p-6 transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                <div className="flex-1 w-full">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">{subject.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {completedCount} / {subject.topics.length} topics completed
                  </p>
                  {subject.topics.length > 0 && (
                    <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-500"
                        style={{ width: `${subjectProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteSubject(subject.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 p-2 rounded-lg mt-3 sm:mt-0 ml-auto sm:ml-2"
                  title="Delete subject"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {subject.topics.length > 0 && (
                <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                  {subject.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <button
                        onClick={() => onToggleTopic(subject.id, topic.id)}
                        className="flex-shrink-0 hover:scale-110 transition-transform duration-200"
                        title={topic.done ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {topic.done ? (
                          <CheckCircle size={24} className="text-green-500 animate-scale-in" />
                        ) : (
                          <Circle size={24} className="text-gray-400 hover:text-blue-500" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm sm:text-base transition-all duration-300 ${
                          topic.done
                            ? 'text-gray-400 line-through'
                            : 'text-gray-800 font-medium'
                        }`}
                      >
                        {topic.title}
                      </span>
                      <button
                        onClick={() => handleDeleteTopic(subject.id, topic.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 p-1 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                <textarea
                  rows={3}
                  value={newTopics[subject.id] || ''}
                  onChange={(e) =>
                    setNewTopics((prev) => ({ ...prev, [subject.id]: e.target.value }))
                  }
                  placeholder="Paste topics (each on a new line). Numbered lists like 1. Topic are auto-split."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 resize-y"
                />
                <button
                  onClick={() => handleAddTopic(subject.id)}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 flex items-center justify-center gap-1 text-sm font-medium"
                  title="Add all topics from the list"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Topics</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.8);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
