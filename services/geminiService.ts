
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

if (!API_KEY) {
    console.warn('⚠️ VITE_DEEPSEEK_API_KEY 未配置，RAG 助手将无法正常工作');
}

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
    hotspotContext?: string; // 当前画卷热点上下文
    readingContext?: string; // 视口段落与浏览足迹
    temperature?: number; // 0-1，控制回答的创造性
}

/**
 * 调用 DeepSeek API 生成回答
 * @param userMessage 用户的问题
 * @param options 配置选项
 * @returns AI 生成的回答
 */
export async function generateResponse(
    userMessage: string,
    options: ChatOptions = {}
): Promise<string> {
    try {
        const { context = '', hotspotContext = '', readingContext = '', temperature = 0.7 } = options;

        // 构建消息列表
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT }
        ];

        const contextBlocks: string[] = [];
        const sceneParts = [hotspotContext, readingContext].filter(Boolean);
        if (sceneParts.length > 0) {
            contextBlocks.push(`【当前画卷浏览上下文】\n${sceneParts.join('\n\n')}`);
        }
        if (context) {
            contextBlocks.push(`【知识库参考】\n${context}`);
        }

        let finalUserMessage = userMessage;
        if (contextBlocks.length > 0) {
            finalUserMessage = `${contextBlocks.join('\n\n')}\n\n---\n\n用户问题：${userMessage}`;
        }
        
        messages.push({ role: 'user', content: finalUserMessage });

        // 调用 DeepSeek API
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                temperature: temperature,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API error: ${response.status} ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error('AI 未返回有效回答');
        }

        return text;

    } catch (error: any) {
        console.error('DeepSeek API 调用失败:', error);

        // 友好的错误提示
        if (error.message?.includes('401')) {
            return '抱歉，API Key 无效或未配置。请检查设置。';
        }

        if (error.message?.includes('402') || error.message?.includes('balance')) {
            return '抱歉，API 余额不足，请充值后重试。';
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
