import React from 'react';
import { QiMenResult } from '../utils/qimen';

interface InfoPanelProps {
  result: QiMenResult;
  content?: string;
  type?: string;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ result, content, type }) => {
  const { siZhu, juShu, zhiFuGong, zhiFuXing, zhiShiGong, zhiShiMen, kongWangZhi, maStar, xunShou } = result;
  
  const gongInfo = (gongNum: string) => {
    const names: Record<string, string> = {
      '1': '坎', '2': '坤', '3': '震', '4': '巽',
      '5': '中', '6': '乾', '7': '兑', '8': '艮', '9': '离'
    };
    return names[gongNum] || '';
  };

  const getWuXingColor = (gan: string) => {
    const wuXingColors: Record<string, string> = {
      '甲': '#22c55e', '乙': '#22c55e', // 木 - 绿色
      '丙': '#ef4444', '丁': '#ef4444', // 火 - 红色
      '戊': '#c4a35a', '己': '#c4a35a', // 土 - 土黄色
      '庚': '#ffd700', '辛': '#ffd700', // 金 - 金色
      '壬': '#3b82f6', '癸': '#3b82f6'  // 水 - 蓝色
    };
    return wuXingColors[gan] || '#1a1a1a';
  };

  const getGanColor = (ganZhu: string) => {
    const gan = ganZhu[0];
    return getWuXingColor(gan);
  };

  const getZhiColor = (ganZhu: string) => {
    const zhi = ganZhu[1];
    const zhiWuXing: Record<string, string> = {
      '子': '#3b82f6', '丑': '#c4a35a', '寅': '#22c55e', '卯': '#22c55e', // 水土木木
      '辰': '#c4a35a', '巳': '#ef4444', '午': '#ef4444', '未': '#c4a35a', // 土火火土
      '申': '#ffd700', '酉': '#ffd700', '戌': '#c4a35a', '亥': '#3b82f6'  // 金金土水
    };
    return zhiWuXing[zhi] || '#1a1a1a';
  };

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
          <div className="text-lg font-bold">
            <span style={{ color: getGanColor(siZhu.year) }}>{siZhu.year[0]}</span>
            <span style={{ color: getZhiColor(siZhu.year) }}>{siZhu.year[1]}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">月柱</div>
          <div className="text-lg font-bold">
            <span style={{ color: getGanColor(siZhu.month) }}>{siZhu.month[0]}</span>
            <span style={{ color: getZhiColor(siZhu.month) }}>{siZhu.month[1]}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">日柱</div>
          <div className="text-lg font-bold">
            <span style={{ color: getGanColor(siZhu.day) }}>{siZhu.day[0]}</span>
            <span style={{ color: getZhiColor(siZhu.day) }}>{siZhu.day[1]}</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">时柱</div>
          <div className="text-lg font-bold">
            <span style={{ color: getGanColor(siZhu.time) }}>{siZhu.time[0]}</span>
            <span style={{ color: getZhiColor(siZhu.time) }}>{siZhu.time[1]}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3 text-sm">
        <div></div>
        <div className="text-center">
          <span className="text-amber-800">节气：</span>
          <span className="text-amber-700">{juShu.jieQiName}</span>
        </div>
        <div></div>
        <div className="text-center">
          <span className="text-amber-800">空亡：</span>
          <span className="text-amber-700">{kongWangZhi.join(' ')}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-sm">
        <div className="text-center">
          <div className="text-amber-500 text-xs">旬首</div>
          <div className="font-bold" style={{ color: getWuXingColor(xunShou[0]) }}>
            {xunShou}
          </div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">值符</div>
          <div className="font-bold" style={{ color: '#00bcd4' }}>{zhiFuXing}</div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">值使</div>
          <div className="font-bold" style={{ color: '#00bcd4' }}>{zhiShiMen}</div>
        </div>
        <div className="text-center">
          <div className="text-amber-500 text-xs">马星</div>
          <div className="font-bold" style={{ color: getZhiColor(maStar.zhi) }}>{maStar.zhi}</div>
        </div>
      </div>
    </div>
  );
};
