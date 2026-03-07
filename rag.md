# RAG 智能助手使用说明

## 功能介绍

豳风图数字长卷平台的 RAG（检索增强生成）智能助手，可以回答关于《豳风图》的历史文化、诗经解读、农事活动等问题。

## 配置步骤

### 1. 获取 DeepSeek API Key (推荐)

由于 DeepSeek 提供国内直连服务且价格极低（甚至免费），本项目已默认切换至 DeepSeek。

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册并登录账号
3. 点击"API Keys"创建新的 API Key
4. 复制生成的 API Key

### 2. 配置环境变量

在项目根目录的 `.env.local` 或 `.env` 文件中添加：

```env
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

将 `your_deepseek_api_key_here` 替换为您的实际 API Key。

> **注意**: 如果您希望切回 Google Gemini，请恢复代码并配置 `VITE_GEMINI_API_KEY`。

### 3. 启动项目

```bash
npm run dev
```

## 使用方法

### 打开聊天助手

1. 在网站右下角找到金色的聊天按钮
2. 点击按钮展开对话框

### 提问示例

- "七月流火是什么意思？"
- "豳风图的历史背景是什么？"
- "画卷中描绘了哪些农事活动？"
- "诗经豳风有哪些篇章？"

### 快捷操作

- **Enter** - 发送消息
- **Shift + Enter** - 换行
- 点击聊天按钮或对话框右上角的按钮可关闭对话框

## 知识库管理

### 知识库位置

知识库文件位于：`public/knowledge/knowledge.json`

### 添加知识条目

编辑 `knowledge.json` 文件，添加新的知识条目：

```json
{
  "id": "unique-id",
  "title": "知识标题",
  "content": "详细内容...",
  "keywords": ["关键词1", "关键词2"],
  "category": "分类名称",
  "tags": ["标签1", "标签2"]
}
```

### 知识检索原理

助手会根据用户问题自动检索相关知识：
1. 匹配标题（权重最高）
2. 匹配关键词
3. 匹配内容
4. 匹配分类和标签

检索到的相关知识会作为上下文注入到 AI 的回答中，使回答更准确、更专业。

## 技术架构

- **前端框架**: React + TypeScript
- **AI 服务**: DeepSeek V3 (兼容 OpenAI 接口)
- **知识库**: JSON 文件存储
- **检索方式**: 关键词匹配（可扩展为向量检索）

## 注意事项

1. **API 额度**: DeepSeek 注册通常赠送免费额度，用完后需充值，但价格极低。
2. **知识库更新**: 修改 `knowledge.json` 后需刷新页面重新加载。
3. **网络要求**: 国内可直接访问，无需特殊网络环境。

## 常见问题

### Q: 提示"API Key 未配置"怎么办？
A: 检查 `.env` 文件中是否正确配置了 `VITE_DEEPSEEK_API_KEY`，并重启开发服务器。

### Q: AI 回答不准确怎么办？
A: 在 `knowledge.json` 中补充相关知识，确保关键词覆盖全面。

### Q: 如何自定义 AI 的回答风格？
A: 修改 `services/geminiService.ts` 中的 `SYSTEM_PROMPT` 常量。
