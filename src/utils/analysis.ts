import { QiMenResult, checkJiXing, checkMenPo, checkRuMu } from './qimen';
import { analyzeGeJu } from './geJu';
import { FactorWeights, getDiLiRatio, getMethodWeights, redistributeWeights, ScoringMethod } from './scoring';

export type ItemType = '财运' | '事业' | '婚恋' | '学习' | '考试' | '健康' | '官非';
export type JiXiong = '大吉' | '中吉' | '平吉' | '吉' | '小吉' | '中平' | '中性' | '中性偏凶' | '平' | '小凶' | '凶' | '大凶';

export interface AnalysisRow {
  category: string;
  situation: string;
  jiXiong: JiXiong;
  meaning: string;
  note: string;
  score?: number;
}

export interface SubjectAnalysis {
  title: string;
  palace: string;
  rows: AnalysisRow[];
  notes: string[];
  score: number;
}

export interface DetailedAnalysisResult {
  riGan: SubjectAnalysis;
  shiGan: SubjectAnalysis;
  yongShen: SubjectAnalysis;
  relation: {
    conclusion: JiXiong;
    wuxingRelation: string;
    meaning: string;
    score: number;
    basis: string;
    selectionText: string;
    shengKe: {
      conclusion: JiXiong;
      relationship: string;
      meaning: string;
    };
    finalJudgment: {
      relationship: string;
      stateText: string;
      conclusion: JiXiong;
      meaning: string;
    };
  };
}

export const GAN_ROW_SCORE = 100 / 6;
export const YONG_SHEN_ROW_SCORE = 20;
export const SPECIAL_NOTE_PENALTY = 20;

export const RELATION_SCORE: Record<JiXiong, number> = {
  大吉: 90,
  中吉: 80,
  平吉: 72,
  吉: 78,
  小吉: 66,
  中平: 45,
  中性: 55,
  中性偏凶: 48,
  平: 55,
  小凶: 42,
  凶: 32,
  大凶: 18,
};

const PALACE_INFO: Record<string, { name: string; wuxing: string; zhi: string[] }> = {
  '1': { name: '坎', wuxing: '水', zhi: ['子'] },
  '2': { name: '坤', wuxing: '土', zhi: ['未', '申'] },
  '3': { name: '震', wuxing: '木', zhi: ['卯'] },
  '4': { name: '巽', wuxing: '木', zhi: ['辰', '巳'] },
  '5': { name: '中', wuxing: '土', zhi: [] },
  '6': { name: '乾', wuxing: '金', zhi: ['戌', '亥'] },
  '7': { name: '兑', wuxing: '金', zhi: ['酉'] },
  '8': { name: '艮', wuxing: '土', zhi: ['丑', '寅'] },
  '9': { name: '离', wuxing: '火', zhi: ['午'] },
};

const GAN_WUXING: Record<string, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};

const YONG_SHEN_WUXING: Record<string, string> = {
  生门: '土',
  开门: '金',
  六合: '木',
  天辅: '木',
  景门: '火',
  天芮: '土',
  白虎: '金',
  惊门: '金',
};

const WUXING_SHENG: Record<string, string> = {
  木: '火', 火: '土', 土: '金', 金: '水', 水: '木',
};

const WUXING_KE: Record<string, string> = {
  木: '土', 土: '水', 水: '火', 火: '金', 金: '木',
};

const BRANCH_GONG: Record<string, string> = {
  子: '1', 丑: '8', 寅: '8', 卯: '3',
  辰: '4', 巳: '4', 午: '9', 未: '2',
  申: '2', 酉: '7', 戌: '6', 亥: '6',
};

const OPPOSITE_GONG: Record<string, string> = {
  '1': '9', '9': '1', '2': '8', '8': '2',
  '3': '7', '7': '3', '4': '6', '6': '4', '5': '5',
};

const BRANCH_CLASH: Record<string, string> = {
  子: '午', 午: '子', 丑: '未', 未: '丑',
  寅: '申', 申: '寅', 卯: '酉', 酉: '卯',
  辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳',
};

const STAR_WUXING: Record<string, string> = {
  天蓬: '水', 天任: '土', 天冲: '木', 天辅: '木', 天英: '火',
  天芮: '土', 天禽: '土', 天柱: '金', 天心: '金',
};

const MEN_WUXING: Record<string, string> = {
  休门: '水', 生门: '土', 伤门: '木', 杜门: '木',
  景门: '火', 死门: '土', 惊门: '金', 开门: '金',
};

const SHEN_WUXING: Record<string, string> = {
  值符: '土', 腾蛇: '火', 螣蛇: '火', 太阴: '金',
  六合: '木', 白虎: '金', 玄武: '水', 九地: '土', 九天: '金',
};

const RU_MU_RESCUE: Record<string, { tomb: string; rescueZhi: string }> = {
  甲: { tomb: '未', rescueZhi: '丑' },
  乙: { tomb: '戌', rescueZhi: '辰' },
  丙: { tomb: '戌', rescueZhi: '辰' },
  戊: { tomb: '戌', rescueZhi: '辰' },
  丁: { tomb: '丑', rescueZhi: '未' },
  己: { tomb: '丑', rescueZhi: '未' },
  庚: { tomb: '丑', rescueZhi: '未' },
  辛: { tomb: '辰', rescueZhi: '戌' },
  壬: { tomb: '辰', rescueZhi: '戌' },
  癸: { tomb: '未', rescueZhi: '丑' },
};

const JI_XING_RESCUE: Record<string, { rescueZhi: string[]; rescueGan?: string; rescueWuxing: string }> = {
  戊: { rescueZhi: ['戌', '丑'], rescueGan: '己', rescueWuxing: '火' },
  己: { rescueZhi: ['卯', '午'], rescueGan: '丁', rescueWuxing: '金' },
  庚: { rescueZhi: ['巳', '亥'], rescueGan: '己', rescueWuxing: '水' },
  辛: { rescueZhi: ['未'], rescueGan: '乙', rescueWuxing: '土' },
  壬: { rescueZhi: ['酉'], rescueWuxing: '金' },
  癸: { rescueZhi: ['亥', '申'], rescueGan: '己', rescueWuxing: '水' },
};

const MEN_PO_RESCUE: Record<string, { rescueWuxing: string; rescueZhi: string; rescueGan?: string }> = {
  '休门-9': { rescueWuxing: '木', rescueZhi: '丑' },
  '生门-1': { rescueWuxing: '金', rescueZhi: '亥' },
  '死门-1': { rescueWuxing: '金', rescueZhi: '巳' },
  '伤门-2': { rescueWuxing: '火', rescueZhi: '戌', rescueGan: '己' },
  '伤门-8': { rescueWuxing: '火', rescueZhi: '戌', rescueGan: '己' },
  '杜门-2': { rescueWuxing: '火', rescueZhi: '申', rescueGan: '庚' },
  '杜门-8': { rescueWuxing: '火', rescueZhi: '申', rescueGan: '庚' },
  '景门-7': { rescueWuxing: '土', rescueZhi: '未' },
  '景门-6': { rescueWuxing: '土', rescueZhi: '未' },
  '开门-3': { rescueWuxing: '水', rescueZhi: '卯' },
  '开门-4': { rescueWuxing: '水', rescueZhi: '卯' },
  '惊门-3': { rescueWuxing: '水', rescueZhi: '卯' },
  '惊门-4': { rescueWuxing: '水', rescueZhi: '卯' },
};

const GAN_JIXING_MEANING: Record<string, string> = {
  戊: '戊:主资本，财，投资，房子，遇击刑易破财，投资亏损。',
  己: '己:主上进，动力，欲望，遇击刑易犯小人，内心受伤。',
  庚: '庚:主开拓，冲劲，能力，遇击刑易犯官非，容易磕碰。',
  辛: '辛:主改革，现金类交易，主犯错，遇击刑易因钱的事情犯错。',
  壬: '壬:主智慧，发脾气，迷茫，遇击刑易被骗，误入歧途。',
  癸: '癸:主感情细腻，两性关系，遇击刑易婚姻不顺或出轨。',
};

const MEN_INFO: Record<string, { jiXiong: JiXiong; meaning: string }> = {
  休门: { jiXiong: '吉', meaning: '休闲、休息，休养生息；迎接新的希望，也代表有贵人相助，领导扶持。懒，喜欢玩乐，聪明。' },
  生门: { jiXiong: '吉', meaning: '生发，生气，生生不息；代表财运、生意。' },
  伤门: { jiXiong: '凶', meaning: '小人，直言口快；造成伤害，吵架，打架，出口伤人，身体受伤。' },
  杜门: { jiXiong: '平', meaning: '躲避、隐藏；拥堵，不通畅；技术能力强；内向，优雅，有气质。' },
  景门: { jiXiong: '平', meaning: '绚烂多彩，达到鼎盛。文化、美丽、展示、文书、艺术天赋，会生活，爱玩，容易成功。' },
  死门: { jiXiong: '凶', meaning: '死寂，死亡，停滞不前。玄学风水。专一，保守，固执死板。' },
  惊门: { jiXiong: '凶', meaning: '口舌争吵，担惊受怕，惊恐怪异。口才好，一针见血，胆子小。官司是非。' },
  开门: { jiXiong: '吉', meaning: '开门代表新的转机，重新开始；也代表希望、工作事业、开拓市场。开心乐观，活泼，喜欢交朋友。' },
};

const STAR_INFO: Record<string, { jiXiong: JiXiong; meaning: string }> = {
  天蓬: { jiXiong: '凶', meaning: '胆子大，好吃懒做，偷盗，遭人惦记，争抢；也主贪财好色、聪明投资、敢闯敢拼。' },
  天任: { jiXiong: '吉', meaning: '老实，勤劳肯干，踏实；任务、责任、任劳任怨，事情稳步向前。' },
  天冲: { jiXiong: '吉', meaning: '敢冲敢闯，敢于拼搏；也代表好动、冲动、冲突，利创业开拓。' },
  天辅: { jiXiong: '吉', meaning: '书生意气，风度翩翩；辅助、辅佐、军师、聪明、学习，适合升官考试。' },
  天英: { jiXiong: '凶', meaning: '英雄、英俊、英勇；也主乱子、麻烦，过旺时代表麻烦或身体受伤。' },
  天芮: { jiXiong: '凶', meaning: '教育、医疗相关；为病星，常用于疾病断测，或事情内部存在问题。' },
  天禽: { jiXiong: '吉', meaning: '中宫调和之星，主稳定、枢纽、承载与协调。' },
  天柱: { jiXiong: '凶', meaning: '中流砥柱；也主破坏、拆除、麻烦，适合搬家、破坏、拆除等事。' },
  天心: { jiXiong: '吉', meaning: '大吉之星，原型为领导才能、将帅人才、军事指挥；适合就职工作。' },
};

const SHEN_INFO: Record<string, { jiXiong: JiXiong; meaning: string }> = {
  值符: { jiXiong: '吉', meaning: '权贵、权威、权力、领导；高贵、贵重、昂贵、值钱；重大、重要。' },
  腾蛇: { jiXiong: '凶', meaning: '狡诈、变化多端、暗中小人；纠缠、反复、波折；惊恐、神经紧张。' },
  螣蛇: { jiXiong: '凶', meaning: '狡诈、变化多端、暗中小人；纠缠、反复、波折；惊恐、神经紧张。' },
  太阴: { jiXiong: '吉', meaning: '阴德、积德行善；荫蔽，暗中保护和资助；暗中、没有公开、不明朗。' },
  六合: { jiXiong: '吉', meaning: '合婚、合作、合同、合伙人；仁义、人缘好，人际关系好，得贵人相助。' },
  白虎: { jiXiong: '凶', meaning: '杀戮、斗争、杀伐、牢狱、官司；身体受伤、精神压力大；干扰、压力。' },
  玄武: { jiXiong: '凶', meaning: '欺骗、造假、隐瞒、虚伪；口舌争吵；暧昧好色；神秘、玄学、说不准。' },
  九地: { jiXiong: '吉', meaning: '厚德载物，滋养万物；稳定踏实、持久长期；低调、保守、消极。' },
  九天: { jiXiong: '吉', meaning: '高处、高大；遥远、好高骛远、大展宏图、格局大；猛烈好动，主动出击。' },
};

const CHANG_SHENG_MEANING: Record<string, { jiXiong: JiXiong; meaning: string }> = {
  长生: { jiXiong: '吉', meaning: '出生，万事待发。因此整体比较好。' },
  沐浴: { jiXiong: '平', meaning: '洗澡快速成长，但对感情、健康不利，桃花太多，甚至遇烂桃花。' },
  冠带: { jiXiong: '吉', meaning: '成年，正式着装。逐渐成长，利感情和健康，不利匆忙赚钱和工作。' },
  临官: { jiXiong: '吉', meaning: '工作，融入社会。有利于工作和赚钱，但也可能消耗感情与健康。' },
  帝旺: { jiXiong: '吉', meaning: '极致，盛中藏衰。对婚姻、事业、赚钱有利，但不利健康。' },
  衰: { jiXiong: '凶', meaning: '变弱，整体衰落。各方面都不好。' },
  病: { jiXiong: '凶', meaning: '生病，健康恶化。各方面都不好。' },
  死: { jiXiong: '凶', meaning: '死去，意识停止。各方面都不好。' },
  墓: { jiXiong: '凶', meaning: '入墓，关闭封藏，是最差的状态。' },
  绝: { jiXiong: '凶', meaning: '绝灭，一切消失。相对静止、没有生命的状态。' },
  胎: { jiXiong: '吉', meaning: '怀胎，新的开始。高速成长期，但基数很低。' },
  养: { jiXiong: '吉', meaning: '孕育，关爱成长。高速成长期，但基数很低。' },
};

const CHANG_SHENG_SCORE: Record<'婚姻' | '事业' | '财运' | '健康', Record<string, number>> = {
  婚姻: { 长生: 3, 沐浴: -4, 冠带: 5, 临官: -3, 帝旺: 2, 衰: -2, 病: -3, 死: -4, 墓: -3, 绝: -1, 胎: 4, 养: 5 },
  事业: { 长生: 1, 沐浴: 3, 冠带: -3, 临官: 5, 帝旺: 3, 衰: -2, 病: -1, 死: -2, 墓: -3, 绝: -1, 胎: 4, 养: 2 },
  财运: { 长生: 2, 沐浴: 2, 冠带: -2, 临官: 3, 帝旺: 2, 衰: -3, 病: -4, 死: -3, 墓: -4, 绝: -2, 胎: 5, 养: 3 },
  健康: { 长生: 2, 沐浴: -1, 冠带: 3, 临官: -3, 帝旺: -4, 衰: -1, 病: -2, 死: -3, 墓: -1, 绝: -1, 胎: 3, 养: 5 },
};

const ITEM_TO_SCORE_TYPE: Record<ItemType, '婚姻' | '事业' | '财运' | '健康'> = {
  财运: '财运',
  事业: '事业',
  婚恋: '婚姻',
  学习: '事业',
  考试: '事业',
  健康: '健康',
  官非: '事业',
};

const YONG_SHEN_MAP: Record<ItemType, string[]> = {
  财运: ['生门'],
  事业: ['开门'],
  婚恋: ['六合'],
  学习: ['天辅'],
  考试: ['景门'],
  健康: ['天芮'],
  官非: ['白虎', '惊门'],
};

const MEN_PO_NOTE: Record<string, string> = {
  生门: '生门门破：破财源，破财运，不利生意。',
  死门: '死门门破：大凶之意，易有生死之劫。',
  杜门: '杜门门破：郁郁不得志，发展无门。',
  伤门: '伤门门破：外力撞击，伤害，抑郁焦虑，精神伤痛。',
  惊门: '惊门门破：惊悸，被外物控制心神。',
  开门: '开门门破：工作压力大，很难开创。',
  休门: '休门门破：抓不住贵人；忙碌，神经紧张。',
  景门: '景门门破：人脉差，文运差，临白虎易有血光。',
};

const CHANG_SHENG_ORDER = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];
const CHANG_SHENG_BRANCHES: Record<string, string[]> = {
  甲: ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'],
  丙: ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
  戊: ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
  庚: ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
  壬: ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
  乙: ['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
  丁: ['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
  己: ['酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申'],
  辛: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
  癸: ['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅'],
};

const COMBO_MEANING: Record<string, Record<string, string>> = {
  生门: {
    天任: '踏实工作、承担责任来财', 天蓬: '犯小人易失财', 天辅: '技术专业、给别人出谋划策来财', 天冲: '容易冲动失财',
    天柱: '独当一面来财，但求财路较艰辛', 天英: '容易仗义失财或酒后失财', 天心: '助人为乐来财，公益奉献类事业较快',
    天芮: '容易犯错失财', 值符: '领导团队来财，或跟对领导来财', 腾蛇: '财进财出不定', 太阴: '福德庇佑来财，暗处来财',
    白虎: '求财压力较大', 六合: '广结人缘来财，或婚姻来财', 玄武: '容易上当失财', 九地: '持续稳定来财', 九天: '好高骛远失财',
  },
  开门: {
    天任: '工作脚踏实地', 天蓬: '工作容易懒散', 天辅: '技术专业或咨询型工作，工作体面', 天冲: '工作容易冲动',
    天柱: '工作独当一面', 天英: '工作意气用事，或因酒失事', 天心: '工作容易升职', 天芮: '工作容易犯错',
    值符: '工作领导团队，或工作离领导较近', 腾蛇: '工作变动大', 太阴: '工作往往有暗中帮助', 白虎: '工作压力较大',
    六合: '工作左右逢源，人脉好', 玄武: '工作易犯小人，有人挖坑', 九地: '工作稳定长久', 九天: '工作视野大，但也容易好高骛远',
  },
  六合: {
    天任: '感情稳定和谐', 天蓬: '容易抱有幻想，外缘期待多', 天辅: '夫妻相敬如宾，善于沟通', 天冲: '易吵架起冲突',
    天柱: '男主外女主内，各有支撑', 天芮: '互相挑刺嫌弃', 天心: '感情灵魂伴侣', 伤门: '容易吵架打架',
    天英: '夫妻齐心协力，但酒气过重则易冲突', 杜门: '易冷战不沟通', 休门: '感情甜蜜温存', 死门: '感情一潭死水',
    生门: '感情生生不息', 惊门: '容易吵架焦虑', 景门: '感情浪漫', 开门: '容易离婚分开或异地分居',
  },
  天辅: {
    休门: '容易贵人指点', 伤门: '抗挫折能力弱，学习压力大', 生门: '学习充满动力', 死门: '没有心思学习',
    杜门: '喜欢钻研学习', 惊门: '学习易受干扰', 景门: '考试成绩较好', 开门: '学习常坐不住，但利开拓性研究',
    值符: '学习能力较强，自控力强', 腾蛇: '情绪容易波动', 太阴: '能静下心学习', 白虎: '学习压力较大',
    六合: '在校人缘很好', 玄武: '学习容易分心或受暧昧影响', 九地: '刻苦勤奋好学', 九天: '容易天马行空',
  },
  景门: {
    值符: '大吉：官方认可，主考赏识，卷面得分高', 太阴: '小凶：思路藏得住但表达不清，易因犹豫丢分',
    九天: '大吉：思维开阔，发挥超常，创新答法易出彩', 白虎: '大凶：突发失误，扣分严重，考运受损',
    天辅: '大吉：文星高照，学识扎实，答卷规范', 玄武: '凶：审题不清，知识混淆，答非所问',
    天英: '大吉：文采斐然，表达力强，作文或论述题出彩', 天芮: '凶：知识点漏洞多，基础不牢，偏科明显',
    天心: '中吉：逻辑清晰，理性强，答题有条理', 天冲: '小凶：急躁粗心，忙中出错，发挥波动大',
    天任: '小吉：踏实细心，基础分稳', 天柱: '凶：表达混乱，文科或口试失分重', 九地: '小凶：思路迟缓，发挥保守',
    天蓬: '小凶：反应快但粗心，成绩波动大',
  },
  天芮: {
    值符: '吉：病有良方，遇良医相助，治疗正规有效', 腾蛇: '凶：病情反复无常，缠绵难愈', 九天: '吉：病气向外消散，恢复速度快',
    太阴: '凶：病情隐匿难查，恢复极慢', 六合: '吉：治疗方案得当，多方调理有效', 白虎: '凶：病情凶险，易突发恶化',
    伤门: '吉：病气被强力克制，治疗得力', 玄武: '凶：病因迷糊，易误诊或用药不当', 杜门: '吉：病情发展被阻断',
    九地: '凶：病气入里，缠绵难愈', 开门: '吉：治疗方案见效快，可顺利恢复', 休门: '凶：病情缠绵，精神萎靡',
    惊门: '吉：有惊无险，治疗后恢复顺利', 生门: '凶：病气持续增生加重', 景门: '凶：炎症发热加剧，反复无常', 死门: '大凶：病情危重，常规治疗无效',
  },
  白虎: {
    天辅: '吉：官非有贵人相助，文书得力', 天蓬: '凶：是非缠身，败诉风险高', 天英: '吉：可通过公开澄清与证据链化解',
    天芮: '凶：官非缠绵难愈，反复消耗', 天禽: '吉：可通过官方调解平稳化解', 天冲: '凶：因冲动争斗升级',
    天心: '吉：理性应对，法律策略有效', 天柱: '凶：口舌不断，名誉受损', 天任: '吉：踏实协商，合规调解',
    休门: '凶：长期消耗，无有效化解', 景门: '吉：通过法律文书与证据化解', 生门: '凶：官非持续升级',
    杜门: '吉：私下调解、保密协商可平息', 死门: '大凶：官非凶险，败诉风险极高', 伤门: '吉：主动维权、固定证据可解决',
    开门: '吉：正规法律途径或官方介入可解决', 惊门: '吉：虚惊一场，可快速化解',
  },
  惊门: {
    值符: '吉：有官方贵人相助，可快速化解', 腾蛇: '凶：虚惊怪讼，拖延反复', 九天: '吉：主动出击、公开澄清可胜',
    太阴: '凶：阴私暗地是非，取证困难', 六合: '吉：协商调解可达成和解', 白虎: '凶：凶险升级，牢狱刑伤风险高',
    天辅: '吉：文书和证据链有力', 玄武: '凶：诬告、诽谤、证据不足', 天英: '吉：主动沟通可压制口舌',
    九地: '凶：长期纠缠，持续消耗', 天禽: '吉：官方流程平稳化解', 天蓬: '凶：对方咄咄逼人，败诉风险高',
    天心: '吉：理性策略能平稳落地', 天芮: '凶：反复出现，难以根治', 天任: '吉：主动协商可平稳解决',
    天冲: '凶：因冲动口舌争斗升级', 天柱: '凶：口舌不断，名誉严重受损',
  },
};

const RELATION_TEXT: Record<ItemType, Record<string, string>> = {
  财运: {
    生: '大吉，财运旺盛，求财易得，有贵人相助，投资、创业、副业均能顺利获利，财富持续增长。',
    同: '平吉，财运平稳无波动，正财收入稳定，可通过长期稳健理财积累。',
    泄: '吉，努力求财有回报，自身能力可转化为财富，虽需付出精力，但收益可观。',
    克出: '凶，求财费力受阻，投资创业易决策失误，难以获得预期收益。',
    克入: '大凶，求财招灾，易有大额破财、投资暴雷、资金被骗，甚至引发口舌官非。',
  },
  事业: {
    生: '大吉，事业运旺，有领导或官方贵人主动相助，升职加薪、项目落地、创业发展均能推进。',
    同: '平吉，事业平稳，个人能力与工作要求匹配，可通过稳健表现实现晋升。',
    泄: '小吉，事业需主动付出才有回报，业绩可转化为成果，但需持续投入精力。',
    克出: '凶，事业持续受阻，易离职、调岗、项目失败，与领导同事矛盾增多。',
    克入: '大凶，事业运极差，易失业、降职、项目暴雷，并可能引发名誉或财富损失。',
  },
  婚恋: {
    生: '大吉，婚恋运旺，正缘主动靠近，伴侣真心呵护，相亲、表白、订婚、结婚均较顺。',
    同: '平吉，关系平稳和谐，双方三观契合，适合长期相处推进婚姻。',
    泄: '小吉，婚恋需主动付出才有回报，但要避免一味内耗。',
    克出: '凶，感情中对抗较重，控制欲或挑剔易造成争吵，有分手风险。',
    克入: '大凶，婚恋运差，易遇桃花劫或被感情压制伤害，分手离婚风险高。',
  },
  学习: {
    生: '大吉，学习运旺，文星高照，有老师或学业贵人相助，理解与吸收效率高。',
    同: '平吉，学习状态稳定，能按部就班掌握知识点。',
    泄: '小吉，学习需主动投入，认真钻研可转化为成绩提升。',
    克出: '凶，学习受阻，厌学或方法错误，知识点吸收困难。',
    克入: '大凶，学习压力极大，记忆理解受损，考试升学接连失利风险高。',
  },
  考试: {
    生: '大吉，考运旺盛，发挥超常，录取顺利，有贵人或主考老师相助。',
    同: '平吉，发挥与自身水平匹配，正常发挥，能顺利过线。',
    泄: '吉，努力有回报，能将学识转化为分数，发挥稳定。',
    克出: '凶，状态不佳，粗心审题不清，所学内容难以发挥。',
    克入: '大凶，临场紧张怯场，发挥严重失常，落榜风险高。',
  },
  健康: {
    生: '平，无明显凶煞则为平吉，有凶煞则转凶。',
    同: '平，无明显凶煞则为平吉，有凶煞则转凶。',
    泄: '凶，命主元气持续耗损生助病气，病情缠绵加重。',
    克出: '吉，命主元气充足，能克制病气，治疗对症则恢复较快。',
    克入: '大凶，病气旺盛克制命主元气，治疗难见效，病情持续加重。',
  },
  官非: {
    生: '大吉，官非有官方贵人相助，可通过正规法律途径快速化解。',
    同: '平吉，官非平稳无升级，可通过协商调解解决。',
    泄: '吉，命主可主动应对、完善证据链，口舌是非逐步平息。',
    克出: '凶，策略失误，易冲动行事、证据不足，官司陷入被动。',
    克入: '大凶，官非凶险，命主被动，牢狱、刑伤、败诉风险高。',
  },
};

function normalizeStar(star: string): string {
  if (star.includes('天芮')) return '天芮';
  if (star.includes('天禽')) return '天禽';
  return star;
}

function getRuiQinGong(result: QiMenResult): string {
  return Object.keys(result.jiuXing).find(gong => gong !== '5' && normalizeStar(result.jiuXing[gong]) === '天芮') || '2';
}

function findPalaceByGan(result: QiMenResult, gan: string, hiddenGan?: string): string {
  const targetGan = gan === '甲' && hiddenGan ? hiddenGan : gan;
  const outerGongOrder = ['4', '9', '2', '3', '7', '8', '1', '6'];
  const outerGong = outerGongOrder.find(gong => result.tianPan[gong] === targetGan);
  if (outerGong) return outerGong;
  return result.tianPan['5'] === targetGan ? getRuiQinGong(result) : '';
}

function findPalaceBySymbol(result: QiMenResult, symbols: string[]): { gong: string; symbol: string } {
  for (const symbol of symbols) {
    const gong = Object.keys(result.baMen).find(key => result.baMen[key] === symbol)
      || Object.keys(result.jiuXing).find(key => normalizeStar(result.jiuXing[key]) === symbol)
      || Object.keys(result.baShen).find(key => result.baShen[key] === symbol)
      || '';
    if (gong) return { gong, symbol };
  }
  return { gong: '', symbol: symbols[0] };
}

function palaceLabel(gong: string): string {
  const info = PALACE_INFO[gong];
  return info ? `${info.name}宫` : '未知宫';
}

function scoreRow(jiXiong: JiXiong, maxScore: number): number {
  if (jiXiong.includes('吉')) return maxScore;
  if (jiXiong === '平' || jiXiong === '中性') return maxScore / 2;
  if (jiXiong === '中性偏凶') return maxScore * 0.3;
  return 0;
}

function jiXiongByScore(score: number): JiXiong {
  if (score >= 80) return '大吉';
  if (score >= 65) return '吉';
  if (score >= 50) return '平';
  if (score >= 30) return '小凶';
  return '凶';
}

type MonthState = '旺' | '相' | '休' | '囚' | '死';

const MONTH_STATE_SCORE: Record<MonthState, number> = {
  旺: 100,
  相: 90,
  休: 50,
  囚: 30,
  死: 0,
};

const MONTH_ZHI_WUXING: Record<string, string> = {
  寅: '木', 卯: '木',
  巳: '火', 午: '火',
  申: '金', 酉: '金',
  亥: '水', 子: '水',
  辰: '土', 戌: '土', 丑: '土', 未: '土',
};

function monthState(monthWuxing: string, sourceWuxing: string): MonthState {
  if (monthWuxing === sourceWuxing) return '旺';
  if (WUXING_SHENG[monthWuxing] === sourceWuxing) return '相';
  if (WUXING_SHENG[sourceWuxing] === monthWuxing) return '休';
  if (WUXING_KE[monthWuxing] === sourceWuxing) return '死';
  return '囚';
}

export function getDiLiByWuxing(
  sourceWuxing: string,
  gong: string,
  monthZhi: string,
  sourceName = '天干',
  ratio = { palace: 0.5, month: 0.5 }
) {
  const palaceResult = elementPalaceJiXiong(sourceWuxing, gong, sourceName);
  const palaceScore = scoreRow(palaceResult.jiXiong, 100);
  const monthWuxing = MONTH_ZHI_WUXING[monthZhi] || '';

  if (!monthWuxing || !sourceWuxing) {
    const fallbackScore = palaceScore * ratio.palace + 50 * ratio.month;
    return {
      jiXiong: jiXiongByScore(fallbackScore),
      score: fallbackScore,
      meaning: `${palaceResult.meaning} 月令信息不足，月令部分暂以平论。`,
      note: `宫位${Math.round(ratio.palace * 100)}%，月令${Math.round(ratio.month * 100)}%`,
    };
  }

  const state = monthState(monthWuxing, sourceWuxing);
  const stateScore = MONTH_STATE_SCORE[state];
  const score = palaceScore * ratio.palace + stateScore * ratio.month;
  const stateMeaningMap: Record<MonthState, string> = {
    旺: `${sourceName}得月令同气，为旺。`,
    相: `月令生${sourceName}，为相。`,
    休: `${sourceName}生月令，为休。`,
    囚: `${sourceName}克月令而受困，为囚。`,
    死: `月令克${sourceName}，为死。`,
  };

  return {
    jiXiong: jiXiongByScore(score),
    score,
    meaning: `${palaceResult.meaning} 月令${monthZhi}属${monthWuxing}，${stateMeaningMap[state]}`,
    note: `宫位${Math.round(ratio.palace * 100)}%，月令${Math.round(ratio.month * 100)}%（${state}）`,
  };
}

function rowFactor(category: string): keyof FactorWeights | '' {
  if (category === '天时') return '天时';
  if (category === '地利') return '地利';
  if (category === '人和') return '人和';
  if (category === '神助') return '神助';
  if (category === '格局') return '格局';
  if (category === '周期') return '周期';
  return '';
}

export function getGanChangSheng(gan: string, gong: string): string {
  const branches = CHANG_SHENG_BRANCHES[gan];
  const palaceBranches = PALACE_INFO[gong]?.zhi || [];
  if (!branches || palaceBranches.length === 0) return '长生';
  const index = branches.findIndex(branch => palaceBranches.includes(branch));
  return CHANG_SHENG_ORDER[index >= 0 ? index : 0];
}

export function getGanChangShengJiXiong(gan: string, gong: string): JiXiong {
  const changSheng = getGanChangSheng(gan, gong);
  return CHANG_SHENG_MEANING[changSheng]?.jiXiong || '平';
}

function inferComboJiXiong(text: string): JiXiong {
  if (text.includes('大凶')) return '大凶';
  if (text.includes('小凶')) return '小凶';
  if (text.includes('凶')) return '凶';
  if (text.includes('大吉')) return '大吉';
  if (text.includes('小吉')) return '小吉';
  if (text.includes('吉')) return '吉';
  const negativeWords = ['失', '犯错', '小人', '压力', '懒散', '冲动', '变动', '上当', '分心', '波动', '冷战', '离婚', '不通', '粗心', '漏洞', '混淆', '缠绵', '误诊', '加重', '败诉', '升级', '消耗', '受损'];
  return negativeWords.some(word => text.includes(word)) ? '凶' : '吉';
}

function comboRowInfo(yongShenSymbol: string | undefined, symbol: string, fallback: { jiXiong: JiXiong; meaning: string }) {
  if (!yongShenSymbol) return fallback;
  const comboText = COMBO_MEANING[yongShenSymbol]?.[symbol];
  if (!comboText) return { jiXiong: '平' as JiXiong, meaning: '原始需求文档的用神计算说明未配置该组合断语。' };
  return {
    jiXiong: inferComboJiXiong(comboText),
    meaning: comboText.replace(/^(大吉|小吉|吉|平吉|平|小凶|大凶|凶|中吉)：/, ''),
  };
}

function categoryForYongShen(symbol: string): '天时' | '人和' | '神助' | '' {
  if (STAR_INFO[symbol]) return '天时';
  if (MEN_INFO[symbol]) return '人和';
  if (SHEN_INFO[symbol]) return '神助';
  return '';
}

function elementPalaceJiXiong(sourceWuxing: string, gong: string, sourceName = '天干'): { jiXiong: JiXiong; meaning: string } {
  const palaceWx = PALACE_INFO[gong]?.wuxing;
  if (!sourceWuxing || !palaceWx) return { jiXiong: '平', meaning: '宫位信息不足，暂以平论。' };
  if (WUXING_KE[sourceWuxing] === palaceWx) return { jiXiong: '小吉', meaning: `${sourceName}克宫位：努力有得。` };
  if (WUXING_KE[palaceWx] === sourceWuxing) return { jiXiong: '大凶', meaning: `宫位克${sourceName}：多阻无成。` };
  if (WUXING_SHENG[sourceWuxing] === palaceWx) return { jiXiong: '小凶', meaning: `${sourceName}生宫位：多有消耗。` };
  if (WUXING_SHENG[palaceWx] === sourceWuxing) return { jiXiong: '大吉', meaning: `宫位生${sourceName}：得地之助。` };
  return { jiXiong: '吉', meaning: `${sourceName}同宫位五行：平顺有成。` };
}

function palaceJiXiong(gan: string, gong: string): { jiXiong: JiXiong; meaning: string } {
  return elementPalaceJiXiong(GAN_WUXING[gan], gong, '天干');
}

type FourHarmKind = '空亡' | '入墓' | '击刑' | '门破';
type FourHarmStatus = '假空' | '半假空' | '真空' | '假墓' | '真墓' | '假击刑' | '真击刑' | '假门破' | '真门破';

interface FourHarmItem {
  kind: FourHarmKind;
  status: FourHarmStatus;
  coefficient: number;
  severe: boolean;
  note: string;
}

const FOUR_HARM_DANGER: Record<FourHarmKind, string> = {
  空亡: '空亡代表“没有、落空”。吉事不吉，凶事不凶。如果问事，用神逢空亡，基本等于这件事“不存在”或“没结果”。',
  入墓: '入墓代表“被困、无力”。就像一个人被关在地下室，他再有才华（吉格好）也发挥不出来。',
  击刑: '击刑代表“破损、难受”。这是最严重的负面能量，代表事情内部有巨大的矛盾或伤害。',
  门破: '门破代表“破坏、冲突”。人和环境的剧烈冲突，吉门被迫吉不就。',
};

const FOUR_HARM_COEFFICIENT: Record<FourHarmStatus, number> = {
  假空: 1,
  半假空: 0.5,
  真空: 0.3,
  假墓: 0.9,
  真墓: 0.3,
  假击刑: 0.6,
  真击刑: 0.3,
  假门破: 0.7,
  真门破: 0.3,
};

function samePalaceGans(result: QiMenResult, gong: string, includeCenter = true): string[] {
  const gans = [result.tianPan[gong], result.diPan[gong]];
  if (includeCenter && gong !== '5' && normalizeStar(result.jiuXing[gong] || '') === '天芮') {
    gans.push(result.tianPan['5'], result.diPan['5']);
  }
  return Array.from(new Set(gans.filter(Boolean)));
}

function samePalaceWuxing(result: QiMenResult, gong: string, excludeGan?: string): string[] {
  const star = normalizeStar(result.jiuXing[gong] || '');
  const values = [
    STAR_WUXING[star],
    MEN_WUXING[result.baMen[gong]],
    SHEN_WUXING[result.baShen[gong]],
    ...samePalaceGans(result, gong).filter(gan => gan !== excludeGan && !checkJiXing(gan, gong)).map(gan => GAN_WUXING[gan]),
  ];
  return values.filter(Boolean);
}

function hasTwoRescueWuxing(result: QiMenResult, gong: string, wuxing: string, excludeGan?: string) {
  return samePalaceWuxing(result, gong, excludeGan).filter(item => item === wuxing).length >= 2;
}

function hasRescueGan(result: QiMenResult, gong: string, rescueGan?: string) {
  if (!rescueGan) return false;
  return [result.siZhu.day[0], result.siZhu.month[0], ...samePalaceGans(result, gong)].includes(rescueGan);
}

function hasRescueZhi(result: QiMenResult, rescueZhi: string | string[]) {
  const options = Array.isArray(rescueZhi) ? rescueZhi : [rescueZhi];
  return options.includes(result.siZhu.day[1]) || options.includes(result.siZhu.month[1]);
}

function buildHarmNote(base: string, kind: FourHarmKind, status: FourHarmStatus, reason: string) {
  const truth = status.startsWith('真') ? `真${kind}` : status;
  return `${base}但${reason}，因此是${truth}。${FOUR_HARM_DANGER[kind]}`;
}

export function analyzeFourHarms(result: QiMenResult, gong: string, focusGan?: string) {
  const items: FourHarmItem[] = [];
  const palaceGans = Array.from(new Set([...samePalaceGans(result, gong), focusGan].filter(Boolean)));

  const kongBranches = result.kongWangZhi.filter(zhi => BRANCH_GONG[zhi] === gong);
  if (kongBranches.length > 0) {
    const maRescue = result.maStar.gong === gong || result.maStar.gong === OPPOSITE_GONG[gong];
    const rescued = kongBranches.filter(zhi =>
      maRescue
      || result.siZhu.day[1] === zhi
      || result.siZhu.month[1] === zhi
      || result.siZhu.day[1] === BRANCH_CLASH[zhi]
      || result.siZhu.month[1] === BRANCH_CLASH[zhi]
    );
    const status: FourHarmStatus = rescued.length === kongBranches.length ? '假空' : rescued.length > 0 ? '半假空' : '真空';
    const reason = status === '真空'
      ? '无日月地支、冲支或驿马解救'
      : maRescue ? '本宫或对宫有驿马解救' : `日月地支解救${rescued.join('、')}`;
    items.push({
      kind: '空亡',
      status,
      coefficient: FOUR_HARM_COEFFICIENT[status],
      severe: status === '真空' || status === '半假空',
      note: buildHarmNote(`空亡${kongBranches.join('、')}。`, '空亡', status, reason),
    });
  }

  for (const gan of palaceGans) {
    if (gan && checkRuMu(gan, gong)) {
      const rescue = RU_MU_RESCUE[gan];
      const isFake = rescue ? hasRescueZhi(result, rescue.rescueZhi) : false;
      const status: FourHarmStatus = isFake ? '假墓' : '真墓';
      const base = `${gan}${GAN_WUXING[gan] || ''}入墓。代表关闭封藏，士气低迷，有心无力，百事不宜。`;
      const reason = isFake ? `日支或月支有${rescue.rescueZhi}冲墓解救` : '无解救';
      items.push({
        kind: '入墓',
        status,
        coefficient: FOUR_HARM_COEFFICIENT[status],
        severe: status === '真墓',
        note: buildHarmNote(base, '入墓', status, reason),
      });
    }

    if (gan && checkJiXing(gan, gong) && GAN_JIXING_MEANING[gan]) {
      const rescue = JI_XING_RESCUE[gan];
      const rescueByGan = hasRescueGan(result, gong, rescue?.rescueGan);
      const rescueByZhi = rescue ? hasRescueZhi(result, rescue.rescueZhi) : false;
      const rescueByWuxing = rescue ? hasTwoRescueWuxing(result, gong, rescue.rescueWuxing, gan) : false;
      const isFake = rescueByGan || rescueByZhi || rescueByWuxing;
      const status: FourHarmStatus = isFake ? '假击刑' : '真击刑';
      const reasons = [
        rescueByGan && `有${rescue?.rescueGan}天干解救`,
        rescueByZhi && `日支或月支有${rescue?.rescueZhi.join('、')}解救`,
        rescueByWuxing && `有两个以上${rescue?.rescueWuxing}五行通关`,
      ].filter(Boolean);
      const base = `${gan}${GAN_WUXING[gan] || ''}击刑。${GAN_JIXING_MEANING[gan]}`;
      items.push({
        kind: '击刑',
        status,
        coefficient: FOUR_HARM_COEFFICIENT[status],
        severe: status === '真击刑',
        note: buildHarmNote(base, '击刑', status, reasons.join('，') || '无解救'),
      });
    }
  }

  const men = result.baMen[gong];
  if (men && checkMenPo(men, gong)) {
    const rescue = MEN_PO_RESCUE[`${men}-${gong}`];
    const rescueByGan = hasRescueGan(result, gong, rescue?.rescueGan);
    const rescueByZhi = rescue ? hasRescueZhi(result, rescue.rescueZhi) : false;
    const rescueByWuxing = rescue ? samePalaceWuxing(result, gong).filter(item => item === rescue.rescueWuxing).length >= 2 : false;
    const isFake = rescueByGan || rescueByZhi || rescueByWuxing;
    const status: FourHarmStatus = isFake ? '假门破' : '真门破';
    const reasons = [
      rescueByGan && `有${rescue?.rescueGan}天干解救`,
      rescueByZhi && `日支或月支有${rescue?.rescueZhi}解救`,
      rescueByWuxing && `有两个以上${rescue?.rescueWuxing}五行通关`,
    ].filter(Boolean);
    const base = MEN_PO_NOTE[men] || `${men}门破：事情有破损阻滞之象。`;
    items.push({
      kind: '门破',
      status,
      coefficient: FOUR_HARM_COEFFICIENT[status],
      severe: status === '真门破',
      note: buildHarmNote(base, '门破', status, reasons.join('，') || '无解救'),
    });
  }

  const severeKinds = new Set(items.filter(item => item.severe).map(item => item.kind));
  const multiplier = severeKinds.size >= 2
    ? 0
    : items.reduce((value, item) => value * item.coefficient, 1);

  return {
    items,
    multiplier,
    notes: items.map(item => item.note),
  };
}

function specialNotes(result: QiMenResult, gong: string, gan: string): string[] {
  const notes: string[] = [];
  const shen = result.baShen[gong];
  notes.push(...analyzeFourHarms(result, gong, gan).notes);
  if (result.maStar.gong === gong) {
    const liuhe = shen === '六合' ? '若六合临马星，则又有分离、见面少之象。' : '';
    notes.push(`马星：主走动、外出、奔波、旅行、出差、搬家、转回职等与移动有关。${liuhe}`);
  }
  return Array.from(new Set(notes));
}

function buildSubject(
  result: QiMenResult,
  itemType: ItemType,
  title: string,
  gong: string,
  gan: string,
  weights: FactorWeights,
  diLiRatio: { palace: number; month: number },
  yongShenSymbol?: string
): SubjectAnalysis {
  if (!gong) {
    return { title, palace: '未知宫', rows: [], notes: ['未找到对应宫位，无法展开分析。'], score: 50 };
  }

  const star = normalizeStar(result.jiuXing[gong] || '');
  const men = result.baMen[gong] || '';
  const shen = result.baShen[gong] || '';
  const palace = PALACE_INFO[gong];
  const diLiResult = yongShenSymbol
    ? getDiLiByWuxing(YONG_SHEN_WUXING[yongShenSymbol], gong, result.siZhu.month[1], '用神', diLiRatio)
    : getDiLiByWuxing(GAN_WUXING[gan || result.tianPan[gong]], gong, result.siZhu.month[1], '天干', diLiRatio);
  const changSheng = getGanChangSheng(gan || result.tianPan[gong], gong);
  const changShengScore = CHANG_SHENG_SCORE[ITEM_TO_SCORE_TYPE[itemType]][changSheng] ?? 0;
  const starInfo = comboRowInfo(yongShenSymbol, star, STAR_INFO[star] || { jiXiong: '平', meaning: '暂无解释。' });
  const menInfo = comboRowInfo(yongShenSymbol, men, MEN_INFO[men] || { jiXiong: '平', meaning: '暂无解释。' });
  const shenInfo = comboRowInfo(yongShenSymbol, shen, SHEN_INFO[shen] || { jiXiong: '平', meaning: '暂无解释。' });

  const skippedCategory = categoryForYongShen(yongShenSymbol || '');
  const rows: AnalysisRow[] = [];

  if (skippedCategory !== '天时') {
    rows.push({ category: '天时', situation: `临${star}`, jiXiong: starInfo.jiXiong, meaning: starInfo.meaning, note: '无' });
  }

  rows.push({
    category: '地利',
    situation: `临${palace?.name || ''}宫/月令${result.siZhu.month[1] || ''}`,
    jiXiong: diLiResult.jiXiong,
    meaning: diLiResult.meaning,
    note: diLiResult.note,
    score: diLiResult.score,
  });

  if (skippedCategory !== '人和') {
    rows.push({ category: '人和', situation: `临${men}`, jiXiong: menInfo.jiXiong, meaning: menInfo.meaning, note: men && checkMenPo(men, gong) ? (MEN_PO_NOTE[men] || '门破，事情受阻。') : '无' });
  }

  if (skippedCategory !== '神助') {
    rows.push({ category: '神助', situation: `临${shen}`, jiXiong: shenInfo.jiXiong, meaning: shenInfo.meaning, note: '无' });
  }

  rows.push({ category: '周期', situation: `临${changSheng}`, jiXiong: CHANG_SHENG_MEANING[changSheng].jiXiong, meaning: CHANG_SHENG_MEANING[changSheng].meaning, note: `${changShengScore > 0 ? '+' : ''}${changShengScore}` });

  const geJu = analyzeGeJu({ result, gong, itemType });
  rows.push({
    category: '格局',
    situation: geJu.name,
    jiXiong: geJu.finalJudgment,
    meaning: geJu.explanation,
    note: geJu.reason,
  });

  const notes = specialNotes(result, gong, gan || result.tianPan[gong]);
  const adjustedWeights = redistributeWeights(weights, skippedCategory || undefined);
  const fourHarm = analyzeFourHarms(result, gong, gan || result.tianPan[gong]);
  const baseScore = Math.min(100, rows.reduce((sum, row) => {
    const factor = rowFactor(row.category);
    return factor ? sum + (row.score ?? scoreRow(row.jiXiong, 100)) * adjustedWeights[factor] : sum;
  }, 0));
  const rawScore = baseScore * fourHarm.multiplier;
  const score = Number(rawScore.toFixed(2));

  return {
    title,
    palace: palaceLabel(gong),
    rows,
    notes,
    score,
  };
}

function relationKind(sourceWx: string, dayWx: string): '生' | '同' | '泄' | '克出' | '克入' {
  if (sourceWx === dayWx) return '同';
  if (WUXING_SHENG[sourceWx] === dayWx) return '生';
  if (WUXING_SHENG[dayWx] === sourceWx) return '泄';
  if (WUXING_KE[dayWx] === sourceWx) return '克出';
  return '克入';
}

function conclusionFor(itemType: ItemType, kind: ReturnType<typeof relationKind>): JiXiong {
  if (itemType === '健康') {
    if (kind === '克出') return '吉';
    if (kind === '生' || kind === '同') return '平';
    if (kind === '泄') return '凶';
    return '大凶';
  }
  if (kind === '生') return '大吉';
  if (kind === '同') return '平吉';
  if (kind === '泄') return itemType === '事业' || itemType === '婚恋' || itemType === '学习' ? '小吉' : '吉';
  if (kind === '克出') return '凶';
  return '大凶';
}

const RELATION_WANG_THRESHOLD = 40;

type RelationKind = ReturnType<typeof relationKind>;
type WangState = '旺' | '弱';

const FINAL_RELATION_RULES: Record<RelationKind, Record<string, { conclusion: JiXiong; score: number; meaning: string }>> = {
  生: {
    '旺-旺': { conclusion: '大吉', score: 100, meaning: '名利双收，水到渠成。事情主动来找你，且自身实力足够，能轻松接住并享受成果。' },
    '旺-弱': { conclusion: '小凶', score: 40, meaning: '富屋贫人，虚不受补。机会虽好，但你能力/运气不足，抓不住或无福消受，甚至因福致祸。' },
    '弱-旺': { conclusion: '中平', score: 45, meaning: '有心无力，画饼充饥。你很想做且有能力，但对方（事/人）没实力或没诚意，最终难成大器。' },
    '弱-弱': { conclusion: '大凶', score: 0, meaning: '互相拖累，同流合污。烂事碰到了倒霉人，不仅办不成，还可能一起陷入泥潭，甚至遭遇诈骗。' },
  },
  泄: {
    '旺-旺': { conclusion: '中吉', score: 80, meaning: '主动投资，长线布局。适合主动出击、花钱办事或投资。目前虽累，但对方值得，未来有回报。' },
    '旺-弱': { conclusion: '凶', score: 10, meaning: '打肿充胖，力不从心。自身实力不够却硬要透支去追求，导致元气大伤，最后把自己拖垮。' },
    '弱-旺': { conclusion: '凶', score: 10, meaning: '肉包打狗，所托非人。你一片真心或投入重金，但对方是个无底洞或垃圾项目，有去无回。' },
    '弱-弱': { conclusion: '大凶', score: 0, meaning: '自取灭亡，血本无归。盲目折腾，不仅达不到目的，还会耗尽最后一点精力或本金。' },
  },
  克出: {
    '旺-旺': { conclusion: '中吉', score: 70, meaning: '劳碌致富，攻坚克难。事情有难度，但你能力强，只要肯下苦功夫、费周折，最终能拿下。' },
    '旺-弱': { conclusion: '凶', score: 20, meaning: '以卵击石，反受其辱。想掌控局面但实力悬殊，不仅控制不了，反而会被事情反噬，惹麻烦上身。' },
    '弱-旺': { conclusion: '小吉', score: 65, meaning: '大材小用，降维打击。杀鸡用牛刀，轻松拿捏。但可能因为目标太小，赚得也不多，食之无味。' },
    '弱-弱': { conclusion: '凶', score: 35, meaning: '盲人摸象，白忙一场。双方都没实力，互相扯皮或纠缠不清，最后竹篮打水一场空。' },
  },
  克入: {
    '旺-旺': { conclusion: '小凶', score: 40, meaning: '压力巨大，险中求胜。事情来势汹汹（如严厉领导、强劲对手），你虽能勉强扛住，但过程极度煎熬。' },
    '旺-弱': { conclusion: '大凶', score: 0, meaning: '泰山压顶，灭顶之灾。彻底被环境或事情压垮。主破财、官非、重病或被对手彻底击溃。' },
    '弱-旺': { conclusion: '小凶', score: 35, meaning: '阴沟翻船，小人作祟。虽然事情本身不大，但像苍蝇一样恶心你，甩不掉，让你心情极差。' },
    '弱-弱': { conclusion: '凶', score: 5, meaning: '雪上加霜，祸不单行。本来就倒霉，还遇到烂事缠身。容易被小麻烦绊倒，运势极低。' },
  },
  同: {
    '旺-旺': { conclusion: '大吉', score: 100, meaning: '强强联手，合作共赢。朋友、合伙人或环境与你同心同德，力量叠加，事半功倍。' },
    '旺-弱': { conclusion: '平', score: 50, meaning: '寄人篱下，随波逐流。平台或对方很强，但你太弱，只能依附于人，没有话语权，分红也少。' },
    '弱-旺': { conclusion: '小凶', score: 40, meaning: '遇人不淑，被猪拖累。你很有能力，但队友/环境太拉胯。在合作中你容易吃亏或被拖后腿。' },
    '弱-弱': { conclusion: '平', score: 45, meaning: '难兄难弟，停滞不前。市场不景气或双方都没动力。事情处于僵持、拖延、毫无进展的状态。' },
  },
};

const RELATION_LABELS: Record<RelationKind, string> = {
  生: '用神生日干（事来找我，大吉）',
  泄: '日干生用神（我去求事，泄气）',
  克出: '日干克用神（我掌控事，辛苦）',
  克入: '用神克日干（事来克我，压力）',
  同: '日干与用神比和（同频共振，合作）',
};

function buildRelation(
  result: QiMenResult,
  itemType: ItemType,
  dayGong: string,
  hourGong: string,
  yongGong: string,
  yongSymbol: string,
  dayScore: number,
  hourScore: number,
  yongScore: number
): DetailedAnalysisResult['relation'] {
  const useHour = !yongGong || yongGong === dayGong;
  const targetGong = useHour ? hourGong : yongGong;
  const targetName = useHour ? '时干' : yongSymbol;
  const targetScore = useHour ? hourScore : yongScore;
  const dayWx = PALACE_INFO[dayGong]?.wuxing;
  const targetWx = PALACE_INFO[targetGong]?.wuxing;
  if (!dayWx || !targetWx) {
    return {
      conclusion: '平',
      wuxingRelation: '五行关系不足',
      meaning: '未能找到完整宫位五行，暂以平论。',
      score: 50,
      basis: '资料不足',
      selectionText: '用神或日干落宫资料不足，暂无法完整判断。',
      shengKe: { conclusion: '平', relationship: '五行关系不足', meaning: '未能找到完整宫位五行，暂以平论。' },
      finalJudgment: { relationship: '五行关系不足', stateText: '资料不足', conclusion: '平', meaning: '未能找到完整宫位五行，暂以平论。' },
    };
  }
  const kind = relationKind(targetWx, dayWx);
  const shengKeConclusion = conclusionFor(itemType, kind);
  const text = RELATION_TEXT[itemType][kind];
  const relationTextMap = {
    生: `${targetName}生日干`,
    同: `${targetName}与日干同宫比和`,
    泄: `${targetName}泄日干`,
    克出: `日干克${targetName}`,
    克入: `${targetName}克日干`,
  };
  const dayState: WangState = dayScore >= RELATION_WANG_THRESHOLD ? '旺' : '弱';
  const targetState: WangState = targetScore >= RELATION_WANG_THRESHOLD ? '旺' : '弱';
  const finalRule = FINAL_RELATION_RULES[kind][`${targetState}-${dayState}`];
  const selectionText = useHour
    ? `由于用神${yongSymbol}与日干同宫，因此直接选用时干分析。按时干与日干关系定吉凶。`
    : `由于用神${yongSymbol}与日干不同宫，因此直接选用${yongSymbol}分析。按用神与日干关系定吉凶，并以时干辅助参考。`;
  const stateText = `用神${targetState}（${targetScore}分） + 日干${dayState}（${dayScore}分）`;
  const finalRelationship = RELATION_LABELS[kind].replaceAll('用神', targetName);

  return {
    conclusion: finalRule.conclusion,
    wuxingRelation: relationTextMap[kind],
    meaning: finalRule.meaning,
    score: finalRule.score,
    basis: selectionText,
    selectionText,
    shengKe: {
      conclusion: shengKeConclusion,
      relationship: relationTextMap[kind],
      meaning: text,
    },
    finalJudgment: {
      relationship: finalRelationship,
      stateText,
      conclusion: finalRule.conclusion,
      meaning: finalRule.meaning,
    },
  };
}

export function analyzeQiMen(result: QiMenResult, itemType: ItemType, scoringMethod: ScoringMethod = '平均算法', customWeights?: FactorWeights): DetailedAnalysisResult {
  const dayGan = result.siZhu.day[0];
  const hourGan = result.siZhu.time[0];
  const dayGong = findPalaceByGan(result, dayGan, result.dayXunShou);
  const hourGong = findPalaceByGan(result, hourGan, result.xunShou);
  const yong = findPalaceBySymbol(result, YONG_SHEN_MAP[itemType]);
  const weights = getMethodWeights(scoringMethod, customWeights);
  const diLiRatio = getDiLiRatio(scoringMethod);

  const riGan = buildSubject(result, itemType, `日干分析：日干为${dayGan}${GAN_WUXING[dayGan] || ''}`, dayGong, dayGan, weights, diLiRatio);
  const shiGan = buildSubject(result, itemType, `时干分析：时干为${hourGan}${GAN_WUXING[hourGan] || ''}`, hourGong, hourGan, weights, diLiRatio);
  const yongShen = buildSubject(result, itemType, `用神分析：取${YONG_SHEN_MAP[itemType].join('+')}为用神`, yong.gong, result.tianPan[yong.gong], weights, diLiRatio, yong.symbol);

  return {
    riGan,
    shiGan,
    yongShen,
    relation: buildRelation(result, itemType, dayGong, hourGong, yong.gong, yong.symbol, riGan.score, shiGan.score, yongShen.score),
  };
}
