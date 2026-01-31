
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

const VideoPortal: React.FC<VideoPortalProps> = ({ hotspot, onClose, onJumpTo, activeMode, onModeChange }) => {
  const [activeVersion, setActiveVersion] = useState<VideoVersion>(
    hotspot.versions?.[0] || { id: 'default', tag: '标准', url: hotspot.videoUrl, styleDesc: '默认生成效果' }
  );
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [interpretation, setInterpretation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
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
          {hotspot.carouselMedia && hotspot.carouselMedia.length > 0 ? (
            <div className="relative w-full h-full flex items-center justify-center bg-[#050505] group">
              {/* 轮播媒体 */}
              <video 
                key={hotspot.carouselMedia[carouselIndex]}
                src={hotspot.carouselMedia[carouselIndex]}
                className={`max-w-full max-h-full transition-transform duration-[2000ms] ${activeMode === 'immersive' ? 'scale-110' : 'scale-100'}`}
                autoPlay loop muted playsInline
                onTimeUpdate={handleTimeUpdate}
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
          <div className="p-8 h-full overflow-y-auto no-scrollbar space-y-12">
            
            <div className="flex items-center gap-2 text-[8px] text-white/20 tracking-widest uppercase">
              <span>全卷</span> <span className="opacity-40">/</span> 
              <span>{hotspot.season}</span> <span className="opacity-40">/</span> 
              <span className="text-[#c5a059]">{hotspot.category}</span>
            </div>

            <section>
              <h2 className="text-4xl font-serif text-[#f0e6d2] leading-tight mb-4">{hotspot.label}</h2>
              <p className="text-sm text-white/50 leading-loose font-serif italic text-justify">
                {hotspot.description}
              </p>
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
