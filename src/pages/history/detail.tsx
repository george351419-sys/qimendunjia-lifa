import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { InfoPanel } from '../../components/InfoPanel';
import { PanGrid } from '../../components/PanGrid';
import { AnalysisPanel } from '../../components/AnalysisPanel';
import { FeedbackPanel } from '../../components/FeedbackPanel';
import { ScoringTabs } from '../../components/ScoringTabs';
import { analyzeQiMen, DetailedAnalysisResult, ItemType } from '../../utils/analysis';
import { calculateQiMen, QiMenResult } from '../../utils/qimen';
import { FeedbackAccuracy, loadRecords, PanRecord, saveRecords } from '../../utils/records';
import { DEFAULT_CUSTOM_WEIGHTS, FactorWeights, getDiLiRatio, getMethodWeights, ScoringMethod } from '../../utils/scoring';

const ITEM_TYPES: ItemType[] = ['财运', '事业', '婚恋', '学习', '考试', '健康', '官非'];

export default function HistoryDetailPage() {
  const router = useRouter();
  const recordId = typeof router.query.id === 'string' ? router.query.id : '';
  const [records, setRecords] = useState<PanRecord[]>([]);
  const activeRecord = records.find(record => record.id === recordId) || null;
  const [content, setContent] = useState('');
  const [type, setType] = useState<ItemType>('财运');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [accuracy, setAccuracy] = useState<FeedbackAccuracy>('');
  const [feedbackText, setFeedbackText] = useState('');
  const [showChangSheng, setShowChangSheng] = useState(false);
  const [showGeJu, setShowGeJu] = useState(false);
  const [message, setMessage] = useState('');
  const [scoringMethod, setScoringMethod] = useState<ScoringMethod>('格局主导法');
  const [customWeights, setCustomWeights] = useState<FactorWeights>(DEFAULT_CUSTOM_WEIGHTS);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  useEffect(() => {
    if (!activeRecord) return;
    setContent(activeRecord.params.content);
    setType(activeRecord.params.type);
    setDate(activeRecord.params.date);
    setTime(activeRecord.params.time);
    setAccuracy(activeRecord.feedback.accuracy);
    setFeedbackText(activeRecord.feedback.text);
    setMessage('');
  }, [activeRecord?.id]);

  const preview = useMemo<{ result: QiMenResult; analysis: DetailedAnalysisResult } | null>(() => {
    if (!activeRecord || !date || !time) return null;
    try {
      const result = calculateQiMen(new Date(`${date}T${time}`), { purpose: type });
      return { result, analysis: analyzeQiMen(result, type, scoringMethod, customWeights) };
    } catch {
      return null;
    }
  }, [activeRecord, date, time, type, scoringMethod, customWeights]);

  const handleSave = () => {
    if (!activeRecord) return;
    const updated: PanRecord = {
      ...activeRecord,
      updatedAt: new Date().toISOString(),
      params: { content, type, date, time },
      feedback: { accuracy, text: feedbackText },
    };
    const nextRecords = records.map(record => record.id === updated.id ? updated : record);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    setMessage('修改已保存。');
  };

  const handleDelete = () => {
    if (!activeRecord) return;
    const nextRecords = records.filter(record => record.id !== activeRecord.id);
    saveRecords(nextRecords);
    router.push('/history');
  };

  return (
    <div className="min-h-screen py-6 px-4" style={{ backgroundColor: '#f5f0e1' }}>
      <div className="max-w-lg mx-auto space-y-4">
        <header className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: '#c94043', letterSpacing: '0.1em' }}>记录详情</h1>
          <div className="mt-2 flex justify-center gap-4 text-sm">
            <Link href="/history" className="text-teal-700 hover:text-teal-900">返回历史记录</Link>
            <Link href="/" className="text-teal-700 hover:text-teal-900">返回排盘</Link>
          </div>
        </header>

        {!activeRecord ? (
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center text-amber-800">
            没有找到这条记录。
          </section>
        ) : (
          <>
            <section className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-amber-950">修改记录</h2>
              <div>
                <label className="block text-amber-800 text-sm mb-1">事项内容</label>
                <textarea
                  value={content}
                  onChange={event => setContent(event.target.value.slice(0, 300))}
                  maxLength={300}
                  rows={2}
                  className="w-full px-3 py-2 border border-amber-300 rounded bg-white text-amber-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-amber-800 text-sm mb-1">事项类型</label>
                <div className="grid grid-cols-4 gap-2">
                  {ITEM_TYPES.map(item => (
                    <button
                      key={item}
                      onClick={() => setType(item)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        type === item ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-amber-800 text-sm mb-1">日期</label>
                  <input
                    type="date"
                    value={date}
                    onChange={event => setDate(event.target.value)}
                    className="w-full px-3 py-2 border border-amber-300 rounded bg-white text-amber-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-amber-800 text-sm mb-1">时间</label>
                  <input
                    type="time"
                    value={time}
                    onChange={event => setTime(event.target.value)}
                    className="w-full px-3 py-2 border border-amber-300 rounded bg-white text-amber-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </section>

            {preview && (
              <>
                <InfoPanel result={preview.result} content={content} type={type} />
                <ScoringTabs
                  method={scoringMethod}
                  customWeights={customWeights}
                  onMethodChange={setScoringMethod}
                  onCustomWeightsChange={setCustomWeights}
                />
                <PanGrid
                  result={preview.result}
                  showChangSheng={showChangSheng}
                  showGeJu={showGeJu}
                  itemType={type}
                  scoreWeights={getMethodWeights(scoringMethod, customWeights)}
                  diLiRatio={getDiLiRatio(scoringMethod)}
                />
                <div className="flex justify-center gap-3 flex-wrap">
                  <button
                    onClick={() => setShowChangSheng(show => !show)}
                    className={`px-4 py-2 text-white rounded ${showChangSheng ? 'bg-amber-700 hover:bg-amber-800' : 'bg-teal-600 hover:bg-teal-700'}`}
                  >
                    长生状态
                  </button>
                  <button
                    onClick={() => setShowGeJu(show => !show)}
                    className={`px-4 py-2 text-white rounded ${showGeJu ? 'bg-amber-700 hover:bg-amber-800' : 'bg-teal-600 hover:bg-teal-700'}`}
                  >
                    格局吉凶
                  </button>
                </div>
                <AnalysisPanel analysis={preview.analysis} />
              </>
            )}

            <FeedbackPanel
              accuracy={accuracy}
              text={feedbackText}
              onAccuracyChange={setAccuracy}
              onTextChange={setFeedbackText}
            />

            <div className="flex justify-center gap-3 flex-wrap pb-6">
              <button onClick={handleSave} className="px-5 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
                保存修改
              </button>
              <button onClick={handleDelete} className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                删除记录
              </button>
              {message && <div className="w-full text-center text-sm text-teal-700">{message}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
