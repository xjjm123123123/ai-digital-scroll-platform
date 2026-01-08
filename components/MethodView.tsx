
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

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#c5a059]">1. 图像渲染与交互引擎</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              系统采用 <strong>Canvas + D3.js</strong> 双引擎架构。长卷资源通过切片技术加载，
              确保在展示超宽画幅时仍能保持流畅。
              坐标系采用标准化百分比映射，解决不同分辨率设备下的交互一致性。
            </p>
          </div>
          <div className="glass-panel p-6 border-white/10 border flex items-center justify-center">
            <div className="w-full aspect-video bg-black flex flex-col items-center justify-center gap-4 border border-dashed border-white/20">
              <div className="text-[10px] text-white/20 tracking-widest">逻辑流</div>
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 border border-[#c5a059] flex items-center justify-center text-[10px]">原始</div>
                <div className="text-[#c5a059]">→</div>
                <div className="w-12 h-12 border border-[#c5a059] flex items-center justify-center text-[10px]">切片</div>
                <div className="text-[#c5a059]">→</div>
                <div className="w-12 h-12 border border-[#c5a059] flex items-center justify-center text-[10px]">呈现</div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-xl font-bold text-[#c5a059]">2. AI 语义生成管线</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: '语义提取', desc: '基于《诗经》原文进行语义分割，定义各节气、农事动作的核心关键词。' },
              { step: '02', title: '指令工程', desc: '利用 Gemini 处理复杂语义，将其转化为具有中国风动感的视觉指令。' },
              { step: '03', title: '动态合成', desc: '调用后端生成模型，将静态意象转化为局部动态序列。' },
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
          <h2 className="text-xl font-bold text-[#c5a059]">3. 交互逻辑规格</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/60">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-4 font-bold text-white tracking-widest">操作类别</th>
                  <th className="py-4 font-bold text-white tracking-widest">技术实现</th>
                  <th className="py-4 font-bold text-white tracking-widest">状态反馈</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-4">平移浏览</td>
                  <td>d3-zoom 变换</td>
                  <td>惯性滚动 / 边界回弹</td>
                </tr>
                <tr>
                  <td className="py-4">智能聚焦</td>
                  <td>相机插值动画</td>
                  <td>平滑飞行过渡</td>
                </tr>
                <tr>
                  <td className="py-4">语义互动</td>
                  <td>SVG 交互层</td>
                  <td>呼吸脉冲 / 悬停高亮</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Methodology;
