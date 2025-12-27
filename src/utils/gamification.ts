export const getBadge = (streak: number): { name: string; emoji: string } | null => {
  if (streak >= 7) return { name: 'Legendary', emoji: '👑' };
  if (streak >= 5) return { name: 'Beast Mode', emoji: '🔥' };
  if (streak >= 3) return { name: 'Focused', emoji: '💪' };
  if (streak >= 1) return { name: 'Warm Up', emoji: '⭐' };
  return null;
};

export const getMotivationalMessage = (progress: number): string => {
  if (progress === 0) return "Every journey starts with a single step. Let's begin!";
  if (progress < 20) return "Slow start but warriors don't quit. Keep pushing!";
  if (progress < 40) return "Building momentum! You're on the right track.";
  if (progress < 60) return "Momentum activated! You're doing amazing.";
  if (progress < 80) return "Outstanding progress! Victory is within reach.";
  if (progress < 100) return "YOU ARE UNSTOPPABLE! Almost there!";
  return "CHAMPION! You've conquered it all!";
};

export const getLevelTitle = (level: number): string => {
  if (level === 0) return 'Beginner';
  if (level < 3) return 'Learner';
  if (level < 5) return 'Scholar';
  if (level < 8) return 'Expert';
  if (level < 12) return 'Master';
  return 'Grand Master';
};
