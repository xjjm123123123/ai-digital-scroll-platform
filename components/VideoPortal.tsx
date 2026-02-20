
import React, { useEffect, useState, useRef } from 'react';
import { Hotspot, HotspotLevel, VideoVersion } from '../types';
import { interpretScene } from '../services/gemini';
import { HOTSPOTS } from '../constants';

interface VideoPortalProps {
  hotspot: Hotspot;
  onClose: () => void;
  onJumpTo: (target: Hotspot) => void;
  activeMode: 'immersive' | 'interpret';
  onModeChange: (m: 'immersive' | 'interpret') => void;
}

const CHAPTER_CONTENT_MAP: Record<string, { label: string; subtitle: string; background: string; contentDetail: string }> = {
  'h-new-8': {
    label: '七月',
    subtitle: '华夏最早的农事历书',
    background: '地位：全诗共八章，是《诗经·国风》中最长的作品。',
    contentDetail: '以时间为经，以生产生活为纬。从一月的寒风刺骨写到腊月的凿冰祭祀，详尽记录了西周时期豳地农民的一年：春天耕种采桑，夏天锄草消暑，秋天收获染丝，冬天修屋捕猎。它不仅是文学作品，更是研究先周社会结构、物候历法、劳动工具及饮食服饰极其珍贵的史料。'
  },
  'h-new-7': {
    label: '七月',
    subtitle: '华夏最早的农事历书',
    background: '地位：全诗共八章，是《诗经·国风》中最长的作品。',
    contentDetail: '以时间为经，以生产生活为纬。从一月的寒风刺骨写到腊月的凿冰祭祀，详尽记录了西周时期豳地农民的一年：春天耕种采桑，夏天锄草消暑，秋天收获染丝，冬天修屋捕猎。它不仅是文学作品，更是研究先周社会结构、物候历法、劳动工具及饮食服饰极其珍贵的史料。'
  },
  'h-new-6': {
    label: '东山',
    subtitle: '战争创伤下的归家之情',
    background: '描写随周公东征三年后复员回乡的士兵。',
    contentDetail: '全诗通过士兵在归途中的心理独白，展现了极高的艺术感染力。第一章写行军之苦；第二章想象家乡房屋荒芜、鹇鹄啼叫的凄凉；第三章转而想象新婚妻子在家苦苦等候的情景。这种"未到家先想家"的虚实结合手法，开启了后世边塞诗和征夫诗的先河。'
  },
  'h-new-5': {
    label: '破斧',
    subtitle: '凯旋后的苦涩与荣耀',
    background: '周公东征胜利，将士们即将解甲归田。',
    contentDetail: '诗歌反复咏叹"既破我斧，又缺我斨"，通过兵器的残破侧面印证了战争的残酷与漫长。虽然武器毁坏了，但将士们对周公能够平定四方、带给他们安宁生活表示了深深的敬意和爱戴，反映了底层士兵在战后复杂的心境。'
  },
  'h-new-4': {
    label: '伐柯',
    subtitle: '婚姻制度的礼法标准',
    background: '确立社会契约与周礼的象征。',
    contentDetail: '以"砍树做斧柄"这一日常劳动为喻，提出核心观点：砍木头需要斧头，娶妻子必须通过媒妁。如果没有旧的斧柄做参考，就做不出新的斧柄；如果没有中介和礼仪，婚姻就不合法。这体现了当时社会已经进入了高度重视契约和礼法的文明阶段。'
  },
  'h-new-3': {
    label: '九罭',
    subtitle: '周初的政治礼仪',
    background: '描写公卿（一说周公）巡视地方时的盛大欢迎场面。',
    contentDetail: '"九罭"指拥有九个网眼的捕鱼大网。诗中以捕获大鱼（鳟、鲂）为起兴，象征着国家的贤才得以任用。随后笔锋转到丰盛的宴席和主宾之间热情的款待，展现了西周初期统治阶层内部和睦、礼贤下士的政治风气。'
  },
  'h-new-2': {
    label: '九罭',
    subtitle: '周初的政治礼仪',
    background: '描写公卿（一说周公）巡视地方时的盛大欢迎场面。',
    contentDetail: '"九罭"指拥有九个网眼的捕鱼大网。诗中以捕获大鱼（鳟、鲂）为起兴，象征着国家的贤才得以任用。随后笔锋转到丰盛的宴席和主宾之间热情的款待，展现了西周初期统治阶层内部和睦、礼贤下士的政治风气。'
  },
  'h-new-1': {
    label: '狼跋',
    subtitle: '困境中的威仪与德行',
    background: '针对诽谤周公的言论进行的辩护。',
    contentDetail: '诗中生动描绘了一只老狼进退两难的窘态：前行则踩到胡须，后退则被尾巴绊倒。这象征了周公在权位与流言之间的艰难处境。但诗歌笔锋一转，赞美周公即便在如此窘境下，依然能够保持赤色的鞋履和优雅的仪态，表现出一种不随波逐流、坚守道德准则的高贵格调。'
  }
};

const getChapterContent = (hotspot: Hotspot) => {
  const mapped = CHAPTER_CONTENT_MAP[hotspot.id];
  if (mapped) {
    return {
      label: mapped.label,
      subtitle: hotspot.subtitle || mapped.subtitle,
      background: hotspot.background || mapped.background,
      contentDetail: hotspot.contentDetail || mapped.contentDetail
    };
  }
  return {
    label: hotspot.label,
    subtitle: hotspot.subtitle || '',
    background: hotspot.background || '',
    contentDetail: hotspot.contentDetail || ''
  };
};

const VideoPortal: React.FC<VideoPortalProps> = ({ hotspot, onClose, onJumpTo, activeMode, onModeChange }) => {
  const [activeVersion, setActiveVersion] = useState<VideoVersion>(
    hotspot.versions?.[0] || { id: 'default', tag: '标准', url: hotspot.videoUrl, styleDesc: '默认生成效果' }
  );
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [interpretation, setInterpretation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadInterpret = async () => {
      setLoading(true);
      const data = await interpretScene(hotspot.label, hotspot.description);
      setInterpretation(data);
      setLoading(false);
    };
    loadInterpret();
    setActiveVersion(hotspot.versions?.[0] || { id: 'default', tag: '标准', url: hotspot.videoUrl, styleDesc: '默认生成效果' });
  }, [hotspot]);

  useEffect(() => {
    setVideoLoading(true);
  }, [activeVersion.url, hotspot.carouselMedia?.[carouselIndex]]);

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleVideoLoaded = () => {
    setVideoLoading(false);
  };

  const relatedHotspots = (hotspot.relatedHotspotIds || [])
    .map(id => HOTSPOTS.find(h => h.id === id))
    .filter(Boolean) as Hotspot[];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-700">
      <div className={`relative w-full max-w-7xl h-full max-h-[90vh] flex flex-col md:flex-row glass-panel rounded-sm border-white/10 overflow-hidden shadow-[0_0_150px_rgba(197,160,89,0.1)]`}>
        
        {/* 工具栏 */}
        <div className="absolute top-0 left-0 w-full z-[60] flex justify-between items-center px-8 py-6 pointer-events-none">
          <div className="flex items-center pointer-events-auto">
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`text-[10px] tracking-widest flex items-center gap-2 transition-colors ${isSaved ? 'text-[#c5a059]' : 'text-white/40 hover:text-white'}`}
            >
              {isSaved ? '已存档' : '收藏入卷'}
              <div className={`w-2 h-2 rounded-full border border-current ${isSaved ? 'bg-current' : ''}`} />
            </button>
          </div>
          
          <div className="flex items-center gap-6 pointer-events-auto">
             <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 pl-2 gap-2 shadow-xl">
               <div className="flex items-center gap-1">
                  {[
                    { id: 'immersive', label: '沉浸' },
                    { id: 'interpret', label: '解读' }
                  ].map(m => (
                    <button 
                      key={m.id}
                      onClick={() => onModeChange(m.id as any)}
                     className={`relative px-5 py-2 rounded-full text-[10px] tracking-[0.2em] transition-all duration-500 overflow-hidden ${
                       activeMode === m.id 
                         ? 'text-[#080808] font-bold shadow-[0_0_15px_rgba(197,160,89,0.4)]' 
                         : 'text-white/40 hover:text-white hover:bg-white/5'
                     }`}
                   >
                     {activeMode === m.id && (
                       <div className="absolute inset-0 bg-gradient-to-r from-[#c5a059] to-[#e0c080] z-0" />
                     )}
                     <span className="relative z-10">{m.label}</span>
                   </button>
                 ))}
               </div>
               
               <div className="w-[1px] h-4 bg-white/10 mx-2" />
               
               <button 
                 onClick={onClose} 
                 className="group w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors mr-1"
               >
                 <svg className="w-4 h-4 text-white/40 group-hover:text-white transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>
          </div>
        </div>

        {/* 视窗内容区 */}
        <div className="flex-[2.8] bg-black relative flex items-center justify-center overflow-hidden">
          {videoLoading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050505]">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-2 border-[#c5a059]/20 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-12 h-12 border-2 border-[#c5a059] rounded-full border-t-transparent animate-spin"></div>
                </div>
                <span className="text-[10px] text-white/30 tracking-widest">加载中</span>
              </div>
            </div>
          )}
          {hotspot.carouselMedia && hotspot.carouselMedia.length > 0 ? (
            <div className="relative w-full h-full flex items-center justify-center bg-[#050505] group">
              {/* 轮播媒体 */}
              <video 
                key={hotspot.carouselMedia[carouselIndex]}
                src={hotspot.carouselMedia[carouselIndex]}
                className={`max-w-full max-h-full transition-transform duration-[2000ms] ${activeMode === 'immersive' ? 'scale-110' : 'scale-100'}`}
                autoPlay loop muted playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedData={handleVideoLoaded}
              />
              
              {/* 轮播控件 */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {hotspot.carouselMedia.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCarouselIndex(idx); }}
                    className={`w-2 h-2 rounded-full transition-all ${idx === carouselIndex ? 'bg-[#c5a059] w-6' : 'bg-white/30 hover:bg-white/60'}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={(e) => {
                   e.stopPropagation();
                   setCarouselIndex((prev) => (prev - 1 + hotspot.carouselMedia!.length) % hotspot.carouselMedia!.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-[#c5a059] transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <button 
                onClick={(e) => {
                   e.stopPropagation();
                   setCarouselIndex((prev) => (prev + 1) % hotspot.carouselMedia!.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-[#c5a059] transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-[#050505]">
              <video 
                ref={videoRef}
                src={activeVersion.url} 
                className={`max-w-full max-h-full transition-transform duration-[2000ms] ${activeMode === 'immersive' ? 'scale-110' : 'scale-100'}`}
                autoPlay loop muted playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedData={handleVideoLoaded}
              />
              
              {/* 语义注释 */}
              {activeMode === 'interpret' && hotspot.annotations?.map((ann, idx) => (
                Math.abs(currentTime - ann.time) < 1.5 && (
                  <div 
                    key={idx}
                    className="absolute p-4 glass-panel border-[#c5a059]/30 rounded-sm animate-in zoom-in slide-in-from-bottom-2 duration-500 max-w-[220px]"
                    style={{ left: `${ann.position.x}%`, top: `${ann.position.y}%` }}
                  >
                    <div className="text-[11px] text-[#f0e6d2] font-serif leading-relaxed italic border-l-2 border-[#c5a059] pl-3">
                      {ann.text}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10 backdrop-blur-md">
               <div className="flex flex-col items-center gap-6">
                  <div className="w-10 h-10 border border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin"></div>
                  <span className="text-[10px] text-[#c5a059] tracking-[0.5em] uppercase animate-pulse">正在唤醒此景意象...</span>
               </div>
            </div>
          )}
        </div>

        {/* 侧边信息栏 */}
        <div className={`flex-1 flex flex-col border-l border-white/5 overflow-hidden bg-[#080808] transition-all duration-700 ${activeMode === 'immersive' ? 'translate-x-full opacity-0 w-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}>
          <div className="p-8 pt-20 h-full overflow-y-auto no-scrollbar space-y-12">
            
            <section>
              <h2 className="text-4xl font-serif text-[#f0e6d2] leading-tight mb-2">{getChapterContent(hotspot).label}</h2>
              {getChapterContent(hotspot).subtitle && (
                <p className="text-lg text-[#c5a059] font-serif tracking-wide mb-4">《{getChapterContent(hotspot).label}》：{getChapterContent(hotspot).subtitle}</p>
              )}
              {getChapterContent(hotspot).background && (
                <div className="mb-4 p-4 bg-white/[0.02] border-l-2 border-[#c5a059]/30">
                  <p className="text-xs text-white/60 leading-relaxed font-serif">
                    <span className="text-[#c5a059] font-bold">背景：</span>{getChapterContent(hotspot).background}
                  </p>
                </div>
              )}
              {getChapterContent(hotspot).contentDetail && (
                <p className="text-sm text-white/70 leading-loose font-serif text-justify">
                  {getChapterContent(hotspot).contentDetail}
                </p>
              )}
              {!getChapterContent(hotspot).contentDetail && (
                <p className="text-sm text-white/50 leading-loose font-serif italic text-justify">
                  {hotspot.description}
                </p>
              )}
            </section>

            {interpretation && (
              <section className="space-y-4">
                <h3 className="text-[9px] text-[#c5a059] tracking-[0.3em] uppercase flex items-center gap-3">
                  <div className="h-[1px] w-6 bg-current" />
                  AI 语义视点
                </h3>
                <div className="space-y-4">
                  <div className="text-xs text-white/80 leading-relaxed font-serif pl-4 border-l border-[#c5a059]/30">
                    “{interpretation.culturalMeaning}”
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interpretation.visualHighlights?.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-[#c5a059]/5 border border-[#c5a059]/10 text-[9px] text-[#c5a059]/70 rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {hotspot.versions && (
              <section className="space-y-4">
                <h3 className="text-[9px] text-white/20 tracking-[0.3em] uppercase">风格变体</h3>
                <div className="grid grid-cols-1 gap-2">
                  {hotspot.versions.map(v => (
                    <button 
                      key={v.id}
                      onClick={() => setActiveVersion(v)}
                      className={`p-3 text-left border transition-all ${
                        activeVersion.id === v.id ? 'border-[#c5a059] bg-[#c5a059]/5' : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className={`text-[10px] ${activeVersion.id === v.id ? 'text-[#c5a059]' : 'text-white/40'}`}>{v.tag}</div>
                      <div className="text-[8px] text-white/20 mt-1 truncate">{v.styleDesc}</div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {relatedHotspots.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-[9px] text-white/20 tracking-[0.3em] uppercase">延展探索</h3>
                <div className="space-y-3">
                  {relatedHotspots.map(h => (
                    <button 
                      key={h.id}
                      onClick={() => onJumpTo(h)}
                      className="group w-full flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 hover:border-[#c5a059]/30 transition-all"
                    >
                      <div className="w-12 h-12 bg-black overflow-hidden relative">
                         <img src={h.originalImage || 'https://picsum.photos/seed/h/100/100'} className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-white/80 font-serif">{h.label}</span>
                        <span className="text-[8px] text-white/20 uppercase mt-0.5">{h.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPortal;
