import { calculateMultiDimensionalDimensions } from './analyticsEngine';

const STORAGE_PREFIX = 'how_cooked_history_';

/**
 * Account-Scoped Assessment History & Trend Persistence Manager
 */
export const historyManager = {
  /**
   * Get storage key for a specific user (or 'guest')
   */
  getStorageKey(username) {
    if (!username || typeof username !== 'string' || !username.trim()) {
      return STORAGE_PREFIX + 'guest';
    }
    return STORAGE_PREFIX + username.trim().toLowerCase();
  },

  /**
   * Save a new assessment run for a specific user
   */
  saveRun(answers, finalScore, breakdown, username = null) {
    try {
      const dimensions = calculateMultiDimensionalDimensions(answers);
      const runItem = {
        id: 'run_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toISOString(),
        username: username || 'guest',
        answers,
        finalScore,
        breakdown,
        dimensions
      };

      const key = this.getStorageKey(username);
      const history = this.getAllRuns(username);
      history.unshift(runItem); // newest first

      const trimmed = history.slice(0, 100);
      localStorage.setItem(key, JSON.stringify(trimmed));
      return runItem;
    } catch (err) {
      console.warn("Failed to save history run locally:", err);
      return null;
    }
  },

  /**
   * Get all stored assessment runs for a specific user
   */
  getAllRuns(username = null) {
    try {
      const key = this.getStorageKey(username);
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  },

  /**
   * Calculate 7-day and 30-day forecasting trajectories for a specific user
   */
  getTrendAnalysis(username = null) {
    const runs = this.getAllRuns(username);
    if (runs.length === 0) {
      return {
        hasData: false,
        totalRuns: 0,
        averageCooked: 0,
        trajectory7Day: 'Flat',
        trajectory30Day: 'Flat',
        recentChange: 0,
        trendDirection: 'Stable'
      };
    }

    const scores = runs.map((r) => r.finalScore);
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round((sum / scores.length) * 10) / 10;

    let recentChange = 0;
    let trendDirection = 'Stable';

    if (runs.length >= 2) {
      const latest = runs[0].finalScore;
      const previous = runs[1].finalScore;
      recentChange = Math.round((latest - previous) * 10) / 10;

      if (recentChange < -1.5) trendDirection = 'Improving 📉';
      else if (recentChange > 1.5) trendDirection = 'Worsening 📈';
      else trendDirection = 'Stable ⚖️';
    }

    let trajectory7Day = 'Stable';
    let trajectory30Day = 'Stable';

    if (runs.length >= 3) {
      const recentScores = runs.slice(0, 5).map(r => r.finalScore);
      const slope = recentScores[0] - recentScores[recentScores.length - 1];
      
      if (slope > 3) {
        trajectory7Day = 'Rising Cookedness 🔥 (+5.2% est)';
        trajectory30Day = 'Critical Burnout Risk 💀 (+14.0% est)';
      } else if (slope < -3) {
        trajectory7Day = 'Recovery Phase 🍃 (-4.5% est)';
        trajectory30Day = 'Sustainable Zen 🧘 (-12.0% est)';
      } else {
        trajectory7Day = 'Steady Equilibrium ⚖️ (±1% est)';
        trajectory30Day = 'Persistent Academic Crunch 🌾';
      }
    }

    return {
      hasData: true,
      totalRuns: runs.length,
      averageCooked: avg,
      latestRun: runs[0],
      recentChange,
      trendDirection,
      trajectory7Day,
      trajectory30Day
    };
  },

  /**
   * Sync remote user runs into local account storage
   */
  syncRemoteRuns(username, remoteRuns = []) {
    if (!username || !Array.isArray(remoteRuns)) return;
    const key = this.getStorageKey(username);
    const existing = this.getAllRuns(username);
    
    // Merge by id
    const existingIds = new Set(existing.map((r) => r.id));
    const merged = [...existing];
    
    remoteRuns.forEach((r) => {
      if (!existingIds.has(r.id)) {
        merged.push(r);
      }
    });

    merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    localStorage.setItem(key, JSON.stringify(merged.slice(0, 100)));
  },

  /**
   * Clear history for a specific user
   */
  clearHistory(username = null) {
    try {
      const key = this.getStorageKey(username);
      localStorage.removeItem(key);
    } catch (e) {}
  }
};
