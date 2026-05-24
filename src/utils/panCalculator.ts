import { PanResult, Palace, InputParams } from '@/types';
import { TIAN_GAN, BA_MEN, JIU_XING, BA_SHEN, GONG_WEI, SHI_GAN, DI_ZHI, RU_MU_MAP, JI_XING_MAP, MEN_PO_MAP } from './constants';

const JIA_ZI = [
  '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
  '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
  '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
  '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
  '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
  '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥',
];

const XUN_KONG_MAP: Record<string, [string, string]> = {
  '甲子': ['戌', '亥'],
  '甲戌': ['申', '酉'],
  '甲申': ['午', '未'],
  '甲午': ['辰', '巳'],
  '甲辰': ['寅', '卯'],
  '甲寅': ['子', '丑'],
};

const CHANG_SHENG_MAP: Record<string, string[]> = {
  '甲': ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
  '丙': ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
  '戊': ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
  '庚': ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
  '壬': ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
  '乙': ['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
  '丁': ['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
  '己': ['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
  '辛': ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  '癸': ['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅'],
};

const CHANG_SHENG_STATES = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];

function solarTerm(year: number, month: number): string {
  const terms = [
    '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
    '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
    '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
    '寒露', '霜降', '立冬', '小雪', '大雪', '冬至',
  ];
  
  const termDays = [
    [6, 20], [20, 4], [4, 19], [19, 4], [5, 20], [20, 5],
    [5, 21], [21, 6], [6, 21], [21, 7], [7, 22], [22, 7],
    [7, 23], [23, 8], [8, 23], [23, 8], [8, 24], [24, 9],
    [9, 23], [23, 10], [7, 22], [22, 11], [7, 22], [22, 12],
  ];
  
  const index = (month - 1) * 2;
  const [day1, day2] = termDays[index];
  const isLeap = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
  
  if (month === 2) {
    const day = isLeap ? 29 : 28;
    return day <= 18 ? terms[index - 1] || '大寒' : terms[index];
  }
  
  return terms[index];
}

function getYuan(solarTerm: string): number {
  const upperTerms = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
  const index = upperTerms.indexOf(solarTerm);
  if (index === -1) return 2;
  return (index % 3) + 1;
}

function getDun(year: number, solarTerm: string): '阳' | '阴' {
  const upperTerms = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
  const isUpper = upperTerms.includes(solarTerm);
  const yearGanIndex = SHI_GAN.indexOf(getYearGan(year));
  
  if ((yearGanIndex % 2 === 0 && isUpper) || (yearGanIndex % 2 === 1 && !isUpper)) {
    return '阳';
  }
  return '阴';
}

function getYearGan(year: number): string {
  const ganIndex = (year - 4) % 10;
  return SHI_GAN[ganIndex < 0 ? ganIndex + 10 : ganIndex];
}

function getYearZhi(year: number): string {
  const zhiIndex = (year - 4) % 12;
  return DI_ZHI[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex];
}

function getMonthGan(yearGan: string, month: number): string {
  const ganIndex = SHI_GAN.indexOf(yearGan);
  const monthOffset = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1];
  return SHI_GAN[(ganIndex + monthOffset[month - 1]) % 10];
}

function getMonthZhi(month: number): string {
  return DI_ZHI[(month + 1) % 12];
}

function getDayGan(year: number, month: number, day: number): string {
  const baseDate = new Date(1900, 0, 1);
  const currentDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((currentDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const ganIndex = (diffDays + 9) % 10;
  return SHI_GAN[ganIndex];
}

function getDayZhi(year: number, month: number, day: number): string {
  const baseDate = new Date(1900, 0, 1);
  const currentDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((currentDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const zhiIndex = (diffDays + 1) % 12;
  return DI_ZHI[zhiIndex];
}

function getHourGan(dayGan: string, hour: number): string {
  const dayGanIndex = SHI_GAN.indexOf(dayGan);
  const hourIndex = Math.floor(hour / 2);
  return SHI_GAN[(dayGanIndex * 2 + hourIndex) % 10];
}

function getHourZhi(hour: number): string {
  const hourIndex = Math.floor((hour + 1) / 2) % 12;
  return DI_ZHI[hourIndex];
}

function getXunShou(dayGan: string, dayZhi: string): string {
  const jiaIndex = Math.floor((SHI_GAN.indexOf(dayGan) * 12 + DI_ZHI.indexOf(dayZhi)) / 10) * 10;
  return JIA_ZI[jiaIndex];
}

function getKongWang(xunShou: string): string {
  const kong = XUN_KONG_MAP[xunShou];
  return kong ? `${kong[0]} ${kong[1]}` : '';
}

function getMaXing(dayZhi: string): string {
  const maMap: Record<string, string> = {
    '申': '寅', '子': '午', '辰': '申',
    '寅': '申', '午': '子', '戌': '辰',
    '亥': '巳', '卯': '酉', '未': '亥',
    '巳': '亥', '酉': '卯', '丑': '未',
  };
  return maMap[dayZhi] || '';
}

function calculatePan(params: InputParams): PanResult {
  const date = params.time;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();

  const yearGan = getYearGan(year);
  const yearZhi = getYearZhi(year);
  const monthGan = getMonthGan(yearGan, month);
  const monthZhi = getMonthZhi(month);
  const dayGan = getDayGan(year, month, day);
  const dayZhi = getDayZhi(year, month, day);
  const hourGan = getHourGan(dayGan, hour);
  const hourZhi = getHourZhi(hour);

  const siZhu = [`${yearGan}${yearZhi}`, `${monthGan}${monthZhi}`, `${dayGan}${dayZhi}`, `${hourGan}${hourZhi}`];
  
  const solarTermName = solarTerm(year, month);
  const yuan = getYuan(solarTermName);
  const dun = getDun(year, solarTermName);
  
  const xunShou = getXunShou(dayGan, dayZhi);
  const kongWang = getKongWang(xunShou);
  const maXing = getMaXing(dayZhi);

  const dungeonNumber = dun === '阳' ? yuan : (10 - yuan);
  const starStart = (dungeonNumber - 1) % 9;
  
  const hourGanIndex = SHI_GAN.indexOf(hourGan);
  const zhiFuStarIndex = (starStart + hourGanIndex) % 9;
  const zhiFu = JIU_XING[zhiFuStarIndex].name;
  
  const zhiShiIndex = hourGanIndex % 8;
  const zhiShi = BA_MEN[zhiShiIndex].name;

  const palaces: Palace[] = [];
  const diPanGan = [...SHI_GAN];
  const jiugongOrder = [4, 3, 8, 1, 6, 7, 2, 9, 5];
  
  for (let i = 0; i < 9; i++) {
    const pos = jiugongOrder[i];
    const gongwei = GONG_WEI.find(g => g.position === pos)!;
    
    const starIndex = (starStart + i) % 9;
    const menIndex = (zhiShiIndex + i) % 8;
    const shenIndex = (zhiFuStarIndex + i) % 8;
    
    let tianganIndex = (SHI_GAN.indexOf(diPanGan[i]) + hourGanIndex) % 10;
    if (pos === 5) {
      tianganIndex = (SHI_GAN.indexOf(diPanGan[4]) + hourGanIndex) % 10;
    }
    
    const isKong = DI_ZHI.indexOf(gongwei.name) >= 0 && kongWang.includes(gongwei.name);
    
    const palace: Palace = {
      position: pos,
      name: gongwei.name,
      tiangan: SHI_GAN[tianganIndex],
      dipan: diPanGan[i],
      baMen: BA_MEN[menIndex].name,
      jiuXing: JIU_XING[starIndex].name,
      baShen: BA_SHEN[shenIndex].name,
      isZhiFu: JIU_XING[starIndex].name === zhiFu,
      isZhiShi: BA_MEN[menIndex].name === zhiShi,
      hasMaXing: DI_ZHI.indexOf(gongwei.name) >= 0 && maXing === gongwei.name,
      isKongWang: isKong,
      ruMu: [],
      jiXing: [],
      menPo: MEN_PO_MAP[BA_MEN[menIndex].name] === gongwei.name,
    };
    
    if (RU_MU_MAP[palace.tiangan]) {
      palace.ruMu.push(palace.tiangan);
    }
    if (RU_MU_MAP[palace.dipan]) {
      palace.ruMu.push(palace.dipan);
    }
    
    const tianganZhi = DI_ZHI[(SHI_GAN.indexOf(palace.tiangan) * 2) % 12];
    if (JI_XING_MAP[tianganZhi]) {
      palace.jiXing.push(palace.tiangan);
    }
    
    palaces.push(palace);
  }
  
  palaces.sort((a, b) => a.position - b.position);
  
  return {
    siZhu,
    kongWang,
    xunShou: `${xunShou}${SHI_GAN[(SHI_GAN.indexOf(xunShou[0]) + 9) % 10]}`,
    zhiFu,
    zhiShi,
    maXing,
    palaces,
  };
}

export { calculatePan };
