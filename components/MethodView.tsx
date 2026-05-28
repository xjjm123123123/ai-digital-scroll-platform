
import React from 'react';

const Methodology: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto px-8 pt-32 pb-20 bg-[#0c0c0c]">
      <div className="max-w-4xl mx-auto space-y-20">
        <header className="space-y-4">
          <h1 className="text-5xl font-serif text-[#f0e6d2]">技术架构与方法论</h1>
          <p className="text-[#c5a059] tracking-[0.2em] text-sm">系统实现方案与研究路径</p>
          <div className="h-1 bg-[#c5a059] w-24" />
        </header>

        <section className="space-y-8">
          <h2 className="text-xl font-bold text-[#c5a059]">1. 总体架构：从“内容生产”到“内容呈现”的闭环</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-white/60 text-sm leading-relaxed">
                系统采用“预生成—云端存储—异步调用”的模式，将 AI 生成的不确定性与高延迟前置在内容生产阶段，
                前端只负责按热点加载视频与结构化元数据，从而保持交互流畅与展示一致性。
              </p>
              <div className="space-y-2 text-xs text-white/50 leading-relaxed">
                <div>《豳风图》原始图像 → 分镜提取 / Prompt 构建 → Wan 2.1 I2V 14B 推理</div>
                <div>→ 稳定化后处理（光流/掩码/金字塔/时序）→ 多模态资源入库</div>
                <div>→ React 长卷平台 → 热点视频门户 / RAG 智能导览 / 沉浸式展陈</div>
              </div>
            </div>
            <div className="glass-panel p-6 border-white/10 border flex items-center justify-center">
              <div className="w-full aspect-video bg-black flex flex-col items-center justify-center gap-4 border border-dashed border-white/20">
                <div className="text-[10px] text-white/20 tracking-widest">闭环链路</div>
                <div className="flex flex-wrap gap-3 items-center justify-center">
                  <div className="px-3 py-2 border border-[#c5a059] text-[10px]">内容生产</div>
                  <div className="text-[#c5a059]">→</div>
                  <div className="px-3 py-2 border border-[#c5a059] text-[10px]">内容组织</div>
                  <div className="text-[#c5a059]">→</div>
                  <div className="px-3 py-2 border border-[#c5a059] text-[10px]">内容呈现</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-bold text-[#c5a059]">2. AI 内容生产层：图生视频生成与稳定化后处理</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: '分镜构建', desc: '从叙事角度选取 8 个核心分镜，强调叙事性、画面完整性与动静对比。' },
              { step: '02', title: '模型推理', desc: 'Wan 2.1 I2V 14B 图生视频；正向 Prompt 固定机位/动作连续/院体风格，负向 Prompt 抑制抖动/变形。' },
              { step: '03', title: '稳定化管线', desc: '光流检测 → 运动掩码 → 拉普拉斯金字塔融合 → 时序平滑，降低背景漂移与笔触闪烁。' },
            ].map(item => (
              <div key={item.step} className="p-6 bg-white/5 border border-white/10 space-y-4">
                <div className="text-2xl font-bold text-white/10">{item.step}</div>
                <h3 className="font-bold text-white/90">{item.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#c5a059]">3. Web 平台服务架构：React + Supabase + LLM API</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            前端采用 React 19 + TypeScript + Vite，样式系统为 Tailwind CSS；数据与资源分发使用 Supabase（PostgreSQL + Storage）。
            智能导览通过可替换的 LLM 服务适配层接入外部模型 API，并保持“云端优先、本地兜底”的降级能力。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/60">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-4 font-bold text-white tracking-widest">分层</th>
                  <th className="py-4 font-bold text-white tracking-widest">模块</th>
                  <th className="py-4 font-bold text-white tracking-widest">职责</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-4">表现层</td>
                  <td>ScrollScene / VideoPortal / RagChat / MiniMap</td>
                  <td>渲染长卷、热点交互、视频门户与对话体验</td>
                </tr>
                <tr>
                  <td className="py-4">业务服务层</td>
                  <td>hotspotService / ragService / LLM Service</td>
                  <td>热点管理、检索召回、Prompt 组装与模型调用</td>
                </tr>
                <tr>
                  <td className="py-4">数据访问层</td>
                  <td>Supabase Client / 本地 JSON / 本地媒体</td>
                  <td>云端优先拉取，网络异常时自动回退离线资源</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-bold text-[#c5a059]">4. 超宽长卷渲染架构：切片懒加载 + GPU 加速</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-white/60 text-sm leading-relaxed">
                面对 65230×2773 的超宽图像，系统采用 Tile-based Rendering，将长卷切为多张纵向切片，首屏仅加载可视区域并按视口预取。
                平移缩放由 D3 接管事件与变换，在容器上使用 translate3d 触发 GPU 加速；底图切片层与透明热点层分离，确保热点锚定精确。
              </p>
              <div className="space-y-2 text-xs text-white/50">
                <div>首屏：2–3 张切片可见即加载</div>
                <div>拖动：根据视口坐标异步预加载前方切片</div>
                <div>渲染：GPU 纹理上传量与内存占用显著降低</div>
              </div>
            </div>
            <div className="glass-panel p-6 border-white/10 border">
              <div className="text-[10px] text-white/20 tracking-widest mb-4">性能目标</div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white/5 border border-white/10">
                  <div className="text-white/30 mb-2">首屏请求</div>
                  <div className="text-[#f0e6d2] tracking-widest">3–6MB</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10">
                  <div className="text-white/30 mb-2">解压内存</div>
                  <div className="text-[#f0e6d2] tracking-widest">~72MB</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10">
                  <div className="text-white/30 mb-2">平移体验</div>
                  <div className="text-[#f0e6d2] tracking-widest">稳定 60fps</div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10">
                  <div className="text-white/30 mb-2">交互定位</div>
                  <div className="text-[#f0e6d2] tracking-widest">绝对坐标锚定</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-bold text-[#c5a059]">5. 交互系统架构：热点叙事 + 双轨门户 + 动态注释</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            系统按「画卷沉浸浏览 → 热点解读门户 → 模式切换」组织交互路径。沉浸与解读并非仅切换文案，而是不同的界面语法、信息密度与辅助功能集合（由
            <code className="text-[#c5a059]/80"> config/viewModes.ts </code>
            统一约束）。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/60 border border-white/10">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-3 text-white/80">维度</th>
                  <th className="p-3 text-white/80">沉浸模式 Immersive</th>
                  <th className="p-3 text-white/80">解读模式 Interpret</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="p-3">默认入口</td>
                  <td className="p-3">入卷后画卷巡游；门户内按 I/C 切换进入</td>
                  <td className="p-3">点击热点默认打开；智能导览与侧栏同步呈现</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3">信息密度</td>
                  <td className="p-3">低：全屏影像 + 章节标题</td>
                  <td className="p-3">高：篇章背景、AI 视点、风格变体、延展探索</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3">交互</td>
                  <td className="p-3">拖拽卷轴、观影；隐藏导览与小地图</td>
                  <td className="p-3">RAG 问答、热点跳转、时序注释、原画对照</td>
                </tr>
                <tr>
                  <td className="p-3">禁止交叉</td>
                  <td className="p-3" colSpan={2}>沉浸态不出现侧栏长文与浮动问答；解读态视频 object-contain 不遮挡画心</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: '热点叙事', desc: '叙事节点锚定于长卷坐标；支持自动巡游、足迹与章节导览。' },
              { step: '02', title: '双轨门户', desc: '沉浸为全屏观影布局；解读为分栏面板 + 懒加载 AI 语义视点。' },
              { step: '03', title: '上下文导览', desc: '解读模式下 RagChat 注入当前热点上下文并生成推荐问题。' },
            ].map(item => (
              <div key={item.step} className="p-6 bg-white/5 border border-white/10 space-y-4">
                <div className="text-2xl font-bold text-white/10">{item.step}</div>
                <h3 className="font-bold text-white/90">{item.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-bold text-[#c5a059]">6. 视觉表现层：水墨风 UI 与 WebGL 氛围</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: '宣纸纹理', desc: '全屏纹理叠加与混合模式营造材质感，保持 pointer-events 不干扰交互。' },
              { step: '02', title: '古铜金光晕', desc: '基于 drop-shadow 与低频呼吸动画，突出品牌与关键交互点。' },
              { step: '03', title: 'WebGL 流体', desc: 'LiquidEther 以古画切片为底层纹理，Shader + 力场模拟水墨流动增强沉浸感。' },
            ].map(item => (
              <div key={item.step} className="p-6 bg-white/5 border border-white/10 space-y-4">
                <div className="text-2xl font-bold text-white/10">{item.step}</div>
                <h3 className="font-bold text-white/90">{item.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-bold text-[#c5a059]">7. 数据组织架构：热点、视频、解读文本统一管理</h2>
          <div className="p-6 bg-white/5 border border-white/10 space-y-4">
            <div className="text-[10px] text-white/20 tracking-widest">多模态单元</div>
            <div className="text-xs text-white/60 leading-relaxed">
              每个分镜对应一个多模态数据单元：热点坐标（x/y/width/height）、视频资源（云端 URL 与本地路径）、文化解读文本、关键帧注释、关键词标签与 Prompt 元信息。
              云端使用 Supabase Storage + PostgreSQL 统一管理；离线包内保留 JSON 与媒体资源池用于断网兜底。
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-bold text-[#c5a059]">8. RAG 智能导览架构：本地知识库 + 检索打分 + LLM 生成</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            为降低古籍与美术史语境下的幻觉风险，系统采用“先检索、后生成”：本地知识库召回 Top-K 内容，
            与用户问题共同组装 Prompt，再调用外部 LLM 生成导览回复。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/60">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-4 font-bold text-white tracking-widest">匹配维度</th>
                  <th className="py-4 font-bold text-white tracking-widest">分值</th>
                  <th className="py-4 font-bold text-white tracking-widest">作用</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-4">热点标题绝对匹配</td>
                  <td>+10</td>
                  <td>精准召回特定场景</td>
                </tr>
                <tr>
                  <td className="py-4">正文关键词匹配</td>
                  <td>+5 / 命中</td>
                  <td>捕获农具、服饰、人物等实体</td>
                </tr>
                <tr>
                  <td className="py-4">模糊内容包含</td>
                  <td>+3</td>
                  <td>长尾兜底</td>
                </tr>
                <tr>
                  <td className="py-4">分类 / 标签匹配</td>
                  <td>+2</td>
                  <td>提供背景语境</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-bold text-[#c5a059]">9. 部署与可靠性：前端轻量化、资源云端化、服务可降级</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: '前端应用', desc: '部署为静态 Web 应用；交互侧尽量轻量化，确保展陈现场稳定运行。' },
              { step: '02', title: '资源云端', desc: '视频与大资源走对象存储分发，结构化数据入库，降低前端包体压力。' },
              { step: '03', title: '优雅降级', desc: '云端不可用时回退本地 JSON 与本地媒体资源，保证基本交互与展示。' },
            ].map(item => (
              <div key={item.step} className="p-6 bg-white/5 border border-white/10 space-y-4">
                <div className="text-2xl font-bold text-white/10">{item.step}</div>
                <h3 className="font-bold text-white/90">{item.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#c5a059]">10. 优点与风险：可展示、可复现、可扩展</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 border border-white/10 space-y-4">
              <div className="text-[10px] text-white/20 tracking-widest">优势</div>
              <div className="text-xs text-white/60 leading-relaxed space-y-2">
                <div>离线生成 + 稳定化后处理，把不确定性留在生产端，展示端稳定可控。</div>
                <div>切片渲染 + GPU 加速，解决超宽长卷的性能瓶颈。</div>
                <div>RAG 先检索后生成，提升文化解读准确性与可追溯性。</div>
              </div>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 space-y-4">
              <div className="text-[10px] text-white/20 tracking-widest">风险</div>
              <div className="text-xs text-white/60 leading-relaxed space-y-2">
                <div>高分辨率与批量推理可能触发显存上限，需控制并发与分辨率策略。</div>
                <div>外部 LLM API 受限流与网络延迟影响，需要缓存与降级机制。</div>
                <div>知识库规模与标注质量决定 RAG 上限，需持续扩展与维护。</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Methodology;
