import {
  calculateSleepScore,
  calculateStudyScore,
  calculateAssignmentScore,
  calculateReelsScore,
  calculateExamScore,
  calculateSyllabusScore,
  calculateMoneyScore,
  calculateLoveScore
} from '../utils/scoring';

export const QUESTIONS = [
  {
    id: 1,
    title: "How many hours did you sleep?",
    subtitle: "Be honest. 15-minute catnaps in class don't count as REM cycle.",
    type: "numeric",
    unit: "hrs",
    min: 0,
    max: 24,
    step: 0.5,
    placeholder: "e.g. 4.5",
    image: "/media/sleep.jpg",
    sound: "/media/sleep.mp3",
    iconName: "Moon",
    scoringFunction: calculateSleepScore,
    getDynamicMeme: (val) => {
      const v = Number(val) || 0;
      if (v === 0) return "💀 0 hours?! Bro is hallucinating in 4K resolution.";
      if (v <= 3) return "⚡ Zombie mode activated. Coffee is running in your veins.";
      if (v <= 6) return "⚠️ Average student operating capacity. Surviving on vibes.";
      return "👑 Sleeping like a baby with zero academic anxiety. Legend.";
    }
  },
  {
    id: 2,
    title: "How many hours did you study?",
    subtitle: "Staring at page 1 for 3 hours while checking Instagram does not count.",
    type: "numeric",
    unit: "hrs",
    min: 0,
    max: 24,
    step: 0.5,
    placeholder: "e.g. 1.0",
    image: "/media/study.jpg",
    sound: "/media/study.mp3",
    iconName: "BookOpen",
    scoringFunction: calculateStudyScore,
    getDynamicMeme: (val) => {
      const v = Number(val) || 0;
      if (v === 0) return "🚨 0 hours! You are betting your entire career on luck.";
      if (v < 1) return "⏳ 30 mins of highlight-pen aesthetic, 0 actual learning.";
      if (v <= 4) return "📖 Solid attempt. At least you opened the textbook PDF.";
      return "🧠 Academic weapon! The professor asks YOU for answers.";
    }
  },
  {
    id: 3,
    title: "How many assignments are currently pending?",
    subtitle: "Count the ones due at 11:59 PM tonight twice.",
    type: "numeric",
    unit: "pending",
    min: 0,
    max: 100,
    step: 1,
    placeholder: "e.g. 6",
    image: "/media/assignments.jpg",
    sound: "/media/assignments.mp3",
    iconName: "FileText",
    scoringFunction: calculateAssignmentScore,
    getDynamicMeme: (val) => {
      const v = Number(val) || 0;
      if (v === 0) return "✨ 0 pending! Who are you and why are you lying?";
      if (v <= 4) return "📝 Manageable crisis. 2 hours before deadline speedrun time.";
      if (v <= 10) return "🔥 Danger zone. Your canvas inbox is screaming.";
      return "🌋 20+ assignments? You don't have backlogs, you have a library.";
    }
  },
  {
    id: 4,
    title: "How many reels did you scroll today?",
    subtitle: "'Just 5 more minutes' - Said 300 reels ago.",
    type: "numeric",
    unit: "reels",
    min: 0,
    max: 2000,
    step: 5,
    placeholder: "e.g. 120",
    image: "/media/reels.jpg",
    sound: "/media/reels.mp3",
    iconName: "Smartphone",
    scoringFunction: calculateReelsScore,
    getDynamicMeme: (val) => {
      const v = Number(val) || 0;
      if (v === 0) return "🧘 Zero brain rot! Are you monk living off-grid?";
      if (v <= 25) return "📱 Casual scroll. Dopamine levels normal.";
      if (v <= 80) return "🌀 Your attention span has left the chat.";
      return "🔥 100+ reels! Your thumb has ran a full marathon today.";
    }
  },
  {
    id: 5,
    title: "How many exams do you still have left?",
    subtitle: "The final bosses standing between you and freedom.",
    type: "numeric",
    unit: "exams",
    min: 0,
    max: 20,
    step: 1,
    placeholder: "e.g. 3",
    image: "/media/exams.jpg",
    sound: "/media/exams.mp3",
    iconName: "Skull",
    scoringFunction: calculateExamScore,
    getDynamicMeme: (val) => {
      const v = Number(val) || 0;
      if (v === 0) return "🎉 FREEDOM! (Unless you failed everything already)";
      if (v <= 2) return "⚔️ Almost at the finish line! Keep surviving.";
      if (v <= 4) return "🥊 Heavyweight fight week. Prepare for battle.";
      return "💀 5+ exams? Final boss gauntlet run. RIP.";
    }
  },
  {
    id: 6,
    title: "What percentage of the syllabus have you completed?",
    subtitle: "Reading the syllabus document itself counts as 1%.",
    type: "numeric",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
    placeholder: "e.g. 25",
    image: "/media/syllabus.jpg",
    sound: "/media/syllabus.mp3",
    iconName: "BarChart3",
    scoringFunction: calculateSyllabusScore,
    getDynamicMeme: (val) => {
      const v = Number(val) || 0;
      if (v === 0) return "🤡 0%? You don't even know what subject this is.";
      if (v <= 25) return "🤏 Unit 1 Chapter 1 intro skimmed. Good luck.";
      if (v <= 60) return "🌗 Halfway there. Praying the exam stays in Chapter 1-3.";
      return "🎯 100%! Either you're a genius or you made up the syllabus.";
    }
  },
  {
    id: 7,
    title: "How much money do you have left?",
    subtitle: "Check your bank account / Paytm UPI wallet right now.",
    type: "numeric",
    unit: "₹",
    min: 0,
    max: 100000,
    step: 10,
    placeholder: "e.g. 75",
    image: "/media/money.jpg",
    sound: "/media/money.mp3",
    iconName: "IndianRupee",
    scoringFunction: calculateMoneyScore,
    getDynamicMeme: (val) => {
      const v = Number(val) || 0;
      if (v === 0) return "💸 ₹0! Ramen noodles on credit card speedrun.";
      if (v <= 100) return "🍞 ₹100 left. Chai and Parle-G diet activated.";
      if (v <= 500) return "☕ Low balance warning. No Starbucks this week.";
      return "💰 Rich student alert! Can afford extra cheese on pizza.";
    }
  },
  {
    id: 8,
    title: "How's your love life?",
    subtitle: "The ultimate scientific evaluation metric.",
    type: "options",
    unit: "status",
    image: "/media/love.jpg",
    sound: "/media/love.mp3",
    iconName: "HeartHandshake",
    scoringFunction: calculateLoveScore,
    options: [
      {
        id: "non-existent",
        title: "Non-existent 💀",
        subtitle: "Single, solitary, and existing strictly in 1D space.",
        scoreLabel: "100% cooked",
        color: "#EF4444"
      },
      {
        id: "really",
        title: "Really? 😭",
        subtitle: "It's complicated, chaotic, or delusional.",
        scoreLabel: "99.9% cooked",
        color: "#F59E0B"
      }
    ],
    getDynamicMeme: (selectedId) => {
      if (selectedId === "non-existent") return "💀 Pure academic focus (or total loneliness). 100% cooked.";
      if (selectedId === "really") return "😭 Delusion is high today! 99.9% cooked.";
      return "Select an option to evaluate your heart damage.";
    }
  }
];
