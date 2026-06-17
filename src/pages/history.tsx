import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadRecords, PanRecord } from '../utils/records';

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('zh-CN', { hour12: false });
};

export default function HistoryPage() {
  const [records, setRecords] = useState<PanRecord[]>([]);

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  return (
    <div className="min-h-screen py-6 px-4" style={{ backgroundColor: '#f5f0e1' }}>
      <div className="max-w-lg mx-auto space-y-4">
        <header className="text-center">
          <h1 className="text-2xl font-bold" style={{ color: '#c94043', letterSpacing: '0.1em' }}>历史记录</h1>
          <Link href="/" className="inline-block mt-2 text-sm text-teal-700 hover:text-teal-900">
            返回排盘
          </Link>
        </header>

        {records.length === 0 ? (
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center text-amber-800">
            还没有保存过记录。
          </section>
        ) : (
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-sm">
            <div className="space-y-2">
              {records.map(record => (
                <Link
                  key={record.id}
                  href={`/history/detail?id=${record.id}`}
                  className="block w-full text-left p-3 rounded border bg-white/80 border-amber-100 hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold text-amber-950 truncate">
                      {record.params.content || `${record.params.type}事项`}
                    </div>
                    <div className="text-xs text-teal-700 whitespace-nowrap">{record.feedback.accuracy || '未反馈'}</div>
                  </div>
                  <div className="mt-1 text-xs text-amber-700">
                    {record.params.type} · {record.params.date} {record.params.time}
                  </div>
                  <div className="mt-1 text-xs text-stone-500">
                    保存：{formatDateTime(record.createdAt)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
