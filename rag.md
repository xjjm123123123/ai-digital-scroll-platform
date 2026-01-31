# RAG 智能助手使用说明

## 功能介绍

豳风图数字长卷平台的 RAG（检索增强生成）智能助手，可以回答关于《豳风图》的历史文化、诗经解读、农事活动等问题。

## 配置步骤

### 1. 获取 Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 登录 Google 账号
3. 点击"Create API Key"创建新的 API Key
4. 复制生成的 API Key

### 2. 配置环境变量

在项目根目录的 `.env.local` 文件中添加：

```
VITE_GEMINI_API_KEY=your_api_key_here
```

将 `your_api_key_here` 替换为您的实际 API Key。

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
- **AI 服务**: Google Gemini 1.5 Flash（免费）
- **知识库**: JSON 文件存储
- **检索方式**: 关键词匹配（可扩展为向量检索）

## 注意事项

1. **API 限制**: Gemini 免费版有请求频率限制，建议合理使用
2. **知识库更新**: 修改 `knowledge.json` 后需刷新页面重新加载
3. **网络要求**: 需要能够访问 Google AI 服务

## 常见问题

### Q: 提示"API Key 未配置"怎么办？
A: 检查 `.env.local` 文件中是否正确配置了 `VITE_GEMINI_API_KEY`，并重启开发服务器。

### Q: AI 回答不准确怎么办？
A: 在 `knowledge.json` 中补充相关知识，确保关键词覆盖全面。

### Q: 如何自定义 AI 的回答风格？
A: 修改 `services/geminiService.ts` 中的 `SYSTEM_PROMPT` 常量。

## 未来扩展

- [ ] 支持语音输入/输出
- [ ] 集成向量数据库（如 Supabase Vector）
- [ ] 支持多轮对话上下文
- [ ] 添加快捷键支持（如 Ctrl+K 打开助手）
- [ ] 支持根据当前浏览位置提供上下文相关建议