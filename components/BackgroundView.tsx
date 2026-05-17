import React, { useRef, useState } from 'react';

const BackgroundView: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<number>(0);

  const tiles = Array.from({ length: 10 }, (_, i) => `/images/tiles/tile_${i}.jpg`);

  const odes = [
    {
      title: "七月",
      subtitle: "农事总纲 · 衣食之源",
      lead: "长卷开篇从“七月流火，九月授衣”起：暑气渐退、寒意将至，人们开始准备冬衣。画面由天象引入人事，呈现古人依时令而生。",
      scene: [
        "夜空渐阔，大火星西流，人物仰观天象",
        "春：修耒耜、下南亩；采桑养蚕、织布；采蘩祀事；妇女送饭于南亩",
        "夏秋：打枣、采瓜、获稻、筑场圃、纳禾稼",
        "冬：塞窗熏鼠、修屋备衣裘、凿冰藏冰",
        "收束：祭祀与宴饮，举兕觥祝祷“万寿无疆”"
      ],
      meaning: [
        "全卷最繁密的一段：不是田园风景，而是“民生图 / 农政图 / 王业根本图”",
        "把一年劳作提升为国家礼制与政治秩序的根基，强调重农恤民、勤政爱民的政治寓意"
      ]
    },
    {
      title: "鸱鸮",
      subtitle: "喻意保孤 · 王业艰难",
      lead: "从农桑丰厚转入政治忧患：危巢孤鸟，风雨将至。表面是鸟巢受侵，深层常被解释为周公自况。",
      scene: [
        "高树之巢倾危，鸱鸮盘旋其上",
        "巢中幼鸟惊惧，母鸟衔草修巢，积聚柴草固门户",
        "天色阴沉，风雨欲来，气氛紧张阴郁"
      ],
      meaning: [
        "对应周初政治风波：周公摄政遭猜忌与流言，仍为保全新建王朝而承担压力",
        "提醒观者：王业既立并非太平无事，国家如鸟巢需不断修护，也会遭遇外患与内乱"
      ]
    },
    {
      title: "东山",
      subtitle: "征人怀乡 · 情真意切",
      lead: "东征归来，细雨迷濛。诗中反复的“慆慆不归”“零雨其濛”，让“归心沉重”成为全卷最浓的情绪段落。",
      scene: [
        "归兵行于雨中：衣甲破旧、车马疲惫，远山云雾迷濛",
        "乡里旧宅倾圮，门户荒废，庭院草木蔓生，墙角蛛网",
        "妇人倚门而望；有人修葺屋宇、重整田园"
      ],
      meaning: [
        "不止歌颂胜利，更写战争之后人的疲惫、思乡与重返生活的愿望",
        "在“国家平乱”之外，强调“家庭/婚姻/田园/日常”必须被重新安顿"
      ]
    },
    {
      title: "破斧",
      subtitle: "哀叹征役 · 民生疾苦",
      lead: "征伐艰难，王师有功。以“既破我斧，又缺我斨”的器物细节，表现战争消耗与秩序重建。",
      scene: [
        "断裂的斧、缺口的斨、疲惫的士卒与修整的车马",
        "战尘已息，军队整肃归来，战争余绪仍在"
      ],
      meaning: [
        "与《东山》并置：一面是归来者的私人情感，一面是王师征伐的公共功业",
        "强调“征伐之难”与“使命完成”的双重叙事：艰辛与功业同时成立"
      ]
    },
    {
      title: "伐柯",
      subtitle: "遵循礼法 · 婚姻之仪",
      lead: "从战争转入礼法制度：“伐柯如何？匪斧不克。取妻如何？匪媒不得。”社会秩序由礼而立、由制而成。",
      scene: [
        "前景：樵夫林间砍木作斧柄，以旧斧为尺度",
        "后景：婚礼场面，媒人往来，两家相见，礼器陈设，亲族观礼"
      ],
      meaning: [
        "由王朝秩序进入社会秩序：农业与武功之外，还需礼制维系",
        "没有《伐柯》，整卷将缺少“礼”的一层，难以构成周人世界的制度骨架"
      ]
    },
    {
      title: "九罭",
      subtitle: "访贤求隐 · 君臣际会",
      lead: "鱼网见公，民心恋德。画面从水滨展开：细密鱼网与“衮衣绣裳”的贵人并置，借景写人心所向。",
      scene: [
        "水边渔人张设细网，水中鳟鲂游动",
        "贵人至水滨，仪态端重；百姓士人迎候瞻望",
        "远处道路车马，暗示将行，而众人希望贤者停留"
      ],
      meaning: [
        "核心不是捕鱼，而是“借鱼网起兴”呈现民情细微与德政所归",
        "若置于周公叙事：人们思慕贤者在位，希望其不离民间"
      ]
    },
    {
      title: "狼跋",
      subtitle: "进退维谷 · 德音不瑕",
      lead: "最适合作为整卷收尾：狼前进踩胡、后退绊尾，形象奇特却直指“进退皆难”。随后以“赤舄几几”的从容，收束为君子德守。",
      scene: [
        "山谷中狼进退受阻：跋胡、载疐其尾",
        "朝堂之上公卿端肃，赤舄整齐，神情从容；群臣议论、流言暗起"
      ],
      meaning: [
        "在周公语境下，“进则疑专权，退则恐王室不安”，正是进退维谷",
        "最终以德自守，完成辅政、东征与制度建构之功，落点在“处困而德不亏”"
      ]
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

          <section>
            <div className="text-center mb-16">
              <h3 className="text-3xl font-serif text-[#f0e6d2] mb-4">豳风七篇 · 史诗华章</h3>
              <p className="text-white/40 text-sm tracking-widest">全卷七段，段段皆为经典</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 bg-white/5 border border-white/10">
                <div className="text-[10px] text-[#c5a059] tracking-[0.3em] mb-3">叙事主线</div>
                <div className="text-sm text-white/60 leading-relaxed">
                  从《七月》的农桑岁时出发，转入《鸱鸮》的忧患政治，再经《东山》《破斧》写东征与战后归来，
                  以《伐柯》进入礼法制度，由《九罭》呈现民心恋德，最终在《狼跋》收束为“进退皆难而德不亏”的君子主题。
                </div>
              </div>

              {odes.map((ode, idx) => {
                const isActive = activeSection === idx;
                return (
                  <button
                    key={ode.title}
                    type="button"
                    onClick={() => setActiveSection(idx)}
                    className={`w-full text-left relative overflow-hidden rounded-xl border transition-all duration-500 ${
                      isActive ? 'border-[#c5a059]/60 bg-[#1a1815]' : 'border-white/10 bg-white/5 hover:border-[#c5a059]/30'
                    }`}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={tiles[idx % tiles.length]}
                        alt={ode.title}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          isActive ? 'opacity-30 scale-105' : 'opacity-15'
                        }`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
                    </div>

                    <div className="relative z-10 p-7 md:p-8">
                      <div className="flex items-baseline justify-between gap-6">
                        <div>
                          <div className="text-[#c5a059] text-2xl font-serif">{ode.title}</div>
                          <div className="text-white/55 text-xs tracking-widest mt-2">{ode.subtitle}</div>
                        </div>
                        <div className={`text-[10px] tracking-[0.3em] ${isActive ? 'text-[#c5a059]' : 'text-white/30'}`}>
                          {isActive ? '收起' : '展开'}
                        </div>
                      </div>

                      <div className="mt-5 text-sm text-white/65 leading-relaxed">
                        {ode.lead}
                      </div>

                      {isActive && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-5 bg-black/40 border border-white/10">
                            <div className="text-[10px] text-white/30 tracking-[0.3em] mb-3">入画要点</div>
                            <div className="space-y-2 text-xs text-white/60 leading-relaxed">
                              {ode.scene.map((line) => (
                                <div key={line}>· {line}</div>
                              ))}
                            </div>
                          </div>
                          <div className="p-5 bg-black/40 border border-white/10">
                            <div className="text-[10px] text-white/30 tracking-[0.3em] mb-3">经义寓意</div>
                            <div className="space-y-2 text-xs text-white/60 leading-relaxed">
                              {ode.meaning.map((line) => (
                                <div key={line}>· {line}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

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

          <section className="space-y-10">
            <div className="text-center">
              <h3 className="text-3xl font-serif text-[#f0e6d2] mb-4">《豳风图》的地位与评价</h3>
              <p className="text-white/40 text-sm tracking-widest">以图证经 · 以画明政 · 以农桑见王业</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: '经典文本的图像阐释',
                  desc: '《豳风图》以《诗经》为根基，将“风雅教化”转化为可观看的农事、礼俗、战争与政治场景，是《诗经》图像化传统的重要题材。'
                },
                {
                  title: '王业艰难的政治视觉化',
                  desc: '《七月》表面写农事，深层为立国之本与为政之鉴。历代重视此题材，正因其能以农桑图景表达重农恤民、勤政爱民的政治态度。'
                },
                {
                  title: '帝王“图教”的材料',
                  desc: '通过耕种、蚕桑、收获、凿冰、祭祀等场景，君主得以直观认识民生艰难，与《耕织图》《无逸图》等共同构成政教图像系统。'
                },
                {
                  title: '持续延展的叙事模式',
                  desc: '从马和之的复合式构图到后世分章表现与田园全景，《豳风图》形成长期延续的图像模式，不断被重绘、改写与再阐释。'
                }
              ].map((item) => (
                <div key={item.title} className="p-7 bg-white/5 border border-white/10">
                  <div className="text-[#c5a059] font-serif text-xl">{item.title}</div>
                  <div className="mt-4 text-sm text-white/60 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="p-7 bg-[#1a1815] border border-[#c5a059]/20">
              <div className="text-[10px] text-[#c5a059] tracking-[0.3em] mb-4">一句话总结</div>
              <div className="text-[#f0e6d2] font-serif text-lg leading-relaxed">
                以图证经，以画明政，以农桑见王业，以日常见礼教。
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
