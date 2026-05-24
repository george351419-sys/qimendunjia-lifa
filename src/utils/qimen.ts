// @ts-nocheck
import { Lunar, Solar } from 'lunar-javascript';

export interface JiuGongInfo {
  gongNumber: string;
  gongName: string;
  direction: string;
  element: string;
  xing: string;
  xingAlias: string;
  xingFeature: string;
  men: string;
  menFeature: string;
  shen: string;
  shenFeature: string;
  jiXiong: string;
  jiXiongText: string;
  explain: string;
}

export interface SiZhu {
  year: string;
  month: string;
  day: string;
  time: string;
}

export interface JuShu {
  jieQiName: string;
  type: 'yang' | 'yin';
  number: string;
  yuan: string;
  fullName: string;
  formatCode: string;
}

export interface AnalysisResult {
  overallJiXiong: string;
  overallJiXiongText: string;
  bestGong: string;
  suggestions: string[];
}

export interface QiMenResult {
  basicInfo: {
    date: string;
    lunarDate: string;
    type: string;
    method: string;
    purpose: string;
    location: string;
  };
  siZhu: SiZhu;
  juShu: JuShu;
  xunShou: string;
  dayXunShou: string;
  luoGongGan: string;
  tianPan: Record<string, string>;
  jiuXing: Record<string, string>;
  baMen: Record<string, string>;
  baShen: Record<string, string>;
  diPan: Record<string, string>;
  zhiFuGong: string;
  zhiFuYuanGong: string;
  zhiFuXing: string;
  zhiShiGong: string;
  zhiShiMen: string;
  kongWangZhi: string[];
  kongWangGong: string[];
  maStar: { zhi: string; gong: string };
  jiuGongAnalysis: Record<string, JiuGongInfo>;
  analysis: AnalysisResult;
}

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const JIU_GONG: any = {
  '1': { name: '坎', direction: '正北', element: 'shui', color: '#03A9F4', yinyang: '阴' },
  '2': { name: '坤', direction: '西南', element: 'tu', color: '#795548', yinyang: '阴' },
  '3': { name: '震', direction: '正东', element: 'mu', color: '#4CAF50', yinyang: '阳' },
  '4': { name: '巽', direction: '东南', element: 'mu', color: '#4CAF50', yinyang: '阳' },
  '5': { name: '中', direction: '中宫', element: 'tu', color: '#795548', yinyang: '阴阳' },
  '6': { name: '乾', direction: '西北', element: 'jin', color: '#FF9800', yinyang: '阳' },
  '7': { name: '兑', direction: '正西', element: 'jin', color: '#FF9800', yinyang: '阴' },
  '8': { name: '艮', direction: '东北', element: 'tu', color: '#795548', yinyang: '阳' },
  '9': { name: '离', direction: '正南', element: 'huo', color: '#F44336', yinyang: '阳' }
};

export const JIU_XING: any = {
  '天蓬': { alias: '贪狼', element: 'shui', color: '#03A9F4', feature: '主智慧、口才、机变' },
  '天芮': { alias: '巨门', element: 'tu', color: '#795548', feature: '主疾病、稳重、坚韧' },
  '天冲': { alias: '禄存', element: 'mu', color: '#4CAF50', feature: '主冲击、变化、快速' },
  '天辅': { alias: '文曲', element: 'mu', color: '#4CAF50', feature: '主扶助、支持、辅佐' },
  '天禽': { alias: '廉贞', element: 'tu', color: '#795548', feature: '为中宫之神，主枢纽、核心' },
  '天心': { alias: '武曲', element: 'jin', color: '#FF9800', feature: '主决断、判断、果决' },
  '天柱': { alias: '破军', element: 'jin', color: '#FF9800', feature: '主坚固、支撑、顶天立地' },
  '天任': { alias: '左辅', element: 'tu', color: '#795548', feature: '主责任、重担、实际' },
  '天英': { alias: '右弼', element: 'huo', color: '#F44336', feature: '主才华、聪明、显贵' }
};

export const BA_MEN: any = {
  '休门': { feature: '为吉门，主休养、安宁、平和。适合休息与调养。', type: 'ji', element: 'shui', color: '#03A9F4' },
  '生门': { feature: '为吉门，主生发、成长、喜庆。适合开始新事物。', type: 'ji', element: 'tu', color: '#795548' },
  '伤门': { feature: '为凶门，主伤害、损失、疾病。需避免冲突与伤害。', type: 'xiong', element: 'mu', color: '#4CAF50' },
  '杜门': { feature: '为凶门，主阻塞、停滞、困难。事情易受阻碍。', type: 'xiong', element: 'mu', color: '#4CAF50' },
  '景门': { feature: '为吉门，主光明、展示、明亮。适合公开场合与展示。', type: 'ji', element: 'huo', color: '#F44336' },
  '死门': { feature: '为凶门，主衰败、结束、死亡。不宜开始重要事情。', type: 'xiong', element: 'tu', color: '#795548' },
  '惊门': { feature: '为凶门，主惊吓、变故、突发状况。需注意意外变化。', type: 'xiong', element: 'jin', color: '#FF9800' },
  '开门': { feature: '为吉门，主通达、顺畅、开始。万事顺利，有好的开端。', type: 'ji', element: 'jin', color: '#FF9800' }
};

export const BA_SHEN: any = {
  '值符': { feature: '为贵神，主吉庆、贵人、福星。', type: 'ji' },
  '腾蛇': { feature: '为凶神，主口舌是非、波动起伏。', type: 'xiong' },
  '太阴': { feature: '为吉神，主柔和、隐藏、内敛。', type: 'ji' },
  '六合': { feature: '为吉神，主和谐、团结、合作。', type: 'ji' },
  '白虎': { feature: '为凶神，主凶猛、伤害、灾祸。', type: 'xiong' },
  '玄武': { feature: '为凶神，主隐秘、盗窃、欺诈。', type: 'xiong' },
  '九地': { feature: '为吉神，主地利、丰收、稳固。', type: 'ji' },
  '九天': { feature: '为吉神，主高升、贵人、成功。', type: 'ji' }
};

const JIE_QI_JU_SUAN = [
  { jieqi: '冬至', type: 'yang' as const, numbers: '174' },
  { jieqi: '小寒', type: 'yang' as const, numbers: '285' },
  { jieqi: '大寒', type: 'yang' as const, numbers: '396' },
  { jieqi: '立春', type: 'yang' as const, numbers: '852' },
  { jieqi: '雨水', type: 'yang' as const, numbers: '963' },
  { jieqi: '惊蛰', type: 'yang' as const, numbers: '174' },
  { jieqi: '春分', type: 'yang' as const, numbers: '396' },
  { jieqi: '清明', type: 'yang' as const, numbers: '417' },
  { jieqi: '谷雨', type: 'yang' as const, numbers: '528' },
  { jieqi: '立夏', type: 'yang' as const, numbers: '417' },
  { jieqi: '小满', type: 'yang' as const, numbers: '528' },
  { jieqi: '芒种', type: 'yang' as const, numbers: '639' },
  { jieqi: '夏至', type: 'yin' as const, numbers: '936' },
  { jieqi: '小暑', type: 'yin' as const, numbers: '825' },
  { jieqi: '大暑', type: 'yin' as const, numbers: '714' },
  { jieqi: '立秋', type: 'yin' as const, numbers: '258' },
  { jieqi: '处暑', type: 'yin' as const, numbers: '147' },
  { jieqi: '白露', type: 'yin' as const, numbers: '936' },
  { jieqi: '秋分', type: 'yin' as const, numbers: '714' },
  { jieqi: '寒露', type: 'yin' as const, numbers: '693' },
  { jieqi: '霜降', type: 'yin' as const, numbers: '582' },
  { jieqi: '立冬', type: 'yin' as const, numbers: '693' },
  { jieqi: '小雪', type: 'yin' as const, numbers: '582' },
  { jieqi: '大雪', type: 'yin' as const, numbers: '471' }
];

const LUO_SHU_ORDER = ['1', '8', '3', '4', '9', '2', '7', '6'];
const SAN_QI_LIU_YI = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
const BASIC_XING: any = {
  '1': '天蓬',
  '2': '天芮',
  '3': '天冲',
  '4': '天辅',
  '5': '天禽',
  '6': '天心',
  '7': '天柱',
  '8': '天任',
  '9': '天英'
};
const BASIC_MEN: any = {
  '1': '休门',
  '2': '死门',
  '3': '伤门',
  '4': '杜门',
  '5': '',
  '6': '开门',
  '7': '惊门',
  '8': '生门',
  '9': '景门'
};

function ganZhiIndex(ganZhi: string): number {
  const gan = ganZhi[0];
  const zhi = ganZhi[1];
  const ganIdx = TIAN_GAN.indexOf(gan);
  const zhiIdx = DI_ZHI.indexOf(zhi);
  if (ganIdx === -1 || zhiIdx === -1) return 0;
  for (let i = 0; i < 60; i++) {
    if (i % 10 === ganIdx && i % 12 === zhiIdx) return i;
  }
  return 0;
}

function findGanOnDiPan(diPan: any, gan: string): string | null {
  for (const gong of LUO_SHU_ORDER) {
    if (diPan[gong] === gan) return gong;
  }
  if (diPan['5'] === gan) return '2';
  return null;
}

function getDiPan(type: 'yang' | 'yin', num: number): any {
  const result: any = {};
  let currentGong = num;

  for (let i = 0; i < 9; i++) {
    result[currentGong.toString()] = SAN_QI_LIU_YI[i];

    if (type === 'yang') {
      currentGong++;
      if (currentGong === 10) currentGong = 1;
    } else {
      currentGong--;
      if (currentGong === 0) currentGong = 9;
    }
  }

  return result;
}

function distributeJiuXing(diPan: any, xunShou: string, shiGan: string) {
  let zhiFuGong = findGanOnDiPan(diPan, xunShou);
  if (!zhiFuGong) zhiFuGong = '2';
  const zhiFuXing = BASIC_XING[zhiFuGong];

  if (!shiGan) {
    return { zhiFuGong, zhiFuXing, jiuXing: { ...BASIC_XING } };
  }

  let luoGong = findGanOnDiPan(diPan, shiGan);
  if (!luoGong) luoGong = zhiFuGong;

  const zhiFuIndex = LUO_SHU_ORDER.indexOf(zhiFuGong);
  const luoGongIndex = LUO_SHU_ORDER.indexOf(luoGong);

  if (zhiFuIndex === -1 || luoGongIndex === -1) {
    return { zhiFuGong, zhiFuXing, jiuXing: { ...BASIC_XING } };
  }

  const steps = (luoGongIndex - zhiFuIndex + 8) % 8;
  const jiuXing: any = {};

  for (let i = 0; i < 8; i++) {
    const originalGong = LUO_SHU_ORDER[i];
    const newIndex = (i + steps) % 8;
    const newGong = LUO_SHU_ORDER[newIndex];

    if (originalGong === '2') {
      jiuXing[newGong] = '天芮(天禽)';
    } else {
      jiuXing[newGong] = BASIC_XING[originalGong];
    }
  }

  jiuXing['5'] = '';

  return { zhiFuGong, zhiFuLuoGong: luoGong, zhiFuXing, jiuXing };
}

function distributeBaMen(zhiFuGong: string, hourDiff: number, type: 'yang' | 'yin') {
  const zhiShiMen = BASIC_MEN[zhiFuGong] || '';
  const zhiFuGongNum = parseInt(zhiFuGong);
  let zhiShiLuoGongNum: number;

  if (type === 'yang') {
    zhiShiLuoGongNum = ((zhiFuGongNum - 1 + hourDiff) % 9) + 1;
  } else {
    zhiShiLuoGongNum = ((zhiFuGongNum - 1 - (hourDiff % 9) + 9) % 9) + 1;
  }

  if (zhiShiLuoGongNum === 5) zhiShiLuoGongNum = 2;
  const zhiShiLuoGong = zhiShiLuoGongNum.toString();

  const zhiFuIndex = LUO_SHU_ORDER.indexOf(zhiFuGong);
  const luoGongIndex = LUO_SHU_ORDER.indexOf(zhiShiLuoGong);

  if (zhiFuIndex === -1 || luoGongIndex === -1) {
    return { zhiShiGong: zhiShiLuoGong, zhiShiMen, baMen: { ...BASIC_MEN } };
  }

  const ringSteps = (luoGongIndex - zhiFuIndex + 8) % 8;
  const baMen: any = { '5': '' };

  for (let i = 0; i < 8; i++) {
    const originalGong = LUO_SHU_ORDER[i];
    const originalMen = BASIC_MEN[originalGong];
    const newIndex = (i + ringSteps) % 8;
    const newGong = LUO_SHU_ORDER[newIndex];
    baMen[newGong] = originalMen;
  }

  return { zhiShiGong: zhiShiLuoGong, zhiShiMen, baMen };
}

function distributeBaShen(zhiFuGong: string, type: 'yang' | 'yin') {
  const shenOrder = ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];
  const clockwiseOrder = ['1', '8', '3', '4', '9', '2', '7', '6'];
  const counterClockwiseOrder = ['1', '6', '7', '2', '9', '4', '3', '8'];
  const gongOrder = type === 'yang' ? clockwiseOrder : counterClockwiseOrder;

  const baShen: any = {
    '1': '', '2': '', '3': '', '4': '', '5': '', '6': '', '7': '', '8': '', '9': ''
  };

  let gongToUse = zhiFuGong;
  if (gongToUse === '5') gongToUse = '2';

  baShen[gongToUse] = '值符';
  const zhiFuGongIndex = gongOrder.indexOf(gongToUse);

  if (zhiFuGongIndex !== -1) {
    for (let i = 1; i < gongOrder.length; i++) {
      const currentGong = gongOrder[(zhiFuGongIndex + i) % gongOrder.length];
      const currentShen = shenOrder[i];
      baShen[currentGong] = currentShen;
    }
  }

  return baShen;
}

function calculateJuShu(date: Date, method: string): JuShu {
  const lunar = Lunar.fromDate(date);

  let jieQiName: string;
  if (method === '时家' || method === '日家') {
    jieQiName = lunar.getPrevJieQi(true).getName();
  } else {
    jieQiName = lunar.getPrevJieQi(true).getName();
  }

  let dayGanZhi: string;
  if (method === '时家' || method === '日家') {
    dayGanZhi = lunar.getDayInGanZhi();
  } else if (method === '月家') {
    dayGanZhi = lunar.getMonthInGanZhi();
  } else {
    dayGanZhi = lunar.getYearInGanZhi();
  }

  const idx = ganZhiIndex(dayGanZhi);
  const fuTouIdx = idx - (idx % 5);
  const yuan = Math.floor(fuTouIdx / 5) % 3;
  const yuanNames = ['上元', '中元', '下元'];

  let juNumber = '1';
  let yinYangType: 'yang' | 'yin' = 'yang';

  for (const item of JIE_QI_JU_SUAN) {
    if (item.jieqi === jieQiName) {
      yinYangType = item.type;
      juNumber = item.numbers.charAt(yuan);
      break;
    }
  }

  return {
    jieQiName,
    type: yinYangType,
    number: juNumber,
    yuan: yuanNames[yuan],
    fullName: `${yinYangType === 'yin' ? '阴遁' : '阳遁'}${juNumber}局 (${yuanNames[yuan]})`,
    formatCode: `${yinYangType}-${juNumber}`
  };
}

function getXunShou(lunar: any, method: string): string {
  let ganZhi: string;
  try {
    if (method === '时家') ganZhi = lunar.getTimeInGanZhi();
    else if (method === '日家') ganZhi = lunar.getDayInGanZhi();
    else if (method === '月家') ganZhi = lunar.getMonthInGanZhi();
    else ganZhi = lunar.getYearInGanZhi();
  } catch (e) {
    return '戊';
  }

  const xunToLiuYi: any = {
    '甲子': '戊', '甲戌': '己', '甲申': '庚',
    '甲午': '辛', '甲辰': '壬', '甲寅': '癸'
  };

  for (const xun of Object.keys(xunToLiuYi)) {
    const idx = ganZhiIndex(xun);
    const currentIdx = ganZhiIndex(ganZhi);
    if (currentIdx >= idx && currentIdx < idx + 10) {
      return xunToLiuYi[xun];
    }
  }

  return '戊';
}

function getShiGan(lunar: any, method: string): string {
  try {
    if (method === '时家') return lunar.getTimeInGanZhi().substring(0, 1);
    else if (method === '日家') return lunar.getDayInGanZhi().substring(0, 1);
    else if (method === '月家') return lunar.getMonthInGanZhi().substring(0, 1);
    else return lunar.getYearInGanZhi().substring(0, 1);
  } catch (e) {
    return '甲';
  }
}

function getXunName(ganZhi: string): string {
  const xunNames = ['甲子', '甲戌', '甲申', '甲午', '甲辰', '甲寅'];
  const idx = ganZhiIndex(ganZhi);
  for (let i = 0; i < xunNames.length; i++) {
    const xunIdx = ganZhiIndex(xunNames[i]);
    if (idx >= xunIdx && idx < xunIdx + 10) {
      return xunNames[i];
    }
  }
  return '甲子';
}

function getHourDiff(lunar: any, method: string): number {
  try {
    let ganZhi: string;
    if (method === '时家') {
      ganZhi = lunar.getTimeInGanZhi();
    } else if (method === '日家') {
      ganZhi = lunar.getDayInGanZhi();
    } else if (method === '月家') {
      ganZhi = lunar.getMonthInGanZhi();
    } else {
      ganZhi = lunar.getYearInGanZhi();
    }
    const xun = getXunName(ganZhi);
    return ganZhiIndex(ganZhi) - ganZhiIndex(xun);
  } catch (e) {
    return 0;
  }
}

function getKongWang(lunar: any, method: string): string[] {
  try {
    let xun: string;
    if (method === '时家') xun = getXunName(lunar.getTimeInGanZhi());
    else if (method === '日家') xun = getXunName(lunar.getDayInGanZhi());
    else if (method === '月家') xun = getXunName(lunar.getMonthInGanZhi());
    else xun = getXunName(lunar.getYearInGanZhi());

    const xunToKongWang: any = {
      '甲子': ['戌', '亥'], '甲戌': ['申', '酉'], '甲申': ['午', '未'],
      '甲午': ['辰', '巳'], '甲辰': ['寅', '卯'], '甲寅': ['子', '丑']
    };

    return xunToKongWang[xun] || [];
  } catch (e) {
    return [];
  }
}

function getKongWangGong(kongWangZhi: string[]): string[] {
  const zhiToGong: any = {
    '子': '1', '丑': '8', '寅': '8', '卯': '3',
    '辰': '4', '巳': '4', '午': '9', '未': '2',
    '申': '2', '酉': '7', '戌': '6', '亥': '6'
  };
  return kongWangZhi.map(zhi => zhiToGong[zhi]).filter(gong => gong);
}

function getMaStar(lunar: any, method: string) {
  let zhi: string;
  if (method === '时家') zhi = lunar.getTimeZhi();
  else if (method === '日家') zhi = lunar.getDayZhi();
  else if (method === '月家') zhi = lunar.getMonthZhi();
  else zhi = lunar.getYearZhi();

  let maZhi = '';
  if (['寅', '午', '戌'].includes(zhi)) maZhi = '申';
  else if (['申', '子', '辰'].includes(zhi)) maZhi = '寅';
  else if (['巳', '酉', '丑'].includes(zhi)) maZhi = '亥';
  else if (['亥', '卯', '未'].includes(zhi)) maZhi = '巳';

  const zhiToGong: any = {
    '子': '1', '丑': '8', '寅': '8', '卯': '3',
    '辰': '4', '巳': '4', '午': '9', '未': '2',
    '申': '2', '酉': '7', '戌': '6', '亥': '6'
  };

  return { zhi: maZhi, gong: zhiToGong[maZhi] || '' };
}

function distributeTianPan(diPan: any, xunShou: string, shiGan: string) {
  let zhiFuGong = findGanOnDiPan(diPan, xunShou);
  if (!zhiFuGong) zhiFuGong = '2';

  let shiGanGong = findGanOnDiPan(diPan, shiGan);
  if (!shiGanGong) shiGanGong = zhiFuGong;

  const zhiFuIndex = LUO_SHU_ORDER.indexOf(zhiFuGong);
  const shiGanIndex = LUO_SHU_ORDER.indexOf(shiGanGong);
  const steps = (shiGanIndex - zhiFuIndex + 8) % 8;

  const tianPan: any = {};
  for (let i = 0; i < 8; i++) {
    const originalGong = LUO_SHU_ORDER[i];
    const newIndex = (i + steps) % 8;
    const newGong = LUO_SHU_ORDER[newIndex];
    tianPan[newGong] = diPan[originalGong];
  }
  
  const usedGan = new Set(Object.values(tianPan));
  const remainingGan = SAN_QI_LIU_YI.find(gan => !usedGan.has(gan));
  tianPan['5'] = remainingGan || tianPan['2'];

  return tianPan;
}

function analyzeGong(gongNumber: number, jiuXing: any, baMen: any, baShen: any): JiuGongInfo {
  const gongStr = gongNumber.toString();
  let xing = jiuXing[gongStr] || '';
  const men = baMen[gongStr] || '';
  const shen = baShen[gongStr] || '';

  const gongInfo = JIU_GONG[gongStr];

  let xingLookup = xing;
  if (xing.includes('天芮')) xingLookup = '天芮';
  else if (xing.includes('天禽')) xingLookup = '天禽';

  const xingInfo = xingLookup ? JIU_XING[xingLookup] : { alias: '', feature: '', element: '' };
  const menInfo = men ? BA_MEN[men] : { feature: '', type: '' };
  const shenInfo = shen ? BA_SHEN[shen] : { feature: '', type: '' };

  let jiXiongScore = 0;

  if (xingInfo.element === 'jin' || xingInfo.element === 'huo') {
    jiXiongScore += 1;
  } else if (xingInfo.element === 'tu') {
    jiXiongScore += 0;
  } else {
    jiXiongScore -= 1;
  }

  if (men && menInfo.type === 'ji') jiXiongScore += 1;
  else if (men && menInfo.type === 'xiong') jiXiongScore -= 1;

  if (shen && shenInfo.type === 'ji') jiXiongScore += 1;
  else if (shen && shenInfo.type === 'xiong') jiXiongScore -= 1;

  let jiXiong: string;
  if (jiXiongScore >= 2) jiXiong = 'da_ji';
  else if (jiXiongScore === 1) jiXiong = 'xiao_ji';
  else if (jiXiongScore === 0) jiXiong = 'ping';
  else if (jiXiongScore === -1) jiXiong = 'xiao_xiong';
  else jiXiong = 'da_xiong';

  const jiXiongText = ['大凶', '小凶', '平', '小吉', '大吉'][jiXiongScore + 2];

  const gongExplain: any = {
    '1': '坎宫主水，与事业、财运、流动资金有关。',
    '2': '坤宫主土，与婚姻、母亲、女性长辈有关。',
    '3': '震宫主木，与创业、开始、长子有关。',
    '4': '巽宫主木，与女性、柔和、文书有关。',
    '5': '中宫为核心，统领八方，与自身状态有关。',
    '6': '乾宫主金，与父亲、权威、领导有关。',
    '7': '兑宫主金，与口舌、沟通、少女有关。',
    '8': '艮宫主土，与停止、障碍、少男有关。',
    '9': '离宫主火，与名声、眼睛、光明有关。'
  };

  let explanation = gongExplain[gongStr] || '';

  if (xing) {
    explanation += ` ${xing}${xingInfo.alias ? '(' + xingInfo.alias + ')' : ''}入${gongStr}宫，${xingInfo.feature || ''}`;
  }
  if (men) {
    explanation += ` ${men}入${gongStr}宫，${menInfo.feature || ''}`;
  }
  if (shen) {
    explanation += ` ${shen}入${gongStr}宫，${shenInfo.feature || ''}`;
  }

  switch (jiXiong) {
    case 'da_ji': explanation += ' 此宫大吉，事情进展顺利，可主动出击。'; break;
    case 'xiao_ji': explanation += ' 此宫小吉，事情有贵人相助，稳步推进为宜。'; break;
    case 'ping': explanation += ' 此宫平平，事情进展一般，需谨慎行事。'; break;
    case 'xiao_xiong': explanation += ' 此宫小凶，事情多有阻碍，宜守不宜进。'; break;
    case 'da_xiong': explanation += ' 此宫大凶，事情多有险阻，最好避开此方位活动。'; break;
  }

  return {
    gongNumber: gongStr,
    gongName: gongInfo.name,
    direction: gongInfo.direction,
    element: gongInfo.element,
    xing,
    xingAlias: xingInfo.alias,
    xingFeature: xingInfo.feature,
    men,
    menFeature: menInfo.feature,
    shen,
    shenFeature: shenInfo.feature,
    jiXiong,
    jiXiongText,
    explain: explanation
  };
}

function overallAnalysis(jiuGongAnalysis: any, zhiFuGong: string, zhiShiGong: string, purpose: string): AnalysisResult {
  const zhiFuJiXiong = jiuGongAnalysis[zhiFuGong] ? jiuGongAnalysis[zhiFuGong].jiXiong : 'ping';
  const zhiShiJiXiong = jiuGongAnalysis[zhiShiGong] ? jiuGongAnalysis[zhiShiGong].jiXiong : 'ping';

  let overallJiXiong: string;
  if (zhiFuJiXiong === 'da_ji' && zhiShiJiXiong === 'da_ji') overallJiXiong = 'da_ji';
  else if (zhiFuJiXiong.includes('ji') && zhiShiJiXiong.includes('ji')) overallJiXiong = 'xiao_ji';
  else if (zhiFuJiXiong.includes('xiong') && zhiShiJiXiong.includes('xiong')) overallJiXiong = 'da_xiong';
  else if (zhiFuJiXiong.includes('xiong') || zhiShiJiXiong.includes('xiong')) overallJiXiong = 'xiao_xiong';
  else overallJiXiong = 'ping';

  let bestGong = '';
  let bestScore = -3;

  for (const gong in jiuGongAnalysis) {
    const analysis = jiuGongAnalysis[gong];
    let score = 0;

    switch (analysis.jiXiong) {
      case 'da_ji': score += 2; break;
      case 'xiao_ji': score += 1; break;
      case 'xiao_xiong': score -= 1; break;
      case 'da_xiong': score -= 2; break;
    }

    if (purpose === '事业' && ['1', '6', '9'].includes(gong)) score += 1;
    else if (purpose === '财运' && ['1', '7', '6'].includes(gong)) score += 1;
    else if (purpose === '婚姻' && ['2', '7', '9'].includes(gong)) score += 1;
    else if (purpose === '健康' && ['3', '9', '4'].includes(gong)) score += 1;
    else if (purpose === '学习' && ['4', '9', '3'].includes(gong)) score += 1;

    if (score > bestScore) {
      bestScore = score;
      bestGong = gong;
    }
  }

  const suggestions: string[] = [];
  switch (overallJiXiong) {
    case 'da_ji':
      suggestions.push('当前时运极佳，可大胆行事，推进重要计划。');
      suggestions.push('贵人运强，适合社交活动和寻求支持。');
      suggestions.push('财运亨通，可考虑投资或财务规划。');
      break;
    case 'xiao_ji':
      suggestions.push('时运较好，可稳步推进计划，但需谨慎。');
      suggestions.push('有贵人相助，但也需自身努力。');
      suggestions.push('财运平稳，宜守不宜进。');
      break;
    case 'ping':
      suggestions.push('时运平平，宜按部就班行事，不宜冒险。');
      suggestions.push('人际关系一般，需多加维护。');
      suggestions.push('财运一般，宜节制开支。');
      break;
    case 'xiao_xiong':
      suggestions.push('时运不佳，宜守不宜进，避免冒险。');
      suggestions.push('谨防小人，保持低调。');
      suggestions.push('财务宜节约，避免大额支出。');
      break;
    case 'da_xiong':
      suggestions.push('当前时运不佳，宜避开重要活动，保持低调。');
      suggestions.push('谨防小人和突发事件，避免冲突。');
      suggestions.push('财务宜严格控制，避免任何投资和大额支出。');
      break;
  }

  if (bestGong) {
    const bestGongInfo = jiuGongAnalysis[bestGong];
    suggestions.push(`最有利方位在${bestGongInfo.direction}方(${bestGongInfo.gongName}宫)，可多往此方位活动。`);
  }

  const overallJiXiongText: any = {
    'da_ji': '大吉', 'xiao_ji': '小吉', 'ping': '平',
    'xiao_xiong': '小凶', 'da_xiong': '大凶'
  };

  return {
    overallJiXiong,
    overallJiXiongText: overallJiXiongText[overallJiXiong],
    bestGong,
    suggestions
  };
}

export function calculateQiMen(date: Date, options?: { type?: string; method?: string; purpose?: string; location?: string }): QiMenResult {
  const opts = {
    type: '四柱',
    method: '时家',
    purpose: '综合',
    location: '默认位置',
    ...options
  };

  const lunar = Lunar.fromDate(date);
  const solar = Solar.fromDate(date);

  const siZhu: SiZhu = {
    year: lunar.getYearInGanZhi(),
    month: lunar.getMonthInGanZhi(),
    day: lunar.getDayInGanZhi(),
    time: lunar.getTimeInGanZhi()
  };

  const juShu = calculateJuShu(date, opts.method);
  const xunShou = getXunShou(lunar, opts.method);
  const dayXunShou = getXunShou(lunar, '日家');
  const shiGan = getShiGan(lunar, opts.method);
  const kongWangZhi = getKongWang(lunar, opts.method);
  const kongWangGong = getKongWangGong(kongWangZhi);
  const maStar = getMaStar(lunar, opts.method);

  const diPan = getDiPan(juShu.type, parseInt(juShu.number));
  const tianPan = distributeTianPan(diPan, xunShou, shiGan);
  const jiuXingResult = distributeJiuXing(diPan, xunShou, shiGan);
  const hourDiff = getHourDiff(lunar, opts.method);
  const baMenResult = distributeBaMen(jiuXingResult.zhiFuGong, hourDiff, juShu.type);
  const baShen = distributeBaShen(jiuXingResult.zhiFuLuoGong || jiuXingResult.zhiFuGong, juShu.type);

  const jiuGongAnalysis: any = {};
  for (let i = 1; i <= 9; i++) {
    jiuGongAnalysis[i] = analyzeGong(i, jiuXingResult.jiuXing, baMenResult.baMen, baShen);
  }

  const analysis = overallAnalysis(
    jiuGongAnalysis,
    jiuXingResult.zhiFuLuoGong || jiuXingResult.zhiFuGong,
    baMenResult.zhiShiGong,
    opts.purpose
  );

  return {
    basicInfo: {
      date: solar.toFullString(),
      lunarDate: lunar.toString(),
      type: opts.type,
      method: opts.method,
      purpose: opts.purpose,
      location: opts.location
    },
    siZhu,
    juShu,
    xunShou,
    dayXunShou,
    luoGongGan: shiGan,
    tianPan,
    jiuXing: jiuXingResult.jiuXing,
    baMen: baMenResult.baMen,
    baShen,
    diPan,
    zhiFuGong: jiuXingResult.zhiFuLuoGong || jiuXingResult.zhiFuGong,
    zhiFuYuanGong: jiuXingResult.zhiFuGong,
    zhiFuXing: jiuXingResult.zhiFuXing,
    zhiShiGong: baMenResult.zhiShiGong,
    zhiShiMen: baMenResult.zhiShiMen,
    kongWangZhi,
    kongWangGong,
    maStar,
    jiuGongAnalysis,
    analysis
  };
}

export const GRID_ORDER = ['4', '9', '2', '3', '5', '7', '8', '1', '6'];

export const getGongElementColor = (gongName: string) => {
  const colors: any = {
    '坎': '#1e3a5f',
    '坤': '#5c4033',
    '震': '#2d5a3d',
    '巽': '#3d5a4d',
    '中': '#4a4a2a',
    '乾': '#4a3a5a',
    '兑': '#5a4a3a',
    '艮': '#5a5a3a',
    '离': '#5a2a2a'
  };
  return colors[gongName] || '#2a2a2a';
};

export const getTextColorClass = (tianGan: string, isZhiFuZhiShi: boolean, isRuMu: boolean, isJiXing: boolean) => {
  if (isZhiFuZhiShi) return 'text-cyan-400';
  if (isRuMu && isJiXing) return 'text-blue-400';
  if (isRuMu) return 'text-yellow-400';
  if (isJiXing) return 'text-purple-400';
  return 'text-white';
};

export const getMenPoColor = (menName: string, isMenPo: boolean, isZhiShi: boolean) => {
  if (isMenPo) return 'text-red-400';
  if (isZhiShi) return 'text-cyan-400';
  return 'text-white';
};

// 入墓判断
export const checkRuMu = (tianGan: string, gongNum: string): boolean => {
  // 甲墓在未(坤宫2)，乙墓在戌(乾宫6)
  // 丙墓在戌(乾宫6)，丁墓在丑(艮宫8)
  // 戊墓在辰(巽宫4)，己墓在辰(巽宫4)
  // 庚墓在丑(艮宫8)，辛墓在辰(巽宫4)
  // 壬墓在辰(巽宫4)，癸墓在未(坤宫2)
  const ruMuMap: Record<string, string[]> = {
    '甲': ['2'],
    '乙': ['6'],
    '丙': ['6'],
    '丁': ['8'],
    '戊': ['4'],
    '己': ['4'],
    '庚': ['8'],
    '辛': ['4'],
    '壬': ['4'],
    '癸': ['2']
  };
  return ruMuMap[tianGan]?.includes(gongNum) || false;
};

// 击刑判断
export const checkJiXing = (tianGan: string, gongNum: string): boolean => {
  const jiXingMap: Record<string, string[]> = {
    '戊': ['3'], // 戊在震宫
    '己': ['2'], // 己在坤宫
    '庚': ['8'], // 庚在艮宫
    '辛': ['9'], // 辛在离宫
    '壬': ['4'], // 壬在巽宫
    '癸': ['4']  // 癸在巽宫
  };
  return jiXingMap[tianGan]?.includes(gongNum) || false;
};

// 门迫判断
export const checkMenPo = (menName: string, gongNum: string): boolean => {
  // 门迫是指门克宫
  const menElement: Record<string, string> = {
    '休门': '水',
    '生门': '土',
    '伤门': '木',
    '杜门': '木',
    '景门': '火',
    '死门': '土',
    '惊门': '金',
    '开门': '金'
  };
  const gongElement: Record<string, string> = {
    '1': '水',
    '2': '土',
    '3': '木',
    '4': '木',
    '5': '土',
    '6': '金',
    '7': '金',
    '8': '土',
    '9': '火'
  };
  
  const elementKe = (a: string, b: string): boolean => {
    const keMap: Record<string, string[]> = {
      '木': ['土'],
      '火': ['金'],
      '土': ['水'],
      '金': ['木'],
      '水': ['火']
    };
    return keMap[a]?.includes(b) || false;
  };
  
  const mEl = menElement[menName];
  const gEl = gongElement[gongNum];
  if (!mEl || !gEl) return false;
  return elementKe(mEl, gEl);
};

