import React from 'react';
import { ItemType } from '../utils/analysis';

interface InputParams {
  content: string;
  type: ItemType;
  date: string;
  time: string;
}

interface InputPanelProps {
  params: InputParams;
  onChange: (params: InputParams) => void;
  onSubmit: () => void;
}

const ITEM_TYPES: ItemType[] = ['财运', '事业', '婚恋', '学习', '考试', '健康', '官非'];

export const InputPanel: React.FC<InputPanelProps> = ({ params, onChange, onSubmit }) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...params, content: e.target.value });
  };

  const handleTypeChange = (type: ItemType) => {
    onChange({ ...params, type });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...params, date: e.target.value });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...params, time: e.target.value });
  };

  const handleNow = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    onChange({ ...params, date: dateStr, time: timeStr });
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-bold text-amber-900 mb-4 text-center">奇门遁甲排盘</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-amber-800 text-sm mb-1">事项内容</label>
          <textarea
            value={params.content}
            onChange={handleContentChange}
            maxLength={300}
            placeholder="请输入您想询问的事项（非必填）"
            className="w-full px-3 py-2 border border-amber-300 rounded bg-white text-amber-900 placeholder-amber-400 focus:outline-none focus:border-amber-500"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-amber-800 text-sm mb-1">事项类型</label>
          <div className="grid grid-cols-4 gap-2">
            {ITEM_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  params.type === type
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-amber-800 text-sm mb-1">日期</label>
            <input
              type="date"
              value={params.date}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-amber-300 rounded bg-white text-amber-900 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-amber-800 text-sm mb-1">时间</label>
            <input
              type="time"
              value={params.time}
              onChange={handleTimeChange}
              className="w-full px-3 py-2 border border-amber-300 rounded bg-white text-amber-900 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-amber-800 text-sm mb-1">&nbsp;</label>
            <button
              onClick={handleNow}
              className="w-full px-3 py-2 bg-amber-200 text-amber-800 rounded hover:bg-amber-300 text-sm"
            >
              现在
            </button>
          </div>
        </div>

        <button
          onClick={onSubmit}
          className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded hover:from-amber-700 hover:to-amber-800 transition-all"
        >
          开始排盘
        </button>
      </div>
    </div>
  );
};
