import { WeatherMetric } from './types';

export const JEJU_REGIONS: string[] = ['제주시', '서귀포시', '한라산', '우도', '성산'];

export const WEATHER_METRICS: WeatherMetric[] = [
  { label: '평균 기온', value: 'temperature', unit: '°C' },
  { label: '평균 습도', value: 'humidity', unit: '%' },
  { label: '풍속', value: 'windSpeed', unit: 'm/s' },
  { label: '강수량', value: 'precipitation', unit: 'mm' },
];

export const CHART_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f97316', '#8b5cf6'];
