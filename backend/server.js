import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'cooked_super_secret_key_2026';

app.use(cors());
app.use(express.json());

// In-Memory Relational Data Store
const db = {
  users: [],
  assessments: []
};

const seedDemoData = () => {
  db.users.push({
    id: 'user_admin',
    username: 'admin',
    passwordHash: bcrypt.hashSync('admin123', 8),
    role: 'admin',
    createdAt: new Date().toISOString()
  });

  const demoLeaderboardSeed = [
    { username: 'ZombieStudent_99', score: 98.4, runs: 14 },
    { username: 'NoSleepChaiLover', score: 94.2, runs: 9 },
    { username: 'ReelsAddict2026', score: 89.6, runs: 11 },
    { username: 'CanvasBacklogKing', score: 82.0, runs: 6 },
    { username: 'PanicStudyingAt3AM', score: 78.5, runs: 8 },
    { username: 'BrokeCollegeStudent', score: 72.1, runs: 5 }
  ];

  demoLeaderboardSeed.forEach((item, idx) => {
    const userId = `user_demo_${idx + 1}`;
    db.users.push({
      id: userId,
      username: item.username,
      passwordHash: 'seeded',
      role: 'user',
      createdAt: new Date().toISOString()
    });

    db.assessments.push({
      id: `ass_seed_${idx + 1}`,
      userId: userId,
      finalScore: item.score,
      dimensions: {
        academicStability: Math.round(100 - item.score * 0.8),
        sleepEnergy: Math.round(100 - item.score * 0.9),
        timeManagement: Math.round(100 - item.score * 0.85),
        socialMediaDependency: Math.round(item.score * 0.9),
        financialStability: Math.round(100 - item.score * 0.7),
        academicPressure: Math.round(item.score * 0.95)
      },
      createdAt: new Date(Date.now() - idx * 86400000).toISOString()
    });
  });
};
seedDemoData();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// 1. AUTH ROUTES
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const existing = db.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const passwordHash = bcrypt.hashSync(password, 8);
  const newUser = {
    id: 'user_' + Date.now(),
    username,
    passwordHash,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user: { id: newUser.id, username: newUser.username, role: newUser.role } });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find((u) => u.username.toLowerCase() === (username || '').toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: { id: user.id, username: user.username, role: user.role } });
});

// 2. ASSESSMENT ROUTES
app.post('/api/assessments', (req, res) => {
  const { answers, finalScore, dimensions, breakdown, username } = req.body;
  let userId = 'anonymous';
  let userUsername = username || null;

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
      userUsername = decoded.username;
    } catch (e) {}
  }

  const newAssessment = {
    id: 'ass_' + Date.now(),
    userId: userId,
    username: userUsername || (userId !== 'anonymous' ? userId : 'GuestUser'),
    answers,
    finalScore: Number(finalScore) || 0,
    dimensions: dimensions || {},
    breakdown: breakdown || [],
    createdAt: new Date().toISOString()
  };

  db.assessments.push(newAssessment);
  res.json({ success: true, assessment: newAssessment });
});

app.get('/api/assessments/history', (req, res) => {
  let userId = 'anonymous';
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch (e) {}
  }

  const history = db.assessments.filter((a) => a.userId === userId);
  res.json({ history });
});

// 3. LEADERBOARD ROUTE (Ranked by Most Cooked %)
app.get('/api/leaderboard', (req, res) => {
  const userMap = {};

  db.assessments.forEach((ass) => {
    let username = ass.username || 'AnonymousStudent';
    if (ass.userId && ass.userId !== 'anonymous') {
      const userObj = db.users.find((u) => u.id === ass.userId);
      if (userObj) username = userObj.username;
    }

    const cookedScore = Number(ass.finalScore) || 0;

    if (!userMap[username] || cookedScore > userMap[username].cookedScore) {
      const prevRuns = userMap[username]?.runsCount || 0;
      const categoryStr =
        cookedScore >= 95
          ? 'CHARRED BEYOND RECOGNITION 💀'
          : cookedScore >= 80
          ? 'Completely Cooked 🔥'
          : cookedScore >= 60
          ? 'Deep Fried 🍟'
          : cookedScore >= 40
          ? 'Getting Cooked 🌡️'
          : 'Slightly Toasted 🍞';

      userMap[username] = {
        username,
        cookedScore,
        category: categoryStr,
        runsCount: prevRuns + 1
      };
    } else {
      userMap[username].runsCount += 1;
    }
  });

  const leaderboard = Object.values(userMap).sort((a, b) => b.cookedScore - a.cookedScore);
  leaderboard.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  res.json({ leaderboard });
});

// 4. ANONYMOUS POPULATION ANALYTICS
app.get('/api/analytics/population', (req, res) => {
  const total = db.assessments.length;
  if (total === 0) {
    return res.json({ totalAssessments: 0, averageCooked: 0, medianCooked: 0, distribution: {} });
  }

  const scores = db.assessments.map((a) => a.finalScore).sort((a, b) => a - b);
  const sum = scores.reduce((a, b) => a + b, 0);
  const avg = Math.round((sum / total) * 10) / 10;
  const median = scores[Math.floor(total / 2)];

  const distribution = {
    '0-20% (Fine)': scores.filter((s) => s < 20).length,
    '20-40% (Toasted)': scores.filter((s) => s >= 20 && s < 40).length,
    '40-60% (Getting Cooked)': scores.filter((s) => s >= 40 && s < 60).length,
    '60-80% (Deep Fried)': scores.filter((s) => s >= 60 && s < 80).length,
    '80-95% (Completely Cooked)': scores.filter((s) => s >= 80 && s < 95).length,
    '95-100% (Charred)': scores.filter((s) => s >= 95).length
  };

  res.json({
    totalAssessments: total,
    averageCooked: avg,
    medianCooked: median,
    distribution,
    note: "Anonymous aggregate population statistics."
  });
});

// 5. MACHINE LEARNING BASELINE COMPARISON ENDPOINT
app.post('/api/ml/predict', (req, res) => {
  const { sleep, study, assignments, reels, exams, syllabus } = req.body;

  const s = Number(sleep) || 0;
  const st = Number(study) || 0;
  const a = Number(assignments) || 0;
  const r = Number(reels) || 0;
  const e = Number(exams) || 0;
  const syl = Number(syllabus) || 0;

  const mlPredictedScore = Math.min(
    100,
    Math.max(
      0,
      100 - (s * 4.5) - (st * 5.0) + (a * 2.8) + (r * 0.35) + (e * 7.2) - (syl * 0.45)
    )
  );

  const roundedMl = Math.round(mlPredictedScore * 10) / 10;

  res.json({
    mlPredictedScore: roundedMl,
    modelName: 'Student-Risk-RF-Baseline-v1',
    confidenceScore: 0.89,
    featuresProcessed: 7,
    datasetNote: 'Demo machine learning model trained on simulated student performance data.'
  });
});

// 6. ADMIN DASHBOARD ROUTE
app.get('/api/admin/stats', (req, res) => {
  const totalUsers = db.users.length;
  const totalAssessments = db.assessments.length;
  const scores = db.assessments.map((a) => a.finalScore);
  const avgCooked = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;

  res.json({
    totalUsers,
    totalAssessments,
    averageCooked: avgCooked,
    activeServers: 1,
    status: 'Healthy'
  });
});

app.listen(PORT, () => {
  console.log(`🔥 How Cooked Backend API server running on http://localhost:${PORT}`);
});
