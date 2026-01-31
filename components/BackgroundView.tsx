import React, { useRef, useState } from 'react';

const BackgroundView: React.FC = () => {
  // Scroll container ref for potential programmatic scrolling
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<number>(0);

  const tiles = Array.from({ length: 10 }, (_, i) => `https://raw.githubusercontent.com/xjjm123123123/ai-digital-scroll-platform/main/public/images/tiles/tile_${i}.jpg`);

  const seasons = [
    {
      title: "春 · 载阳",
      subtitle: "一之日觱发，一之日于耜",
      desc: "画卷开篇，春风拂过豳地。农夫们开始修补农具，整理田垄。画面中可见人物或扛锄而行，或牵牛耕地，嫩绿的柳色与初升的暖阳交相辉映，充满了勃勃生机。",
      color: "#8FA876" // Spring Green
    },
    {
      title: "夏 · 鸣蜩",
      subtitle: "四月秀葽，五月鸣蜩",
      desc: "盛夏时节，万物生长。采桑女忙碌于桑林之间，养蚕缫丝。这一段不仅描绘了男耕女织的辛劳，更细致刻画了古代独特的蚕桑文化，人物衣纹飘逸，神态专注。",
      color: "#BF7A6F" // Summer Red/Warm
    },
    {
      title: "秋 · 获稻",
      subtitle: "八月剥枣，十月获稻",
      desc: "金秋是收获的季节。画卷展现了壮观的收割场景：割稻、打场、堆垛。沉甸甸的谷穗压弯了腰，农人们脸上洋溢着丰收的喜悦，打谷场上一片繁忙热闹。",
      color: "#D9A03A" // Autumn Gold
    },
    {
      title: "冬 · 同庆",
      subtitle: "九月授衣，朋酒斯飨",
      desc: "冬日农闲，人们缝制新衣，酿造春酒，举行祭祀与宴饮。画面转入室内或庭院，展现了“跻彼公堂，称彼兕觥”的宗族欢庆场面，这是对一年辛劳的慰藉，也是礼乐文明的体现。",
      color: "#8C9BAB" // Winter Blue/Grey
    }
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-[#0c0c0c] text-[#e0d8c8] scroll-smooth">
      <div className="max-w-7xl mx-auto pb-20 pt-6">

        {/* Hero / Header Section */}
        <header className="relative py-24 text-center px-4 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c5a059] opacity-5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-block border border-[#c5a059]/30 px-4 py-1 rounded-full backdrop-blur-md mb-4 animate-fade-in">
              <span className="text-xs font-serif text-[#c5a059] tracking-[0.3em] uppercase">The Odes of Bin by Ma Hezhi</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-[#f0e6d2] tracking-wider drop-shadow-2xl">
              关于<span className="text-[#c5a059] mx-2">《豳风图》</span>
            </h1>
            <p className="text-white/60 text-lg font-serif tracking-widest max-w-2xl mx-auto leading-loose">
              南宋院体画极致 · 诗经国风之滥觞 · 农耕文明全景图
            </p>
          </div>
        </header>

        {/* Digital Scroll Viewer - THE CORE NEW FEATURE */}
        <section className="mb-24 relative group">
          <div className="px-8 mb-8 flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-serif text-[#c5a059]">数字长卷预览</h2>
              <p className="text-white/50 text-sm">向右滑动，阅尽三千年农桑画卷</p>
            </div>
            {/* Decorative Scroll Hint */}
            <div className="hidden md:flex items-center space-x-2 text-white/30 text-xs tracking-widest animate-pulse">
              <span>SCROLL</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </div>

          {/* The Scroll Container */}
          <div
            ref={scrollRef}
            className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide border-y border-[#c5a059]/10 bg-[#1a1815] relative"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="inline-flex h-[400px] md:h-[500px]">
              {tiles.map((tileSrc, index) => (
                <div key={index} className="h-full relative shrink-0 group/tile">
                  {/* Image Tile */}
                  <img
                    src={tileSrc}
                    alt={`Binfeng Scroll Section ${index}`}
                    className="h-full w-auto object-cover select-none pointer-events-none opacity-90 transition-opacity duration-500 group-hover/tile:opacity-100"
                    loading="lazy"
                  />
                  {/* Simple index marker for debugging/nav - can receive hotspots later */}
                  <div className="absolute bottom-0 left-0 p-2 text-[10px] text-white/20">{index}</div>
                </div>
              ))}
              {/* End padding */}
              <div className="w-32 h-full opacity-0 shrink-0" />
            </div>
          </div>
        </section>

        {/* Deep Dive Content - Four Seasons Analysis */}
        <div className="px-8 max-w-6xl mx-auto space-y-32">

          {/* Intro Text Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4 sticky top-10">
              <h3 className="text-4xl font-serif text-[#f0e6d2] leading-tight mb-6">
                以画证史<br />
                <span className="text-[#c5a059] text-2xl">见证周代社会的缩影</span>
              </h3>
              <div className="w-12 h-[2px] bg-[#c5a059] mb-6" />
              <p className="text-white/60 text-sm leading-7 text-justify">
                《豳风图》全卷布局宏大，从右至左展开。马和之巧妙地运用时空转换的艺术手法，将不同季节、不同地点的农事活动安排在同一画面中。正如《石渠宝笈》所言：“虽然以七月为名，实则备载四时之景。”
              </p>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {seasons.map((season, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.02] border border-white/5 p-8 rounded-xl hover:bg-white/[0.04] hover:border-[#c5a059]/30 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-serif text-[#f0e6d2] group-hover:text-[#c5a059] transition-colors">{season.title}</h4>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: season.color }} />
                  </div>
                  <p className="text-[#c5a059] text-xs font-serif mb-4 opacity-70 italic">{season.subtitle}</p>
                  <p className="text-white/60 text-sm leading-relaxed text-justify">
                    {season.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Artistic Feature Highlight - Ma Hezhi */}
          <section className="relative rounded-2xl overflow-hidden border border-[#c5a059]/20">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
            {/* Background reinforcement */}
            <img src="/images/tiles/tile_4.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity blur-sm" alt="Background" />

            <div className="relative z-20 p-12 md:p-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-serif text-[#f0e6d2]">画圣遗韵：蚂蝗描</h3>
                <p className="text-white/70 leading-relaxed font-light">
                  全卷笔法高古，虽设色绚丽，却无脂粉俗气。马和之运用其标志性的“蚂蝗描”，线条似断还连，粗细变化随心所欲，恰如其分地表现了衣纹的质感与人物的动态。这种“逸笔草草”而又神形兼备的画风，在南宋院体画中独树一帜。
                </p>
                <blockquote className="border-l-2 border-[#c5a059] pl-6 py-2 my-8 text-white/50 italic font-serif">
                  “和之作画，务去华藻，自成一家。” —— 《画继》
                </blockquote>
              </div>
              <div className="relative h-64 w-full bg-black/50 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="text-center space-y-2">
                  <p className="text-[#c5a059] text-xs tracking-widest">笔法解析</p>
                  <div className="w-16 h-16 border-2 border-[#c5a059] rounded-full mx-auto flex items-center justify-center animate-spin-slow">
                    <span className="font-serif text-2xl">兰</span>
                  </div>
                  <p className="text-white/40 text-[10px]">兰叶飘逸 · 线条灵动</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-40 text-center border-t border-white/5 pt-10 pb-10">
          <svg className="w-6 h-6 mx-auto text-[#c5a059] mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          <p className="text-[#c5a059] tracking-[0.5em] text-xs font-serif opacity-60">AI数字长卷 · 交互式文化体验平台</p>
          <p className="text-white/20 text-[10px] mt-2 tracking-widest uppercase">Based on the collection of The Palace Museum</p>
        </footer>

      </div>
    </div>
  );
};

export default BackgroundView;
