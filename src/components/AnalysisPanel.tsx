import React from 'react';
import { DetailedAnalysisResult, SubjectAnalysis } from '../utils/analysis';

interface AnalysisPanelProps {
  analysis: DetailedAnalysisResult;
}

const getJiXiongColor = (value: string): string => {
  if (value.includes('吉')) return '#15803d';
  if (value === '平') return '#a16207';
  return '#dc2626';
};

const getScoreColor = (score: number): string => {
  if (score >= 75) return '#15803d';
  if (score >= 55) return '#0f766e';
  if (score >= 40) return '#a16207';
  return '#dc2626';
};

const SubjectBlock: React.FC<{ subject: SubjectAnalysis }> = ({ subject }) => (
  <section className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <h3 className="text-base font-bold text-amber-950">{subject.title}</h3>
        <div className="text-xs text-amber-700 mt-1">所在宫位：{subject.palace}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-amber-600">评分</div>
        <div className="text-xl font-bold" style={{ color: getScoreColor(subject.score) }}>{subject.score}</div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-amber-100 text-amber-900">
            <th className="text-left p-2 border border-amber-200 whitespace-nowrap">类别</th>
            <th className="text-left p-2 border border-amber-200 whitespace-nowrap">情况</th>
            <th className="text-left p-2 border border-amber-200 whitespace-nowrap">吉凶</th>
            <th className="text-left p-2 border border-amber-200 min-w-[12rem]">体现</th>
            <th className="text-left p-2 border border-amber-200 min-w-[7rem]">注意</th>
          </tr>
        </thead>
        <tbody>
          {subject.rows.map((row, index) => (
            <tr key={`${row.category}-${index}`} className="bg-white/70">
              <td className="p-2 border border-amber-100 text-amber-900 whitespace-nowrap">{row.category}</td>
              <td className="p-2 border border-amber-100 text-stone-800 whitespace-nowrap">{row.situation}</td>
              <td className="p-2 border border-amber-100 font-bold whitespace-nowrap" style={{ color: getJiXiongColor(row.jiXiong) }}>{row.jiXiong}</td>
              <td className="p-2 border border-amber-100 text-stone-700 leading-relaxed">{row.meaning}</td>
              <td className="p-2 border border-amber-100 text-stone-700 leading-relaxed">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {subject.notes.length > 0 && (
      <div className="mt-3 space-y-1">
        {subject.notes.map((note, index) => (
          <div key={index} className="text-sm text-red-700 leading-relaxed">
            此外，注意：{note}
          </div>
        ))}
      </div>
    )}
  </section>
);

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis }) => {
  const { relation } = analysis;

  return (
    <div className="space-y-4">
      <SubjectBlock subject={analysis.riGan} />
      <SubjectBlock subject={analysis.shiGan} />
      <SubjectBlock subject={analysis.yongShen} />

      <section className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 shadow-md">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base font-bold text-amber-950">关系定吉凶</h3>
            <div className="text-xs text-amber-700 mt-1">{relation.basis}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-amber-600">综合评分</div>
            <div className="text-xl font-bold" style={{ color: getScoreColor(relation.score) }}>{relation.score}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[6rem_12rem_1fr] border border-amber-200 text-sm">
          <div className="p-2 bg-amber-100 text-amber-900 font-bold border-b md:border-b-0 md:border-r border-amber-200">吉凶关系</div>
          <div className="p-2 bg-white/80 font-bold border-b md:border-b-0 md:border-r border-amber-100" style={{ color: getJiXiongColor(relation.conclusion) }}>{relation.conclusion}</div>
          <div className="p-2 bg-white/80 text-stone-700">{relation.wuxingRelation}</div>
          <div className="p-2 bg-amber-100 text-amber-900 font-bold md:border-r border-amber-200">释义</div>
          <div className="p-2 bg-white/80 text-stone-700 md:col-span-2 leading-relaxed">{relation.meaning}</div>
        </div>
      </section>
    </div>
  );
};
