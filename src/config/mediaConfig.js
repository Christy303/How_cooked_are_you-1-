/**
 * Central Media Configuration
 * Easily update video paths, audio files, image fallbacks, or cumulative/final score video thresholds here.
 */

// Default single video fallback
export const FINAL_VIDEO = "/media/final-video.mp4";

/**
 * Question Media Fallbacks & Sound Mappings
 */
export const QUESTION_MEDIA = [
  { id: 1, image: "/media/sleep.jpg", sound: "/media/sleep.mp3", fallbackColor: "#1E1B4B" },
  { id: 2, image: "/media/study.jpg", sound: "/media/study.mp3", fallbackColor: "#312E81" },
  { id: 3, image: "/media/assignments.jpg", sound: "/media/assignments.mp3", fallbackColor: "#4C1D95" },
  { id: 4, image: "/media/reels.jpg", sound: "/media/reels.mp3", fallbackColor: "#701A75" },
  { id: 5, image: "/media/exams.jpg", sound: "/media/exams.mp3", fallbackColor: "#831843" },
  { id: 6, image: "/media/syllabus.jpg", sound: "/media/syllabus.mp3", fallbackColor: "#881337" },
  { id: 7, image: "/media/money.jpg", sound: "/media/money.mp3", fallbackColor: "#7F1D1D" },
  { id: 8, image: "/media/love.jpg", sound: "/media/love.mp3", fallbackColor: "#450A0A" }
];

/**
 * 8 Cumulative Cooked Score Video Thresholds (Used on Questionnaire right-side panel)
 * 
 * Edit this array to customize:
 * - minScore & maxScore: The percentage range that triggers this video.
 * - video: The local video path in public/media/.
 * - title & description: Label shown above the video player.
 */
export const CUMULATIVE_STATUS_VIDEOS = [
  {
    id: 1,
    minScore: 0,
    maxScore: 20,
    video: "/media/status-video-1.mp4",
    title: "Vibing & Chilling 🗿",
    description: "Cumulative Cooked Range: 0% - 20%"
  },
  {
    id: 2,
    minScore: 20,
    maxScore: 35,
    video: "/media/status-video-2.mp4",
    title: "Mild Discomfort 🍞",
    description: "Cumulative Cooked Range: 20% - 35%"
  },
  {
    id: 3,
    minScore: 35,
    maxScore: 50,
    video: "/media/status-video-3.mp4",
    title: "Sweat Commencing 💦",
    description: "Cumulative Cooked Range: 35% - 50%"
  },
  {
    id: 4,
    minScore: 50,
    maxScore: 65,
    video: "/media/status-video-4.mp4",
    title: "Getting Cooked 🌡️",
    description: "Cumulative Cooked Range: 50% - 65%"
  },
  {
    id: 5,
    minScore: 65,
    maxScore: 78,
    video: "/media/status-video-5.mp4",
    title: "Sizzling Panic 🍳",
    description: "Cumulative Cooked Range: 65% - 78%"
  },
  {
    id: 6,
    minScore: 78,
    maxScore: 88,
    video: "/media/status-video-6.mp4",
    title: "Deep Fried 🍟",
    description: "Cumulative Cooked Range: 78% - 88%"
  },
  {
    id: 7,
    minScore: 88,
    maxScore: 95,
    video: "/media/status-video-7.mp4",
    title: "Completely Cooked 🔥",
    description: "Cumulative Cooked Range: 88% - 95%"
  },
  {
    id: 8,
    minScore: 95,
    maxScore: 100,
    video: "/media/status-video-8.mp4",
    title: "CHARRED BEYOND RECOGNITION 💀",
    description: "Cumulative Cooked Range: 95% - 100%"
  }
];

/**
 * 7 Final Result Video Thresholds (Used on Final Result screen)
 * Range mappings:
 * 1: 0 - 16%   -> /media/final-video-1.mp4
 * 2: 17 - 32%  -> /media/final-video-2.mp4
 * 3: 33 - 50%  -> /media/final-video-3.mp4
 * 4: 51 - 67%  -> /media/final-video-4.mp4
 * 5: 68 - 83%  -> /media/final-video-5.mp4
 * 6: 84 - 99%  -> /media/final-video-6.mp4
 * 7: 100%      -> /media/final-video-7.mp4
 */
export const FINAL_RESULT_VIDEOS = [
  {
    id: 1,
    minScore: 0,
    maxScore: 16.9,
    video: "/media/final-video-1.mp4",
    fallbackVideo: "/media/final-video.mp4",
    title: "Suspiciously Functioning 🗿",
    description: "Final Cooked Range: 0% - 16%"
  },
  {
    id: 2,
    minScore: 17,
    maxScore: 32.9,
    video: "/media/final-video-2.mp4",
    fallbackVideo: "/media/final-video.mp4",
    title: "Slightly Toasted 🍞",
    description: "Final Cooked Range: 17% - 32%"
  },
  {
    id: 3,
    minScore: 33,
    maxScore: 50.9,
    video: "/media/final-video-3.mp4",
    fallbackVideo: "/media/final-video.mp4",
    title: "Warm & Sweating 💦",
    description: "Final Cooked Range: 33% - 50%"
  },
  {
    id: 4,
    minScore: 51,
    maxScore: 67.9,
    video: "/media/final-video-4.mp4",
    fallbackVideo: "/media/final-video.mp4",
    title: "Getting Cooked 🍳",
    description: "Final Cooked Range: 51% - 67%"
  },
  {
    id: 5,
    minScore: 68,
    maxScore: 83.9,
    video: "/media/final-video-5.mp4",
    fallbackVideo: "/media/final-video.mp4",
    title: "Deep Fried 🍟",
    description: "Final Cooked Range: 68% - 83%"
  },
  {
    id: 6,
    minScore: 84,
    maxScore: 99.9,
    video: "/media/final-video-6.mp4",
    fallbackVideo: "/media/final-video.mp4",
    title: "Completely Cooked 🔥",
    description: "Final Cooked Range: 84% - 99%"
  },
  {
    id: 7,
    minScore: 100,
    maxScore: 100,
    video: "/media/final-video-7.mp4",
    fallbackVideo: "/media/final-video.mp4",
    title: "CHARRED BEYOND RECOGNITION 💀🔥",
    description: "Final Cooked Range: 100%"
  }
];

export function getMatchingStatusVideo(cumulativeScore, questionIndex = 0) {
  const score = Math.min(100, Math.max(0, Number(cumulativeScore) || 0));
  const found = CUMULATIVE_STATUS_VIDEOS.find(
    (item) => score >= item.minScore && score <= item.maxScore
  );
  if (found) return found;
  const safeIndex = Math.min(CUMULATIVE_STATUS_VIDEOS.length - 1, Math.max(0, questionIndex));
  return CUMULATIVE_STATUS_VIDEOS[safeIndex];
}

export function getMatchingFinalVideo(finalScore) {
  const score = Math.min(100, Math.max(0, Number(finalScore) || 0));
  const found = FINAL_RESULT_VIDEOS.find(
    (item) => score >= item.minScore && score <= item.maxScore
  );
  if (found) return found;
  if (score < 17) return FINAL_RESULT_VIDEOS[0];
  return FINAL_RESULT_VIDEOS[FINAL_RESULT_VIDEOS.length - 1];
}

// Audio Context Singleton for synthesized sound effects fallback
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSynthSFX(type = 'next') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'start') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'next') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 200, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'back') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'calculate') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      osc.frequency.setValueAtTime(1760, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (err) {
    console.warn("Synth SFX could not play:", err);
  }
}

export function playQuestionSound(soundPath, sfxType = 'next', isMuted = false) {
  if (isMuted) return;

  if (soundPath) {
    const audio = new Audio(soundPath);
    audio.volume = 0.5;
    audio.play().catch(() => {
      playSynthSFX(sfxType);
    });
  } else {
    playSynthSFX(sfxType);
  }
}
