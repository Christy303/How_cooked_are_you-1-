import React, { useState } from 'react';
import { Sliders, Zap, CheckCircle2, TrendingDown, RefreshCw, BookOpen, Clock } from 'lucide-react';
import { simulateWhatIf } from '../analytics/simulatorEngine';
import DependencyGraphView from './DependencyGraphView';

export default function WhatIfSimulator({ baselineAnswers = {}, questions = [] }) {
  const [simCategoryTab, setSimCategoryTab] = useState('habits'); // 'habits' | 'academics'

  const [simAnswers, setSimAnswers] = useState({
    1: baselineAnswers[1] ?? 5,
    2: baselineAnswers[2] ?? 2,
    3: baselineAnswers[3] ?? 4,
    4: baselineAnswers[4] ?? 60,
    5: baselineAnswers[5] ?? 2,
    6: baselineAnswers[6] ?? 35,
    7: baselineAnswers[7] ?? 200,
    8: baselineAnswers[8] ?? 'non-existent'
  });

  const {
    simulatedFinalScore,
    simulatedCategory,
    interventions,
    baselineFinalScore,
    scoreDiff
  } = simulateWhatIf(simAnswers, baselineAnswers);

  const handleSliderChange = (id, val) => {
    setSimAnswers((prev) => ({
      ...prev,
      [id]: val
    }));
  };

  const handleResetToBaseline = () => {
    setSimAnswers({
      1: baselineAnswers[1] ?? 5,
      2: baselineAnswers[2] ?? 2,
      3: baselineAnswers[3] ?? 4,
      4: baselineAnswers[4] ?? 60,
      5: baselineAnswers[5] ?? 2,
      6: baselineAnswers[6] ?? 35,
      7: baselineAnswers[7] ?? 200,
      8: baselineAnswers[8] ?? 'non-existent'
    });
  };

  return (
    <div className="simulator-container glass-panel fade-in">
      <div className="simulator-header">
        <div className="header-title-box">
          <Zap size={24} className="text-fire-accent pulse-animation" />
          <h2>WHAT-IF LIFE SIMULATOR</h2>
        </div>
        <button className="nav-btn btn-secondary" onClick={handleResetToBaseline}>
          <RefreshCw size={16} />
          <span>RESET TO BASELINE</span>
        </button>
      </div>

      {/* Main Side-by-Side Dual-Pane Grid */}
      <div className="simulator-main-grid">
        {/* Left Column: Interactive Control Console */}
        <div className="sim-controls-col glass-card">
          <div className="controls-header-bar">
            <h3>SIMULATION CONTROLS</h3>
            <div className="sim-tab-pills">
              <button
                className={`tab-pill-btn ${simCategoryTab === 'habits' ? 'pill-active' : ''}`}
                onClick={() => setSimCategoryTab('habits')}
              >
                <Clock size={14} />
                <span>Habits & Routine</span>
              </button>
              <button
                className={`tab-pill-btn ${simCategoryTab === 'academics' ? 'pill-active' : ''}`}
                onClick={() => setSimCategoryTab('academics')}
              >
                <BookOpen size={14} />
                <span>Academics & Life</span>
              </button>
            </div>
          </div>

          {/* Group A: Habits & Routine */}
          {simCategoryTab === 'habits' && (
            <div className="sliders-sub-grid fade-in">
              <div className="slider-item">
                <div className="slider-label-row">
                  <span>😴 Sleep Hours</span>
                  <strong>{simAnswers[1]} hrs</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.5"
                  value={simAnswers[1]}
                  onChange={(e) => handleSliderChange(1, e.target.value)}
                  className="sim-range-input"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>📚 Study Hours</span>
                  <strong>{simAnswers[2]} hrs</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  step="0.5"
                  value={simAnswers[2]}
                  onChange={(e) => handleSliderChange(2, e.target.value)}
                  className="sim-range-input"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>📱 Reels Scrolled</span>
                  <strong>{simAnswers[4]} reels</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={simAnswers[4]}
                  onChange={(e) => handleSliderChange(4, e.target.value)}
                  className="sim-range-input"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>💸 Money Left</span>
                  <strong>₹{simAnswers[7]}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={simAnswers[7]}
                  onChange={(e) => handleSliderChange(7, e.target.value)}
                  className="sim-range-input"
                />
              </div>
            </div>
          )}

          {/* Group B: Academics & Life */}
          {simCategoryTab === 'academics' && (
            <div className="sliders-sub-grid fade-in">
              <div className="slider-item">
                <div className="slider-label-row">
                  <span>📝 Pending Assignments</span>
                  <strong>{simAnswers[3]} pending</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={simAnswers[3]}
                  onChange={(e) => handleSliderChange(3, e.target.value)}
                  className="sim-range-input"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>💀 Exams Remaining</span>
                  <strong>{simAnswers[5]} exams</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={simAnswers[5]}
                  onChange={(e) => handleSliderChange(5, e.target.value)}
                  className="sim-range-input"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>📖 Syllabus Covered</span>
                  <strong>{simAnswers[6]}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={simAnswers[6]}
                  onChange={(e) => handleSliderChange(6, e.target.value)}
                  className="sim-range-input"
                />
              </div>

              <div className="slider-item">
                <div className="slider-label-row">
                  <span>❤️ Love Life Status</span>
                  <strong>{simAnswers[8] === 'non-existent' ? 'Non-existent 💀' : 'Really? 😭'}</strong>
                </div>
                <div className="toggle-options">
                  <button
                    className={`toggle-btn ${simAnswers[8] === 'non-existent' ? 'toggle-active' : ''}`}
                    onClick={() => handleSliderChange(8, 'non-existent')}
                  >
                    Non-existent 💀
                  </button>
                  <button
                    className={`toggle-btn ${simAnswers[8] === 'really' ? 'toggle-active' : ''}`}
                    onClick={() => handleSliderChange(8, 'really')}
                  >
                    Really? 😭
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Simulation Results & Impact Engine */}
        <div className="sim-results-col">
          {/* Live Score Display Card */}
          <div className="sim-score-card glass-card fire-border-glow">
            <div className="hero-stat">
              <span className="hero-label">SIMULATED COOKED SCORE</span>
              <h1 className="hero-val" style={{ color: simulatedCategory.color }}>
                {simulatedFinalScore.toFixed(1)}%
              </h1>
              <span className="hero-badge" style={{ background: simulatedCategory.color }}>
                {simulatedCategory.title}
              </span>
            </div>

            {baselineFinalScore !== null && (
              <div className="hero-diff">
                <span className="diff-label">DELTA VS SAVED</span>
                <div className="diff-val-box">
                  <strong className="baseline-val">{baselineFinalScore.toFixed(1)}%</strong>
                  <span
                    className={`diff-pill ${scoreDiff <= 0 ? 'pill-good' : 'pill-bad'}`}
                  >
                    {scoreDiff > 0 ? `+${scoreDiff}%` : `${scoreDiff}%`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Side-by-side Intervention Cards */}
          <div className="interventions-row-grid">
            <div className="intervention-card glass-card highlight-card">
              <div className="card-header-icon">
                <TrendingDown size={18} className="text-emerald" />
                <h4>HIGHEST SINGLE IMPACT</h4>
              </div>
              <p className="action-text">"{interventions.bestSingle.action}"</p>
              <div className="impact-pill">
                <span>Reduction: </span>
                <strong className="text-emerald">-{interventions.bestSingle.reduction}% Cooked</strong>
              </div>
            </div>

            <div className="intervention-card glass-card">
              <div className="card-header-icon">
                <CheckCircle2 size={18} className="text-fire-orange" />
                <h4>OPTIMAL COMBO PLAN</h4>
              </div>
              <p className="action-text">"{interventions.optimalCombo.action}"</p>
              <div className="impact-pill">
                <span>Combined: </span>
                <strong className="text-fire-highlight">-{interventions.optimalCombo.reduction}% Cooked</strong>
              </div>
            </div>
          </div>

          {/* Dependency Graph View */}
          <DependencyGraphView answers={simAnswers} />
        </div>
      </div>
    </div>
  );
}
