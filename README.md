# 🎨 AI Digital Scroll Platform: Ma Hezhi's "Odes of Bin"
# AI 数字长卷平台：马和之《豳风图》

<div align="center">
  <img src="public/scroll-preview.png" alt="Digital Scroll Preview" width="100%" />
  <p><em>Revitalizing the Song Dynasty Masterpiece with Modern AI Technology</em></p>
  <p><em>利用现代 AI 技术重现南宋传世名画《豳风图》的风采</em></p>
</div>

## 📖 Introduction (项目简介)

This project is an **interactive digital scroll platform** dedicated to Ma Hezhi's "Odes of Bin" (马和之《豳风图》), a masterpiece from the Southern Song Dynasty. By integrating **RAG (Retrieval-Augmented Generation)** technology and **dynamic frontend interactions**, we aim to bring this ancient artwork to life, allowing users to explore the detailed agricultural scenes and cultural heritage of the Zhou Dynasty in an immersive way.

本项目是一个致力于展示南宋名画马和之《豳风图》的**交互式数字长卷平台**。通过融合 **RAG（检索增强生成）** 技术与**动态前端交互**，我们旨在让这幅沉睡千年的古画“活”起来，带领用户沉浸式地探索周代的农耕文明与文化遗产。

## ✨ Key Features (核心功能)

- **📜 Seamless Digital Scroll (无缝数字长卷)**:
  - High-resolution, continuous horizontal scrolling experience mimicking the physical viewing of a handscroll.
  - 高清、连续的横向卷轴浏览体验，还原传统手卷的观看方式。

- **🤖 AI Intelligent Guide (AI 智能导览)**:
  - Built-in **RAG System** powered by a structured knowledge base (`knowledge.json`).
  - Capable of answering questions about the artist (Ma Hezhi), painting techniques (Orchid Leaf Stroke), and historical context.
  - 内置基于结构化知识库的 **RAG 系统**，可智能回答关于画家（马和之）、技法（兰叶描/蚂蝗描）及历史背景的问题。

- **🌾 Dynamic Scene Interaction (动态场景交互)**:
  - Elements in the painting (e.g., farmers, crops, birds) are animated to reflect the "July" poem's agricultural timeline.
  - 画中元素（如农夫、作物、飞鸟）被赋予动态效果，生动重现《七月》诗篇中的农事活动。

- **📚 Deep Cultural Analysis (深度文化赏析)**:
  - Detailed breakdown of all 7 sections: *July*, *Owl*, *East Mountain*, *Broken Axe*, *Hewing an Axe Handle*, *Nine Nets*, and *Wolf's Dewlap*.
  - 包含全卷七段内容的深度解析：《七月》、《鸱鸮》、《东山》、《破斧》、《伐柯》、《九罭》、《狼跋》。

## 🛠️ Tech Stack (技术栈)

- **Frontend**: [Next.js 14](https://nextjs.org/), [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **AI / LLM**: [Google Gemini API](https://ai.google.dev/) / [DeepSeek API](https://www.deepseek.com/)
- **Knowledge Base**: JSON-based Structured Data

## 🚀 Getting Started (快速开始)

Follow these steps to run the project locally.

### Prerequisites (前置条件)

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation (安装步骤)

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/ai-digital-scroll-platform.git
    cd ai-digital-scroll-platform
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory and add your API key:
    ```env
    # Choose one of the following providers
    GEMINI_API_KEY=your_google_gemini_api_key
    # DEEPSEEK_API_KEY=your_deepseek_api_key
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

5.  **Open in Browser**:
    Visit [http://localhost:3000](http://localhost:3000) to view the app.

## 📂 Project Structure (项目结构)

```plaintext
ai-digital-scroll-platform/
├── app/                  # Next.js App Router pages
├── components/           # React components (Scroll, Chat, etc.)
├── public/
│   ├── knowledge/        # RAG Knowledge Base
│   │   └── knowledge.json # Structured data for AI guide
│   └── ...               # Images and assets
├── services/             # API services (Gemini, RAG logic)
├── styles/               # Global styles
└── ...
```

## 🤝 Contributing (贡献)

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License (许可)

This project is licensed under the MIT License.

---

<div align="center">
  <sub>Built with ❤️ by the AI Digital Scroll Team</sub>
</div>
