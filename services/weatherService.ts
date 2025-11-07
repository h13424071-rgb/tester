
import type { WeatherDataPoint } from '../types';

const METRIC_RANGES: { [key: string]: { min: number, max: number, dailyVariance: number } } = {
  temperature: { min: 5, max: 28, dailyVariance: 3 },
  humidity: { min: 40, max: 95, dailyVariance: 10 },
  windSpeed: { min: 1, max: 15, dailyVariance: 4 },
  precipitation: { min: 0, max: 50, dailyVariance: 20 },
};

const REGION_MODIFIERS: { [key: string]: { temp: number, precip: number } } = {
  '제주시': { temp: 0, precip: 1 },
  '서귀포시': { temp: 2, precip: 1.2 },
  '한라산': { temp: -8, precip: 1.8 },
  '우도': { temp: 1, precip: 0.8 },
  '성산': { temp: 1, precip: 1.1 },
};

export const generateMockWeatherData = (
  region: string,
  metric: string,
  startDateStr: string,
  endDateStr: string
): WeatherDataPoint[] => {
  const data: WeatherDataPoint[] = [];
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  const range = METRIC_RANGES[metric] || { min: 0, max: 100, dailyVariance: 10 };
  const modifier = REGION_MODIFIERS[region] || { temp: 0, precip: 1 };

  let currentValue = range.min + Math.random() * (range.max - range.min);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const fluctuation = (Math.random() - 0.5) * range.dailyVariance;
    currentValue += fluctuation;

    // Apply modifiers
    let finalValue = currentValue;
    if (metric === 'temperature') {
      finalValue += modifier.temp;
    }
    if (metric === 'precipitation') {
      finalValue = Math.max(0, finalValue * modifier.precip); // Precipitation can't be negative
      // Make precipitation spiky (not raining every day)
      if (Math.random() > 0.6) {
        finalValue = 0;
      }
    }

    // Clamp value within min/max range
    finalValue = Math.max(range.min, Math.min(range.max, finalValue));

    data.push({
      date: d.toISOString().split('T')[0],
      value: parseFloat(finalValue.toFixed(1)),
    });
  }

  return data;
};
