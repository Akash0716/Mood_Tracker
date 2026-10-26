/**
 * Rule-based reflections and curated reflection prompts.
 * Operates purely locally without requiring external or paid AI APIs.
 */

const REFLECTION_PROMPTS = [
  {
    id: 'smile-today',
    category: 'Daily Joy',
    prompt: 'What made you smile or pause with appreciation today?',
  },
  {
    id: 'grateful-three',
    category: 'Gratitude',
    prompt: 'What are three small or large things you feel genuinely grateful for right now?',
  },
  {
    id: 'challenging-part',
    category: 'Resilience',
    prompt: 'What was the most challenging part of your day, and how did you navigate it?',
  },
  {
    id: 'feel-relaxed',
    category: 'Self-Care',
    prompt: 'What is one kind, restful action you can take this evening to help yourself recharge?',
  },
  {
    id: 'learned-about-self',
    category: 'Personal Growth',
    prompt: 'What is one insight you discovered about yourself, your energy, or your boundaries today?',
  },
  {
    id: 'let-go',
    category: 'Mindfulness',
    prompt: 'What is one expectation or worry that is not serving you, which you can choose to let go of?',
  },
  {
    id: 'proud-moment',
    category: 'Self-Compassion',
    prompt: 'What is something you worked through or accomplished recently that you can feel proud of?',
  },
  {
    id: 'tomorrow-intention',
    category: 'Mindfulness',
    prompt: 'What gentle intention or feeling would you like to welcome into tomorrow?',
  },
];

/**
 * Generate transparent, rule-based wellness insights from recent user data.
 * Does NOT diagnose or claim proven scientific causation.
 */
function generateReflections(recentMoods = [], recentHabits = []) {
  const insights = [];

  if (!recentMoods || recentMoods.length === 0) {
    return [
      {
        type: 'welcome',
        badge: 'Getting Started',
        title: 'Begin Your MindBloom Journey',
        message: 'Log your first daily mood check-in and habit record to start seeing personalized patterns and calming insights.',
        suggestion: 'Try logging your mood and writing a brief journal entry today.',
      },
    ];
  }

  const scores = recentMoods.map((m) => m.score);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // Emotion frequency
  const allEmotions = recentMoods.flatMap((m) => m.emotions || []);
  const emotionCounts = {};
  allEmotions.forEach((e) => {
    emotionCounts[e] = (emotionCounts[e] || 0) + 1;
  });

  // Factor frequency
  const allFactors = recentMoods.flatMap((m) => m.factors || []);
  const factorCounts = {};
  allFactors.forEach((f) => {
    factorCounts[f] = (factorCounts[f] || 0) + 1;
  });

  // Rule 1: High stress or anxiety detected
  const stressOrAnxietyCount = (emotionCounts['Stressed'] || 0) + (emotionCounts['Anxious'] || 0);
  if (stressOrAnxietyCount >= 2) {
    insights.push({
      type: 'gentle_care',
      badge: 'Mindful Care',
      title: 'Gentle Support for Busy Minds',
      message: 'You have logged feelings of stress or anxiety recently. Taking short breaks, stepping outside for fresh air, or engaging in mindful breathing can create calming space.',
      suggestion: 'Consider spending 5-10 minutes with our meditation habit tracker or writing about what is feeling heavy.',
    });
  }

  // Rule 2: Low mood trend
  if (avgScore <= 2.5 && recentMoods.length >= 3) {
    insights.push({
      type: 'support',
      badge: 'Emotional Comfort',
      title: 'Be Especially Kind to Yourself',
      message: 'Your recent check-ins reflect a softer, more challenging emotional period. It is completely normal and valid to have lower-energy days.',
      suggestion: 'Reach out to someone you trust, prioritize extra sleep, or jot down one comfort item that brings you peace.',
    });
  }

  // Rule 3: High positive mood
  if (avgScore >= 4.0 && recentMoods.length >= 3) {
    insights.push({
      type: 'uplift',
      badge: 'Flourishing',
      title: 'Positive Momentum',
      message: 'Your mood has been bright and steady over recent check-ins! Capturing the habits or people supporting your well-being helps build resilience.',
      suggestion: 'Write a quick gratitude entry in your journal to bookmark these positive memories.',
    });
  }

  // Rule 4: Sleep correlation check with habits
  if (recentHabits.length >= 3) {
    const sleepLogged = recentHabits.filter((h) => h.sleepHours > 0);
    if (sleepLogged.length > 0) {
      const avgSleep = sleepLogged.reduce((sum, h) => sum + h.sleepHours, 0) / sleepLogged.length;
      if (avgSleep < 6.5) {
        insights.push({
          type: 'rest',
          badge: 'Rest & Recovery',
          title: 'Rest Pattern Noticed',
          message: `Your recorded sleep has averaged around ${avgSleep.toFixed(1)} hours over this period. Consistent rest strongly influences emotional balance.`,
          suggestion: 'A calming screen-free wind-down routine 30 minutes before bed can support deeper sleep.',
        });
      }
    }
  }

  // Rule 5: Fallback general inspiration
  if (insights.length === 0) {
    insights.push({
      type: 'reflection',
      badge: 'Daily Reflection',
      title: 'Steady and Balanced',
      message: 'Your emotional rhythm has been balanced. Taking time to notice the small, quiet joys in daily life nurtures long-term well-being.',
      suggestion: 'Choose a reflection prompt from your journal to explore what is bringing meaning to your week.',
    });
  }

  return insights;
}

module.exports = {
  REFLECTION_PROMPTS,
  generateReflections,
};
