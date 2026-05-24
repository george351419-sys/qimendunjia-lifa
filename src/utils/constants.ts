import { TianGan, BaMen, JiuXing, BaShen, GongWei, ItemType } from '@/types';

export const TIAN_GAN: TianGan[] = [
  { name: '甲', wuxing: '木', meaning: '主生长、发展、开创', jiXingMeaning: '甲木击刑主竞争激烈，事业受阻' },
  { name: '乙', wuxing: '木', meaning: '主柔顺、弯曲、依附', jiXingMeaning: '乙木击刑主人际关系复杂，容易吃亏' },
  { name: '丙', wuxing: '火', meaning: '主光明、热情、急躁', jiXingMeaning: '丙火击刑主口舌是非，情绪不稳' },
  { name: '丁', wuxing: '火', meaning: '主文明、礼仪、才华', jiXingMeaning: '丁火击刑主文书失误，计划落空' },
  { name: '戊', wuxing: '土', meaning: '主稳重、诚信、厚重', jiXingMeaning: '戊土击刑主做事拖延，信用受损' },
  { name: '己', wuxing: '土', meaning: '主上进、动力、欲望', jiXingMeaning: '己土击刑易犯小人，内心受伤' },
  { name: '庚', wuxing: '金', meaning: '主刚强、果断、魄力', jiXingMeaning: '庚金击刑主竞争压力大，易招官非' },
  { name: '辛', wuxing: '金', meaning: '主锐利、精细、雕琢', jiXingMeaning: '辛金击刑主决策失误，损失财物' },
  { name: '壬', wuxing: '水', meaning: '主智慧、流动、变化', jiXingMeaning: '壬水击刑主感情波动，财运不稳' },
  { name: '癸', wuxing: '水', meaning: '主细腻、感情、隐蔽', jiXingMeaning: '癸水击刑主婚姻不顺或出轨' },
];

export const BA_MEN: BaMen[] = [
  { name: '休门', wuxing: '水', meaning: '主休息、养生、安宁', jiXiong: '吉' },
  { name: '生门', wuxing: '土', meaning: '主生长、发展、财运', jiXiong: '吉' },
  { name: '伤门', wuxing: '木', meaning: '主伤害、竞争、变动', jiXiong: '凶' },
  { name: '杜门', wuxing: '木', meaning: '主阻塞、保密、隐藏', jiXiong: '平' },
  { name: '景门', wuxing: '火', meaning: '主文书、考试、名声', jiXiong: '吉' },
  { name: '死门', wuxing: '土', meaning: '主死亡、结束、停滞', jiXiong: '凶' },
  { name: '惊门', wuxing: '金', meaning: '主惊恐、口舌、官司', jiXiong: '凶' },
  { name: '开门', wuxing: '金', meaning: '主开启、事业、贵人', jiXiong: '吉' },
];

export const JIU_XING: JiuXing[] = [
  { name: '天蓬', wuxing: '水', meaning: '主智慧、冒险、开创', jiXiong: '吉' },
  { name: '天任', wuxing: '土', meaning: '主任劳、稳重、踏实', jiXiong: '吉' },
  { name: '天冲', wuxing: '木', meaning: '主动力、竞争、冲击', jiXiong: '平' },
  { name: '天辅', wuxing: '木', meaning: '主文化、教育、辅佐', jiXiong: '吉' },
  { name: '天英', wuxing: '火', meaning: '主才华、名声、艳丽', jiXiong: '平' },
  { name: '天芮', wuxing: '土', meaning: '主疾病、阴私、阻碍', jiXiong: '凶' },
  { name: '天柱', wuxing: '金', meaning: '主威严、果断、破坏', jiXiong: '凶' },
  { name: '天心', wuxing: '金', meaning: '主谋略、决策、贵人', jiXiong: '吉' },
  { name: '天禽', wuxing: '土', meaning: '主稳重、调和、中宫', jiXiong: '吉' },
];

export const BA_SHEN: BaShen[] = [
  { name: '值符', meaning: '主贵人相助、吉庆', jiXiong: '吉' },
  { name: '螣蛇', meaning: '主虚诈、怪异、虚惊', jiXiong: '凶' },
  { name: '太阴', meaning: '主阴私、隐藏、谋略', jiXiong: '平' },
  { name: '六合', meaning: '主和合、婚姻、合作', jiXiong: '吉' },
  { name: '白虎', meaning: '主凶煞、官非、疾病', jiXiong: '凶' },
  { name: '玄武', meaning: '主阴谋、盗窃、暧昧', jiXiong: '凶' },
  { name: '九地', meaning: '主静止、稳固、保守', jiXiong: '平' },
  { name: '九天', meaning: '主高远、积极、行动', jiXiong: '吉' },
];

export const GONG_WEI: GongWei[] = [
  { position: 1, name: '坎', wuxing: '水', number: '一' },
  { position: 2, name: '坤', wuxing: '土', number: '二' },
  { position: 3, name: '震', wuxing: '木', number: '三' },
  { position: 4, name: '巽', wuxing: '木', number: '四' },
  { position: 5, name: '中', wuxing: '土', number: '五' },
  { position: 6, name: '乾', wuxing: '金', number: '六' },
  { position: 7, name: '兑', wuxing: '金', number: '七' },
  { position: 8, name: '艮', wuxing: '土', number: '八' },
  { position: 9, name: '离', wuxing: '火', number: '九' },
];

export const YONG_SHEN_MAP: Record<ItemType, string> = {
  '财运': '生门',
  '事业': '开门',
  '婚恋': '六合',
  '学习': '天辅',
  '考试': '景门',
  '健康': '天芮',
  '官非': '白虎',
};

export const SHI_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const RU_MU_MAP: Record<string, string> = {
  '甲': '未', '乙': '未',
  '丙': '戌', '丁': '戌',
  '戊': '辰', '己': '辰',
  '庚': '丑', '辛': '丑',
  '壬': '未', '癸': '未',
};

export const JI_XING_MAP: Record<string, string[]> = {
  '子': ['卯'],
  '卯': ['子'],
  '寅': ['巳'],
  '巳': ['寅', '申'],
  '申': ['巳', '寅'],
  '丑': ['戌'],
  '戌': ['丑', '未'],
  '未': ['戌', '丑'],
  '辰': ['辰'],
  '午': ['午'],
  '酉': ['酉'],
  '亥': ['亥'],
};

export const MEN_PO_MAP: Record<string, string> = {
  '休门': '坤',
  '生门': '艮',
  '伤门': '震',
  '杜门': '巽',
  '景门': '离',
  '死门': '坎',
  '惊门': '兑',
  '开门': '乾',
};

export const CHANG_SHENG_STATES = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];

export const WU_XING_SHENG_K: Record<string, { sheng: string[]; ke: string[] }> = {
  '金': { sheng: ['水'], ke: ['木'] },
  '木': { sheng: ['火'], ke: ['土'] },
  '水': { sheng: ['木'], ke: ['火'] },
  '火': { sheng: ['土'], ke: ['金'] },
  '土': { sheng: ['金'], ke: ['水'] },
};
