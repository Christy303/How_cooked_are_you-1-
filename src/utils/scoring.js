/**
 * Interpolate value y between two points (x0, y0) and (x1, y1)
 */
function interpolate(x, x0, y0, x1, y1) {
  if (x <= x0) return y0;
  if (x >= x1) return y1;
  return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
}

/**
 * Piecewise linear interpolation over a sorted list of points [{x, y}]
 */
function interpolatePoints(x, points) {
  if (x <= points[0].x) return points[0].y;
  const lastPoint = points[points.length - 1];
  if (x >= lastPoint.x) return lastPoint.y;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (x >= p1.x && x <= p2.x) {
      return interpolate(x, p1.x, p1.y, p2.x, p2.y);
    }
  }
  return 0;
}

/**
 * Question 1: Hours slept
 * 0 hrs -> 100%
 * 1-3 hrs -> 90% to 80%
 * 4-6 hrs -> 65% to 50%
 * 7-9 hrs -> 10% to 0%
 * > 9 hrs -> 0%
 */
export function calculateSleepScore(hours) {
  const h = Math.max(0, Number(hours) || 0);
  const points = [
    { x: 0, y: 100 },
    { x: 1, y: 90 },
    { x: 3, y: 80 },
    { x: 4, y: 65 },
    { x: 6, y: 50 },
    { x: 7, y: 10 },
    { x: 9, y: 0 }
  ];
  return Math.min(100, Math.max(0, interpolatePoints(h, points)));
}

/**
 * Question 2: Hours studied
 * 0 hrs -> 100%
 * 30m - 1 hr -> 90% to 80%
 * 4-6 hrs -> 50% to 35%
 * 7-9 hrs -> 20% to 0%
 */
export function calculateStudyScore(hours) {
  const h = Math.max(0, Number(hours) || 0);
  const points = [
    { x: 0, y: 100 },
    { x: 0.5, y: 90 },
    { x: 1, y: 80 },
    { x: 4, y: 50 },
    { x: 6, y: 35 },
    { x: 7, y: 20 },
    { x: 9, y: 0 }
  ];
  return Math.min(100, Math.max(0, interpolatePoints(h, points)));
}

/**
 * Question 3: Assignments pending
 * 0 -> 0%
 * 5 -> 50%
 * 10 -> 85%
 * 20+ -> 100%
 */
export function calculateAssignmentScore(count) {
  const c = Math.max(0, Number(count) || 0);
  const points = [
    { x: 0, y: 0 },
    { x: 5, y: 50 },
    { x: 10, y: 85 },
    { x: 20, y: 100 }
  ];
  return Math.min(100, Math.max(0, interpolatePoints(c, points)));
}

/**
 * Question 4: Reels scrolled
 * 0 -> 0%
 * 25 -> 50%
 * 50 -> 85%
 * 100+ -> 100%
 */
export function calculateReelsScore(count) {
  const c = Math.max(0, Number(count) || 0);
  const points = [
    { x: 0, y: 0 },
    { x: 25, y: 50 },
    { x: 50, y: 85 },
    { x: 100, y: 100 }
  ];
  return Math.min(100, Math.max(0, interpolatePoints(c, points)));
}

/**
 * Question 5: Exams remaining
 * 0 -> 0%
 * 1 -> 50%
 * 3 -> 85%
 * 5+ -> 100%
 */
export function calculateExamScore(count) {
  const c = Math.max(0, Number(count) || 0);
  const points = [
    { x: 0, y: 0 },
    { x: 1, y: 50 },
    { x: 3, y: 85 },
    { x: 5, y: 100 }
  ];
  return Math.min(100, Math.max(0, interpolatePoints(c, points)));
}

/**
 * Question 6: Syllabus covered %
 * 0% -> 100%
 * 25% -> 85%
 * 50% -> 50%
 * 100% -> 0%
 */
export function calculateSyllabusScore(percentage) {
  const p = Math.min(100, Math.max(0, Number(percentage) || 0));
  const points = [
    { x: 0, y: 100 },
    { x: 25, y: 85 },
    { x: 50, y: 50 },
    { x: 100, y: 0 }
  ];
  return Math.min(100, Math.max(0, interpolatePoints(p, points)));
}

/**
 * Question 7: Money left (₹)
 * ₹0 -> 100%
 * ₹0-₹100 -> 100% to 85%
 * ₹100-₹500 -> 85% to 50%
 * ₹500+ -> 50% to 0% (reaches 0% around ₹2000)
 */
export function calculateMoneyScore(rupees) {
  const r = Math.max(0, Number(rupees) || 0);
  const points = [
    { x: 0, y: 100 },
    { x: 100, y: 85 },
    { x: 500, y: 50 },
    { x: 2000, y: 0 }
  ];
  return Math.min(100, Math.max(0, interpolatePoints(r, points)));
}

/**
 * Question 8: Love life
 * 'non-existent' -> 100%
 * 'really' -> 99.9%
 */
export function calculateLoveScore(optionId) {
  if (optionId === 'non-existent') return 100;
  if (optionId === 'really') return 99.9;
  return 100; // default fallback
}

/**
 * Calculate arithmetic mean of all 8 scores
 * (s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8) / 8
 */
export function calculateFinalScore(scores) {
  if (!scores || scores.length === 0) return 0;
  const sum = scores.reduce((acc, val) => acc + (Number(val) || 0), 0);
  const average = sum / scores.length;
  const clamped = Math.min(100, Math.max(0, average));
  return Math.round(clamped * 10) / 10;
}

/**
 * Get humorous result category based on final percentage
 */
export function getResultCategory(score) {
  if (score < 20) {
    return {
      title: "Absolutely Fine 🗿",
      badge: "SUSPICIOUSLY NORMAL",
      color: "#10B981", // Emerald
      flameLevel: 1,
      description: "You're suspiciously functioning normally. Are you even in college?",
      memeTip: "Bro is actually built different."
    };
  } else if (score < 40) {
    return {
      title: "Slightly Toasted 🍞",
      badge: "MILD CONCERN",
      color: "#F59E0B", // Amber
      flameLevel: 2,
      description: "You're still okay. Probably. Just a slight smell of burning ambition.",
      memeTip: "Warm, but not yet crispy."
    };
  } else if (score < 60) {
    return {
      title: "Getting Cooked 🌡️",
      badge: "MEDIUM RARE PANIC",
      color: "#F97316", // Orange
      flameLevel: 3,
      description: "Things are starting to go wrong. Smoke signals detected in your gradebook.",
      memeTip: "Turn down the heat or call your mom."
    };
  } else if (score < 80) {
    return {
      title: "Deep Fried 🍟",
      badge: "ACADEMIC CRACKLE",
      color: "#EF4444", // Bright Red
      flameLevel: 4,
      description: "Your academic career is making concerning noises. Extra crispy.",
      memeTip: "Golden brown and screaming inside."
    };
  } else if (score < 95) {
    return {
      title: "Completely Cooked 🔥",
      badge: "EXTRA WELL DONE",
      color: "#DC2626", // Deep Red
      flameLevel: 5,
      description: "There may be no saving you. Grab an ice pack and start praying to the Bell Curve.",
      memeTip: "You're not on fire, you ARE the fire."
    };
  } else {
    return {
      title: "CHARRED BEYOND RECOGNITION 💀🔥",
      badge: "NUCLEAR MELTDOWN",
      color: "#9333EA", // Neon Purple / Hellfire
      flameLevel: 6,
      description: "Please contact your nearest functioning human. Science cannot explain how you are still standing.",
      memeTip: "Absolute cinema level of cooked."
    };
  }
}
