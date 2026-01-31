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
 * 简单的关键词匹配检索
 * @param query 用户查询
 * @param topK 返回最相关的 K 条结果
 * @returns 相关的知识库条目
 */
export function searchKnowledge(query: string, topK: number = 3): KnowledgeEntry[] {
    if (!isLoaded || knowledgeBase.length === 0) {
        return [];
    }

    // 计算每个条目的相关性分数
    const scored = knowledgeBase.map(entry => {
        let score = 0;
        const queryLower = query.toLowerCase();

        // 标题匹配（权重最高）
        if (entry.title.toLowerCase().includes(queryLower)) {
            score += 10;
        }

        // 关键词匹配
        entry.keywords.forEach(keyword => {
            if (queryLower.includes(keyword.toLowerCase()) ||
                keyword.toLowerCase().includes(queryLower)) {
                score += 5;
            }
        });

        // 内容匹配
        if (entry.content.toLowerCase().includes(queryLower)) {
            score += 3;
        }

        // 分类和标签匹配
        if (entry.category.toLowerCase().includes(queryLower)) {
            score += 2;
        }

        entry.tags?.forEach(tag => {
            if (queryLower.includes(tag.toLowerCase())) {
                score += 2;
            }
        });

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
 * @param entries 知识库条目
 * @returns 格式化的上下文文本
 */
export function buildContext(entries: KnowledgeEntry[]): string {
    if (entries.length === 0) {
        return '';
    }

    return entries
        .map(entry => `【${entry.title}】\n${entry.content}`)
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
