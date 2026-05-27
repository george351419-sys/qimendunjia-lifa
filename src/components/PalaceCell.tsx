import React from 'react';
import { QiMenResult, checkRuMu, checkJiXing, checkMenPo } from '../utils/qimen';
import { analyzeFourHarms, getDiLiByWuxing, getGanChangSheng, getGanChangShengJiXiong, ItemType } from '../utils/analysis';
import { analyzeGeJu, getGeJuColor } from '../utils/geJu';
import { FactorWeights, getMethodWeights } from '../utils/scoring';

interface PalaceCellProps {
  palaceNum: string;
  result: QiMenResult;
  showChangSheng: boolean;
  showGeJu: boolean;
  itemType: ItemType;
  scoreWeights?: FactorWeights;
  diLiRatio?: { palace: number; month: number };
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

type MarkerLevel = '吉' | '凶' | '平';

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

const SHEN_MARKER: Record<string, MarkerLevel> = {
  值符: '吉',
  腾蛇: '凶',
  螣蛇: '凶',
  太阴: '吉',
  六合: '吉',
  白虎: '凶',
  玄武: '凶',
  九地: '吉',
  九天: '吉',
};

const GAN_WUXING: Record<string, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};

const JiXiongStar: React.FC<{ level?: MarkerLevel }> = ({ level }) => {
  if (!level) return null;
  const isNeutral = level === '平';
  const color = level === '吉' ? '#2f9e44' : level === '凶' ? '#c96f6f' : '#9ca3af';
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute -right-1.5 -bottom-0.5 w-2 h-2"
      fill={isNeutral ? 'none' : 'currentColor'}
      stroke="currentColor"
      strokeWidth={isNeutral ? 2.6 : 0}
      style={{ color }}
      aria-label={`事上${level}`}
    >
      <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5z" />
    </svg>
  );
};

const scoreMarker = (level?: MarkerLevel) => {
  if (level === '吉') return 100;
  if (level === '平') return 50;
  return 0;
};

const scoreGeJu = (level: string) => {
  if (level.includes('吉')) return 100;
  if (level === '中性' || level === '平') return 50;
  if (level === '中性偏凶') return 30;
  return 0;
};

const scoreJiXiong = (level: string) => {
  if (level.includes('吉')) return 100;
  if (level === '平' || level === '中性') return 50;
  if (level === '中性偏凶') return 30;
  return 0;
};

const getPalaceScoreColor = (score: number) => {
  if (score >= 75) return '#15803d';
  if (score >= 55) return '#0f766e';
  if (score >= 40) return '#a16207';
  return '#dc2626';
};

const DayStar: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-700" fill="currentColor" stroke="currentColor" strokeWidth="0" aria-label="日干所在宫">
    <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5z" />
  </svg>
);

const HollowHourTriangle: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-teal-700" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-label="时干所在宫">
    <path d="M12 4l8 15H4z" />
  </svg>
);

const HorseMark: React.FC = () => (
  <span className="text-[13px] leading-none font-bold text-stone-600" aria-label="马星">
    马
  </span>
);

const MarkedText: React.FC<{
  children: React.ReactNode;
  level?: MarkerLevel;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, level, className = '', style }) => (
  <span className={`relative inline-flex items-center pr-1 leading-none ${className}`} style={style}>
    {children}
    <JiXiongStar level={level} />
  </span>
);

export const PalaceCell: React.FC<PalaceCellProps> = ({ palaceNum, result, showChangSheng, showGeJu, itemType, scoreWeights, diLiRatio }) => {
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
  const dayGan = result.siZhu.day[0];
  const hourGan = result.siZhu.time[0];
  const dayLookupGan = dayGan === '甲' ? result.dayXunShou : dayGan;
  const hourLookupGan = hourGan === '甲' ? result.xunShou : hourGan;
  const isDayGanInCenter = tianPan['5'] === dayLookupGan;
  const isHourGanInCenter = tianPan['5'] === hourLookupGan;
  const isRuiQinPalace = palaceNum !== '5' && normalizeStar(jiuXing[palaceNum] || '') === '天芮';
  const isDayGanPalace = isDayGanInCenter ? isRuiQinPalace : tianPan[palaceNum] === dayLookupGan;
  const isHourGanPalace = isHourGanInCenter ? isRuiQinPalace : tianPan[palaceNum] === hourLookupGan;
  const yongShenSymbols = YONG_SHEN_MAP[itemType] || [];
  const isYongShen = yongShenSymbols.some(symbol => symbol === men || symbol === shen || symbol === normalizeStar(jiuXing[palaceNum] || ''));
  
  const isZhiFuXing = xing === zhiFuXing || xing === '芮禽' && zhiFuXing === '天芮';
  const isZhiShiMen = men === zhiShiMen;

  const isRuMu = checkRuMu(tianGan, palaceNum);
  const isJiXing = checkJiXing(tianGan, palaceNum);
  const isMenPo = checkMenPo(men, palaceNum);
  const weights = scoreWeights || getMethodWeights('平均算法');
  const effectiveDiLiRatio = diLiRatio || { palace: 0.5, month: 0.5 };
  const shenMarker = SHEN_MARKER[shen];
  const xingMarker = STAR_MARKER[normalizeStar(jiuXing[palaceNum] || '')];
  const menMarker = MEN_MARKER[men];
  const palaceTianGans = Array.from(new Set([
    tianGan,
    isRuiQin ? zhongGongTianGan : '',
  ].filter(Boolean)));
  const geJuResults = palaceTianGans.length
    ? palaceTianGans.map(gan => analyzeGeJu({ result, gong: palaceNum, itemType, tianGan: gan }))
    : [analyzeGeJu({ result, gong: palaceNum, itemType })];
  const geJuScore = geJuResults.reduce((sum, item) => sum + scoreGeJu(item.finalJudgment), 0) / geJuResults.length;
  const geJuDisplay = Array.from(new Set(geJuResults.map(item => item.finalJudgment))).join('/');
  const geJuDisplayColor = geJuResults.length === 1 ? getGeJuColor(geJuResults[0].finalJudgment) : '#a16207';
  const geJuTitle = geJuResults.map(item => `${item.key} ${item.name}：${item.finalJudgment}。${item.reason}`).join('\n');
  const diLiScore = palaceTianGans.length
    ? palaceTianGans.reduce((sum, gan) => sum + getDiLiByWuxing(GAN_WUXING[gan], palaceNum, result.siZhu.month[1], '天干', effectiveDiLiRatio).score, 0) / palaceTianGans.length
    : 50;
  const changShengScore = palaceTianGans.length
    ? palaceTianGans.reduce((sum, gan) => sum + scoreJiXiong(getGanChangShengJiXiong(gan, palaceNum)), 0) / palaceTianGans.length
    : 50;
  const fourHarm = analyzeFourHarms(result, palaceNum, tianGan);
  const palaceRawScore =
    (scoreMarker(xingMarker) * weights.天时 +
      diLiScore * weights.地利 +
      scoreMarker(menMarker) * weights.人和 +
      scoreMarker(shenMarker) * weights.神助 +
      geJuScore * weights.格局 +
      changShengScore * weights.周期) * fourHarm.multiplier;
  const palaceScore = Math.min(100, palaceRawScore);
  const palaceScoreText = Number(palaceScore.toFixed(1));

  const getGanSpecialColor = (gan: string | undefined, fallback = '#1a1a1a') => {
    if (!gan) return fallback;
    const ruMu = checkRuMu(gan, palaceNum);
    const jiXing = checkJiXing(gan, palaceNum);
    if (ruMu && jiXing) return '#3b82f6';
    if (ruMu) return '#8a5a00';
    if (jiXing) return '#a855f7';
    return fallback;
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
      <span className={`relative inline-flex items-center justify-center w-10 h-7 leading-none ${className}`}>
        {showChangSheng && (
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 whitespace-nowrap">{getGanChangSheng(gan, palaceNum)}</span>
        )}
        <span className="text-sm" style={{ color }}>{gan}</span>
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

      {/* 左上角：马星标识 */}
      {isMaXing && (
        <div className={`absolute ${isKongWang ? 'top-7 left-1' : 'top-1 left-1'} w-6 h-6 flex items-center justify-center rounded-full bg-amber-50/90`}>
          <HorseMark />
        </div>
      )}

      {isYongShen && (
        <div className={`absolute ${(isDayGanPalace || isHourGanPalace) ? 'top-7' : 'top-1'} right-1 w-6 h-6 flex items-center justify-center`} title="用神">
          <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-sm" fill="none" aria-label="用神">
            <path d="M6 3.5v17" stroke="#b75f5f" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M7 4.5h10.5l-2.2 3 2.2 3H7z" fill="none" stroke="#c96f6f" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {isDayGanPalace && (
        <div className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center" title="日干所在宫">
          <DayStar />
        </div>
      )}

      {isHourGanPalace && (
        <div className={`absolute ${isDayGanPalace ? 'top-7' : 'top-1'} right-1 w-6 h-6 flex items-center justify-center`} title="时干所在宫">
          <HollowHourTriangle />
        </div>
      )}

      {showGeJu && (
        <div
          className="absolute right-1 bottom-1 text-[10px] leading-none font-bold bg-amber-50/90 px-1 py-0.5 rounded-sm"
          style={{ color: geJuDisplayColor }}
          title={geJuTitle}
        >
          {geJuDisplay}
        </div>
      )}

      <div
        className="absolute left-1 bottom-1 text-[10px] leading-none font-bold bg-amber-50/90 px-1 py-0.5 rounded-sm"
        style={{ color: getPalaceScoreColor(palaceScore) }}
        title="宫位分：按当前计分法计算八神、九星、地利、八门、格局、周期；入墓、击刑、门迫、空亡每项扣20分"
      >
        {palaceScoreText}
      </div>

      <div className="w-[18%]"></div>

      <div className="w-[31%] flex flex-col">
        <div className="h-1/3 flex items-center justify-start">
          <MarkedText level={shenMarker} className="text-sm text-gray-900">
            {shen}
          </MarkedText>
        </div>
        <div className="h-1/3 flex items-center justify-start">
          {xing && (
            <MarkedText level={xingMarker} className="text-sm" style={{ color: getXingColor(), fontWeight: isZhiFuXing ? 'bold' : 'normal' }}>
              {xing}
            </MarkedText>
          )}
        </div>
        <div className="h-1/3 flex items-center justify-start">
          {men && (
            <MarkedText level={menMarker} className="text-sm" style={{ color: getMenColor(), fontWeight: (isZhiShiMen || isMenPo) ? 'bold' : 'normal' }}>
              {men}
            </MarkedText>
          )}
        </div>
      </div>

      <div className="w-[3%]"></div>

      <div className="w-[34%] flex flex-col">
        <div className="h-1/3"></div>
        <div className="h-1/3 flex items-center justify-start">
          {isRuiQin && zhongGongTianGan && (
            <GanWithChangSheng gan={zhongGongTianGan} color={getGanSpecialColor(zhongGongTianGan, '#6b7280')} className="mr-1" />
          )}
          {palaceNum !== '5' && (
            <GanWithChangSheng gan={tianGan} color={getGanSpecialColor(tianGan)} />
          )}
        </div>
        <div className="h-1/3 flex items-center justify-start">
          <GanWithChangSheng gan={diGan} color={getGanSpecialColor(diGan, '#111827')} />
        </div>
      </div>

      <div className="w-[14%]"></div>
    </div>
  );
};
