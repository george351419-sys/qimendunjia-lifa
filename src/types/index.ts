export type ItemType = '财运' | '事业' | '婚恋' | '学习' | '考试' | '健康' | '官非';

export interface InputParams {
  content: string;
  type: ItemType;
  time: Date;
}

export interface Palace {
  position: number;
  name: string;
  tiangan: string;
  dipan: string;
  baMen: string;
  jiuXing: string;
  baShen: string;
  isZhiFu: boolean;
  isZhiShi: boolean;
  hasMaXing: boolean;
  isKongWang: boolean;
  ruMu: string[];
  jiXing: string[];
  menPo: boolean;
  changSheng?: string;
  diPanBaShen?: string;
}

export interface PanResult {
  siZhu: string[];
  kongWang: string;
  xunShou: string;
  zhiFu: string;
  zhiShi: string;
  maXing: string;
  palaces: Palace[];
}

export interface TianGan {
  name: string;
  wuxing: string;
  meaning: string;
  jiXingMeaning: string;
}

export interface BaMen {
  name: string;
  wuxing: string;
  meaning: string;
  jiXiong: string;
}

export interface JiuXing {
  name: string;
  wuxing: string;
  meaning: string;
  jiXiong: string;
}

export interface BaShen {
  name: string;
  meaning: string;
  jiXiong: string;
}

export interface GongWei {
  position: number;
  name: string;
  wuxing: string;
  number: string;
}

export interface GanAnalysis {
  name: string;
  analysis: string;
  notes: string[];
  score: number;
}

export interface AnalysisResult {
  riGan: GanAnalysis;
  shiGan: GanAnalysis;
  yongShen: GanAnalysis;
  jiXiong: {
    conclusion: string;
    relationship: string;
    score: number;
  };
}

export interface AppState {
  inputParams: InputParams;
  panResult: PanResult | null;
  analysisResult: AnalysisResult | null;
  showChangSheng: boolean;
  showDiPanBaShen: boolean;
}
