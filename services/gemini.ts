
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

export const interpretScene = async (hotspotLabel: string, description: string) => {
  try {
    const prompt = `分析《豳风图》中的场景：“${hotspotLabel}”。
      背景：${description}
      请提供一段专业的艺术解读，重点在于该意象在诗经中的文化含义，并生成一段用于视频生成的超细致英文Prompt。
      
      请严格按照以下 JSON 格式返回结果，不要包含 markdown 代码块标记：
      {
        "culturalMeaning": "文化含义解读",
        "visualHighlights": ["视觉亮点1", "视觉亮点2"],
        "videoPrompt": "English video prompt"
      }`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        })
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content;

    if (!content) return null;

    // 清理可能的 markdown 标记
    content = content.replace(/```json\n?|```/g, '').trim();

    return JSON.parse(content);
  } catch (error) {
    console.error("DeepSeek Interpretation Error:", error);
    return null;
  }
};
