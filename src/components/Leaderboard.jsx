import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Shield, Users, RefreshCw } from 'lucide-react';
import { apiClient } from '../services/apiClient';

const DEMO_LEADERBOARD = [
  { username: 'ZombieStudent_99', cookedScore: 98.4, category: 'CHARRED BEYOND RECOGNITION 💀', runsCount: 14 },
  { username: 'NoSleepChaiLover', cookedScore: 94.2, category: 'Completely Cooked 🔥', runsCount: 9 },
  { username: 'ReelsAddict2026', cookedScore: 89.6, category: 'Completely Cooked 🔥', runsCount: 11 },
  { username: 'CanvasBacklogKing', cookedScore: 82.0, category: 'Deep Fried 🍟', runsCount: 6 },
  { username: 'PanicStudyingAt3AM', cookedScore: 78.5, category: 'Deep Fried 🍟', runsCount: 8 },
  { username: 'BrokeCollegeStudent', cookedScore: 72.1, category: 'Getting Cooked 🌡️', runsCount: 5 },
  { username: 'SyllabusScared', cookedScore: 64.0, category: 'Getting Cooked 🌡️', runsCount: 4 },
  { username: 'SuspiciouslyCalm', cookedScore: 32.5, category: 'Slightly Toasted 🍞', runsCount: 3 }
];

const getCategoryForScore = (score) => {
  if (score >= 95) return 'CHARRED BEYOND RECOGNITION 💀';
  if (score >= 80) return 'Completely Cooked 🔥';
  if (score >= 60) return 'Deep Fried 🍟';
  if (score >= 40) return 'Getting Cooked 🌡️';
  return 'Slightly Toasted 🍞';
};

const getLocalUserScores = () => {
  const localMap = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('how_cooked_history_')) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const runs = JSON.parse(raw);
        if (Array.isArray(runs) && runs.length > 0) {
          const firstRun = runs[0];
          let uname = firstRun.username || key.replace('how_cooked_history_', '');
          if (!uname || uname.toLowerCase() === 'guest') uname = 'Guest (You)';

          const maxScore = Math.max(...runs.map((r) => Number(r.finalScore) || 0));
          const keyLower = uname.toLowerCase();

          localMap[keyLower] = {
            username: uname,
            cookedScore: maxScore,
            category: getCategoryForScore(maxScore),
            runsCount: runs.length,
            isLocal: true
          };
        }
      } catch (e) {}
    }
  }
  return localMap;
};

const mergeAndRank = (baseList = [], currentUser = null) => {
  const map = {};

  const initial = baseList && baseList.length > 0 ? baseList : DEMO_LEADERBOARD;
  initial.forEach((item) => {
    const key = item.username.toLowerCase();
    const cookedScore = Number(item.cookedScore) || 0;
    map[key] = {
      username: item.username,
      cookedScore,
      category: item.category || getCategoryForScore(cookedScore),
      runsCount: item.runsCount || 1,
      isLocal: false
    };
  });

  const localScores = getLocalUserScores();
  Object.keys(localScores).forEach((key) => {
    const localEntry = localScores[key];
    if (!map[key] || localEntry.cookedScore >= map[key].cookedScore) {
      map[key] = {
        username: localEntry.username,
        cookedScore: localEntry.cookedScore,
        category: localEntry.category,
        runsCount: Math.max(localEntry.runsCount, map[key]?.runsCount || 0),
        isLocal: true
      };
    } else {
      map[key].runsCount = Math.max(map[key].runsCount, localEntry.runsCount);
    }
  });

  const sorted = Object.values(map).sort((a, b) => b.cookedScore - a.cookedScore);

  sorted.forEach((item, idx) => {
    item.rank = idx + 1;
    if (currentUser && item.username.toLowerCase() === currentUser.username.toLowerCase()) {
      item.isCurrentUser = true;
    }
  });

  return sorted;
};

export default function Leaderboard({ currentUser }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();

    const handleUpdate = () => {
      fetchLeaderboard();
    };

    window.addEventListener('cooked_assessment_completed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('cooked_assessment_completed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [currentUser]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await apiClient.request('/leaderboard');
      if (res && Array.isArray(res.leaderboard)) {
        const merged = mergeAndRank(res.leaderboard, currentUser);
        setLeaderboardData(merged);
      } else {
        useFallbackData();
      }
    } catch (e) {
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackData = () => {
    const merged = mergeAndRank(DEMO_LEADERBOARD, currentUser);
    setLeaderboardData(merged);
  };

  return (
    <div className="leaderboard-container glass-panel fade-in">
      <div className="leaderboard-header">
        <div className="header-title-box">
          <Trophy size={26} className="text-fire-orange pulse-animation" />
          <div>
            <h2>HALL OF FLAMES LEADERBOARD</h2>
            <p className="leaderboard-sub">Rankings of the most cooked students in existence.</p>
          </div>
        </div>

        <button className="nav-btn btn-secondary" onClick={fetchLeaderboard}>
          <RefreshCw size={16} className={loading ? 'spin-animation' : ''} />
          <span>REFRESH RANKS</span>
        </button>
      </div>

      {/* Top 3 Podium Cards */}
      {leaderboardData.length >= 3 && (
        <div className="podium-grid">
          {/* Rank 2 */}
          <div className="podium-card glass-card rank-2">
            <span className="rank-number">#2</span>
            <Flame size={32} className="text-fire-orange" />
            <h3 className="podium-username">{leaderboardData[1].username}</h3>
            <h1 className="podium-score text-fire">{leaderboardData[1].cookedScore.toFixed(1)}%</h1>
            <span className="podium-badge">{leaderboardData[1].category}</span>
          </div>

          {/* Rank 1 */}
          <div className="podium-card glass-card rank-1 fire-border-glow">
            <div className="crown-badge">👑 #1 MOST COOKED</div>
            <Flame size={48} className="text-fire-orange intense-glow flame-pulse-slow" />
            <h3 className="podium-username text-fire-highlight">{leaderboardData[0].username}</h3>
            <h1 className="podium-score text-fire-highlight">{leaderboardData[0].cookedScore.toFixed(1)}%</h1>
            <span className="podium-badge-gold">{leaderboardData[0].category}</span>
          </div>

          {/* Rank 3 */}
          <div className="podium-card glass-card rank-3">
            <span className="rank-number">#3</span>
            <Flame size={32} className="text-amber" />
            <h3 className="podium-username">{leaderboardData[2].username}</h3>
            <h1 className="podium-score text-amber">{leaderboardData[2].cookedScore.toFixed(1)}%</h1>
            <span className="podium-badge">{leaderboardData[2].category}</span>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="leaderboard-table-card glass-card">
        <table className="history-table leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student Handle</th>
              <th>Cooked Damage</th>
              <th>Status Tier</th>
              <th>Assessments</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((item) => {
              const isYou = item.isCurrentUser || item.isLocal || (currentUser && item.username.toLowerCase() === currentUser.username.toLowerCase());
              return (
                <tr
                  key={item.rank + '_' + item.username}
                  className={isYou ? 'highlight-user-row' : ''}
                >
                  <td>
                    <span className={`rank-badge ${item.rank <= 3 ? `rank-badge-${item.rank}` : ''}`}>
                      #{item.rank}
                    </span>
                  </td>
                  <td>
                    <strong className="username-cell">
                      {item.username}
                      {isYou && <span className="you-pill">YOU</span>}
                    </strong>
                  </td>
                  <td>
                    <strong className="score-cell text-fire-highlight">
                      {item.cookedScore.toFixed(1)}% Cooked 🔥
                    </strong>
                  </td>
                  <td>
                    <span className="category-cell-pill">{item.category}</span>
                  </td>
                  <td>{item.runsCount || 1} runs</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
