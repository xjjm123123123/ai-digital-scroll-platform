import React, { useRef, useState } from 'react';

const BackgroundView: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<number>(0);

  const tiles = Array.from({ length: 10 }, (_, i) => `/images/tiles/tile_${i}.jpg`);

  const odes = [
    {
      title: "七月",
      subtitle: "农事总纲 · 衣食之源",
      desc: "《七月》是《豳风》中最长的一篇，也是全卷的核心。诗人以通俗流畅的语言，按季节顺序记述了农夫一年四季的耕作、蚕桑、打猎、修缮房屋等劳动生活，以及祭祀、燕飨等活动，宛如一幅宏大的周代社会风俗画卷。"
    },
    {
      title: "鸱鸮",
      subtitle: "喻意保孤 · 王业艰难",
      desc: "借一只母鸟在鸱鸮（猫头鹰）抓走幼鸟后，辛勤修补巢穴的故事，比喻周公在流言蜚语中竭力维护周王朝的统一和安定，保护年幼的成王，体现了周公的忠心与苦心。"
    },
    {
      title: "东山",
      subtitle: "征人怀乡 · 情真意切",
      desc: "描述了周公东征三年后，士兵在归途中对家乡亲人的思念之情。诗中既有对战争艰苦的回忆，又有对家乡景物和妻子的深切怀念，情感真挚动人。"
    },
    {
      title: "破斧",
      subtitle: "哀叹征役 · 民生疾苦",
      desc: "通过描写斧柄折断、斧刃缺损，反映了随周公东征的士兵长年征战的劳苦和对和平生活的渴望，同时也赞颂了周公东征平定祸乱的功绩。"
    },
    {
      title: "伐柯",
      subtitle: "遵循礼法 · 婚姻之仪",
      desc: "以砍伐斧柄需要依样画葫芦为起兴，阐述了迎娶妻子需要媒妁之言的道理，同时也隐喻了治理国家需要遵循法度，任用贤能。"
    },
    {
      title: "九罭",
      subtitle: "访贤求隐 · 君臣际会",
      desc: "描写了周公在微服私访中，看到渔夫在河中设网捕鱼的情景，表达了周公求贤若渴、礼贤下士的态度，以及君臣遇合的喜悦。"
    },
    {
      title: "狼跋",
      subtitle: "进退维谷 · 德音不瑕",
      desc: "以老狼进退两难的窘态起兴，赞美周公在艰难处境中依然保持美德，即使面临流言蜚语和政治困境，也能从容应对，最终感化世人。"
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
              <span>滑动</span>
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

        {/* Deep Dive Content */}
        <div className="px-8 max-w-6xl mx-auto space-y-32">

          {/* The Seven Odes */}
          <section>
            <div className="text-center mb-16">
              <h3 className="text-3xl font-serif text-[#f0e6d2] mb-4">豳风七篇 · 史诗华章</h3>
              <p className="text-white/40 text-sm tracking-widest">全卷七段，段段皆为经典</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {odes.map((ode, idx) => (
                <div key={idx} className="relative group overflow-hidden rounded-lg bg-[#1a1815] border border-[#c5a059]/10 hover:border-[#c5a059]/40 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />
                  <img 
                    src={tiles[idx % tiles.length]} 
                    alt={ode.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="relative z-20 p-6 h-full flex flex-col justify-end">
                    <h4 className="text-2xl font-serif text-[#c5a059] mb-2">{ode.title}</h4>
                    <p className="text-white/60 text-xs italic mb-4 border-l-2 border-[#c5a059] pl-2">{ode.subtitle}</p>
                    <p className="text-white/50 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {ode.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Artistic Feature Highlight - Ma Hezhi */}
          <section className="relative rounded-2xl overflow-hidden border border-[#c5a059]/20">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
            {/* Background reinforcement */}
            <img src="/images/tiles/tile_4.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity blur-sm" alt="Background" />

            <div className="relative z-20 p-12 md:p-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-serif text-[#f0e6d2]">画圣遗韵：蚂蝗描</h3>
                <p className="text-white/70 leading-relaxed font-light">
                  全卷笔法高古，虽设色绚丽，却无脂粉俗气。马和之运用其标志性的"蚂蝗描"，线条似断还连，粗细变化随心所欲，恰如其分地表现了衣纹的质感与人物的动态。这种"逸笔草草"而又神形兼备的画风，在南宋院体画中独树一帜。
                </p>
                <blockquote className="border-l-2 border-[#c5a059] pl-6 py-2 my-8 text-white/50 italic font-serif">
                  "和之作画，务去华藻，自成一家。" —— 《画继》
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
