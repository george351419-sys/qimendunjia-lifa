export type ScoreFactor = '天时' | '地利' | '人和' | '神助' | '格局' | '周期';
export type ScoringMethod = '格局主导法' | '天地人主导法' | '地利旺衰主导法' | '平均算法' | '自定义法';

export type FactorWeights = Record<ScoreFactor, number>;

export const SCORE_FACTORS: ScoreFactor[] = ['天时', '地利', '人和', '神助', '格局', '周期'];

export const DEFAULT_CUSTOM_WEIGHTS: FactorWeights = {
  天时: 0.2,
  地利: 0.3,
  人和: 0.3,
  神助: 0.2,
  格局: 0,
  周期: 0,
};

export const SCORING_METHOD_WEIGHTS: Record<ScoringMethod, FactorWeights> = {
  格局主导法: {
    天时: 0.1,
    地利: 0.15,
    人和: 0.25,
    神助: 0.15,
    格局: 0.3,
    周期: 0.05,
  },
  天地人主导法: {
    天时: 0.25,
    地利: 0.25,
    人和: 0.25,
    神助: 0.1,
    格局: 0.1,
    周期: 0.05,
  },
  地利旺衰主导法: {
    天时: 0.15,
    地利: 0.35,
    人和: 0.15,
    神助: 0.05,
    格局: 0.25,
    周期: 0.05,
  },
  平均算法: {
    天时: 1 / 6,
    地利: 1 / 6,
    人和: 1 / 6,
    神助: 1 / 6,
    格局: 1 / 6,
    周期: 1 / 6,
  },
  自定义法: DEFAULT_CUSTOM_WEIGHTS,
};

export const FACTOR_EXPLANATIONS: Record<ScoreFactor, string> = {
  天时: '以盘中九星（月令、节气、四季五行旺衰）为代表，对应外部大环境、行业趋势、政策风向、整体时机、客观大势；决定事情是否顺势而为。',
  地利: '以地盘九宫和月令共同判断：50%看天干/用神五行与宫位五行的生克，50%看天干/用神五行在当前月令中的旺相休囚死。',
  人和: '以八门、门破、门迫、宫门生克为代表，对应个人决策、沟通协作、人际关系、执行力、团队状态；主导人为选择与行动层面的顺逆。',
  神助: '以八神为代表，对应无形气场、贵人帮扶、意外变故、是非口舌、心理状态、机缘灵感、隐性风险。',
  格局: '以三奇六仪组合、击刑、合害、各类吉凶格为代表，对应事件内在能量结构、细节利弊、隐性隐患、规则冲突、事态本质吉凶。',
  周期: '以入墓、入库、旬空、伏吟、反吟、十二长生等为代表，对应事情快慢、拖延反复、时机成熟度、停滞状态、应验节奏。',
};

export const METHOD_EXPLANATIONS: Record<ScoringMethod, string> = {
  格局主导法: '适用于单点求事、当下状态、具体行为成败。核心看宫内符号组合与人事行动，格局和八门权重最高。',
  天地人主导法: '适用于长期运势、大方向、行业或事业全局、多年规划，优先看天时、地利、人和三大底座。',
  地利旺衰主导法: '结合月令和宫位生克判断旺衰，与体用关系决定吉凶配合比较好。',
  平均算法: '均衡分析六项因素，把天时、地利、人和、神助、格局、周期平均纳入参考。',
  自定义法: '根据问题灵活设定权重。若不填写，默认天时20%、地利30%、人和30%、神助20%、格局0%、周期0%。',
};

export function getDiLiRatio(method: ScoringMethod) {
  if (method === '地利旺衰主导法') {
    return { palace: 0.35, month: 0.65 };
  }
  return { palace: 0.5, month: 0.5 };
}

export function normalizeWeights(weights: FactorWeights): FactorWeights {
  const total = SCORE_FACTORS.reduce((sum, factor) => sum + (Number.isFinite(weights[factor]) ? weights[factor] : 0), 0);
  if (total <= 0) return SCORING_METHOD_WEIGHTS.平均算法;
  return SCORE_FACTORS.reduce((next, factor) => {
    next[factor] = Math.max(0, weights[factor] || 0) / total;
    return next;
  }, {} as FactorWeights);
}

export function getMethodWeights(method: ScoringMethod, customWeights?: FactorWeights): FactorWeights {
  return normalizeWeights(method === '自定义法' ? (customWeights || DEFAULT_CUSTOM_WEIGHTS) : SCORING_METHOD_WEIGHTS[method]);
}

export function redistributeWeights(weights: FactorWeights, omitted?: ScoreFactor): FactorWeights {
  if (!omitted) return weights;
  const omittedWeight = weights[omitted] || 0;
  const remaining = SCORE_FACTORS.filter(factor => factor !== omitted);
  const extra = omittedWeight / remaining.length;
  return SCORE_FACTORS.reduce((next, factor) => {
    next[factor] = factor === omitted ? 0 : (weights[factor] || 0) + extra;
    return next;
  }, {} as FactorWeights);
}

export function formatPercent(weight: number) {
  return `${Number((weight * 100).toFixed(1))}%`;
}
