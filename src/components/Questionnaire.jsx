import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Video,
  Moon,
  BookOpen,
  FileText,
  Smartphone,
  Skull,
  BarChart3,
  IndianRupee,
  HeartHandshake
} from 'lucide-react';
import LoveLifeSelector from './LoveLifeSelector';
import { playQuestionSound, getMatchingStatusVideo } from '../config/mediaConfig';

const iconMap = {
  Moon,
  BookOpen,
  FileText,
  Smartphone,
  Skull,
  BarChart3,
  IndianRupee,
  HeartHandshake
};

export default function Questionnaire({
  questions,
  currentIndex,
  answers,
  onAnswerChange,
  onNext,
  onBack,
  isMuted,
  toggleMute
}) {
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentAnswer = answers[currentQuestion.id] ?? '';

  const [validationError, setValidationError] = useState('');
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const IconComponent = iconMap[currentQuestion.iconName] || HelpCircle;

  // Validate answer
  const isAnswerValid = () => {
    if (currentQuestion.type === 'options') {
      return Boolean(currentAnswer);
    }
    if (currentAnswer === '' || currentAnswer === null || currentAnswer === undefined) {
      return false;
    }
    const val = Number(currentAnswer);
    if (isNaN(val) || val < 0) return false;
    return true;
  };

  // Compute live cumulative cooked score up to the current question
  const calculateLiveCumulativeScore = () => {
    let sumScores = 0;
    let count = 0;

    for (let i = 0; i <= currentIndex; i++) {
      const q = questions[i];
      let val = answers[q.id];

      if (i === currentIndex) {
        if (isAnswerValid()) {
          val = currentAnswer;
        } else {
          continue;
        }
      }

      if (val !== undefined && val !== null && val !== '') {
        const score = q.scoringFunction(val);
        sumScores += score;
        count++;
      }
    }

    if (count === 0) return 0;
    return Math.round((sumScores / count) * 10) / 10;
  };

  const cumulativeScore = calculateLiveCumulativeScore();
  const matchedVideoConfig = getMatchingStatusVideo(cumulativeScore, currentIndex);

  useEffect(() => {
    setVideoError(false);
  }, [matchedVideoConfig?.video]);

  const handleNextClick = () => {
    if (!isAnswerValid()) {
      if (currentQuestion.type === 'numeric') {
        setValidationError('Please enter a valid non-negative number before proceeding!');
      } else {
        setValidationError('Please select one option to evaluate your cooked status!');
      }
      return;
    }
    setValidationError('');
    setVideoError(false);
    
    const sfxType = isLastQuestion ? 'calculate' : 'next';
    playQuestionSound(currentQuestion.sound, sfxType, isMuted);
    
    onNext();
  };

  const handleBackClick = () => {
    setValidationError('');
    setVideoError(false);
    playQuestionSound(null, 'back', isMuted);
    onBack();
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    onAnswerChange(currentQuestion.id, val);
    if (validationError) setValidationError('');
  };

  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const liveMeme = currentQuestion.getDynamicMeme(currentAnswer);

  return (
    <div className="questionnaire-container fade-in">
      {/* Top Header & Progress */}
      <div className="questionnaire-header">
        <div className="header-info">
          <span className="question-counter">
            Question <span className="text-fire-highlight">{currentIndex + 1}</span> of {totalQuestions}
          </span>
          <span className="progress-badge">{progressPercentage}% Complete</span>
        </div>

        <div className="header-actions">
          <button
            className="icon-btn-mute"
            onClick={toggleMute}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="questionnaire-grid">
        {/* Left Column: Question Input & Controls */}
        <div className="question-column">
          <div className="question-category-tag">
            <IconComponent size={18} className="text-fire-accent" />
            <span>METRIC {currentIndex + 1} OF 8</span>
          </div>

          <h2 className="question-title">{currentQuestion.title}</h2>
          <p className="question-subtitle">{currentQuestion.subtitle}</p>

          {/* Input Area */}
          <div className="input-area">
            {currentQuestion.type === 'numeric' ? (
              <div className="input-group">
                <input
                  type="number"
                  min={currentQuestion.min ?? 0}
                  max={currentQuestion.max ?? 10000}
                  step={currentQuestion.step ?? 1}
                  value={currentAnswer}
                  onChange={handleInputChange}
                  placeholder={currentQuestion.placeholder}
                  className="large-number-input"
                  autoFocus
                />
                <span className="input-unit-badge">{currentQuestion.unit}</span>
              </div>
            ) : (
              <LoveLifeSelector
                options={currentQuestion.options}
                value={currentAnswer}
                onChange={(val) => {
                  onAnswerChange(currentQuestion.id, val);
                  if (validationError) setValidationError('');
                }}
              />
            )}
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="validation-error-box slide-up">
              <AlertCircle size={18} />
              <span>{validationError}</span>
            </div>
          )}

          {/* Live Meme Tip */}
          <div className="meme-reaction-box">
            <Sparkles size={16} className="text-amber" />
            <p>{liveMeme}</p>
          </div>

          {/* Navigation Controls */}
          <div className="navigation-actions">
            <button
              className="nav-btn btn-secondary"
              onClick={handleBackClick}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={20} />
              <span>BACK</span>
            </button>

            <button
              className={`nav-btn btn-primary ${isLastQuestion ? 'btn-danger-fire' : ''}`}
              onClick={handleNextClick}
              disabled={!isAnswerValid()}
            >
              <span>{isLastQuestion ? "CALCULATE MY DAMAGE 🔥" : "NEXT"}</span>
              {!isLastQuestion && <ChevronRight size={20} />}
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Status Video Panel */}
        <div className="media-column">
          <div className="media-card-wrapper">
            <div className="media-header-bar">
              <div className="media-title-badge">
                <Video size={16} className="text-fire-accent pulse-animation" />
                <span>CURRENT STATUS VIDEO</span>
              </div>
              <div className="cumulative-score-tag">
                <span>Cooked: </span>
                <strong className="text-fire-highlight">{cumulativeScore.toFixed(1)}%</strong>
              </div>
            </div>

            {/* Video Player Display Area */}
            <div className="media-display-area video-display-box">
              {!videoError && matchedVideoConfig?.video ? (
                <video
                  ref={videoRef}
                  key={matchedVideoConfig.video}
                  controls
                  playsInline
                  autoPlay
                  loop
                  muted={isMuted}
                  className="status-video-player"
                  onError={() => setVideoError(true)}
                >
                  <source src={matchedVideoConfig.video} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              ) : (
                <div className="video-placeholder-card">
                  <div className="placeholder-icon-wrapper">
                    <Video size={42} className="text-fire-accent opacity-80" />
                  </div>
                  <h3 className="placeholder-title">{matchedVideoConfig?.title || 'Status Video'}</h3>
                  <p className="placeholder-sub">{matchedVideoConfig?.description || 'Active Range'}</p>
                  
                  <div className="video-path-info">
                    <span>Configured Video Path:</span>
                    <code>{matchedVideoConfig?.video || '/media/status-video-1.mp4'}</code>
                  </div>
                  <span className="audio-note">
                    {isMuted ? "🔇 Audio Muted (Use top button to unmute)" : "🔊 Video Audio Enabled"}
                  </span>
                </div>
              )}
            </div>

            <div className="media-footer-caption">
              <span className="video-tier-label">{matchedVideoConfig?.title}</span>
              <p className="caption-text">"Video adjusts live based on your cumulative cooked %."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
