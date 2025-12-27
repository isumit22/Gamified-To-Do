import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LabelList, ReferenceLine, PieChart, Pie } from 'recharts';
import { Trophy, Flame, Zap, Target } from 'lucide-react';
import { Subject } from '../hooks/useStudyData';
import { getBadge, getMotivationalMessage, getLevelTitle } from '../utils/gamification';

interface DashboardProps {
  subjects: Subject[];
  stats: {
    totalTopics: number;
    completedTopics: number;
    progress: number;
    xp: number;
    level: number;
    streak: number;
  };
}

export const Dashboard = ({ subjects, stats }: DashboardProps) => {
  const badge = getBadge(stats.streak);
  const motivationalMessage = getMotivationalMessage(stats.progress);
  const levelTitle = getLevelTitle(stats.level);

  const chartData = subjects.map((subject) => {
    const completed = subject.topics.filter((t) => t.done).length;
    const total = subject.topics.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      name: subject.name,
      completed,
      total,
      percentage,
    };
  });

  const avgPercentage = chartData.length > 0
    ? Math.round(chartData.reduce((acc, s) => acc + s.percentage, 0) / chartData.length)
    : 0;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const donutData = [
    { name: 'Completed', value: stats.progress, color: '#10b981' },
    { name: 'Remaining', value: 100 - stats.progress, color: '#e5e7eb' },
  ];

  return (
    <div className="space-y-4">
      {/* Donut Progress Chart */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg hover:shadow-xl p-6 transition-all duration-300 animate-stat-card overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Target size={24} className="text-blue-600" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Overall Progress</h2>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Donut Chart */}
          <div className="relative flex-shrink-0">
            <ResponsiveContainer width={240} height={240}>
              <PieChart>
                <defs>
                  <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                  animationDuration={1000}
                  animationBegin={0}
                >
                  {donutData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? 'url(#progressGradient)' : entry.color}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-5xl font-black bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stats.progress}%
              </div>
              <div className="text-sm font-semibold text-gray-600 mt-1">
                {stats.progress < 30 ? 'Just Started!' : stats.progress < 60 ? 'Keep Pushing!' : stats.progress < 90 ? 'Almost There!' : 'Amazing! 🎉'}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{stats.completedTopics}</div>
              <div className="text-xs text-gray-600 mt-1">Completed</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{stats.totalTopics - stats.completedTopics}</div>
              <div className="text-xs text-gray-600 mt-1">Remaining</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">{stats.xp}</div>
              <div className="text-xs text-gray-600 mt-1">Total XP</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-orange-600">Lv {stats.level}</div>
              <div className="text-xs text-gray-600 mt-1">{levelTitle}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 p-4 rounded-lg mt-6 animate-fade-in">
          <p className="text-gray-800 font-medium text-sm sm:text-base">{motivationalMessage}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-lg shadow-lg hover:shadow-xl p-5 sm:p-6 transition-all duration-300 transform hover:scale-105 animate-stat-card overflow-hidden" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={24} />
            <span className="text-sm font-medium opacity-90">XP Points</span>
          </div>
          <div className="text-3xl sm:text-4xl font-bold">{stats.xp}</div>
          <div className="text-sm opacity-90 mt-2">
            Level {stats.level} • {levelTitle}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl p-5 sm:p-6 transition-all duration-300 transform hover:scale-105 animate-stat-card overflow-hidden" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Flame size={24} />
            <span className="text-sm font-medium opacity-90">Streak</span>
          </div>
          <div className="text-3xl sm:text-4xl font-bold">{stats.streak}</div>
          {badge && (
            <div className="text-sm opacity-90 mt-2">
              <span className="mr-1">{badge.emoji}</span>{badge.name}
            </div>
          )}
        </div>
      </div>

      {stats.totalTopics > 0 && (
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl p-5 sm:p-6 transition-all duration-300 animate-stat-card overflow-hidden" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={24} className="text-yellow-500" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Subject Progress</h2>
          </div>

          {chartData.length > 0 && (
            <div className="mb-4 overflow-x-auto">
              <ResponsiveContainer width={chartData.length > 3 ? Math.max(500, chartData.length * 100) : '100%'} height={320}>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: chartData.length > 3 ? 40 : 20 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#4b5563', fontSize: 12 }}
                    angle={chartData.length > 3 ? -30 : 0}
                    textAnchor={chartData.length > 3 ? 'end' : 'middle'}
                    height={chartData.length > 3 ? 80 : 40}
                  />
                  <YAxis tick={{ fill: '#4b5563', fontSize: 12 }} domain={[0, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value, _name, props) => [
                      `${value}% (${props.payload.completed} / ${props.payload.total})`,
                      'Progress',
                    ]}
                  />
                  <ReferenceLine y={avgPercentage} stroke="#10b981" strokeDasharray="4 4" label={{ value: `Avg ${avgPercentage}%`, position: 'right', fill: '#065f46', fontSize: 12 }} />
                  <Bar dataKey="percentage" radius={[8, 8, 0, 0]} animationDuration={800}>
                    <LabelList dataKey="percentage" position="top" formatter={(v: number) => `${v}%`} style={{ fill: '#111827', fontSize: 12 }} />
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-4 space-y-2">
            {chartData.map((subject, index) => {
              const percentage =
                subject.total > 0
                  ? Math.round((subject.completed / subject.total) * 100)
                  : 0;
              return (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="flex-1 text-sm text-gray-700 font-medium">{subject.name}</span>
                  <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes stat-card-in {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .animate-stat-card {
          animation: stat-card-in 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};
