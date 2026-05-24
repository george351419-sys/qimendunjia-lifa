import React, { useState, useEffect } from 'react';
import { InputPanel } from '../components/InputPanel';
import { InfoPanel } from '../components/InfoPanel';
import { PanGrid } from '../components/PanGrid';
import { AnalysisPanel } from '../components/AnalysisPanel';
import { analyzeQiMen, DetailedAnalysisResult, ItemType } from '../utils/analysis';
import { calculateQiMen, QiMenResult } from '../utils/qimen';

interface InputParams {
  content: string;
  type: ItemType;
  date: string;
  time: string;
}

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTimeInput = (date: Date) => {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
};

export default function Home() {
  const [params, setParams] = useState<InputParams>({
    content: '',
    type: '财运',
    date: '',
    time: ''
  });
  const [result, setResult] = useState<QiMenResult | null>(null);
  const [analysis, setAnalysis] = useState<DetailedAnalysisResult | null>(null);
  const [showChangSheng, setShowChangSheng] = useState(false);

  useEffect(() => {
    const now = new Date();
    setParams(p => ({ ...p, date: formatDateInput(now), time: formatTimeInput(now) }));
  }, []);

  const handleSubmit = () => {
    try {
      const date = new Date(`${params.date}T${params.time}`);
      const qimenResult = calculateQiMen(date, { purpose: params.type });
      setResult(qimenResult);
      setAnalysis(analyzeQiMen(qimenResult, params.type));
    } catch (error) {
      console.error('排盘错误:', error);
      alert('排盘失败，请检查日期格式');
    }
  };

  const handlePrevHour = () => {
    if (!result) return;
    const date = new Date(`${params.date}T${params.time}`);
    date.setHours(date.getHours() - 2);
    const dateStr = formatDateInput(date);
    const timeStr = formatTimeInput(date);
    setParams(p => ({ ...p, date: dateStr, time: timeStr }));
    const qimenResult = calculateQiMen(date, { purpose: params.type });
    setResult(qimenResult);
    setAnalysis(analyzeQiMen(qimenResult, params.type));
  };

  const handleNextHour = () => {
    if (!result) return;
    const date = new Date(`${params.date}T${params.time}`);
    date.setHours(date.getHours() + 2);
    const dateStr = formatDateInput(date);
    const timeStr = formatTimeInput(date);
    setParams(p => ({ ...p, date: dateStr, time: timeStr }));
    const qimenResult = calculateQiMen(date, { purpose: params.type });
    setResult(qimenResult);
    setAnalysis(analyzeQiMen(qimenResult, params.type));
  };

  return (
    <div className="min-h-screen py-6 px-4" style={{ backgroundColor: '#f5f0e1' }}>
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#c94043', letterSpacing: '0.1em' }}>
            奇门遁甲排盘
          </h1>
        </header>

        <div className="space-y-4">
          <InputPanel
            params={params}
            onChange={setParams}
            onSubmit={handleSubmit}
          />

          {result && (
            <>
              <InfoPanel
                result={result}
                content={params.content}
                type={params.type}
              />

              <PanGrid result={result} showChangSheng={showChangSheng} itemType={params.type} />

              <div className="flex justify-center gap-3 flex-wrap">
                <button
                  onClick={() => setShowChangSheng(show => !show)}
                  className={`px-4 py-2 text-white rounded ${showChangSheng ? 'bg-amber-700 hover:bg-amber-800' : 'bg-teal-600 hover:bg-teal-700'}`}
                >
                  长生状态
                </button>
                <button
                  onClick={handlePrevHour}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  上一局
                </button>
                <button
                  onClick={handleNextHour}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                >
                  下一局
                </button>
              </div>

              <div className="flex justify-center gap-3 flex-wrap mt-2">
                <div className="flex items-center gap-1 text-xs">
                  <span style={{ color: '#00bcd4' }}>值符/使</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span style={{ color: '#9b7a30' }}>入墓</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span style={{ color: '#a855f7' }}>击刑</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span style={{ color: '#dc2626' }}>门迫</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span style={{ color: '#3b82f6' }}>刑+墓</span>
                </div>
              </div>

              {analysis && <AnalysisPanel analysis={analysis} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
