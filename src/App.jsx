import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Questionnaire from './components/Questionnaire';
import ResultScreen from './components/ResultScreen';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import WhatIfSimulator from './components/WhatIfSimulator';
import Leaderboard from './components/Leaderboard';
import AdminDashboard from './components/AdminDashboard';
import GamificationBar from './components/GamificationBar';
import AuthModal from './components/AuthModal';
import FireParticleCanvas from './components/FireParticleCanvas';
import ScrollVideoBackground from './components/ScrollVideoBackground';
import { QUESTIONS } from './config/questionsData';
import { calculateFinalScore, getResultCategory } from './utils/scoring';
import { historyManager } from './analytics/historyManager';
import { apiClient } from './services/apiClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('assessment'); // 'assessment' | 'analytics' | 'simulator' | 'leaderboard' | 'admin'
  const [step, setStep] = useState('landing'); // 'landing' | 'questionnaire' | 'result'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [lastPage, setLastPage] = useState(null);

  const toggleMute = () => setIsMuted((prev) => !prev);

  // Check auth profile on mount
  useEffect(() => {
    apiClient.getProfile()
      .then((res) => {
        if (res && res.user) {
          setUser(res.user);
        }
      })
      .catch(() => setUser(null));
  }, []);

  // Open Auth modal popup window over current view
  const handleOpenAuth = () => {
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    apiClient.setToken(null);
    setUser(null);
  };

  // Start assessment
  const handleStart = () => {
    setStep('questionnaire');
    setCurrentIndex(0);
  };

  // Record an answer
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Compute breakdown and final score
  const breakdown = QUESTIONS.map((q) => {
    const rawAns = answers[q.id];
    const score = q.scoringFunction(rawAns);
    return {
      questionId: q.id,
      answer: rawAns ?? 'N/A',
      score
    };
  });

  const individualScores = breakdown.map((item) => item.score);
  const finalScore = calculateFinalScore(individualScores);
  const category = getResultCategory(finalScore);

  // Proceed to next question or calculate final result
  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Final Question reached -> calculate damage and save to history under active user's account
      const activeUsername = user ? user.username : 'Guest';
      historyManager.saveRun(answers, finalScore, breakdown, activeUsername);
      
      // Attempt backend API sync
      apiClient.saveAssessment({ answers, finalScore, breakdown, username: activeUsername }).catch(() => {});
      
      // Dispatch custom event to auto-update leaderboard
      window.dispatchEvent(new CustomEvent('cooked_assessment_completed', {
        detail: { score: finalScore, username: activeUsername }
      }));

      setStep('result');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setStep('landing');
  };

  return (
    <div className="app-main-wrapper">
      {/* Scroll-Scrubbed Site Video Background */}
      <ScrollVideoBackground />

      {/* Dynamic Background Particle System */}
      <FireParticleCanvas intensity={step === 'result' ? finalScore : (currentIndex + 1) * 10} />

      <main className="content-container">
        {/* Top Gamification & Navigation Bar */}
        <GamificationBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
        />

        {/* Tab 1: Quiz Assessment */}
        {activeTab === 'assessment' && (
          <>
            {step === 'landing' && (
              <LandingPage
                onStart={handleStart}
                onOpenSimulator={() => setActiveTab('simulator')}
                onOpenLeaderboard={() => setActiveTab('leaderboard')}
                onOpenAnalytics={() => setActiveTab('analytics')}
                isMuted={isMuted}
                toggleMute={toggleMute}
              />
            )}

            {step === 'questionnaire' && (
              <Questionnaire
                questions={QUESTIONS}
                currentIndex={currentIndex}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onNext={handleNext}
                onBack={handleBack}
                isMuted={isMuted}
                toggleMute={toggleMute}
              />
            )}

            {step === 'result' && (
              <ResultScreen
                finalScore={finalScore}
                category={category}
                breakdown={breakdown}
                questions={QUESTIONS}
                answers={answers}
                onRestart={handleRestart}
                onOpenSimulator={() => setActiveTab('simulator')}
                onOpenAnalytics={() => setActiveTab('analytics')}
                isMuted={isMuted}
                toggleMute={toggleMute}
              />
            )}
          </>
        )}

        {/* Tab 2: Multi-Dimensional Analytics & Trends */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            latestAnswers={answers}
            latestScore={finalScore}
            user={user}
          />
        )}

        {/* Tab 3: What-If Life Simulator */}
        {activeTab === 'simulator' && (
          <WhatIfSimulator
            baselineAnswers={answers}
            questions={QUESTIONS}
          />
        )}

        {/* Tab 4: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <Leaderboard currentUser={user} />
        )}

        {/* Tab 5: Admin Dashboard (Protected) */}
        {activeTab === 'admin' && user?.role === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleCloseAuth}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
