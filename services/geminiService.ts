import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!API_KEY) {
    console.warn('⚠️ VITE_GEMINI_API_KEY 未配置，RAG 助手将无法正常工作');
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

// 系统提示词 - 定义 AI 助手的角色和行为
const SYSTEM_PROMPT = `你是豳风图数字长卷平台的智能导览助手。你的职责是：

1. 帮助用户了解《豳风图》的历史文化背景
2. 解读《诗经·豳风》中的诗句含义
3. 介绍画卷中的农事活动和传统文化
4. 回答关于中国古代农耕文明的问题

回答要求：
- 使用简洁、优雅的中文
- 保持专业但不失亲切的语气
- 如果问题超出豳风图相关范围，礼貌地引导用户回到主题
- 回答内容应当详实、准确，不要过于简略
- 可以适当引用诗经原文，增强文化氛围`;

export interface ChatOptions {
    context?: string; // 从知识库检索到的相关上下文
    temperature?: number; // 0-1，控制回答的创造性
}

/**
 * 调用 Gemini API 生成回答
 * @param userMessage 用户的问题
 * @param options 配置选项
 * @returns AI 生成的回答
 */
export async function generateResponse(
    userMessage: string,
    options: ChatOptions = {}
): Promise<string> {
    try {
        const { context = '', temperature = 0.7 } = options;

        // 构建完整的提示词
        let fullPrompt = `${SYSTEM_PROMPT}\n\n`;

        if (context) {
            fullPrompt += `参考以下知识库内容回答问题：\n\n${context}\n\n---\n\n`;
        }

        fullPrompt += `用户问题：${userMessage}`;

        // 调用 Gemini API
        // 不设置 maxOutputTokens，使用模型默认值（通常很大）
        // 系统提示词已包含在 fullPrompt 中
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                temperature,
                topP: 0.95,
                topK: 40,
            },
        });

        const text = response.text;

        if (!text) {
            throw new Error('AI 未返回有效回答');
        }

        return text;

    } catch (error: any) {
        console.error('Gemini API 调用失败:', error);

        // 友好的错误提示
        if (error.message?.includes('API_KEY') || error.message?.includes('apiKey')) {
            return '抱歉，AI 服务配置有误。请检查 API Key 设置。';
        }

        if (error.message?.includes('quota')) {
            return '抱歉，API 调用次数已达上限，请稍后再试。';
        }

        if (error.message?.includes('network') || error.message?.includes('fetch')) {
            return '抱歉，网络连接失败，请检查网络后重试。';
        }

        return '抱歉，我暂时无法回答这个问题，请稍后再试。';
    }
}

/**
 * 检查 API Key 是否已配置
 */
export function isApiKeyConfigured(): boolean {
    return !!API_KEY && API_KEY.length > 0;
}
