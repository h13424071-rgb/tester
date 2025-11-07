import { GoogleGenAI } from "@google/genai";
import type { WeatherDataPoint, WeatherMetric } from '../types';

// Assume process.env.API_KEY is configured in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface RegionData {
  region: string;
  data: WeatherDataPoint[];
}

export const getWeatherAnalysis = async (
  allRegionsData: RegionData[],
  regions: string[],
  metric: WeatherMetric,
  startDate: string,
  endDate: string
): Promise<string> => {
  if (!allRegionsData || allRegionsData.length === 0) {
    return "분석할 데이터가 없습니다.";
  }

  const model = 'gemini-2.5-flash';
  
  const dataString = allRegionsData.map(regionData => {
    const dailyData = regionData.data.map(d => `  - ${d.date}: ${d.value}${metric.unit}`).join('\n');
    return `**${regionData.region} 데이터:**\n${dailyData}`;
  }).join('\n\n');

  const prompt = `
당신은 제주도 기상 데이터 비교 분석 전문가입니다.
다음 여러 지역의 데이터를 비교 분석하여 사용자에게 친절하고 상세한 설명을 제공해주세요. Markdown 형식을 사용해 제목과 목록을 보기 좋게 꾸며주세요.

- **분석 지역**: 제주도 ${regions.join(', ')}
- **분석 항목**: ${metric.label}
- **분석 기간**: ${startDate} ~ ${endDate}

**지역별 상세 데이터:**
${dataString}

위 데이터를 기반으로 다음 항목들을 포함하여 **비교 분석 리포트**를 작성해주세요:

1.  **종합 분석 및 비교 요약**: 각 지역의 전반적인 ${metric.label} 트렌드를 요약하고, 지역 간의 주요 차이점과 공통점을 비교 분석해주세요. (예: '한라산' 지역이 '제주시'에 비해 평균적으로 5도 가량 낮았으며, 변동폭은 더 컸습니다.)
2.  **지역별 주요 특징**: 각 지역별로 최고값과 최저값을 기록한 날짜와 수치를 언급하고, 그 의미를 간략히 설명해주세요.
3.  **결론 및 조언**: 전체적인 비교 분석 결과를 바탕으로 결론을 내리고, 여행객 또는 주민을 위한 유용한 조언을 덧붙여주세요. (예: 해당 기간 동안 해안가인 '제주시'보다 산간인 '한라산'의 날씨가 더 쌀쌀했으므로, 방문 시 옷차림에 유의해야 합니다.)

전문적인 용어를 사용하되, 일반인도 이해하기 쉽게 설명해주세요.
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting analysis from Gemini:", error);
    throw new Error("AI 분석 중 오류가 발생했습니다. API 키 또는 네트워크 연결을 확인해주세요.");
  }
};