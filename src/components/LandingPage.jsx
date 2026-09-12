import React from 'react';
import { Flame, Sparkles, AlertTriangle, Zap, Volume2, VolumeX, Trophy, Activity, ArrowRight, BarChart2, TrendingUp } from 'lucide-react';
import { playSynthSFX } from '../config/mediaConfig';
import Leaderboard from './Leaderboard';

export default function LandingPage({ onStart, onOpenSimulator, onOpenLeaderboard, onOpenAnalytics, isMuted, toggleMute }) {
  const handleStart = () => {
    if (!isMuted) {
      playSynthSFX('start');
    }
    onStart();
  };

  return (
    <div className="landing-container fade-in">
      <div className="top-banner">
        <span className="badge-pill">
          <Sparkles className="icon-sm" /> FULL-STACK STUDENT ANALYTICS PLATFORM
        </span>
        <button
          className="icon-btn-mute"
          onClick={toggleMute}
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Open Editorial Hero Section — Completely Unwrapped (Zero Card Containers) */}
      <div className="hero-editorial-section text-center">
        <div className="hero-editorial-eyebrow">EST. 2026 — SCIENTIFIC BURNOUT INDEX</div>
        
        <h1 className="hero-title-staggered">
          <span>HOW</span>
          <span className="title-row-ember">cooked</span>
          <span>ARE YOU?</span>
        </h1>

        <p className="landing-subtitle">
          "Answer 8 completely scientific questions to calculate your cooked percentage, track life analytics, run what-if simulations, and climb the Hall of Flames."
        </p>

        {/* Independent Editorial Navigation Links (Zero Card Boxes / Surfaces / Borders) */}
        <div className="hero-editorial-links">
          {onOpenLeaderboard && (
            <button className="editorial-nav-link" onClick={onOpenLeaderboard}>
              <Trophy size={18} className="link-icon text-amber" />
              <div className="link-content">
                <span className="link-title">Hall of Flames</span>
                <span className="link-sub">Ranked most cooked students</span>
              </div>
              <ArrowRight size={15} className="link-arrow" />
            </button>
          )}

          <div className="link-divider" />

          {onOpenAnalytics && (
            <button className="editorial-nav-link" onClick={onOpenAnalytics}>
              <Activity size={18} className="link-icon text-emerald" />
              <div className="link-content">
                <span className="link-title">6-D Life Analytics</span>
                <span className="link-sub">Multi-metric radar & trends</span>
              </div>
              <ArrowRight size={15} className="link-arrow" />
            </button>
          )}

          <div className="link-divider" />

          {onOpenSimulator && (
            <button className="editorial-nav-link" onClick={onOpenSimulator}>
              <Zap size={18} className="link-icon text-fire-accent" />
              <div className="link-content">
                <span className="link-title">What-If Simulator</span>
                <span className="link-sub">Test sleep/study changes live</span>
              </div>
              <ArrowRight size={15} className="link-arrow" />
            </button>
          )}
        </div>

        {/* Primary Call to Action */}
        <div className="hero-cta-wrapper margin-top-lg" style={{ marginTop: '2rem' }}>
          <button className="cta-button pulse-btn" onClick={handleStart}>
            <span>START QUIZ ASSESSMENT</span>
            <Flame size={20} className="icon-flame-btn" />
          </button>
        </div>

        <div className="landing-warning" style={{ marginTop: '1.25rem' }}>
          <AlertTriangle size={15} className="text-amber" />
          <span>Warning: Side effects may include sudden urge to study or complete backlogs.</span>
        </div>
      </div>

      {/* LIVE ANALYTICS & GRAPH PREVIEW BANNER */}
      <div className="landing-analytics-showcase glass-panel fire-border-glow text-left" style={{ marginTop: '2.5rem' }}>
        <div className="section-title-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BarChart2 size={24} className="text-fire-orange" />
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>LIVE 6-DIMENSIONAL LIFE ANALYTICS & TRAJECTORY GRAPH</h3>
          </div>
          <button className="nav-btn btn-secondary" onClick={onOpenAnalytics}>
            <span>OPEN FULL ANALYTICS</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="dimensions-grid" style={{ marginTop: '1rem' }}>
          <div className="dim-item">
            <div className="dim-info">
              <span>Academic Stability Index</span>
              <strong>78%</strong>
            </div>
            <div className="dim-bar"><div className="dim-fill fill-emerald" style={{ width: '78%' }} /></div>
          </div>
          <div className="dim-item">
            <div className="dim-info">
              <span>Sleep & Energy Index</span>
              <strong>42%</strong>
            </div>
            <div className="dim-bar"><div className="dim-fill fill-blue" style={{ width: '42%' }} /></div>
          </div>
          <div className="dim-item">
            <div className="dim-info">
              <span>Time Management Index</span>
              <strong>35%</strong>
            </div>
            <div className="dim-bar"><div className="dim-fill fill-purple" style={{ width: '35%' }} /></div>
          </div>
          <div className="dim-item">
            <div className="dim-info">
              <span>Social Media Dependency</span>
              <strong>89%</strong>
            </div>
            <div className="dim-bar"><div className="dim-fill fill-red" style={{ width: '89%' }} /></div>
          </div>
          <div className="dim-item">
            <div className="dim-info">
              <span>Financial Stability</span>
              <strong>50%</strong>
            </div>
            <div className="dim-bar"><div className="dim-fill fill-amber" style={{ width: '50%' }} /></div>
          </div>
          <div className="dim-item">
            <div className="dim-info">
              <span>Academic Pressure Load</span>
              <strong>92%</strong>
            </div>
            <div className="dim-bar"><div className="dim-fill fill-orange" style={{ width: '92%' }} /></div>
          </div>
        </div>

        <div className="trend-summary-grid" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div className="trend-card glass-card">
            <span className="trend-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><TrendingUp size={14} /> 7-DAY FORECAST TRAJECTORY</span>
            <h3 className="trend-val text-amber" style={{ fontSize: '1.2rem', margin: '0.2rem 0' }}>Rising Cookedness 🔥 (+5.2% est)</h3>
            <span className="trend-sub" style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Slope trajectory prediction model</span>
          </div>
          <div className="trend-card glass-card">
            <span className="trend-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><Activity size={14} /> 30-DAY FORECAST TRAJECTORY</span>
            <h3 className="trend-val text-fire" style={{ fontSize: '1.2rem', margin: '0.2rem 0' }}>Critical Burnout Risk 💀 (+14.0% est)</h3>
            <span className="trend-sub" style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Long-term burnout projection</span>
          </div>
        </div>
      </div>

      {/* EMBEDDED HALL OF FLAMES LEADERBOARD DIRECTLY ON HOME PAGE */}
      <div className="landing-leaderboard-section margin-top-lg" style={{ marginTop: '2.5rem' }}>
        <Leaderboard />
      </div>
    </div>
  );
}
