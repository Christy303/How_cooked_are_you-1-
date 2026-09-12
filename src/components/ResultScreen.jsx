import React, { useEffect, useState, useRef } from 'react';
import {
  Flame,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  BarChart2,
  Video,
  Zap,
  Activity,
  Trophy,
  TrendingDown,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getMatchingFinalVideo } from '../config/mediaConfig';
import { calculateMultiDimensionalDimensions, calculateInterventions } from '../analytics/analyticsEngine';
import Leaderboard from './Leaderboard';

export default function ResultScreen({
  finalScore,
  category,
  breakdown,
  questions,
  answers,
  onRestart,
  onOpenSimulator,
  onOpenAnalytics,
  isMuted,
  toggleMute
}) {
  const [displayScore, setDisplayScore] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const finalVideoConfig = getMatchingFinalVideo(finalScore);
  const [currentVideoSrc, setCurrentVideoSrc] = useState(finalVideoConfig.video || '/media/final-video.mp4');
  const videoRef = useRef(null);

  // Compute analytics & interventions directly for the result screen
  const dimensions = calculateMultiDimensionalDimensions(answers || {});
  const interventions = calculateInterventions(answers || {});

  useEffect(() => {
    if (finalVideoConfig.video) {
      setCurrentVideoSrc(finalVideoConfig.video);
    }
    setVideoError(false);
  }, [finalScore]);

  // Animated Count-Up Score
  useEffect(() => {
    let startTimestamp = null;
    const duration = 2000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easedProgress * finalScore * 10) / 10;
      setDisplayScore(currentVal);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);

    if (finalScore >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#FF4500', '#FF8C00', '#FFD700', '#DC2626']
        });
      } catch (e) {}
    }
  }, [finalScore]);

  const handleVideoError = () => {
    if (currentVideoSrc !== finalVideoConfig.fallbackVideo && finalVideoConfig.fallbackVideo) {
      setCurrentVideoSrc(finalVideoConfig.fallbackVideo);
    } else {
      setVideoError(true);
    }
  };

  return (
    <div className={`result-container fade-in ${finalScore >= 80 ? 'screen-shake-light' : ''}`}>
      {/* Top Banner */}
      <div className="result-top-bar">
        <span className="badge-pill-result" style={{ borderColor: category.color, color: category.color }}>
          <Award size={16} /> OFFICIAL CERTIFICATE OF COOKED-NESS
        </span>
        <button className="icon-btn-mute" onClick={toggleMute} title="Toggle Audio">
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Main Result Display */}
      <div className="result-main-card">
        <h2 className="result-headline">YOU ARE...</h2>

        {/* Big Animated Score Display */}
        <div className="score-hero">
          <div className="flame-counter-wrapper">
            <Flame
              size={84}
              style={{ color: category.color }}
              className={`flame-pulse-slow ${finalScore >= 60 ? 'intense-glow' : ''}`}
            />
            <h1 className="score-percentage" style={{ color: category.color }}>
              {displayScore.toFixed(1)}%
            </h1>
            <span className="cooked-word">COOKED 🔥</span>
          </div>

          {/* Dynamic Thermometer / Fire Meter */}
          <div className="meter-wrapper">
            <div className="meter-labels">
              <span>0% TOASTED</span>
              <span>50% DEEP FRIED</span>
              <span>100% CHARRED</span>
            </div>
            <div className="meter-track">
              <div
                className="meter-fill"
                style={{
                  width: `${displayScore}%`,
                  background: `linear-gradient(90deg, #10B981 0%, #F59E0B 50%, #EF4444 80%, #9333EA 100%)`
                }}
              />
            </div>
          </div>
        </div>

        {/* Category Result Summary */}
        <div
          className="category-box"
          style={{ borderLeft: `4px solid ${category.color}` }}
        >
          <div className="category-header">
            <h3 className="category-title">{category.title}</h3>
            <span className="category-badge-pill" style={{ background: category.color }}>
              {category.badge}
            </span>
          </div>
          <p className="category-description">{category.description}</p>
          <div className="category-meme-tip">
            <strong>Diagnostic Note: </strong> {category.memeTip}
          </div>
        </div>

        {/* 6-DIMENSIONAL LIFE METRICS GAUGES */}
        <div className="dimensions-section text-left">
          <div className="section-title-bar">
            <Activity size={20} className="text-fire-accent" />
            <h3>6-DIMENSIONAL LIFE ANALYTICS AUDIT</h3>
          </div>

          <div className="dimensions-grid">
            <div className="dim-item">
              <div className="dim-info">
                <span>Academic Stability Index</span>
                <strong>{dimensions.academicStability}%</strong>
              </div>
              <div className="dim-bar"><div className="dim-fill fill-emerald" style={{ width: `${dimensions.academicStability}%` }} /></div>
            </div>

            <div className="dim-item">
              <div className="dim-info">
                <span>Sleep & Energy Index</span>
                <strong>{dimensions.sleepEnergy}%</strong>
              </div>
              <div className="dim-bar"><div className="dim-fill fill-blue" style={{ width: `${dimensions.sleepEnergy}%` }} /></div>
            </div>

            <div className="dim-item">
              <div className="dim-info">
                <span>Time Management Index</span>
                <strong>{dimensions.timeManagement}%</strong>
              </div>
              <div className="dim-bar"><div className="dim-fill fill-purple" style={{ width: `${dimensions.timeManagement}%` }} /></div>
            </div>

            <div className="dim-item">
              <div className="dim-info">
                <span>Social Media Dependency</span>
                <strong>{dimensions.socialMediaDependency}%</strong>
              </div>
              <div className="dim-bar"><div className="dim-fill fill-red" style={{ width: `${dimensions.socialMediaDependency}%` }} /></div>
            </div>

            <div className="dim-item">
              <div className="dim-info">
                <span>Financial Stability</span>
                <strong>{dimensions.financialStability}%</strong>
              </div>
              <div className="dim-bar"><div className="dim-fill fill-amber" style={{ width: `${dimensions.financialStability}%` }} /></div>
            </div>

            <div className="dim-item">
              <div className="dim-info">
                <span>Academic Pressure Load</span>
                <strong>{dimensions.academicPressure}%</strong>
              </div>
              <div className="dim-bar"><div className="dim-fill fill-orange" style={{ width: `${dimensions.academicPressure}%` }} /></div>
            </div>
          </div>
        </div>

        {/* INTERVENTION RECOMMENDATION BOX */}
        {interventions && interventions.bestSingle && (
          <div className="intervention-card text-left">
            <div className="card-header-icon">
              <TrendingDown size={20} className="text-emerald" />
              <h3>HIGHEST IMPACT ACTION TO REDUCE COOKEDNESS</h3>
            </div>
            <p className="action-text">"{interventions.bestSingle.action}"</p>
            <div className="impact-pill">
              <span>Expected Cookedness Reduction: </span>
              <strong className="text-emerald">-{interventions.bestSingle.reduction}% Cooked</strong>
            </div>
          </div>
        )}

        {/* Final Video Section */}
        <div className="video-section text-left">
          <div className="video-header">
            <Video size={20} className="text-fire-accent" />
            <h3>FINAL REACTION VIDEO ({finalVideoConfig.description})</h3>
          </div>

          <div className="video-player-container">
            {!videoError && currentVideoSrc ? (
              <video
                ref={videoRef}
                key={currentVideoSrc}
                controls
                playsInline
                autoPlay
                muted={isMuted}
                preload="metadata"
                className="final-video-player"
                onError={handleVideoError}
              >
                <source src={currentVideoSrc} type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>
            ) : (
              <div className="video-fallback-box">
                <Flame size={48} className="text-fire-accent pulse-animation" />
                <h4>Final Video Tier Placeholder ({finalVideoConfig.title})</h4>
                <p>
                  Configured tier video path: <code>{finalVideoConfig.video}</code>
                </p>
                <span className="fallback-note">
                  (Upload <code>{finalVideoConfig.video}</code> or <code>/media/final-video.mp4</code> to play your custom reaction video with full audio and controls)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Detailed 8-Question Score Breakdown */}
        <div className="breakdown-section glass-card text-left">
          <div className="breakdown-header">
            <BarChart2 size={20} className="text-fire-accent" />
            <h3>8-METRIC AUDIT BREAKDOWN</h3>
          </div>

          <div className="breakdown-grid">
            {breakdown.map((item, idx) => {
              const q = questions.find((q) => q.id === item.questionId);
              return (
                <div key={item.questionId} className="breakdown-item glass-mini-card">
                  <div className="breakdown-metric-info">
                    <span className="metric-index">#{idx + 1}</span>
                    <span className="metric-title">{q ? q.title : `Metric ${item.questionId}`}</span>
                  </div>

                  <div className="breakdown-values">
                    <span className="user-answer-pill">
                      Answer: <strong>{String(item.answer)}</strong>
                    </span>
                    <span
                      className="metric-score-tag"
                      style={{
                        color:
                          item.score > 75
                            ? '#EF4444'
                            : item.score > 40
                            ? '#F59E0B'
                            : '#10B981'
                      }}
                    >
                      {item.score.toFixed(1)}% Cooked
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NEW FEATURE 3: EMBEDDED HALL OF FLAMES LEADERBOARD */}
        <div className="text-left">
          <Leaderboard />
        </div>

        {/* Action Buttons */}
        <div className="result-actions-grid">
          {onOpenSimulator && (
            <button className="nav-btn btn-secondary" onClick={onOpenSimulator}>
              <Zap size={18} className="text-fire-accent" />
              <span>WHAT-IF SIMULATOR</span>
            </button>
          )}

          {onOpenAnalytics && (
            <button className="nav-btn btn-secondary" onClick={onOpenAnalytics}>
              <Activity size={18} className="text-amber" />
              <span>VIEW ANALYTICS</span>
            </button>
          )}

          <button className="cta-button pulse-btn btn-restart" onClick={onRestart}>
            <RotateCcw size={22} />
            <span>DO IT AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
