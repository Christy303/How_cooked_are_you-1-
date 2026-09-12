import React from 'react';
import { Award, Flame, Zap, Shield, UserCheck, LogIn, LayoutDashboard, Trophy } from 'lucide-react';
import { historyManager } from '../analytics/historyManager';

export default function GamificationBar({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout
}) {
  const username = user ? user.username : null;
  const historyRuns = historyManager.getAllRuns(username);
  const totalRuns = historyRuns.length;
  
  const xp = totalRuns * 150;
  const level = totalRuns === 0 ? 1 : Math.floor(xp / 300) + 1;
  const streak = Math.min(totalRuns, 7);

  return (
    <div className="gamification-bar glass-panel">
      <div className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'assessment' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('assessment')}
        >
          <Flame size={16} />
          <span>QUIZ</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <Award size={16} />
          <span>ANALYTICS & TRENDS</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'simulator' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('simulator')}
        >
          <Zap size={16} />
          <span>WHAT-IF SIMULATOR</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'leaderboard' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <Trophy size={16} />
          <span>LEADERBOARD</span>
        </button>

        {user && user.role === 'admin' && (
          <button
            className={`tab-btn ${activeTab === 'admin' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <LayoutDashboard size={16} />
            <span>ADMIN</span>
          </button>
        )}
      </div>

      <div className="gamification-stats">
        <div className="xp-pill" title="Account Level Progress">
          <Shield size={14} className="text-amber" />
          <span>LVL {level}</span>
          <span className="xp-val">({xp} XP)</span>
        </div>

        <div className="streak-pill" title="Account Assessment Streak">
          <Flame size={14} className="text-fire-orange" />
          <span>{streak} DAY STREAK</span>
        </div>

        <div className="auth-pill">
          {user ? (
            <button className="user-btn" onClick={onLogout} title="Click to Logout">
              <UserCheck size={14} className="text-emerald" />
              <span>{user.username}</span>
            </button>
          ) : (
            <button className="login-btn" onClick={onOpenAuth}>
              <LogIn size={14} />
              <span>LOGIN</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
