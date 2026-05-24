import { QiMenResult, checkJiXing, checkMenPo, checkRuMu } from './qimen';

export type ItemType = '财运' | '事业' | '婚恋' | '学习' | '考试' | '健康' | '官非';
export type JiXiong = '大吉' | '平吉' | '吉' | '小吉' | '平' | '小凶' | '凶' | '大凶';

export interface AnalysisRow {
  category: string;
  situation: string;
  jiXiong: JiXiong;
  meaning: string;
  note: string;
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
  };
}

export const GAN_ROW_SCORE = 20;
export const YONG_SHEN_ROW_SCORE = 25;
export const SPECIAL_NOTE_PENALTY = 20;

export const RELATION_SCORE: Record<JiXiong, number> = {
  大吉: 90,
  平吉: 72,
  吉: 78,
  小吉: 66,
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

function findPalaceByGan(result: QiMenResult, gan: string): string {
  const outerGongOrder = ['4', '9', '2', '3', '7', '8', '1', '6'];
  const outerGong = outerGongOrder.find(gong => result.tianPan[gong] === gan);
  if (outerGong) return outerGong;
  return result.tianPan['5'] === gan ? getRuiQinGong(result) : '';
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
  if (jiXiong === '平') return maxScore / 2;
  return 0;
}

export function getGanChangSheng(gan: string, gong: string): string {
  const branches = CHANG_SHENG_BRANCHES[gan];
  const palaceBranches = PALACE_INFO[gong]?.zhi || [];
  if (!branches || palaceBranches.length === 0) return '长生';
  const index = branches.findIndex(branch => palaceBranches.includes(branch));
  return CHANG_SHENG_ORDER[index >= 0 ? index : 0];
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

function specialNotes(result: QiMenResult, gong: string, gan: string): string[] {
  const notes: string[] = [];
  const men = result.baMen[gong];
  const shen = result.baShen[gong];
  const tianGan = result.tianPan[gong];
  const diGan = result.diPan[gong];

  for (const candidate of [tianGan, diGan].filter(Boolean)) {
    if (checkRuMu(candidate, gong)) notes.push(`${candidate}${GAN_WUXING[candidate] || ''}入墓。代表关闭封藏，士气低迷，有心无力，百事不宜。`);
    if (checkJiXing(candidate, gong) && GAN_JIXING_MEANING[candidate]) notes.push(`${candidate}${GAN_WUXING[candidate] || ''}击刑。${GAN_JIXING_MEANING[candidate]}`);
  }
  if (gan && gan !== tianGan && checkJiXing(gan, gong) && GAN_JIXING_MEANING[gan]) {
    notes.push(`${gan}${GAN_WUXING[gan] || ''}击刑。${GAN_JIXING_MEANING[gan]}`);
  }
  if (men && checkMenPo(men, gong)) notes.push(MEN_PO_NOTE[men] || `${men}门破：事情有破损阻滞之象。`);
  if (result.kongWangGong.includes(gong)) notes.push('空亡：信息不实，事物空无；犹如陆地上行舟，徒劳无功，使不上劲。');
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
  yongShenSymbol?: string
): SubjectAnalysis {
  if (!gong) {
    return { title, palace: '未知宫', rows: [], notes: ['未找到对应宫位，无法展开分析。'], score: 50 };
  }

  const star = normalizeStar(result.jiuXing[gong] || '');
  const men = result.baMen[gong] || '';
  const shen = result.baShen[gong] || '';
  const palace = PALACE_INFO[gong];
  const palaceResult = yongShenSymbol
    ? elementPalaceJiXiong(YONG_SHEN_WUXING[yongShenSymbol], gong, '用神')
    : palaceJiXiong(gan || result.tianPan[gong], gong);
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

  rows.push({ category: '地利', situation: `临${palace?.name || ''}宫`, jiXiong: palaceResult.jiXiong, meaning: palaceResult.meaning, note: '无' });

  if (skippedCategory !== '人和') {
    rows.push({ category: '人和', situation: `临${men}`, jiXiong: menInfo.jiXiong, meaning: menInfo.meaning, note: men && checkMenPo(men, gong) ? (MEN_PO_NOTE[men] || '门破，事情受阻。') : '无' });
  }

  if (skippedCategory !== '神助') {
    rows.push({ category: '神助', situation: `临${shen}`, jiXiong: shenInfo.jiXiong, meaning: shenInfo.meaning, note: '无' });
  }

  rows.push({ category: '周期', situation: `临${changSheng}`, jiXiong: CHANG_SHENG_MEANING[changSheng].jiXiong, meaning: CHANG_SHENG_MEANING[changSheng].meaning, note: `${changShengScore > 0 ? '+' : ''}${changShengScore}` });

  const notes = specialNotes(result, gong, gan || result.tianPan[gong]);
  const rowScore = yongShenSymbol ? YONG_SHEN_ROW_SCORE : GAN_ROW_SCORE;
  const specialPenaltyCount = notes.filter(note => ['入墓', '击刑', '门破', '空亡'].some(keyword => note.includes(keyword))).length;
  const score = Math.max(0, Math.min(100, rows.reduce((sum, row) => sum + scoreRow(row.jiXiong, rowScore), 0) - specialPenaltyCount * SPECIAL_NOTE_PENALTY));

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

function buildRelation(result: QiMenResult, itemType: ItemType, dayGong: string, hourGong: string, yongGong: string, yongSymbol: string): DetailedAnalysisResult['relation'] {
  const useHour = !yongGong || yongGong === dayGong;
  const targetGong = useHour ? hourGong : yongGong;
  const targetName = useHour ? '时干' : yongSymbol;
  const dayWx = PALACE_INFO[dayGong]?.wuxing;
  const targetWx = PALACE_INFO[targetGong]?.wuxing;
  if (!dayWx || !targetWx) {
    return { conclusion: '平', wuxingRelation: '五行关系不足', meaning: '未能找到完整宫位五行，暂以平论。', score: 50, basis: '资料不足' };
  }
  const kind = relationKind(targetWx, dayWx);
  const conclusion = conclusionFor(itemType, kind);
  const text = RELATION_TEXT[itemType][kind];
  const relationTextMap = {
    生: `${targetName}生日干`,
    同: `${targetName}与日干同宫比和`,
    泄: `${targetName}泄日干`,
    克出: `日干克${targetName}`,
    克入: `${targetName}克日干`,
  };

  return {
    conclusion,
    wuxingRelation: relationTextMap[kind],
    meaning: text,
    score: RELATION_SCORE[conclusion],
    basis: useHour ? '用神与日干同宫，按时干与日干关系定吉凶。' : '用神与日干不同宫，按用神与日干关系定吉凶，并以时干辅助参考。',
  };
}

export function analyzeQiMen(result: QiMenResult, itemType: ItemType): DetailedAnalysisResult {
  const dayGan = result.siZhu.day[0];
  const hourGan = result.siZhu.time[0];
  const dayGong = findPalaceByGan(result, dayGan);
  const hourGong = findPalaceByGan(result, hourGan);
  const yong = findPalaceBySymbol(result, YONG_SHEN_MAP[itemType]);

  return {
    riGan: buildSubject(result, itemType, `日干分析：日干为${dayGan}${GAN_WUXING[dayGan] || ''}`, dayGong, dayGan),
    shiGan: buildSubject(result, itemType, `时干分析：时干为${hourGan}${GAN_WUXING[hourGan] || ''}`, hourGong, hourGan),
    yongShen: buildSubject(result, itemType, `用神分析：取${YONG_SHEN_MAP[itemType].join('+')}为用神`, yong.gong, result.tianPan[yong.gong], yong.symbol),
    relation: buildRelation(result, itemType, dayGong, hourGong, yong.gong, yong.symbol),
  };
}
