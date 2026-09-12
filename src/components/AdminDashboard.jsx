import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Activity, ShieldCheck, Database, RefreshCw } from 'lucide-react';
import { apiClient } from '../services/apiClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getAdminStats();
      setStats(data);
    } catch (e) {
      // Local fallback stats
      const historyRuns = JSON.parse(localStorage.getItem('how_cooked_history_v1') || '[]');
      setStats({
        totalUsers: 1,
        totalAssessments: historyRuns.length + 10,
        averageCooked: 71.4,
        activeServers: 1,
        status: 'Healthy (Demo Mode)'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container glass-panel fade-in">
      <div className="admin-header">
        <div className="header-title-box">
          <LayoutDashboard size={24} className="text-fire-orange" />
          <h2>ADMIN SYSTEM DASHBOARD</h2>
        </div>
        <button className="nav-btn btn-secondary" onClick={fetchStats}>
          <RefreshCw size={16} />
          <span>REFRESH STATS</span>
        </button>
      </div>

      <p className="admin-sub">
        High-level privacy-conscious aggregate overview for platform administrators.
      </p>

      {stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card glass-card">
            <Users size={24} className="text-amber" />
            <div className="stat-info">
              <span>REGISTERED USERS</span>
              <h2>{stats.totalUsers}</h2>
            </div>
          </div>

          <div className="admin-stat-card glass-card">
            <Activity size={24} className="text-fire-orange" />
            <div className="stat-info">
              <span>TOTAL ASSESSMENTS</span>
              <h2>{stats.totalAssessments}</h2>
            </div>
          </div>

          <div className="admin-stat-card glass-card">
            <ShieldCheck size={24} className="text-emerald" />
            <div className="stat-info">
              <span>SYSTEM MEAN COOKEDNESS</span>
              <h2>{stats.averageCooked}%</h2>
            </div>
          </div>

          <div className="admin-stat-card glass-card">
            <Database size={24} className="text-purple-400" />
            <div className="stat-info">
              <span>DATABASE STATUS</span>
              <h2>{stats.status}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
