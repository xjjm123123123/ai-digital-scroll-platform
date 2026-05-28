import { KnowledgeEntry } from '../types';

let knowledgeBase: KnowledgeEntry[] = [];
let isLoaded = false;

/**
 * 加载知识库数据
 */
export async function loadKnowledgeBase(): Promise<void> {
    if (isLoaded) return;

    try {
        const response = await fetch('/knowledge/knowledge.json');
        if (!response.ok) {
            throw new Error('知识库加载失败');
        }

        const data = await response.json();
        knowledgeBase = data.entries || [];
        isLoaded = true;

        console.log(`✅ 知识库加载成功，共 ${knowledgeBase.length} 条记录`);
    } catch (error) {
        console.error('❌ 知识库加载失败:', error);
        knowledgeBase = [];
    }
}

/**
 * RAG 检索匹配判定维度与评分权重设计
 * 
 * 1. 热点标题绝对匹配 (+10分) - 核心锚点
 *    - 目的：确保针对特定场景核心意象的提问能精准召回关联词条。
 *    - 机制：当用户查询完全包含标题，或标题完全包含用户查询时触发。
 *    - 赋予最高置信度，直接锁定核心内容。
 * 
 * 2. 正文关键词散布匹配 (+5分/词) - 关键实体捕获
 *    - 目的：构建广泛的实体召回网络，捕获自然语言提问中的关键实体（如农具、服饰）。
 *    - 机制：遍历词条的关键词列表，每命中一个查询中的关键词即累加分数。
 * 
 * 3. 模糊内容包含匹配 (+3分) - 长尾兜底
 *    - 目的：作为高分匹配落空时的系统兜底策略。
 *    - 机制：基于子串包含关系的弱相关性召回，确保即使未命中关键词也能通过全文检索找到相关内容。
 * 
 * 4. 全局分类/标签匹配 (+2分) - 次级上下文
 *    - 目的：利用元数据标签将相近文化属性的知识条目聚类，提供充实的文化背景。
 *    - 机制：当查询涉及分类或标签时给予少量加分，辅助提升相关领域内容的排名。
 */
export function searchKnowledge(query: string, topK: number = 5): KnowledgeEntry[] {
    if (!isLoaded || knowledgeBase.length === 0) {
        return [];
    }

    const queryLower = query.toLowerCase().trim();
    if (!queryLower) return [];

    // 计算每个条目的相关性分数
    const scored = knowledgeBase.map(entry => {
        let score = 0;
        const titleLower = entry.title.toLowerCase();
        const contentLower = entry.content.toLowerCase();
        const categoryLower = entry.category.toLowerCase();
        
        // 1. 热点标题绝对匹配 (+10 分)
        // 核心锚点：确保核心意象精准召回
        // 逻辑：双向包含匹配 - 查询包含标题 或 标题包含查询（且查询有一定长度避免误配）
        if (queryLower.includes(titleLower) || (titleLower.includes(queryLower) && queryLower.length > 1)) {
            score += 10;
        }

        // 2. 正文关键词散布匹配 (+5 分 / 命中词)
        // 关键实体捕获：构建实体召回网络
        // 逻辑：统计命中的关键词数量
        if (entry.keywords && Array.isArray(entry.keywords)) {
            entry.keywords.forEach(keyword => {
                const keywordLower = keyword.toLowerCase();
                // 仅当查询包含关键词时加分，避免反向包含（如查询“人”匹配关键词“工具人”及其它包含人的词）带来的噪音
                if (queryLower.includes(keywordLower)) {
                    score += 5;
                }
            });
        }

        // 3. 模糊内容包含匹配 (+3 分)
        // 长尾兜底：弱相关性召回机制
        // 逻辑：全文检索包含
        if (contentLower.includes(queryLower) && queryLower.length > 1) {
            score += 3;
        }

        // 4. 全局分类/标签匹配 (+2 分)
        // 次级上下文：文化属性聚类
        // 逻辑：分类或标签命中
        if (categoryLower.includes(queryLower)) {
            score += 2;
        }

        if (entry.tags && Array.isArray(entry.tags)) {
            entry.tags.forEach(tag => {
                const tagLower = tag.toLowerCase();
                if (queryLower.includes(tagLower)) {
                    score += 2;
                }
            });
        }

        return { entry, score };
    });

    // 过滤掉分数为 0 的，并按分数降序排序
    const filtered = scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(item => item.entry);

    return filtered;
}

/**
 * 构建上下文字符串
 * 
 * 将检索到的知识条目格式化为 LLM 可理解的文本块。
 * 
 * 【设计考量 - 充实的文化背景】
 * 为了让主模型（Gemini）在生成回答时能更好地理解《豳风图》的深层文化内涵，
 * 我们不仅提供了标题和正文，还显式注入了元数据（分类与标签）。
 * 
 * - 分类（Category）：如“画卷赏析”、“农事文化”，为模型划定知识领域。
 * - 标签（Tags）：如“宋代”、“名画”、“风俗”，为模型提供关联的文化属性。
 * 
 * 这种结构化的上下文输入，有助于模型生成更具历史底蕴和专业深度的回答。
 * 
 * @param entries 检索到的高分知识库条目
 * @returns 格式化的上下文文本，供 Prompt 使用
 */
export function buildContext(entries: KnowledgeEntry[]): string {
    if (entries.length === 0) {
        return '';
    }

    return entries
        .map(entry => {
            let contextStr = `【${entry.title}】`;
            
            // 注入元数据：分类 (Category) - 提供宏观知识领域上下文
            if (entry.category) contextStr += `\n分类：${entry.category}`;
            
            // 注入元数据：标签 (Tags) - 提供微观文化属性关联
            if (entry.tags && entry.tags.length > 0) contextStr += `\n标签：${entry.tags.join(', ')}`;
            
            // 核心内容
            contextStr += `\n内容：${entry.content}`;
            
            return contextStr;
        })
        .join('\n\n');
}

/**
 * 获取所有分类
 */
export function getCategories(): string[] {
    if (!isLoaded) return [];

    const categories = new Set(knowledgeBase.map(entry => entry.category));
    return Array.from(categories);
}

/**
 * 按分类获取知识条目
 */
export function getEntriesByCategory(category: string): KnowledgeEntry[] {
    if (!isLoaded) return [];

    return knowledgeBase.filter(entry => entry.category === category);
}

/**
 * 获取随机推荐
 */
export function getRandomEntries(count: number = 3): KnowledgeEntry[] {
    if (!isLoaded || knowledgeBase.length === 0) return [];

    const shuffled = [...knowledgeBase].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, knowledgeBase.length));
}
