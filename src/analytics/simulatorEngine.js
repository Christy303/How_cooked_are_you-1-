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
import { calculateMultiDimensionalDimensions, calculateInterventions } from './analyticsEngine';

/**
 * What-If Life Simulator Engine
 */
export function simulateWhatIf(simulatedAnswers = {}, baselineAnswers = {}) {
  // Extract inputs
  const sleep = Number(simulatedAnswers[1]) ?? 7;
  const study = Number(simulatedAnswers[2]) ?? 2;
  const assignments = Number(simulatedAnswers[3]) ?? 2;
  const reels = Number(simulatedAnswers[4]) ?? 30;
  const exams = Number(simulatedAnswers[5]) ?? 1;
  const syllabus = Number(simulatedAnswers[6]) ?? 50;
  const money = Number(simulatedAnswers[7]) ?? 500;
  const love = simulatedAnswers[8] || 'non-existent';

  // Individual scores
  const sleepScore = calculateSleepScore(sleep);
  const studyScore = calculateStudyScore(study);
  const assignmentScore = calculateAssignmentScore(assignments);
  const reelsScore = calculateReelsScore(reels);
  const examScore = calculateExamScore(exams);
  const syllabusScore = calculateSyllabusScore(syllabus);
  const moneyScore = calculateMoneyScore(money);
  const loveScore = calculateLoveScore(love);

  const simulatedFinalScore = calculateFinalScore([
    sleepScore,
    studyScore,
    assignmentScore,
    reelsScore,
    examScore,
    syllabusScore,
    moneyScore,
    loveScore
  ]);

  const simulatedCategory = getResultCategory(simulatedFinalScore);
  const dimensions = calculateMultiDimensionalDimensions(simulatedAnswers);
  const interventions = calculateInterventions(simulatedAnswers);

  // Baseline comparison if baseline provided
  let baselineFinalScore = null;
  let scoreDiff = 0;

  if (baselineAnswers && Object.keys(baselineAnswers).length > 0) {
    baselineFinalScore = calculateFinalScore([
      calculateSleepScore(baselineAnswers[1]),
      calculateStudyScore(baselineAnswers[2]),
      calculateAssignmentScore(baselineAnswers[3]),
      calculateReelsScore(baselineAnswers[4]),
      calculateExamScore(baselineAnswers[5]),
      calculateSyllabusScore(baselineAnswers[6]),
      calculateMoneyScore(baselineAnswers[7]),
      calculateLoveScore(baselineAnswers[8])
    ]);
    scoreDiff = Math.round((simulatedFinalScore - baselineFinalScore) * 10) / 10;
  }

  return {
    simulatedAnswers,
    simulatedFinalScore,
    simulatedCategory,
    dimensions,
    interventions,
    baselineFinalScore,
    scoreDiff,
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
