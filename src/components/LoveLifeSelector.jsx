import React from 'react';
import { HeartOff, HeartCrack, CheckCircle2 } from 'lucide-react';

export default function LoveLifeSelector({ options, value, onChange }) {
  return (
    <div className="lovelife-container">
      <div className="options-list">
        {options.map((opt) => {
          const isSelected = value === opt.id;
          return (
            <div
              key={opt.id}
              className={`option-item-row ${isSelected ? 'selected-option' : ''}`}
              onClick={() => onChange(opt.id)}
            >
              <div className="option-left-content">
                <div className="option-icon-inline">
                  {opt.id === 'non-existent' ? (
                    <HeartOff size={22} className="text-red-500" />
                  ) : (
                    <HeartCrack size={22} className="text-amber-500" />
                  )}
                </div>
                <div className="option-text-group">
                  <h3 className="option-title">{opt.title}</h3>
                  <p className="option-desc">{opt.subtitle}</p>
                </div>
              </div>

              <div className="option-right-content">
                <span className="option-score-pill">{opt.scoreLabel}</span>
                {isSelected && <CheckCircle2 size={20} className="text-fire-accent" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
