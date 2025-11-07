export interface WeatherDataPoint {
  date: string;
  value: number;
}

export interface WeatherMetric {
  label: string;
  value: string;
  unit: string;
}

export interface AnalysisOptions {
  region: string[];
  metric: string;
  startDate: string;
  endDate: string;
}