import React from 'react';
import { QiMenResult } from '../utils/qimen';

interface InfoPanelProps {
  result: QiMenResult;
  content?: string;
  type?: string;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ result, content, type }) => {
  const { siZhu, juShu, zhiFuXing, zhiShiMen, kongWangZhi, maStar, xunShou, specialGe } = result;

  type MarkerLevel = '吉' | '凶' | '平';

  const STAR_MARKER: Record<string, MarkerLevel> = {
    天蓬: '凶',
    天任: '吉',
    天冲: '吉',
    天辅: '吉',
    天英: '凶',
    天芮: '凶',
    天禽: '吉',
    天柱: '凶',
    天心: '吉',
  };

  const MEN_MARKER: Record<string, MarkerLevel> = {
    休门: '吉',
    生门: '吉',
    伤门: '凶',
    杜门: '平',
    景门: '平',
    死门: '凶',
    惊门: '凶',
    开门: '吉',
  };

  const JiXiongStar: React.FC<{ level?: MarkerLevel }> = ({ level }) => {
    if (!level) return null;
    const isNeutral = level === '平';
    const color = level === '吉' ? '#2f9e44' : level === '凶' ? '#c96f6f' : '#9ca3af';
    return (
      <svg
        viewBox="0 0 24 24"
        className="absolute -right-2 -bottom-0.5 w-2.5 h-2.5"
        fill={isNeutral ? 'none' : 'currentColor'}
        stroke="currentColor"
        strokeWidth={isNeutral ? 2.5 : 0}
        style={{ color }}
        aria-label={`事上${level}`}
      >
        <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5z" />
      </svg>
    );
  };

  const MarkedValue: React.FC<{ children: React.ReactNode; level?: MarkerLevel }> = ({ children, level }) => (
    <span className="relative inline-flex items-center pr-2 leading-none">
      {children}
      <JiXiongStar level={level} />
    </span>
  );
  
  const valueColor = '#1a1a1a';

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 shadow-md">
      {content && (
        <div className="mb-3 pb-2 border-b border-amber-200">
          <span className="text-amber-800 font-medium">事项：</span>
          <span className="text-amber-700">{content}</span>
        </div>
      )}

      <div className="mb-3">
        <span className="text-amber-800 font-medium">日期：</span>
        <span className="text-amber-700">{result.basicInfo.lunarDate}</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center">
          <div className="text-amber-500 text-xs">年柱</div>
          <div className="text-lg font-bold" style={{ color: valueColor }}>{siZhu.year}</div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">月柱</div>
          <div className="text-lg font-bold" style={{ color: valueColor }}>{siZhu.month}</div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">日柱</div>
          <div className="text-lg font-bold" style={{ color: valueColor }}>{siZhu.day}</div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">时柱</div>
          <div className="text-lg font-bold" style={{ color: valueColor }}>{siZhu.time}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3 text-sm">
        <div></div>
        <div className="text-center">
          <span className="text-amber-800">节气：</span>
          <span style={{ color: valueColor }}>{juShu.jieQiName}</span>
        </div>
        <div></div>
        <div className="text-center">
          <span className="text-amber-800">空亡：</span>
          <span style={{ color: valueColor }}>{kongWangZhi.join(' ')}</span>
        </div>
      </div>

      {specialGe && specialGe.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3 text-sm">
          <div></div>
          <div className="col-span-2 text-center">
            <span className="text-amber-800">特殊格：</span>
            <span style={{ color: valueColor }}>{specialGe.join('、')}</span>
          </div>
          <div></div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 text-sm">
        <div className="text-center">
          <div className="text-amber-500 text-xs">旬首</div>
          <div className="font-bold" style={{ color: valueColor }}>
            {xunShou}
          </div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">值符</div>
          <div className="font-bold" style={{ color: '#00bcd4' }}>
            <MarkedValue level={STAR_MARKER[zhiFuXing]}>
              {zhiFuXing}
            </MarkedValue>
          </div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">值使</div>
          <div className="font-bold" style={{ color: '#00bcd4' }}>
            <MarkedValue level={MEN_MARKER[zhiShiMen]}>
              {zhiShiMen}
            </MarkedValue>
          </div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">马星</div>
          <div className="font-bold" style={{ color: valueColor }}>{maStar.zhi}</div>
        </div>
      </div>
    </div>
  );
};
