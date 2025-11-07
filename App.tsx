import React, { useState, useCallback, useEffect } from 'react';
import Controls from './components/Controls';
import WeatherChart from './components/WeatherChart';
import Analysis from './components/Analysis';
import { generateMockWeatherData } from './services/weatherService';
import { getWeatherAnalysis } from './services/geminiService';
import { WEATHER_METRICS } from './constants';
import type { AnalysisOptions } from './types';

type ChartData = Array<{
  date: string;
  [key: string]: string | number | null;
}>;

const App: React.FC = () => {
  const getInitialDate = (offsetDays: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().split('T')[0];
  };

  const [options, setOptions] = useState<AnalysisOptions>({
    region: ['제주시'],
    metric: 'temperature',
    startDate: getInitialDate(-7),
    endDate: getInitialDate(0),
  });

  const [chartData, setChartData] = useState<ChartData>([]);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleAnalyze = useCallback(async () => {
    if (options.region.length === 0) {
      setError('분석할 지역을 하나 이상 선택해주세요.');
      setChartData([]);
      setAnalysisText('');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisText('');
    setChartData([]);

    try {
      const selectedMetric = WEATHER_METRICS.find(m => m.value === options.metric);
      if (!selectedMetric) throw new Error('Invalid metric selected');

      const allRegionsData = options.region.map(reg => ({
        region: reg,
        data: generateMockWeatherData(reg, options.metric, options.startDate, options.endDate),
      }));
      
      const dates = allRegionsData[0].data.map(d => d.date);
      const mergedData = dates.map(date => {
        const dataPoint: { date: string; [key: string]: any } = { date };
        allRegionsData.forEach(regionData => {
          const point = regionData.data.find(d => d.date === date);
          dataPoint[regionData.region] = point ? point.value : null;
        });
        return dataPoint;
      });

      setChartData(mergedData);
      
      const analysis = await getWeatherAnalysis(allRegionsData, options.region, selectedMetric, options.startDate, options.endDate);
      setAnalysisText(analysis);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setAnalysisText('데이터 분석에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [options]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    handleAnalyze();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-500 flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            제주 날씨 비교 분석
          </h1>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            {isDarkMode ? 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            }
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4">
            <Controls
              options={options}
              setOptions={setOptions}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
            <div className="bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-lg transition-all duration-300">
              <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-300">데이터 시각화</h2>
              <div className="h-80">
                 <WeatherChart data={chartData} regions={options.region} metric={WEATHER_METRICS.find(m => m.value === options.metric)} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-lg transition-all duration-300">
               <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-300">AI 비교 분석 리포트</h2>
               <Analysis text={analysisText} isLoading={isLoading} />
               {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;