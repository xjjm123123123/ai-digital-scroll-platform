
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Hotspot, VideoVersion } from '../types';
import { interpretScene } from '../services/gemini';
import { HOTSPOTS } from '../constants';
import { getPortalModeSpec } from '../config/viewModes';
import { getChapterContent } from '../config/chapterContent';
import AnnotationOverlay from './AnnotationOverlay';

interface VideoPortalProps {
  hotspot: Hotspot;
  onClose: () => void;
  onJumpTo: (target: Hotspot) => void;
  activeMode: 'immersive' | 'interpret';
  onModeChange: (m: 'immersive' | 'interpret') => void;
}

const ModeToggle = ({
  activeMode,
  onModeChange,
}: {
  activeMode: 'immersive' | 'interpret';
  onModeChange: (m: 'immersive' | 'interpret') => void;
}) => (
  <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 pl-2 gap-2 shadow-xl">
    <div className="flex items-center gap-1">
      {[
        { id: 'immersive' as const, label: '沉浸' },
        { id: 'interpret' as const, label: '解读' },
      ].map((m) => (
        <button
          key={m.id}
          onClick={() => onModeChange(m.id)}
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
  </div>
);

const VideoPortal: React.FC<VideoPortalProps> = ({
  hotspot,
  onClose,
  onJumpTo,
  activeMode,
  onModeChange,
}) => {
  const spec = getPortalModeSpec(activeMode);
  const chapter = getChapterContent(hotspot);

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
  const interpretationCacheRef = useRef<Record<string, any>>({});

  const loadInterpretation = useCallback(async () => {
    const cached = interpretationCacheRef.current[hotspot.id];
    if (cached) {
      setInterpretation(cached);
      return;
    }
    setLoading(true);
    try {
      const data = await interpretScene(hotspot.label, hotspot.description);
      interpretationCacheRef.current[hotspot.id] = data;
      setInterpretation(data);
    } finally {
      setLoading(false);
    }
  }, [hotspot.id, hotspot.label, hotspot.description]);

  useEffect(() => {
    setActiveVersion(
      hotspot.versions?.[0] || { id: 'default', tag: '标准', url: hotspot.videoUrl, styleDesc: '默认生成效果' }
    );
    setCarouselIndex(0);
    setVideoLoading(true);
    setCurrentTime(0);
  }, [hotspot]);

  useEffect(() => {
    if (activeMode === 'interpret') {
      loadInterpretation();
    }
  }, [activeMode, loadInterpretation]);

  useEffect(() => {
    setVideoLoading(true);
  }, [activeVersion.url, hotspot.carouselMedia?.[carouselIndex]]);

  const handleTimeUpdate = (e?: React.SyntheticEvent<HTMLVideoElement>) => {
    const el = e?.currentTarget ?? videoRef.current;
    if (el) setCurrentTime(el.currentTime);
  };

  const relatedHotspots = (hotspot.relatedHotspotIds || [])
    .map((id) => HOTSPOTS.find((h) => h.id === id))
    .filter(Boolean) as Hotspot[];

  const videoClassName = 'max-w-full max-h-full object-contain transition-opacity duration-500';

  const renderVideoContent = () => (
    <>
      {videoLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050505]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-[#c5a059]/20 rounded-full" />
              <div className="absolute top-0 left-0 w-12 h-12 border-2 border-[#c5a059] rounded-full border-t-transparent animate-spin" />
            </div>
            <span className="text-[10px] text-white/30 tracking-widest">加载中</span>
          </div>
        </div>
      )}

      {hotspot.carouselMedia && hotspot.carouselMedia.length > 0 ? (
        <div className="relative w-full h-full flex items-center justify-center bg-[#050505] group">
          <video
            key={hotspot.carouselMedia[carouselIndex]}
            src={hotspot.carouselMedia[carouselIndex]}
            className={videoClassName}
            autoPlay
            loop
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={() => setVideoLoading(false)}
          />
          {spec.showAnnotations && (
            <AnnotationOverlay annotations={hotspot.annotations} currentTime={currentTime} />
          )}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {hotspot.carouselMedia.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCarouselIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${idx === carouselIndex ? 'bg-[#c5a059] w-6' : 'bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center bg-[#050505]">
          <video
            ref={videoRef}
            src={activeVersion.url}
            className={videoClassName}
            autoPlay
            loop
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={() => setVideoLoading(false)}
          />
          {spec.showAnnotations && (
            <AnnotationOverlay annotations={hotspot.annotations} currentTime={currentTime} />
          )}
        </div>
      )}
    </>
  );

  const renderSidePanel = () => (
    <div className="flex-1 flex flex-col border-l border-white/5 overflow-hidden bg-[#080808] min-w-[280px] max-w-[420px]">
      <div className="p-8 pt-20 h-full overflow-y-auto no-scrollbar space-y-12">
        {hotspot.originalImage && (
          <section className="space-y-3">
            <h3 className="text-[9px] text-[#c5a059] tracking-[0.3em] uppercase">原画对照</h3>
            <img
              src={hotspot.originalImage}
              alt="原画"
              className="w-full border border-white/10 opacity-90"
            />
          </section>
        )}

        <section>
          <h2 className="text-4xl font-serif text-[#f0e6d2] leading-tight mb-2">{chapter.label}</h2>
          {chapter.subtitle && (
            <p className="text-lg text-[#c5a059] font-serif tracking-wide mb-4">
              《{chapter.label}》：{chapter.subtitle}
            </p>
          )}
          {chapter.background && (
            <div className="mb-4 p-4 bg-white/[0.02] border-l-2 border-[#c5a059]/30">
              <p className="text-xs text-white/60 leading-relaxed font-serif">
                <span className="text-[#c5a059] font-bold">背景：</span>
                {chapter.background}
              </p>
            </div>
          )}
          {chapter.contentDetail ? (
            <p className="text-sm text-white/70 leading-loose font-serif text-justify">{chapter.contentDetail}</p>
          ) : (
            <p className="text-sm text-white/50 leading-loose font-serif italic text-justify">{hotspot.description}</p>
          )}
        </section>

        {spec.showAiInterpretation &&
          (loading ? (
            <section className="space-y-4 animate-pulse opacity-50">
              <div className="h-4 w-24 bg-[#c5a059]/10 rounded mb-4" />
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-5/6 bg-white/5 rounded" />
            </section>
          ) : (
            interpretation && (
              <section className="space-y-4">
                <h3 className="text-[9px] text-[#c5a059] tracking-[0.3em] uppercase flex items-center gap-3">
                  <div className="h-[1px] w-6 bg-current" />
                  AI 语义视点
                </h3>
                <div className="text-xs text-white/80 leading-relaxed font-serif pl-4 border-l border-[#c5a059]/30">
                  “{interpretation.culturalMeaning}”
                </div>
                <div className="flex flex-wrap gap-2">
                  {interpretation.visualHighlights?.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#c5a059]/5 border border-[#c5a059]/10 text-[9px] text-[#c5a059]/70 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )
          ))}

        {spec.showStyleVariants && hotspot.versions && (
          <section className="space-y-4">
            <h3 className="text-[9px] text-white/20 tracking-[0.3em] uppercase">风格变体</h3>
            <div className="grid grid-cols-1 gap-2">
              {hotspot.versions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVersion(v)}
                  className={`p-3 text-left border transition-all ${
                    activeVersion.id === v.id
                      ? 'border-[#c5a059] bg-[#c5a059]/5'
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <div
                    className={`text-[10px] ${activeVersion.id === v.id ? 'text-[#c5a059]' : 'text-white/40'}`}
                  >
                    {v.tag}
                  </div>
                  <div className="text-[8px] text-white/20 mt-1 truncate">{v.styleDesc}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {spec.showRelatedHotspots && relatedHotspots.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-[9px] text-white/20 tracking-[0.3em] uppercase">延展探索</h3>
            <div className="space-y-3">
              {relatedHotspots.map((h) => (
                <button
                  key={h.id}
                  onClick={() => onJumpTo(h)}
                  className="group w-full flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 hover:border-[#c5a059]/30 transition-all"
                >
                  <div className="w-12 h-12 bg-black overflow-hidden relative">
                    <img
                      src={h.originalImage || 'https://picsum.photos/seed/h/100/100'}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100"
                      alt=""
                    />
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
  );

  if (activeMode === 'immersive') {
    return (
      <div className={spec.portalContainerClass}>
        <div className="absolute top-0 left-0 w-full z-[60] flex justify-between items-center px-6 py-5 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
          <h2 className="text-lg font-serif text-[#f0e6d2]/90 tracking-widest pointer-events-none">
            {chapter.label}
          </h2>
          <div className="flex items-center gap-4 pointer-events-auto">
            <ModeToggle activeMode={activeMode} onModeChange={onModeChange} />
            <button
              onClick={onClose}
              className="group w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="关闭"
            >
              <svg
                className="w-4 h-4 text-white/60 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className={spec.videoAreaClass}>{renderVideoContent()}</div>
      </div>
    );
  }

  return (
    <div className={spec.portalContainerClass}>
      <div className="relative w-full max-w-7xl h-full max-h-[90vh] flex flex-col md:flex-row glass-panel rounded-sm border-white/10 overflow-hidden shadow-[0_0_150px_rgba(197,160,89,0.1)]">
        <div className="absolute top-0 left-0 w-full z-[60] flex justify-between items-center px-8 py-6 pointer-events-none">
          {spec.showSaveButton && (
            <div className="flex items-center pointer-events-auto">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`text-[10px] tracking-widest flex items-center gap-2 transition-colors ${isSaved ? 'text-[#c5a059]' : 'text-white/40 hover:text-white'}`}
              >
                {isSaved ? '已存档' : '收藏入卷'}
                <div className={`w-2 h-2 rounded-full border border-current ${isSaved ? 'bg-current' : ''}`} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-6 pointer-events-auto ml-auto">
            <ModeToggle activeMode={activeMode} onModeChange={onModeChange} />
            <div className="w-[1px] h-4 bg-white/10" />
            <button
              onClick={onClose}
              className="group w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-4 h-4 text-white/40 group-hover:text-white transition-all duration-300 group-hover:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className={spec.videoAreaClass}>{renderVideoContent()}</div>
        {spec.showSidePanel && renderSidePanel()}
      </div>
    </div>
  );
};

export default VideoPortal;
