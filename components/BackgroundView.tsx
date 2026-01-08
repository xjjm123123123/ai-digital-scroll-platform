
import React from 'react';

const BackgroundView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto px-8 pt-32 pb-20 bg-[#0c0c0c]">
      <div className="max-w-4xl mx-auto space-y-20">
        <header className="space-y-4 text-center">
          <h1 className="text-5xl font-serif text-[#f0e6d2]">关于《豳风图》</h1>
          <div className="h-[2px] bg-[#c5a059] w-24 mx-auto mt-4" />
          <p className="text-[#c5a059] tracking-[0.5em] text-sm mt-2">诗经意象与古代农桑文化</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <section className="space-y-6">
            <h2 className="text-2xl font-serif text-[#c5a059] border-b border-[#c5a059]/30 pb-2">历史沿革</h2>
            <p className="text-white/70 leading-relaxed text-sm text-justify">
              《豳风》是《诗经·国风》中的一部分，共七篇，主要是描写周族祖先在豳地（今陕西彬县一带）生活、生产的诗歌。
              《豳风图》历代皆有画家以此为题作画，其中以马和之、周臣等人的传世作品最为著名。
              画面多以“七月”为核心，细致勾勒了从春耕到冬藏、从采桑到织纩的完整农业周期。
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-serif text-[#c5a059] border-b border-[#c5a059]/30 pb-2">艺术特色</h2>
            <p className="text-white/70 leading-relaxed text-sm text-justify">
              本画卷不仅是艺术创作，更是珍贵的社会史资料。画中人物神态生动，农具、服饰、建筑等细节考究，
              展现了“先民”质朴、辛勤的生命状态。其构图多采用手卷形式，随着卷轴推移，时令流转，
              产生一种独特的时空叙事感。
            </p>
          </section>
        </div>

        <section className="p-10 glass-panel border border-[#c5a059]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <span className="text-9xl font-bold chinese-font">七月</span>
          </div>
          <h2 className="text-2xl font-serif text-[#c5a059] mb-6">核心意象：七月流火</h2>
          <div className="space-y-4 text-white/80 italic font-serif leading-loose">
            “七月流火，九月授衣。一之日觱发，二之日栗烈。无衣无褐，何以卒岁？”<br/>
            “三之日于耜，四之日举趾。同我妇子，馌彼南亩。田畯至喜。”
          </div>
          <p className="mt-8 text-sm text-white/50 leading-relaxed">
            本系统通过AI技术，试图还原《七月》中所描绘的那些极具动感的瞬时状态，将静止的古画笔触转化为具有生命力的动态影像。
          </p>
        </section>

        <footer className="text-center py-10 opacity-30 text-[10px] tracking-widest border-t border-white/10">
          基于数字化馆藏资源重构
        </footer>
      </div>
    </div>
  );
};

export default BackgroundView;
