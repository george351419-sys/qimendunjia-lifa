import { QiMenResult, checkJiXing, checkMenPo, checkRuMu } from './qimen';

export type GeJuLevel = '大吉' | '吉' | '中性' | '中性偏凶' | '平' | '凶' | '大凶';

interface GeJuEntry {
  rawJudgment: string;
  explanation: string;
  name: string;
}

export interface GeJuContext {
  result: QiMenResult;
  gong: string;
  itemType?: string;
  tianGan?: string;
}

export interface GeJuResult {
  key: string;
  name: string;
  rawJudgment: string;
  baseJudgment: GeJuLevel;
  finalJudgment: GeJuLevel;
  explanation: string;
  condition: string;
  reason: string;
}

const GEJU_TABLE: Record<string, GeJuEntry> = {
  "甲+甲": {
    "rawJudgment": "吉（伏吟宜静守）",
    "explanation": "双木成林，庆云献瑞，主荣华、得志、进展、顺畅。伏吟格局宜静守，不宜妄动。",
    "name": "双木成林"
  },
  "甲+乙": {
    "rawJudgment": "中性（随门吉凶）",
    "explanation": "青龙和会，藤罗系甲，门吉事也吉，门凶事也凶，吉凶随八门状态变化。",
    "name": "青龙和会"
  },
  "甲+丙": {
    "rawJudgment": "大吉（逢迫墓击刑则凶）",
    "explanation": "青龙返首，为事所谋，大吉大利，利于谋划成事；如逢门迫、入墓、击刑，吉事会转为凶事。",
    "name": "青龙返首"
  },
  "甲+丁": {
    "rawJudgment": "吉（入墓、宫迫则凶）",
    "explanation": "木火通明，主升迁、得贵人相助，宜见上级领导、求功名，为事吉利；若遇入墓、宫迫则为凶。",
    "name": "木火通明"
  },
  "甲+戊": {
    "rawJudgment": "凶（利主，宜静守）",
    "explanation": "青龙耀明，青龙受困，伏吟格局，主孤立徒劳，百事不顺，道路闭塞，以静守为好，利于主方。",
    "name": "青龙耀明"
  },
  "甲+己": {
    "rawJudgment": "凶",
    "explanation": "贵人入狱，公私营谋皆不利，易受制肘、沦为傀儡，宜踏实稳步，同心协力行事。",
    "name": "贵人入狱"
  },
  "甲+庚": {
    "rawJudgment": "大凶",
    "explanation": "值符飞宫，吉事不吉，凶事更凶，求财无利，测病大凶，动辄招咎，宜更换方位避祸。",
    "name": "值符飞宫"
  },
  "甲+辛": {
    "rawJudgment": "中性偏凶（吉门可谋事，凶门则凶）",
    "explanation": "青龙折足，若得吉门生助尚能谋事；逢凶门则主招灾、失财、足疾、折伤等凶事。",
    "name": "青龙折足"
  },
  "甲+壬": {
    "rawJudgment": "凶",
    "explanation": "青龙入水，凡阴阳事皆不吉利，主人落落寡合，寂寞不安，又名青龙入天牢。",
    "name": "青龙入水"
  },
  "甲+癸": {
    "rawJudgment": "中性（吉门则吉，凶门则凶）",
    "explanation": "青龙华盖，逢吉门为吉，可招福临门；逢凶门则事多不利，整体为凶。",
    "name": "青龙华盖"
  },
  "乙+甲": {
    "rawJudgment": "吉",
    "explanation": "藤罗系甲，锦上添花，高山仰止，景行行止，主得贵人助力，人事圆满，有意外之喜。",
    "name": "藤罗系甲"
  },
  "乙+乙": {
    "rawJudgment": "中性（宜静守，不利进取）",
    "explanation": "日奇伏吟，又名奇中伏奇，求官、谒贵不利，只宜静守，适合积粮藏宝、莳花种果等守成之事。",
    "name": "日奇伏吟"
  },
  "乙+丙": {
    "rawJudgment": "中性（吉星则吉，凶星则凶）",
    "explanation": "奇蔽明堂，又名奇仪顺遂，遇吉星则主迁官晋职；遇凶星则主夫妻反目、离别。",
    "name": "奇蔽明堂"
  },
  "乙+丁": {
    "rawJudgment": "吉",
    "explanation": "奇助玉女，又名奇仪相佐，最利文书、考试之事，百事可为，行事顺利。",
    "name": "奇助玉女"
  },
  "乙+戊": {
    "rawJudgment": "中性（利阴人，门吉尚可）",
    "explanation": "阴害阳门，又名奇入天门，利于阴人行事，不利阳人，宜旅游、婚姻之事，得吉门则尚可。",
    "name": "阴害阳门"
  },
  "乙+己": {
    "rawJudgment": "凶（得吉门为地遁吉格）",
    "explanation": "日奇入墓，又名日入地户，被土暗昧，门凶事必凶；若得生、开二吉门则为地遁吉格，可转凶为吉。",
    "name": "日奇入墓"
  },
  "乙+庚": {
    "rawJudgment": "中性偏凶（争讼、私意，逢开门为风遁吉格）",
    "explanation": "日奇被刑，又名奇合太白，主争讼财产、夫妻怀有私意；若临巽宫、逢开门则为风遁吉格。",
    "name": "日奇被刑"
  },
  "乙+辛": {
    "rawJudgment": "大凶（逢吉门为云遁、虎遁吉格）",
    "explanation": "青龙逃走，主人亡财破、奸害、奴仆拐带，测婚主女逃男；若得三吉门之一则为云遁、虎遁吉格。",
    "name": "青龙逃走"
  },
  "乙+壬": {
    "rawJudgment": "中性偏凶（利旅游、婚姻，余事不利）",
    "explanation": "日奇入地，又名奇门入狱，主尊卑悖乱、官讼是非、有人谋害，仅利于旅游、婚姻之事。",
    "name": "日奇入地"
  },
  "乙+癸": {
    "rawJudgment": "中性（先败后成，躲灾避难吉，逢吉门为龙遁吉格）",
    "explanation": "华盖逢星，又名奇逢罗网，主遁迹修道、先败后成，躲灾避难为吉；若得三吉门之一则为龙遁吉格。",
    "name": "华盖逢星"
  },
  "丙+甲": {
    "rawJudgment": "吉（测病凶）",
    "explanation": "飞鸟跌穴，主名利双收，可谋大事，有巧遇之贵人相助；唯独测病不吉，有死亡之忧。",
    "name": "飞鸟跌穴"
  },
  "丙+乙": {
    "rawJudgment": "吉（宜节制）",
    "explanation": "日月并明，又名日月并行、雀含花甲，主公私吉庆，祸福无常，行事宜节制有度。",
    "name": "日月并明"
  },
  "丙+丙": {
    "rawJudgment": "凶",
    "explanation": "月奇孛师，又名伏吟洪光，主文书逼迫、破耗遗失，易招咎、行事失败。",
    "name": "月奇孛师"
  },
  "丙+丁": {
    "rawJudgment": "大吉（得生门为天遁吉格）",
    "explanation": "月奇朱雀，若得生门则为天遁吉格，宜献策上书、求谒纳贤，行事大吉。",
    "name": "月奇朱雀"
  },
  "丙+戊": {
    "rawJudgment": "吉",
    "explanation": "奇逢重生，又名月奇得使，吉上加吉，主名利双收，需结合日时干支、门、宫生克灵活运用。",
    "name": "奇逢重生"
  },
  "丙+己": {
    "rawJudgment": "中性偏凶",
    "explanation": "奇入明堂，又名太孛入刑，凡事欲为皆失意且迟缓，主文章极处无奇，人品极处无求。",
    "name": "奇入明堂"
  },
  "丙+庚": {
    "rawJudgment": "凶",
    "explanation": "荧入太白，亦为丙奇升殿，吉不抵凶，主增灾乐祸，诸事宜守旧，不可谋划新事。",
    "name": "荧入太白"
  },
  "丙+辛": {
    "rawJudgment": "吉",
    "explanation": "奇神生合，又名日月相会，主赞天地之化育，福自天来，尤其宜求医治病之事。",
    "name": "奇神生合"
  },
  "丙+壬": {
    "rawJudgment": "中性（宜小事，不宜大事）",
    "explanation": "奇神游海，又名火入天罗，诸事吉而不实，宜行小事，不宜谋大事，行事宜未雨绸缪。",
    "name": "奇神游海"
  },
  "丙+癸": {
    "rawJudgment": "凶",
    "explanation": "奇逢华盖，又名华盖孛师，主乌云掩目，需防小人、陷阱，看似吉利实则为凶。",
    "name": "奇逢华盖"
  },
  "丁+甲": {
    "rawJudgment": "吉",
    "explanation": "青龙转光，主加官进禄，士庶皆吉，行事更上一层楼，利于求官、进取。",
    "name": "青龙转光"
  },
  "丁+乙": {
    "rawJudgment": "大吉（逢吉门/吉神为天遁/鬼遁吉格）",
    "explanation": "玉女奇生，逢生门、太阴则为人遁吉格；逢开门、休门、九地则为鬼遁吉格，行事大吉。",
    "name": "玉女奇生"
  },
  "丁+丙": {
    "rawJudgment": "吉",
    "explanation": "奇神合明，又名星随月转，百事吉庆，大有施为，行事需注意非分之才毋苟得。",
    "name": "奇神合明"
  },
  "丁+丁": {
    "rawJudgment": "中性（虽吉有相争）",
    "explanation": "奇神相敌，又名奇人太阴，诸事虽有吉利，但恐有相争之事，需知机暗图，先施为则得意。",
    "name": "奇神相敌"
  },
  "丁+戊": {
    "rawJudgment": "吉",
    "explanation": "玉女神龙，又名青龙转光，主官人升迁，常人威昌，宜于文艺之事，行事宜固守。",
    "name": "玉女神龙"
  },
  "丁+己": {
    "rawJudgment": "中性偏凶（防情海生波、小人）",
    "explanation": "玉女刑杀，又名火入勾陈，主情投意美、私合有趣，需防情海生波、奸计、小人陷害。",
    "name": "玉女刑杀"
  },
  "丁+庚": {
    "rawJudgment": "中性偏凶（凡事反复，音讯阻隔）",
    "explanation": "玉女刑杀，又名朱雀入没、隔格，凡事强图则多反复，音讯阻隔，唯有心诚则灵。",
    "name": "玉女刑杀"
  },
  "丁+辛": {
    "rawJudgment": "凶",
    "explanation": "玉女伏虎，又名朱雀入狱，求谋不利，诸事艰难，主玉石俱焚、贬谪、反背之事。",
    "name": "玉女伏虎"
  },
  "丁+壬": {
    "rawJudgment": "吉",
    "explanation": "乘龙游海，又名五神互合，诸事顺遂，易得贵人亲近，主鹤鸣九帛，声闻于天。",
    "name": "乘龙游海"
  },
  "丁+癸": {
    "rawJudgment": "大凶",
    "explanation": "朱雀投江，诸事不利，主人情反复、文书错误、官司败诉，需防溺水、口舌、目疾等凶事。",
    "name": "朱雀投江"
  },
  "戊+甲": {
    "rawJudgment": "中性（宜静守，踏实努力）",
    "explanation": "巨石压木，不得人和，行事宜贯彻始终、踏实努力；伏吟格局，凡事闭塞，以静守为好。",
    "name": "巨石压木"
  },
  "戊+乙": {
    "rawJudgment": "吉",
    "explanation": "青龙入云，又名青龙合灵，战利主客诸事大吉，若加三吉门则尤为吉利。",
    "name": "青龙入云"
  },
  "戊+丙": {
    "rawJudgment": "中性（先难后易，逢凶格则凶）",
    "explanation": "青龙得明，又名青龙回首，主先难后易；若遇门迫、入墓、击刑则为凶。",
    "name": "青龙得明"
  },
  "戊+丁": {
    "rawJudgment": "中性（门生宫则吉，门克宫则反复）",
    "explanation": "青龙耀明，又名天龙光耀，宜求名、谒贵，门生宫则为吉，门克宫则事多反复。",
    "name": "青龙耀明"
  },
  "戊+戊": {
    "rawJudgment": "小凶（伏吟宜静，动则为凶）",
    "explanation": "青龙伏吟、青龙入地，以静为吉、动则为凶。事难进展，资金阻滞，出行受阻，人事迟钝，疾病主肿。伏吟局，路不通，事反复；静则吉，动则辱；钱难转，人固执。",
    "name": "青龙伏吟"
  },
  "戊+己": {
    "rawJudgment": "中性（门生宫则吉，门克宫则凶）",
    "explanation": "青龙相合，又名贵人入狱，门生宫则诸事大吉，门克宫则有始无终，易坐吃山空。",
    "name": "青龙相合"
  },
  "戊+庚": {
    "rawJudgment": "凶",
    "explanation": "值符飞宫，又名青龙恃势，主怀才不遇、苦节独行，好景不常，行事易功亏一篑。",
    "name": "值符飞宫"
  },
  "戊+辛": {
    "rawJudgment": "凶",
    "explanation": "青龙相侵，又名青龙折足，主招灾、失财、徒劳无功，行事勿轻许诺言、多管闲事。",
    "name": "青龙相侵"
  },
  "戊+壬": {
    "rawJudgment": "中性偏凶（诸事耗散，需智慧破解）",
    "explanation": "青龙破狱，又名青龙入天牢，宫克、门守则诸事耗散，需以智慧破解困难、阻碍。",
    "name": "青龙破狱"
  },
  "戊+癸": {
    "rawJudgment": "吉（得景门、门宫相生则大吉）",
    "explanation": "青龙华盖，若得景门则为丙化龙升格，门宫相生则诸事大吉，行事宜专一、互信。",
    "name": "青龙华盖"
  },
  "己+甲": {
    "rawJudgment": "凶",
    "explanation": "犬遇青龙，主挫折不断，人生如梦幻，追逐名利反招灾咎，需防被人利用、受连累。",
    "name": "犬遇青龙"
  },
  "己+乙": {
    "rawJudgment": "中性（利男女私事、婚姻，余事不利）",
    "explanation": "日入地户，诸事难圆，诸般暗昧，又名墓神不明，仅利于男女私事、婚姻之事，余事皆不利。",
    "name": "日入地户"
  },
  "己+丙": {
    "rawJudgment": "中性偏凶（宜迟缓，防疾病、失贞）",
    "explanation": "地户埋光，又名光孛地户，凡为有阻，屈而不伸，行事宜迟缓则吉，需防疾病、失贞之事。",
    "name": "地户埋光"
  },
  "己+丁": {
    "rawJudgment": "中性（先费后益，防祸从口出）",
    "explanation": "明堂贪生，又名朱雀入墓，诸事难吉，主先费后益，最终可得祯祥，行事需防祸从口出。",
    "name": "明堂贪生"
  },
  "己+戊": {
    "rawJudgment": "吉",
    "explanation": "明堂从禄，又名犬遇青龙，万事大吉，主喜悦重逢、荐拔、如愿、受他人重视。",
    "name": "明堂从禄"
  },
  "己+己": {
    "rawJudgment": "凶",
    "explanation": "明堂重逢，又名伏吟格，凡事自败难圆，进退不决，终为不吉，主行事遇阻碍、易染病。",
    "name": "明堂重逢"
  },
  "己+庚": {
    "rawJudgment": "凶",
    "explanation": "明堂伏杀，又名刑格返吟，主掌权不久、隐私被揭、官灾色难、耽于淫佚之事。",
    "name": "明堂伏杀"
  },
  "己+辛": {
    "rawJudgment": "中性偏凶",
    "explanation": "天庭得势，又名游魂入墓，主因小失大、华而不实、小口邪祟、本末倒置。",
    "name": "天庭得势"
  },
  "己+壬": {
    "rawJudgment": "凶",
    "explanation": "明堂被刑，又名地网高张，百事无成，主参商各别、儿女不肖、女性失贞、家庭不和。",
    "name": "明堂被刑"
  },
  "己+癸": {
    "rawJudgment": "凶",
    "explanation": "明堂华盖，又名地刑玄武，诸事谋为反复难成，主病危、官讼、好事成悲。",
    "name": "明堂华盖"
  },
  "庚+甲": {
    "rawJudgment": "大凶",
    "explanation": "太乙伏宫，主恩反成仇、谪降、破财、动荡不安、众叛亲离，官商行事皆不利。",
    "name": "太乙伏宫"
  },
  "庚+乙": {
    "rawJudgment": "中性（宜守不宜进，苦乐参半）",
    "explanation": "太白贪合，又名太白逢星，主苦乐参半，行事宜守不宜进，易乐极生悲。",
    "name": "太白贪合"
  },
  "庚+丙": {
    "rawJudgment": "凶",
    "explanation": "太白加宫，又名太白入荧，需防贼盗、失财、欺诈、侵占，行事劳心劳力。",
    "name": "太白加宫"
  },
  "庚+丁": {
    "rawJudgment": "中性偏凶（诸事不利，一得一失）",
    "explanation": "太白受制，又名亭亭，诸事不利，反复不定，主失角留齿、一得一失，行事宜小不宜大。",
    "name": "太白受制"
  },
  "庚+戊": {
    "rawJudgment": "中性（先破后成，余事不利）",
    "explanation": "太白逢恩，又名太白天乙、伏宫，主先破后成，仅利于少男少女相关事，余事主天道公理无存、官讼纠纷。",
    "name": "太白逢恩"
  },
  "庚+己": {
    "rawJudgment": "凶",
    "explanation": "太白大刑，又名刑格，所为不吉，宜守旧，主贪花恋酒、为情惹祸、家庭风波。",
    "name": "太白大刑"
  },
  "庚+庚": {
    "rawJudgment": "大凶",
    "explanation": "太白重刑，又名战格，为大凶格局，主交通事故、官讼刑狱、兄弟阋墙、飞灾横祸。",
    "name": "太白重刑"
  },
  "庚+辛": {
    "rawJudgment": "凶",
    "explanation": "太白重锋，又名白虎干格，主交通事故、阻碍不顺、伏奸反叛、男女不和。",
    "name": "太白重锋"
  },
  "庚+壬": {
    "rawJudgment": "凶",
    "explanation": "太白退位，又名小格，百事敛踪，主迷途、意外损失、纠缠难解、华而不实。",
    "name": "太白退位"
  },
  "庚+癸": {
    "rawJudgment": "大凶",
    "explanation": "太白冲刑，又名大格，诸事不宜，主图谋反害、满招损、破产，动辄招咎。",
    "name": "太白冲刑"
  },
  "辛+甲": {
    "rawJudgment": "中性偏凶（怀才不遇，徒劳）",
    "explanation": "龙争虎斗，月下松影，主怀才不遇，行事消极、徒劳无功，难以施展抱负。",
    "name": "龙争虎斗"
  },
  "辛+乙": {
    "rawJudgment": "大凶",
    "explanation": "白虎猖狂，诸事不吉，所为不成，主家破人亡、飞灾横祸，女性需防失贞，易有破财、官司之事。",
    "name": "白虎猖狂"
  },
  "辛+丙": {
    "rawJudgment": "中性（求谋可成，防因财致讼）",
    "explanation": "天庭得明，又名干合孛师，求谋可成，行事需防因财致讼，知足为富，祸起于微。",
    "name": "天庭得明"
  },
  "辛+丁": {
    "rawJudgment": "中性（有始无终，惟利求名、官讼赦罪）",
    "explanation": "白虎受伤，又名狱神得奇，行事有始无终，多有耗散，唯独利于求名、官讼、赦罪之事。",
    "name": "白虎受伤"
  },
  "辛+戊": {
    "rawJudgment": "凶",
    "explanation": "龙虎争强，又名困龙被伤，主不和、不遇，官事不利，积弊如山，易有意外受伤。",
    "name": "龙虎争强"
  },
  "辛+己": {
    "rawJudgment": "凶",
    "explanation": "虎坐明堂，又名入狱自刑，主背叛、败诉，水至清则无鱼，人至察则无徒，行事不宜过于苛刻。",
    "name": "虎坐明堂"
  },
  "辛+庚": {
    "rawJudgment": "凶",
    "explanation": "虎逢太白，又名白虎出刀、飞宫格，诸事反复、多有争论、迟滞，易有伤病、血光之灾。",
    "name": "虎逢太白"
  },
  "辛+辛": {
    "rawJudgment": "凶",
    "explanation": "天庭自刑，又名凶蛇入狱，凡为不利，所图不就，主纷争、阻滞、误会、口舌是非。",
    "name": "天庭自刑"
  },
  "辛+壬": {
    "rawJudgment": "中性偏凶（讼凶，余事可逢凶化吉）",
    "explanation": "白虎犯狱，又名蟒蛇相缠，主忧惊、反复，诉讼之事为凶，余事若能克己复礼则可逢凶化吉。",
    "name": "白虎犯狱"
  },
  "辛+癸": {
    "rawJudgment": "凶",
    "explanation": "虎投罗网，又名天牢华盖，主误会、落入圈套、口舌是非，考试之事不利。",
    "name": "虎投罗网"
  },
  "壬+甲": {
    "rawJudgment": "凶",
    "explanation": "青龙入狱，浪里行舟之象，主内外忧危、困难、口舌是非、酒色之灾。",
    "name": "青龙入狱"
  },
  "壬+乙": {
    "rawJudgment": "中性（产孕吉，男性不利，余事不利）",
    "explanation": "日入地户，又名水蛇入火，凡事不利，谋事多惊，仅产孕之事为吉，男性行事不利。",
    "name": "日入地户"
  },
  "壬+丙": {
    "rawJudgment": "凶",
    "explanation": "天牢伏奇，又名水蛇入火，凡事不利，求谋反凶，美景不久，行事易坐失良机。",
    "name": "天牢伏奇"
  },
  "壬+丁": {
    "rawJudgment": "中性（利文书、男吉，女凶，余事有阻）",
    "explanation": "太阴被狱，又名干合蛇刑，诸事有阻，谋为暗昧，仅利于文书之事，男性行事为吉，女性行事为凶。",
    "name": "太阴被狱"
  },
  "壬+戊": {
    "rawJudgment": "中性（官讼、求名得胜，余事有始无终）",
    "explanation": "青龙入狱，又名小蛇化龙，诸事有始无终，唯独官讼、求名之事可得胜，利于攀龙附凤。",
    "name": "青龙入狱"
  },
  "壬+己": {
    "rawJudgment": "凶",
    "explanation": "天地刑冲，又名凶蛇入狱，诸事谋为不成，吉事成凶，考试、诉讼之事皆不利。",
    "name": "天地刑冲"
  },
  "壬+庚": {
    "rawJudgment": "中性（刑狱公平，操之过急则败）",
    "explanation": "天牢倚势，又名飞干格、太白擒蛇，主刑狱公平，可立剖邪正，行事若操之过急则易失败。",
    "name": "天牢倚势"
  },
  "壬+辛": {
    "rawJudgment": "中性偏凶（讼凶，余事可逢凶化吉）",
    "explanation": "白虎犯狱，又名蟒蛇相缠，主忧惊、反复，诉讼之事为凶，余事若能克己复礼则可逢凶化吉。",
    "name": "白虎犯狱"
  },
  "壬+壬": {
    "rawJudgment": "大凶",
    "explanation": "天牢自刑，又名蛇入地网，诸事破败，凡为不利，主内外不安，枉费心力。",
    "name": "天牢自刑"
  },
  "壬+癸": {
    "rawJudgment": "凶",
    "explanation": "阴阳重地，又名幼女奸淫，凡事不宜图谋，主计穷无生意、受累、伤病。",
    "name": "阴阳重地"
  },
  "癸+甲": {
    "rawJudgment": "中性（逢凶化吉，得助力）",
    "explanation": "青龙入地，主逢凶化吉，可得贵人助力、举荐，行事宜放下往事，莫追过往。",
    "name": "青龙入地"
  },
  "癸+乙": {
    "rawJudgment": "吉",
    "explanation": "日沉九地，又名华盖蓬星，诸事有益，可得他人扶助，行事迟则有吉，利于升进。",
    "name": "日沉九地"
  },
  "癸+丙": {
    "rawJudgment": "中性（宜固守，阻滞忧惊）",
    "explanation": "明堂犯悖，又名华盖孛师，主阻滞、忧惊，行事无可无不可，宜固守不宜妄动。",
    "name": "明堂犯悖"
  },
  "癸+丁": {
    "rawJudgment": "大凶",
    "explanation": "蟒蛇妖跃，百事不宜，求吉反凶，主文书、契约错失、官非、火灾、冤屈、反目之事。",
    "name": "蟒蛇妖跃"
  },
  "癸+戊": {
    "rawJudgment": "中性（宜私谋、迟缓、小事，余事难吉）",
    "explanation": "青龙入地，又名天乙会合，诸事难吉，宜私谋、迟缓行事，只宜行小事，不宜谋大事。",
    "name": "青龙入地"
  },
  "癸+己": {
    "rawJudgment": "中性（惟利求名、官讼，余事不利）",
    "explanation": "华盖地户，又名华盖入明堂，行事罔费心力，唯独利于求名、官讼之事，余事主音讯阻隔、男女纷争。",
    "name": "华盖地户"
  },
  "癸+庚": {
    "rawJudgment": "凶",
    "explanation": "天网犯冲，又名太白入网，求谋无益，主家丑外扬、老少不良、顽固、堕落。",
    "name": "天网犯冲"
  },
  "癸+辛": {
    "rawJudgment": "中性（先费后益，诉讼、疾病凶）",
    "explanation": "华盖受恩，又名网盖天牢，主先费后益，行事忌逾越，诉讼、疾病之事为凶。",
    "name": "华盖受恩"
  },
  "癸+壬": {
    "rawJudgment": "凶",
    "explanation": "天网终狱，凡事不利，无定见，难图谋，婚姻、产育、小口、治病之事皆不吉。",
    "name": "天网终狱"
  },
  "癸+癸": {
    "rawJudgment": "大凶",
    "explanation": "天网重张，又名天网四张，凡事自败，宜守旧，官讼、疾病之事皆为凶。",
    "name": "天网重张"
  }
};

const JI_MEN = new Set(['休门', '生门', '景门', '开门']);
const XIONG_MEN = new Set(['伤门', '杜门', '死门', '惊门']);
const JI_XING = new Set(['天任', '天冲', '天辅', '天禽', '天心']);
const XIONG_XING = new Set(['天蓬', '天英', '天芮', '天柱']);

const MEN_WUXING: Record<string, string> = {
  休门: '水', 生门: '土', 伤门: '木', 杜门: '木', 景门: '火', 死门: '土', 惊门: '金', 开门: '金',
};

const PALACE_WUXING: Record<string, string> = {
  '1': '水', '2': '土', '3': '木', '4': '木', '5': '土', '6': '金', '7': '金', '8': '土', '9': '火',
};

const WUXING_SHENG: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const WUXING_KE: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

function normalizeStar(star: string): string {
  if (star.includes('天芮')) return '天芮';
  if (star.includes('天禽')) return '天禽';
  return star;
}

function splitJudgment(raw: string): { base: GeJuLevel; condition: string } {
  const match = raw.match(/^([^（(]+)[（(](.+)[）)]$/);
  const baseText = (match?.[1] || raw).trim();
  const condition = (match?.[2] || '').trim();
  if (baseText.includes('大吉')) return { base: '大吉', condition };
  if (baseText.includes('大凶')) return { base: '大凶', condition };
  if (baseText.includes('中性偏凶')) return { base: '中性偏凶', condition };
  if (baseText.includes('中性')) return { base: '中性', condition };
  if (baseText.includes('凶')) return { base: '凶', condition };
  if (baseText.includes('吉')) return { base: '吉', condition };
  return { base: '平', condition };
}

function menJiXiong(men: string): GeJuLevel {
  if (JI_MEN.has(men)) return '吉';
  if (XIONG_MEN.has(men)) return '凶';
  return '中性';
}

function starJiXiong(star: string): GeJuLevel {
  const normalized = normalizeStar(star);
  if (JI_XING.has(normalized)) return '吉';
  if (XIONG_XING.has(normalized)) return '凶';
  return '中性';
}

function menPalaceRelation(men: string, gong: string): '门生宫' | '宫生门' | '门克宫' | '宫克门' | '比和' | '未知' {
  const menWx = MEN_WUXING[men];
  const palaceWx = PALACE_WUXING[gong];
  if (!menWx || !palaceWx) return '未知';
  if (menWx === palaceWx) return '比和';
  if (WUXING_SHENG[menWx] === palaceWx) return '门生宫';
  if (WUXING_SHENG[palaceWx] === menWx) return '宫生门';
  if (WUXING_KE[menWx] === palaceWx) return '门克宫';
  if (WUXING_KE[palaceWx] === menWx) return '宫克门';
  return '未知';
}

function worse(a: GeJuLevel, b: GeJuLevel): GeJuLevel {
  const rank: Record<GeJuLevel, number> = { 大吉: 6, 吉: 5, 中性: 3, 平: 3, 中性偏凶: 2, 凶: 1, 大凶: 0 };
  return rank[a] <= rank[b] ? a : b;
}

function better(a: GeJuLevel, b: GeJuLevel): GeJuLevel {
  const rank: Record<GeJuLevel, number> = { 大吉: 6, 吉: 5, 中性: 3, 平: 3, 中性偏凶: 2, 凶: 1, 大凶: 0 };
  return rank[a] >= rank[b] ? a : b;
}

function resolveCondition(base: GeJuLevel, condition: string, context: GeJuContext, tianGan: string, diGan: string): { final: GeJuLevel; reason: string } {
  const { result, gong, itemType } = context;
  const men = result.baMen[gong] || '';
  const star = normalizeStar(result.jiuXing[gong] || '');
  const hasMenPo = men ? checkMenPo(men, gong) : false;
  const hasRuMu = [tianGan, diGan].filter(Boolean).some(gan => checkRuMu(gan, gong));
  const hasJiXing = [tianGan, diGan].filter(Boolean).some(gan => checkJiXing(gan, gong));
  const hasKongWang = result.kongWangGong.includes(gong);
  const hasBadBlock = hasMenPo || hasRuMu || hasJiXing || hasKongWang;
  const badParts = [hasMenPo ? '门迫' : '', hasRuMu ? '入墓' : '', hasJiXing ? '击刑' : '', hasKongWang ? '空亡' : ''].filter(Boolean).join('、');
  const notes: string[] = [];
  let final = base;

  if (!condition) return { final, reason: '按表格原始吉凶判断。' };

  if (condition.includes('随门吉凶') || condition.includes('门吉') || condition.includes('凶门')) {
    const byMen = menJiXiong(men);
    if (condition.includes('门吉') && condition.includes('门凶')) final = byMen;
    else if (condition.includes('随门吉凶')) final = byMen;
    else if (JI_MEN.has(men)) final = better(final, '吉');
    else if (XIONG_MEN.has(men)) final = worse(final, '凶');
    notes.push(`当前临${men || '未知门'}，按门的吉凶修正为${final}`);
  }

  if (condition.includes('吉星') || condition.includes('凶星')) {
    const byStar = starJiXiong(star);
    final = byStar;
    notes.push(`当前临${star || '未知星'}，按星的吉凶修正为${final}`);
  }

  if (condition.includes('门生宫') || condition.includes('门克宫') || condition.includes('宫迫')) {
    const relation = menPalaceRelation(men, gong);
    if (relation === '门生宫' || relation === '宫生门' || relation === '比和') final = better(final, '吉');
    if (relation === '门克宫' || relation === '宫克门') final = worse(final, '凶');
    notes.push(`当前${relation}，按门宫关系修正为${final}`);
  }

  if (condition.includes('迫') || condition.includes('墓') || condition.includes('击刑') || condition.includes('凶格')) {
    if (hasBadBlock) {
      final = worse(final, '凶');
      notes.push(`当前遇${badParts}，原括注提示遇此转凶`);
    } else {
      notes.push('当前未见门迫、入墓、击刑、空亡，保留原判断');
    }
  }

  if (condition.includes('得生门')) {
    if (men === '生门') { final = better(final, '吉'); notes.push('当前得生门，按条件取吉'); }
    else notes.push(`当前为${men || '未知门'}，未得生门`);
  }
  if (condition.includes('得景门')) {
    if (men === '景门') { final = better(final, condition.includes('大吉') ? '大吉' : '吉'); notes.push('当前得景门，按条件取吉'); }
    else notes.push(`当前为${men || '未知门'}，未得景门`);
  }
  if (condition.includes('逢开门')) {
    if (men === '开门') { final = better(final, '吉'); notes.push('当前逢开门，按条件取吉'); }
    else notes.push(`当前为${men || '未知门'}，未逢开门`);
  }
  if (condition.includes('逢吉门') || condition.includes('得吉门')) {
    if (JI_MEN.has(men)) { final = better(final, '吉'); notes.push(`当前临${men}，为吉门`); }
    else if (XIONG_MEN.has(men)) { final = worse(final, '凶'); notes.push(`当前临${men}，不是吉门`); }
  }

  if (itemType === '健康' && (condition.includes('测病') || condition.includes('病'))) {
    final = worse(final, '凶');
    notes.push('当前问健康，括注涉病凶，按凶论');
  }
  if (itemType === '官非' && (condition.includes('讼') || condition.includes('官司') || condition.includes('诉讼'))) {
    final = condition.includes('官讼得胜') ? better(final, '吉') : worse(final, '凶');
    notes.push('当前问官非，按括注中诉讼条件修正');
  }

  return { final, reason: notes.length ? notes.join('；') + '。' : `参考括注“${condition}”，当前盘面未触发额外转化。` };
}

export function analyzeGeJu(context: GeJuContext): GeJuResult {
  const { result, gong } = context;
  const tianGan = context.tianGan || result.tianPan[gong] || '';
  const diGan = result.diPan[gong] || '';
  const key = `${tianGan}+${diGan}`;
  const entry = GEJU_TABLE[key];

  if (!entry) {
    return {
      key,
      name: '未收录格局',
      rawJudgment: '中性',
      baseJudgment: '中性',
      finalJudgment: '中性',
      explanation: '表格未提供该天干组合格局，暂以中性论。',
      condition: '',
      reason: '未在当前格局表中找到对应组合。',
    };
  }

  const { base, condition } = splitJudgment(entry.rawJudgment);
  const resolved = resolveCondition(base, condition, context, tianGan, diGan);

  return {
    key,
    name: entry.name,
    rawJudgment: entry.rawJudgment,
    baseJudgment: base,
    finalJudgment: resolved.final,
    explanation: entry.explanation,
    condition,
    reason: resolved.reason,
  };
}

export function getGeJuColor(level: GeJuLevel): string {
  if (level.includes('吉')) return '#15803d';
  if (level === '中性' || level === '平') return '#a16207';
  if (level === '中性偏凶') return '#c2410c';
  return '#dc2626';
}
