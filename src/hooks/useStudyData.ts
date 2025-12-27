import { useState, useEffect } from 'react';

export interface Topic {
  id: string;
  title: string;
  done: boolean;
  completedAt?: string;
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Exam {
  id: string;
  subject: string;
  examDate: string; // YYYY-MM-DD
  examTime: string; // HH:MM
  status: 'pending' | 'completed';
  completedAt?: string;
}

export interface StudyData {
  examName: string;
  subjects: Subject[];
  exams: Exam[];
  createdAt: string;
  lastStudyDate?: string;
  streak: number;
}

const STORAGE_KEY = 'studyXP_data';

const createId = (): string => {
  // Prefer bound calls to Web Crypto API to avoid illegal invocation
  const c: Crypto | undefined = (globalThis as any).crypto as Crypto | undefined;
  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }
  if (c && typeof c.getRandomValues === 'function') {
    const buf = new Uint8Array(16);
    c.getRandomValues(buf);
    // RFC 4122 variant & version
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const hex = Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  // Fallback: timestamp + random segment
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const normalizeIds = (data: StudyData): StudyData => {
  // Ensure topic IDs within each subject are unique to prevent bulk toggle side effects
  const subjects = data.subjects.map((s) => {
    const seen = new Set<string>();
    const topics = s.topics.map((t) => {
      let id = t.id;
      if (seen.has(id)) {
        id = createId();
      }
      seen.add(id);
      return { ...t, id };
    });
    return { ...s, topics };
  });
  // Ensure exams array exists for backward compatibility
  return { ...data, subjects, exams: data.exams || [] };
};

const getInitialData = (): StudyData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed: StudyData = JSON.parse(saved);
      return normalizeIds(parsed);
    } catch {
      // If corrupted, fall back to default structure
    }
  }
  // Return demo data for new users
  return {
    examName: 'Mid Semester Exams 2025-26',
    subjects: [],
    exams: [
      { id: createId(), subject: 'COI', examDate: '2025-12-29', examTime: '09:00', status: 'pending' },
      { id: createId(), subject: 'Physics', examDate: '2025-12-30', examTime: '09:00', status: 'pending' },
      { id: createId(), subject: 'DBMS', examDate: '2025-12-31', examTime: '09:00', status: 'pending' },
      { id: createId(), subject: 'Python', examDate: '2026-01-01', examTime: '13:00', status: 'pending' },
      { id: createId(), subject: 'MLT', examDate: '2026-01-02', examTime: '09:00', status: 'pending' },
      { id: createId(), subject: 'Web Tech', examDate: '2026-01-06', examTime: '09:00', status: 'pending' },
      { id: createId(), subject: 'DS', examDate: '2026-01-07', examTime: '13:00', status: 'pending' },
      { id: createId(), subject: 'DAA', examDate: '2026-01-08', examTime: '09:00', status: 'pending' },
      { id: createId(), subject: 'OOSD', examDate: '2026-01-12', examTime: '09:00', status: 'pending' },
      { id: createId(), subject: 'COA', examDate: '2026-01-13', examTime: '13:00', status: 'pending' },
      { id: createId(), subject: 'Maths 4', examDate: '2026-01-19', examTime: '13:00', status: 'pending' },
    ],
    createdAt: new Date().toISOString(),
    streak: 0,
  };
};

export const useStudyData = () => {
  const [data, setData] = useState<StudyData>(getInitialData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setExamName = (name: string) => {
    setData((prev) => ({ ...prev, examName: name }));
  };

  const resetAll = () => {
    // Reset subjects and topics but preserve exams
    setData((prev) => ({
      ...prev,
      examName: prev.examName,
      subjects: [],
      streak: 0,
      lastStudyDate: undefined,
    }));
  };

  const addExam = (subject: string, examDate: string, examTime: string) => {
    const newExam: Exam = {
      id: createId(),
      subject,
      examDate,
      examTime,
      status: 'pending',
    };
    setData((prev) => ({
      ...prev,
      exams: [...prev.exams, newExam].sort((a, b) => {
        const dateA = new Date(`${a.examDate}T${a.examTime}`);
        const dateB = new Date(`${b.examDate}T${b.examTime}`);
        return dateA.getTime() - dateB.getTime();
      }),
    }));
  };

  const deleteExam = (examId: string) => {
    setData((prev) => ({
      ...prev,
      exams: prev.exams.filter((e) => e.id !== examId),
    }));
  };

  const autoCompleteExams = () => {
    const now = new Date();
    let updated = false;
    const updatedExams = data.exams.map((exam) => {
      if (exam.status === 'pending') {
        const examDateTime = new Date(`${exam.examDate}T${exam.examTime}`);
        if (now > examDateTime) {
          updated = true;
          return { ...exam, status: 'completed' as const, completedAt: now.toISOString() };
        }
      }
      return exam;
    });
    if (updated) {
      setData((prev) => ({ ...prev, exams: updatedExams }));
    }
  };

  useEffect(() => {
    // Run once on mount and then every minute
    autoCompleteExams();
    const interval = setInterval(autoCompleteExams, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount and via interval

  const addSubject = (name: string) => {
    const newSubject: Subject = {
      id: createId(),
      name,
      topics: [],
    };
    setData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));
  };

  const deleteSubject = (subjectId: string) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== subjectId),
    }));
  };

  const addTopic = (subjectId: string, title: string) => {
    const newTopic: Topic = {
      id: createId(),
      title,
      done: false,
    };
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId ? { ...s, topics: [...s.topics, newTopic] } : s
      ),
    }));
  };

  const toggleTopic = (subjectId: string, topicId: string) => {
    const today = new Date().toDateString();
    const lastStudy = data.lastStudyDate ? new Date(data.lastStudyDate).toDateString() : null;

    let newStreak = data.streak;
    if (lastStudy !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastStudy === yesterday.toDateString()) {
        newStreak += 1;
      } else if (lastStudy === null) {
        newStreak = 1;
      } else {
        newStreak = 1;
      }
    }

    setData((prev) => ({
      ...prev,
      lastStudyDate: new Date().toISOString(),
      streak: newStreak,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              topics: s.topics.map((t) =>
                t.id === topicId
                  ? { ...t, done: !t.done, completedAt: !t.done ? new Date().toISOString() : undefined }
                  : t
              ),
            }
          : s
      ),
    }));
  };

  const deleteTopic = (subjectId: string, topicId: string) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) }
          : s
      ),
    }));
  };

  const totalTopics = data.subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const completedTopics = data.subjects.reduce(
    (acc, s) => acc + s.topics.filter((t) => t.done).length,
    0
  );
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const xp = completedTopics * 10;
  const level = Math.floor(xp / 100);

  return {
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
    autoCompleteExams,
    stats: {
      totalTopics,
      completedTopics,
      progress,
      xp,
      level,
      streak: data.streak,
    },
  };
};
