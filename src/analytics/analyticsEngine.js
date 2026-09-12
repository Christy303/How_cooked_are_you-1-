import {
  calculateSleepScore,
  calculateStudyScore,
  calculateAssignmentScore,
  calculateReelsScore,
  calculateExamScore,
  calculateSyllabusScore,
  calculateMoneyScore,
  calculateLoveScore,
  calculateFinalScore,
  getResultCategory
} from '../utils/scoring';

/**
 * Advanced Multi-Dimensional Life Analytics Engine
 * Extends baseline scoring without modifying existing baseline logic.
 */

/**
 * Calculate 6 Multi-Dimensional Life Metrics (0% to 100% scale)
 */
export function calculateMultiDimensionalDimensions(answers = {}) {
  const sleepHrs = Number(answers[1]) || 0;
  const studyHrs = Number(answers[2]) || 0;
  const assignments = Number(answers[3]) || 0;
  const reels = Number(answers[4]) || 0;
  const exams = Number(answers[5]) || 0;
  const syllabusPct = Number(answers[6]) || 0;
  const money = Number(answers[7]) || 0;
  const loveOption = answers[8] || 'non-existent';

  // Individual baseline cooked scores
  const sleepScore = calculateSleepScore(sleepHrs);
  const studyScore = calculateStudyScore(studyHrs);
  const assignmentScore = calculateAssignmentScore(assignments);
  const reelsScore = calculateReelsScore(reels);
  const examScore = calculateExamScore(exams);
  const syllabusScore = calculateSyllabusScore(syllabusPct);
  const moneyScore = calculateMoneyScore(money);
  const loveScore = calculateLoveScore(loveOption);

  // 1. Academic Stability (100 = Stable, 0 = In Collapse)
  // Higher study & higher syllabus = higher stability
  const syllabusHealth = syllabusPct;
  const studyHealth = Math.min(100, studyHrs * 20);
  const academicStability = Math.round((syllabusHealth * 0.6 + studyHealth * 0.4));

  // 2. Sleep & Energy Index (100 = Fully Rested, 0 = Zombie)
  const sleepHealth = Math.min(100, (sleepHrs / 8) * 100);
  const examDrain = Math.min(60, exams * 12);
  const sleepEnergy = Math.round(Math.max(0, sleepHealth - examDrain * 0.3));

  // 3. Time Management Index (100 = Master of Time, 0 = Chaos)
  const reelPenalty = Math.min(60, (reels / 100) * 60);
  const assignmentPenalty = Math.min(40, (assignments / 15) * 40);
  const timeManagement = Math.round(Math.max(0, 100 - (reelPenalty + assignmentPenalty)));

  // 4. Social Media Dependency (100 = Extreme Doomscrolling, 0 = Off-Grid Monk)
  const socialMediaDependency = Math.round(calculateReelsScore(reels));

  // 5. Financial Stability Index (100 = Solvent, 0 = Broke)
  const financialStability = Math.round(Math.max(0, 100 - moneyScore));

  // 6. Academic Pressure Load (100 = Extreme Panic, 0 = Zero Stress)
  const academicPressure = Math.round((examScore * 0.6 + assignmentScore * 0.4));

  const overallCooked = calculateFinalScore([
    sleepScore,
    studyScore,
    assignmentScore,
    reelsScore,
    examScore,
    syllabusScore,
    moneyScore,
    loveScore
  ]);

  return {
    academicStability,
    sleepEnergy,
    timeManagement,
    socialMediaDependency,
    financialStability,
    academicPressure,
    overallCooked,
    category: getResultCategory(overallCooked),
    individualScores: {
      sleep: sleepScore,
      study: studyScore,
      assignments: assignmentScore,
      reels: reelsScore,
      exams: examScore,
      syllabus: syllabusScore,
      money: moneyScore,
      love: loveScore
    }
  };
}

/**
 * Dependency Graph Model Analysis
 * Models non-linear interactions between life metrics.
 */
export function buildDependencyGraph(answers = {}) {
  const sleepHrs = Number(answers[1]) || 0;
  const studyHrs = Number(answers[2]) || 0;
  const assignments = Number(answers[3]) || 0;
  const reels = Number(answers[4]) || 0;
  const exams = Number(answers[5]) || 0;
  const money = Number(answers[7]) || 0;

  const nodes = [
    { id: 'sleep', label: 'Sleep Deprivation', value: `${sleepHrs} hrs`, risk: sleepHrs < 5 },
    { id: 'reels', label: 'Doomscrolling', value: `${reels} reels`, risk: reels > 50 },
    { id: 'study', label: 'Study Deficit', value: `${studyHrs} hrs`, risk: studyHrs < 2 },
    { id: 'assignments', label: 'Backlog Mountain', value: `${assignments} pending`, risk: assignments > 5 },
    { id: 'exams', label: 'Exam Pressure', value: `${exams} remaining`, risk: exams > 2 },
    { id: 'finances', label: 'Financial Strain', value: `₹${money}`, risk: money < 100 }
  ];

  const edges = [];

  if (sleepHrs < 5) {
    edges.push({ from: 'sleep', to: 'reels', reason: 'Low sleep triggers low willpower & doomscrolling' });
    edges.push({ from: 'sleep', to: 'study', reason: 'Fatigue drastically reduces study capacity' });
  }

  if (reels > 50) {
    edges.push({ from: 'reels', to: 'assignments', reason: 'Excessive scrolling delays pending assignments' });
  }

  if (assignments > 5) {
    edges.push({ from: 'assignments', to: 'exams', reason: 'Unfinished assignments compound exam panic' });
  }

  if (money < 100) {
    edges.push({ from: 'finances', to: 'sleep', reason: 'Financial anxiety disrupts sleep quality' });
  }

  return { nodes, edges };
}

/**
 * Intervention Optimization Engine
 * Calculates highest-impact single change and optimal combination.
 */
export function calculateInterventions(answers = {}) {
  const baseScore = calculateFinalScore([
    calculateSleepScore(answers[1]),
    calculateStudyScore(answers[2]),
    calculateAssignmentScore(answers[3]),
    calculateReelsScore(answers[4]),
    calculateExamScore(answers[5]),
    calculateSyllabusScore(answers[6]),
    calculateMoneyScore(answers[7]),
    calculateLoveScore(answers[8])
  ]);

  const candidates = [];

  // Candidate 1: Increase Sleep by 2 hours (up to 8h)
  const currentSleep = Number(answers[1]) || 0;
  const newSleep = Math.min(8, currentSleep + 2);
  const sleepNewScore = calculateFinalScore([
    calculateSleepScore(newSleep),
    calculateStudyScore(answers[2]),
    calculateAssignmentScore(answers[3]),
    calculateReelsScore(answers[4]),
    calculateExamScore(answers[5]),
    calculateSyllabusScore(answers[6]),
    calculateMoneyScore(answers[7]),
    calculateLoveScore(answers[8])
  ]);
  const sleepDiff = baseScore - sleepNewScore;
  if (sleepDiff > 0.1) {
    candidates.push({
      metric: 'Sleep',
      action: `Sleep +2 hours (from ${currentSleep}h to ${newSleep}h)`,
      newScore: sleepNewScore,
      reduction: Math.round(sleepDiff * 10) / 10
    });
  }

  // Candidate 2: Cut Reels by 50%
  const currentReels = Number(answers[4]) || 0;
  const newReels = Math.floor(currentReels * 0.5);
  const reelsNewScore = calculateFinalScore([
    calculateSleepScore(answers[1]),
    calculateStudyScore(answers[2]),
    calculateAssignmentScore(answers[3]),
    calculateReelsScore(newReels),
    calculateExamScore(answers[5]),
    calculateSyllabusScore(answers[6]),
    calculateMoneyScore(answers[7]),
    calculateLoveScore(answers[8])
  ]);
  const reelsDiff = baseScore - reelsNewScore;
  if (reelsDiff > 0.1) {
    candidates.push({
      metric: 'Reels',
      action: `Reduce reels scrolling by 50% (from ${currentReels} to ${newReels})`,
      newScore: reelsNewScore,
      reduction: Math.round(reelsDiff * 10) / 10
    });
  }

  // Candidate 3: Increase Study by 2 hours
  const currentStudy = Number(answers[2]) || 0;
  const newStudy = currentStudy + 2;
  const studyNewScore = calculateFinalScore([
    calculateSleepScore(answers[1]),
    calculateStudyScore(newStudy),
    calculateAssignmentScore(answers[3]),
    calculateReelsScore(answers[4]),
    calculateExamScore(answers[5]),
    calculateSyllabusScore(answers[6]),
    calculateMoneyScore(answers[7]),
    calculateLoveScore(answers[8])
  ]);
  const studyDiff = baseScore - studyNewScore;
  if (studyDiff > 0.1) {
    candidates.push({
      metric: 'Study',
      action: `Study +2 hours (from ${currentStudy}h to ${newStudy}h)`,
      newScore: studyNewScore,
      reduction: Math.round(studyDiff * 10) / 10
    });
  }

  // Candidate 4: Complete 3 pending assignments
  const currentAssignments = Number(answers[3]) || 0;
  const newAssignments = Math.max(0, currentAssignments - 3);
  const assignNewScore = calculateFinalScore([
    calculateSleepScore(answers[1]),
    calculateStudyScore(answers[2]),
    calculateAssignmentScore(newAssignments),
    calculateReelsScore(answers[4]),
    calculateExamScore(answers[5]),
    calculateSyllabusScore(answers[6]),
    calculateMoneyScore(answers[7]),
    calculateLoveScore(answers[8])
  ]);
  const assignDiff = baseScore - assignNewScore;
  if (assignDiff > 0.1) {
    candidates.push({
      metric: 'Assignments',
      action: `Finish 3 pending assignments (down to ${newAssignments})`,
      newScore: assignNewScore,
      reduction: Math.round(assignDiff * 10) / 10
    });
  }

  // Candidate 5: Increase Syllabus by 25%
  const currentSyllabus = Number(answers[6]) || 0;
  const newSyllabus = Math.min(100, currentSyllabus + 25);
  const syllabusNewScore = calculateFinalScore([
    calculateSleepScore(answers[1]),
    calculateStudyScore(answers[2]),
    calculateAssignmentScore(answers[3]),
    calculateReelsScore(answers[4]),
    calculateExamScore(answers[5]),
    calculateSyllabusScore(newSyllabus),
    calculateMoneyScore(answers[7]),
    calculateLoveScore(answers[8])
  ]);
  const syllabusDiff = baseScore - syllabusNewScore;
  if (syllabusDiff > 0.1) {
    candidates.push({
      metric: 'Syllabus',
      action: `Cover +25% syllabus (up to ${newSyllabus}%)`,
      newScore: syllabusNewScore,
      reduction: Math.round(syllabusDiff * 10) / 10
    });
  }

  candidates.sort((a, b) => b.reduction - a.reduction);

  const bestSingle = candidates[0] || {
    metric: 'Optimal State',
    action: 'Maintain your current routine. You are in peak condition.',
    newScore: baseScore,
    reduction: 0
  };

  // Combination of top 2 interventions
  const combinedNewScore = calculateFinalScore([
    calculateSleepScore(newSleep),
    calculateStudyScore(newStudy),
    calculateAssignmentScore(newAssignments),
    calculateReelsScore(newReels),
    calculateExamScore(answers[5]),
    calculateSyllabusScore(newSyllabus),
    calculateMoneyScore(answers[7]),
    calculateLoveScore(answers[8])
  ]);

  const combinedReduction = Math.round(Math.max(0, baseScore - combinedNewScore) * 10) / 10;

  return {
    baseScore,
    bestSingle,
    allCandidates: candidates,
    optimalCombo: {
      action: 'Combined Reset: +2h Sleep, +2h Study, Cut Reels by 50%',
      newScore: combinedNewScore,
      reduction: combinedReduction
    }
  };
}
