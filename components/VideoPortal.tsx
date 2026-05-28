
/**
 * 双轨视频门户组件
 * 
 * 功能特性：
 * 1. 全屏视频门户 - 触发热点后跨越DOM层级升起全屏视窗
 * 2. 双轨模式切换 - 支持"沉浸模式"与"解读模式"的无缝切换
 * 3. 时序监听钩子 - 视频播放至特定关键帧时，画面浮现半透明语义标注框
 * 4. 边缘滑入面板 - 解读模式下，图文解析面板由边缘滑入
 */

import React, { useEffect, useState, useRef } from 'react';
import { Hotspot, HotspotLevel, VideoVersion } from '../types';
import { interpretScene } from '../services/gemini';
import { HOTSPOTS } from '../constants';

/**
 * VideoPortal 组件 Props 接口
 * @param hotspot - 当前激活的热点对象
 * @param onClose - 关闭门户的回调函数
 * @param onJumpTo - 跳转到其他热点的回调函数
 * @param activeMode - 当前模式：'immersive'(沉浸模式) | 'interpret'(解读模式)
 * @param onModeChange - 模式切换回调函数
 */
interface VideoPortalProps {
  hotspot: Hotspot;
  onClose: () => void;
  onJumpTo: (target: Hotspot) => void;
  activeMode: 'immersive' | 'interpret';
  onModeChange: (m: 'immersive' | 'interpret') => void;
}

/**
 * 篇章内容映射表
 * 存储《诗经》各篇章的详细信息，用于解读模式下的内容展示
 */
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

/**
 * 获取篇章内容
 * 优先使用映射表中的内容，备选使用热点对象的内容
 * @param hotspot - 热点对象
 * @returns 篇章的标签、副标题、背景和详细内容
 */
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

/**
 * 双轨视频门户主组件
 * 
 * 核心功能说明：
 * - 全屏覆盖：使用 fixed inset-0 z-[100] 实现跨越DOM层级的全屏门户
 * - 沉浸模式：视频放大显示(scale-110)，隐藏侧边栏，提供沉浸式观看体验
 * - 解读模式：视频还原大小(scale-100)，侧边栏从右侧滑入，显示图文解析
 * - 时序监听：通过 onTimeUpdate 钩子监听视频播放时间，动态显示语义标注
 */
const VideoPortal: React.FC<VideoPortalProps> = ({ hotspot, onClose, onJumpTo, activeMode, onModeChange }) => {
  // 当前激活的视频版本
  const [activeVersion, setActiveVersion] = useState<VideoVersion>(
    hotspot.versions?.[0] || { id: 'default', tag: '标准', url: hotspot.videoUrl, styleDesc: '默认生成效果' }
  );
  
  // 轮播媒体当前索引
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // AI 语义解读数据
  const [interpretation, setInterpretation] = useState<any>(null);
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  
  // 视频加载状态
  const [videoLoading, setVideoLoading] = useState(true);
  
  // 当前视频播放时间（秒）- 用于时序监听关键帧
  const [currentTime, setCurrentTime] = useState(0);
  
  // 收藏/存档状态
  const [isSaved, setIsSaved] = useState(false);
  
  // 视频元素引用 - 用于获取当前播放时间
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * 组件挂载时加载AI语义解读
   * 调用 gemini 服务获取当前场景的文化语义分析
   */
  useEffect(() => {
    const loadInterpret = async () => {
      setLoading(true);
      const data = await interpretScene(hotspot.label, hotspot.description);
      setInterpretation(data);
      setLoading(false);
    };
    loadInterpret();
    // 重置视频版本为第一个
    setActiveVersion(hotspot.versions?.[0] || { id: 'default', tag: '标准', url: hotspot.videoUrl, styleDesc: '默认生成效果' });
  }, [hotspot]);

  /**
   * 切换视频版本或轮播媒体时触发视频加载状态
   */
  useEffect(() => {
    setVideoLoading(true);
  }, [activeVersion.url, hotspot.carouselMedia?.[carouselIndex]]);

  /**
   * 时序监听钩子 - 视频播放时间更新回调
   * 
   * 核心功能：每当视频播放时间更新时，捕获当前时间戳
   * 应用场景：用于判断是否到达关键帧，从而显示/隐藏语义标注框
   * 实现原理：通过 video 元素的 currentTime 属性获取当前播放位置
   */
  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  /**
   * 视频加载完成回调
   * 隐藏加载状态，显示视频内容
   */
  const handleVideoLoaded = () => {
    setVideoLoading(false);
  };

  /**
   * 获取相关热点列表
   * 根据 relatedHotspotIds 查找对应的热点对象
   */
  const relatedHotspots = (hotspot.relatedHotspotIds || [])
    .map(id => HOTSPOTS.find(h => h.id === id))
    .filter(Boolean) as Hotspot[];

  return (
    // 全屏门户容器 - 跨越DOM层级，使用 z-index: 100 置顶
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-700">
      <div className={`relative w-full max-w-7xl h-full max-h-[90vh] flex flex-col md:flex-row glass-panel rounded-sm border-white/10 overflow-hidden shadow-[0_0_150px_rgba(197,160,89,0.1)]`}>
        
        {/* 工具栏 - 包含收藏按钮和模式切换 */}
        <div className="absolute top-0 left-0 w-full z-[60] flex justify-between items-center px-8 py-6 pointer-events-none">
          {/* 收藏/存档按钮 */}
          <div className="flex items-center pointer-events-auto">
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`text-[10px] tracking-widest flex items-center gap-2 transition-colors ${isSaved ? 'text-[#c5a059]' : 'text-white/40 hover:text-white'}`}
            >
              {isSaved ? '已存档' : '收藏入卷'}
              <div className={`w-2 h-2 rounded-full border border-current ${isSaved ? 'bg-current' : ''}`} />
            </button>
          </div>
          
          {/* 模式切换与关闭按钮区域 */}
          <div className="flex items-center gap-6 pointer-events-auto">
             {/* 模式切换按钮组 - 沉浸/解读双轨切换 */}
             <div className="flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 pl-2 gap-2 shadow-xl">
               <div className="flex items-center gap-1">
                  {/* 模式选项：沉浸模式 / 解读模式 */}
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
                     {/* 选中状态下的渐变背景 */}
                     {activeMode === m.id && (
                       <div className="absolute inset-0 bg-gradient-to-r from-[#c5a059] to-[#e0c080] z-0" />
                     )}
                     <span className="relative z-10">{m.label}</span>
                   </button>
                 ))}
               </div>
               
               {/* 分隔线 */}
               <div className="w-[1px] h-4 bg-white/10 mx-2" />
               
               {/* 关闭按钮 */}
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

        {/* 视窗内容区 - 视频/轮播媒体展示区域 */}
        <div className="flex-[2.8] bg-black relative flex items-center justify-center overflow-hidden">
          {/* 视频加载中状态 - 显示加载动画 */}
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
          
          {/* 条件渲染：优先显示轮播媒体（多视频），否则显示单个视频 */}
          {hotspot.carouselMedia && hotspot.carouselMedia.length > 0 ? (
            // 轮播媒体容器
            <div className="relative w-full h-full flex items-center justify-center bg-[#050505] group">
              {/* 轮播视频元素 */}
              <video 
                key={hotspot.carouselMedia[carouselIndex]}
                src={hotspot.carouselMedia[carouselIndex]}
                // 沉浸模式：视频放大；解读模式：视频还原
                className={`max-w-full max-h-full transition-transform duration-[2000ms] ${activeMode === 'immersive' ? 'scale-110' : 'scale-100'}`}
                autoPlay loop muted playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedData={handleVideoLoaded}
              />
              
              {/* 轮播指示器 - 底部圆点 */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {hotspot.carouselMedia.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCarouselIndex(idx); }}
                    className={`w-2 h-2 rounded-full transition-all ${idx === carouselIndex ? 'bg-[#c5a059] w-6' : 'bg-white/30 hover:bg-white/60'}`}
                  />
                ))}
              </div>
              
              {/* 上一张按钮 */}
              <button 
                onClick={(e) => {
                   e.stopPropagation();
                   setCarouselIndex((prev) => (prev - 1 + hotspot.carouselMedia!.length) % hotspot.carouselMedia!.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-[#c5a059] transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              {/* 下一张按钮 */}
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
            // 单视频容器
            <div className="relative w-full h-full flex items-center justify-center bg-[#050505]">
              {/* 主视频元素 - 绑定时序监听钩子 */}
              <video 
                ref={videoRef}
                src={activeVersion.url} 
                // 沉浸模式：视频放大(scale-110)；解读模式：视频还原(scale-100)
                className={`max-w-full max-h-full transition-transform duration-[2000ms] ${activeMode === 'immersive' ? 'scale-110' : 'scale-100'}`}
                autoPlay loop muted playsInline
                onTimeUpdate={handleTimeUpdate}
                onLoadedData={handleVideoLoaded}
              />
              
              {/* 语义注释框 - 时序监听实现的关键帧标注
               * 
               * 显示条件：
               * 1. 必须是解读模式 (activeMode === 'interpret')
               * 2. 当前视频播放时间必须落在关键帧时间点的 ±1.5秒范围内
               * 
               * 时序双维度传递：
               * - 时间维度：通过 currentTime 与 ann.time 的差值判断是否显示
               * - 空间维度：通过 ann.position.x/y 确定标注框在画面中的位置
               * 
               * 动画效果：zoom-in + slide-in-from-bottom-2 实现浮现效果
               */}
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
        </div>

        {/* 侧边信息栏 - 解读模式下面板由边缘滑入
         * 
         * 动画实现：
         * - 沉浸模式：translate-x-full + opacity-0，隐藏到右侧边缘外
         * - 解读模式：translate-x-0 + opacity-100，从右侧滑入
         * - transition-all duration-700：700ms 的平滑过渡动画
         */}
        <div className={`flex-1 flex flex-col border-l border-white/5 overflow-hidden bg-[#080808] transition-all duration-700 ${activeMode === 'immersive' ? 'translate-x-full opacity-0 w-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}>
          <div className="p-8 pt-20 h-full overflow-y-auto no-scrollbar space-y-12">
            
            {/* 篇章信息 section */}
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

            {/* AI 语义视点 section - Gemini API 生成的场景解读 */}
            {loading ? (
              <section className="space-y-4 animate-pulse opacity-50">
                <div className="h-4 w-24 bg-[#c5a059]/10 rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-3 w-5/6 bg-white/5 rounded" />
                  <div className="h-3 w-4/6 bg-white/5 rounded" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-5 w-16 bg-[#c5a059]/10 rounded" />
                  <div className="h-5 w-12 bg-[#c5a059]/10 rounded" />
                </div>
              </section>
            ) : interpretation && (
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

            {/* 风格变体 section - 同一视频的多种AI生成风格 */}
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

            {/* 延展探索 section - 相关热点跳转 */}
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
