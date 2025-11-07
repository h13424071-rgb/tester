import React from 'react';

interface AnalysisProps {
  text: string;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
  </div>
);

const Analysis: React.FC<AnalysisProps> = ({ text, isLoading }) => {
  if (isLoading) {
    return <SkeletonLoader />;
  }
  
  // A simple formatter for the text to add some basic styling
  const formattedText = text.split('\n').map((paragraph, index) => {
    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
      return <h3 key={index} className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-4 mb-2">{paragraph.replaceAll('**', '')}</h3>;
    }
    if (paragraph.trim() === '') {
        return <br key={index} />;
    }
    return <p key={index} className="mb-2 leading-relaxed">{paragraph}</p>;
  });

  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      {text ? formattedText : <p className="text-slate-500 dark:text-slate-400">분석 결과가 여기에 표시됩니다.</p>}
    </div>
  );
};

export default Analysis;