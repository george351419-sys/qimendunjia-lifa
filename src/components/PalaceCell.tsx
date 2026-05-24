import React from 'react';
import { QiMenResult, checkRuMu, checkJiXing, checkMenPo } from '../utils/qimen';
import { getGanChangSheng, ItemType } from '../utils/analysis';

interface PalaceCellProps {
  palaceNum: string;
  result: QiMenResult;
  showChangSheng: boolean;
  itemType: ItemType;
}

const YONG_SHEN_MAP: Record<ItemType, string[]> = {
  财运: ['生门'],
  事业: ['开门'],
  婚恋: ['六合'],
  学习: ['天辅'],
  考试: ['景门'],
  健康: ['天芮'],
  官非: ['白虎', '惊门'],
};

const normalizeStar = (star: string) => {
  if (star.includes('天芮')) return '天芮';
  if (star.includes('天禽')) return '天禽';
  return star;
};

export const PalaceCell: React.FC<PalaceCellProps> = ({ palaceNum, result, showChangSheng, itemType }) => {
  const { tianPan, jiuXing, baMen, baShen, diPan, zhiFuGong, zhiFuXing, zhiShiGong, zhiShiMen, kongWangGong, maStar } = result;
  const shen = baShen[palaceNum];
  const men = baMen[palaceNum];
  let xing = jiuXing[palaceNum];
  
  const isRuiQin = xing === '天芮(天禽)';
  if (isRuiQin) xing = '芮禽';
  
  const tianGan = tianPan[palaceNum];
  const diGan = diPan[palaceNum];
  
  const zhongGongTianGan = tianPan['5'];
  const zhongGongDiGan = diPan['5'];

  const isKongWang = kongWangGong.includes(palaceNum);
  const isMaXing = palaceNum === maStar.gong;
  const yongShenSymbols = YONG_SHEN_MAP[itemType] || [];
  const isYongShen = yongShenSymbols.some(symbol => symbol === men || symbol === shen || symbol === normalizeStar(jiuXing[palaceNum] || ''));
  
  const isZhiFuXing = xing === zhiFuXing || xing === '芮禽' && zhiFuXing === '天芮';
  const isZhiShiMen = men === zhiShiMen;

  const isRuMu = checkRuMu(tianGan, palaceNum);
  const isJiXing = checkJiXing(tianGan, palaceNum);
  const isMenPo = checkMenPo(men, palaceNum);

  const zhongGongIsRuMu = zhongGongTianGan ? checkRuMu(zhongGongTianGan, palaceNum) : false;
  const zhongGongIsJiXing = zhongGongTianGan ? checkJiXing(zhongGongTianGan, palaceNum) : false;

  const getTianGanColor = () => {
    if (isRuMu && isJiXing) return '#3b82f6';
    if (isRuMu) return '#9b7a30';
    if (isJiXing) return '#a855f7';
    return '#1a1a1a';
  };

  const getZhongGongTianGanColor = () => {
    if (!zhongGongTianGan) return '#6b7280';
    if (zhongGongIsRuMu && zhongGongIsJiXing) return '#3b82f6';
    if (zhongGongIsRuMu) return '#9b7a30';
    if (zhongGongIsJiXing) return '#a855f7';
    return '#6b7280';
  };

  const getXingColor = () => {
    if (isZhiFuXing) return '#00bcd4';
    return '#1a1a1a';
  };

  const getMenColor = () => {
    if (isMenPo) return '#dc2626';
    if (isZhiShiMen) return '#00bcd4';
    return '#1a1a1a';
  };

  const GanWithChangSheng = ({
    gan,
    color,
    className = '',
  }: {
    gan?: string;
    color: string;
    className?: string;
  }) => {
    if (!gan) return null;
    return (
      <span className={`relative inline-flex items-center justify-center w-12 h-8 leading-none ${className}`}>
        {showChangSheng && (
          <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 whitespace-nowrap">{getGanChangSheng(gan, palaceNum)}</span>
        )}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm" style={{ color }}>{gan}</span>
      </span>
    );
  };

  return (
    <div className="relative w-full aspect-square overflow-hidden bg-amber-50 flex">
      {/* 左上角：空亡标识 */}
      {isKongWang && (
        <div className="absolute top-0 left-0 w-7 h-7 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
      )}

      {/* 右上角：马星标识 */}
      {isMaXing && (
        <div className={`absolute ${isYongShen ? 'top-8' : 'top-1'} right-1 w-8 h-8 flex items-center justify-center`}>
          <img src="/horse.png" alt="马星" className="w-7 h-7 object-contain" />
        </div>
      )}

      {isYongShen && (
        <div className="absolute top-1 right-1 h-6 min-w-6 px-1 rounded-sm bg-red-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
          用
        </div>
      )}

      <div className="w-[18%]"></div>

      <div className="w-[31%] flex flex-col">
        <div className="h-1/3 flex items-center justify-start">
          <span className="text-sm text-gray-900">{shen}</span>
        </div>
        <div className="h-1/3 flex items-center justify-start">
          {xing && <span className="text-sm" style={{ color: getXingColor(), fontWeight: isZhiFuXing ? 'bold' : 'normal' }}>{xing}</span>}
        </div>
        <div className="h-1/3 flex items-center justify-start">
          {men && <span className="text-sm" style={{ color: getMenColor(), fontWeight: (isZhiShiMen || isMenPo) ? 'bold' : 'normal' }}>{men}</span>}
        </div>
      </div>

      <div className="w-[3%]"></div>

      <div className="w-[34%] flex flex-col">
        <div className="h-1/3"></div>
        <div className="h-1/3 flex items-center justify-start">
          {isRuiQin && zhongGongTianGan && (
            <GanWithChangSheng gan={zhongGongTianGan} color={getZhongGongTianGanColor()} className="mr-1" />
          )}
          {palaceNum !== '5' && (
            <GanWithChangSheng gan={tianGan} color={getTianGanColor()} />
          )}
        </div>
        <div className="h-1/3 flex items-center justify-start">
          <GanWithChangSheng gan={diGan} color="#111827" />
        </div>
      </div>

      <div className="w-[14%]"></div>
    </div>
  );
};
