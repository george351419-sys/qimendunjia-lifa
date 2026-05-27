import React from 'react';
import { FeedbackAccuracy } from '../utils/records';

interface FeedbackPanelProps {
  accuracy: FeedbackAccuracy;
  text: string;
  onAccuracyChange: (accuracy: FeedbackAccuracy) => void;
  onTextChange: (text: string) => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ accuracy, text, onAccuracyChange, onTextChange }) => {
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(event.target.value.slice(0, 1500));
  };

  return (
    <section className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-base font-bold text-amber-950">事后反馈</h3>
        <div className="text-xs text-amber-600">{text.length}/1500</div>
      </div>

      <div className="flex gap-3 mb-3">
        {(['准', '不准'] as const).map(option => (
          <button
            key={option}
            onClick={() => onAccuracyChange(accuracy === option ? '' : option)}
            className={`flex-1 py-2 rounded border text-sm font-bold transition-colors ${
              accuracy === option
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'bg-white/80 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={handleTextChange}
        maxLength={1500}
        rows={5}
        placeholder="可以记录事情后续、哪些判断准、哪些地方不准。"
        className="w-full px-3 py-2 border border-amber-300 rounded bg-white text-amber-900 placeholder-amber-400 focus:outline-none focus:border-amber-500 resize-y"
      />
    </section>
  );
};
