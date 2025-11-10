export interface AnalysisMetric {
  metric: string;
  finding: string;
  score: number;
}

export interface ExternalPlatformAnalysis {
  platformName: 'ZeroGPT' | 'QuillBot' | 'Copyleaks';
  predictedScore: number;
  summary: string;
}

export interface AnalysisData {
  aiScore: number;
  summary: string;
  analysis: AnalysisMetric[];
  externalAnalysis: ExternalPlatformAnalysis[];
}

export interface AnalysisResult {
  data: AnalysisData;
}
