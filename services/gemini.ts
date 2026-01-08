
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const interpretScene = async (hotspotLabel: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `分析《豳风图》中的场景：“${hotspotLabel}”。
      背景：${description}
      请提供一段专业的艺术解读，重点在于该意象在诗经中的文化含义，并生成一段用于视频生成的超细致英文Prompt。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            culturalMeaning: { type: Type.STRING },
            visualHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            videoPrompt: { type: Type.STRING }
          },
          required: ["culturalMeaning", "videoPrompt"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Interpretation Error:", error);
    return null;
  }
};
