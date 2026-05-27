import React, { useState } from 'react';
import {
  DEFAULT_CUSTOM_WEIGHTS,
  FACTOR_EXPLANATIONS,
  FactorWeights,
  formatPercent,
  getMethodWeights,
  METHOD_EXPLANATIONS,
  ScoreFactor,
  SCORE_FACTORS,
  ScoringMethod,
} from '../utils/scoring';

interface ScoringTabsProps {
  method: ScoringMethod;
  customWeights: FactorWeights;
  onMethodChange: (method: ScoringMethod) => void;
  onCustomWeightsChange: (weights: FactorWeights) => void;
}

const METHODS: ScoringMethod[] = ['格局主导法', '天地人主导法', '地利旺衰主导法', '平均算法', '自定义法'];

export const ScoringTabs: React.FC<ScoringTabsProps> = ({ method, customWeights, onMethodChange, onCustomWeightsChange }) => {
  const [tip, setTip] = useState<{ title: string; text: string } | null>(null);
  const activeWeights = getMethodWeights(method, customWeights);
  const customTotal = SCORE_FACTORS.reduce((sum, factor) => sum + customWeights[factor], 0);

  const updateCustomWeight = (factor: ScoreFactor, value: string) => {
    const percent = Math.max(0, Number(value) || 0);
    onCustomWeightsChange({ ...customWeights, [factor]: percent / 100 });
  };

  return (
    <section className="bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-sm">
      <div className="grid grid-cols-3 gap-1 mb-3">
        {METHODS.map(item => (
          <button
            key={item}
            onClick={() => onMethodChange(item)}
            className={`px-2 py-2 rounded text-xs font-bold transition-colors ${
              method === item ? 'bg-teal-600 text-white' : 'bg-white/80 text-amber-800 hover:bg-amber-100'
            }`}
            title={METHOD_EXPLANATIONS[item]}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        {SCORE_FACTORS.map(factor => (
          <button
            key={factor}
            onClick={() => setTip({ title: factor, text: FACTOR_EXPLANATIONS[factor] })}
            className="rounded border border-amber-100 bg-white/75 px-2 py-1 text-left text-amber-900 hover:bg-amber-100"
          >
            <span className="font-bold">{factor}</span>
            <span className="ml-1 text-teal-700">{formatPercent(activeWeights[factor])}</span>
          </button>
        ))}
      </div>

      <div className="mt-2 text-xs leading-relaxed text-amber-700">
        {METHOD_EXPLANATIONS[method]}
      </div>

      {method === '自定义法' && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          {SCORE_FACTORS.map(factor => (
            <label key={factor} className="block text-amber-800">
              {factor}
              <input
                type="number"
                min={0}
                step={1}
                value={Number((customWeights[factor] * 100).toFixed(1))}
                onChange={event => updateCustomWeight(factor, event.target.value)}
                className="mt-1 w-full rounded border border-amber-300 bg-white px-2 py-1 text-amber-900 focus:outline-none focus:border-amber-500"
              />
            </label>
          ))}
          <button
            onClick={() => onCustomWeightsChange(DEFAULT_CUSTOM_WEIGHTS)}
            className="col-span-2 rounded bg-amber-100 px-2 py-1 text-amber-800 hover:bg-amber-200"
          >
            恢复默认
          </button>
          <div className={`rounded px-2 py-1 text-center ${Math.abs(customTotal - 1) < 0.001 ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-700'}`}>
            合计 {formatPercent(customTotal)}
          </div>
        </div>
      )}

      {tip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={() => setTip(null)}>
          <div className="max-w-sm rounded-lg bg-amber-50 border border-amber-200 p-4 shadow-lg" onClick={event => event.stopPropagation()}>
            <div className="mb-2 font-bold text-amber-950">{tip.title}</div>
            <div className="text-sm leading-relaxed text-stone-700">{tip.text}</div>
            <button onClick={() => setTip(null)} className="mt-3 w-full rounded bg-teal-600 py-2 text-sm text-white hover:bg-teal-700">
              知道了
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
