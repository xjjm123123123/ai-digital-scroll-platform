
const fs = require('fs');
const path = require('path');

// 读取知识库数据
const knowledgePath = path.join(process.cwd(), 'public/knowledge/knowledge.json');
const knowledgeData = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'));
const knowledgeBase = knowledgeData.entries;

const testQueries = [
    "七月流火是什么意思",
    "豳风图的历史背景",
    "农具",
    "周公",
    "祭祀",
    "完全不相关的查询"
];

console.log("=== RAG 评分测试 ===\n");

testQueries.forEach(query => {
    console.log(`查询: "${query}"`);
    const queryLower = query.toLowerCase().trim();

    const scored = knowledgeBase.map(entry => {
        let score = 0;
        const titleLower = entry.title.toLowerCase();
        const contentLower = entry.content.toLowerCase();
        const categoryLower = entry.category.toLowerCase();
        
        let details = [];

        // 1. 标题匹配
        if (queryLower.includes(titleLower) || (titleLower.includes(queryLower) && queryLower.length > 1)) {
            score += 10;
            details.push("标题命中(+10)");
        }

        // 2. 关键词匹配
        if (entry.keywords && Array.isArray(entry.keywords)) {
            entry.keywords.forEach(keyword => {
                if (queryLower.includes(keyword.toLowerCase())) {
                    score += 5;
                    details.push(`关键词[${keyword}](+5)`);
                }
            });
        }

        // 3. 内容匹配
        if (contentLower.includes(queryLower) && queryLower.length > 1) {
            score += 3;
            details.push("内容命中(+3)");
        }

        // 4. 分类匹配
        if (categoryLower.includes(queryLower)) {
            score += 2;
            details.push("分类命中(+2)");
        }

        // 5. 标签匹配
        if (entry.tags && Array.isArray(entry.tags)) {
            entry.tags.forEach(tag => {
                if (queryLower.includes(tag.toLowerCase())) {
                    score += 2;
                    details.push(`标签[${tag}](+2)`);
                }
            });
        }
        
        return { title: entry.title, score, details: details.join(', ') };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

    if (scored.length === 0) {
        console.log("  无匹配结果");
    } else {
        scored.forEach((item, index) => {
            console.log(`  ${index + 1}. [${item.score}分] ${item.title}`);
            if (item.details) console.log(`     Details: ${item.details}`);
        });
    }
    console.log("\n-------------------\n");
});
