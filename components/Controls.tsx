import React from 'react';
import { JEJU_REGIONS, WEATHER_METRICS } from '../constants';
import type { AnalysisOptions } from '../types';

interface ControlsProps {
  options: AnalysisOptions;
  setOptions: React.Dispatch<React.SetStateAction<AnalysisOptions>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

const MAX_REGIONS = 3;

const Label: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
    {children}
  </label>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select
    {...props}
    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
  >
    {props.children}
  </select>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
)

const Controls: React.FC<ControlsProps> = ({ options, setOptions, onAnalyze, isLoading }) => {
  const handleOptionChange = <K extends keyof AnalysisOptions,>(key: K, value: AnalysisOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleRegionToggle = (toggledRegion: string) => {
    setOptions(prev => {
      const newRegions = prev.region.includes(toggledRegion)
        ? prev.region.filter(r => r !== toggledRegion)
        : [...prev.region, toggledRegion];
      
      if (newRegions.length > MAX_REGIONS) {
        return prev; // Or show a notification
      }
      return { ...prev, region: newRegions };
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-lg space-y-5">
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">분석 조건 설정</h2>
      <div>
        <Label>지역 선택 (최대 {MAX_REGIONS}개)</Label>
        <div className="flex flex-wrap gap-2">
          {JEJU_REGIONS.map(region => {
            const isSelected = options.region.includes(region);
            const isDisabled = !isSelected && options.region.length >= MAX_REGIONS;
            return (
              <button 
                key={region} 
                onClick={() => handleRegionToggle(region)}
                disabled={isDisabled}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 border
                  ${isSelected 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {region}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="metric">기상 항목</Label>
        <Select
          id="metric"
          value={options.metric}
          onChange={(e) => handleOptionChange('metric', e.target.value)}
        >
          {WEATHER_METRICS.map(metric => (
            <option key={metric.value} value={metric.value}>{metric.label} ({metric.unit})</option>
          ))}
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">시작일</Label>
          <Input
            id="startDate"
            type="date"
            value={options.startDate}
            onChange={(e) => handleOptionChange('startDate', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="endDate">종료일</Label>
          <Input
            id="endDate"
            type="date"
            value={options.endDate}
            onChange={(e) => handleOptionChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={isLoading || options.region.length === 0}
        className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            분석 중...
          </>
        ) : '데이터 비교 분석'}
      </button>
    </div>
  );
};

export default Controls;