
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import ScrollScene from './components/ScrollScene';
import MiniMap from './components/MiniMap';
import VideoPortal from './components/VideoPortal';
import MethodView from './components/MethodView';
import BackgroundView from './components/BackgroundView';
import LiquidEther from './components/LiquidEther';
import { AppState, Hotspot } from './types';
import { SCROLL_WIDTH } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentView: 'home',
    selectedHotspot: null,
    isPanning: false,
    scale: 1,
    position: { x: 0, y: 0 },
    activeMode: 'interpret'
  });

  const [jumpRequest, setJumpRequest] = useState<{ x: number; y: number; scale: number } | undefined>();
  const [radarActive, setRadarActive] = useState(false);
  const [history, setHistory] = useState<Hotspot[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 最小加载时间（毫秒）
  const MIN_LOAD_TIME = 20000;

  // 资源预加载
  useEffect(() => {
    const startTime = Date.now();
    const imagesToLoad = [
      '/images/binfengtu_small.jpg',
      '/images/logo/Simplification.svg'
    ];

    // 模拟进度条
    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(99, Math.floor((elapsedTime / MIN_LOAD_TIME) * 100));
      setLoadingProgress(progress);
    }, 100);

    const loadImages = async () => {
      try {
        const promises = imagesToLoad.map(src => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
          });
        });
        await Promise.all(promises);
        
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOAD_TIME - elapsedTime);

        setTimeout(() => {
          clearInterval(progressInterval);
          setLoadingProgress(100);
          setIsLoading(false);
        }, remainingTime);

      } catch (err) {
        console.error('Failed to load images', err);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOAD_TIME - elapsedTime);
        setTimeout(() => {
          clearInterval(progressInterval);
          setLoadingProgress(100);
          setIsLoading(false);
        }, remainingTime);
      }
    };

    loadImages();
    return () => clearInterval(progressInterval);
  }, []);

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.currentView !== 'explore') return;
      
      switch(e.key.toLowerCase()) {
        case 'q':
          if (state.selectedHotspot) setState(prev => ({ ...prev, selectedHotspot: null }));
          break;
        case 'r': // Radar
          setRadarActive(true);
          setTimeout(() => setRadarActive(false), 2000);
          break;
        case 'c': // Cycle Mode
          const modes: any[] = ['immersive', 'interpret', 'compare'];
          const next = modes[(modes.indexOf(state.activeMode) + 1) % modes.length];
          setState(prev => ({ ...prev, activeMode: next }));
          break;
        case 'f':
          setJumpRequest({ x: state.position.x, y: state.position.y, scale: 1.0 });
          break;
        case 'p':
          setShowHistory(prev => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.currentView, state.selectedHotspot, state.activeMode, state.position]);

  const handleNavigate = useCallback((view: AppState['currentView']) => {
    setState(prev => ({ ...prev, currentView: view, selectedHotspot: null }));
  }, []);

  const handleExploreClick = useCallback(() => {
    handleNavigate('explore');
  }, [handleNavigate]);

  const handleHotspotClick = useCallback((h: Hotspot) => {
    setState(prev => ({ ...prev, selectedHotspot: h }));
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== h.id);
      return [h, ...filtered].slice(0, 10);
    });
  }, []);

  const handleJump = useCallback((targetX: number) => {
    setJumpRequest({ x: targetX, y: 0, scale: 1 });
  }, []);

  const handleDeepJump = useCallback((target: Hotspot) => {
    setState(prev => ({ ...prev, selectedHotspot: null }));
    const targetX = -(target.x / 100) * SCROLL_WIDTH + window.innerWidth / 2;
    setJumpRequest({ x: targetX, y: 0, scale: 1.5 });
    
    setTimeout(() => {
      handleHotspotClick(target);
    }, 1300);
  }, [handleHotspotClick]);

  const handleViewChange = useCallback((pos: { x: number; y: number; scale: number }) => {
    setState(prev => ({ ...prev, position: { x: pos.x, y: pos.y }, scale: pos.scale }));
  }, []);

  const handleRadarClick = useCallback(() => {
    setRadarActive(true);
  }, []);

  const handleHistoryClick = useCallback(() => {
    setShowHistory(prev => !prev);
  }, []);

  const handleHistoryItemClick = useCallback((hotspot: Hotspot) => {
    handleDeepJump(hotspot);
  }, [handleDeepJump]);

  const handleVideoPortalClose = useCallback(() => {
    setState(prev => ({ ...prev, selectedHotspot: null }));
  }, []);

  const handleVideoModeChange = useCallback((m: string) => {
    setState(prev => ({ ...prev, activeMode: m }));
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0c0c0c] flex flex-col items-center justify-center select-none">
        <div className="relative">
          <div className="w-40 h-40 flex items-center justify-center ink-glow">
            <img 
              src="/images/logo/Simplification.svg" 
              alt="Loading..." 
              className="w-full h-full object-contain opacity-90" 
            />
          </div>
        </div>
        <div className="mt-12 text-[#c5a059] text-xl tracking-[0.8em] font-bold chinese-font opacity-80 animate-pulse ml-4 text-center">
          <div>载入中</div>
          <div className="text-sm text-[#c5a059]/60 mt-2 font-serif tracking-[0.2em]">{loadingProgress}%</div>
        </div>
      </div>
    );
  }

  return (
    <Layout currentView={state.currentView} onNavigate={handleNavigate}>
      {state.currentView === 'home' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden relative">
          {/* 背景装饰 - LiquidEther */}
          <div className="absolute inset-0 z-0 opacity-40">
            <LiquidEther 
              mouseForce={20} 
              cursorSize={140} 
              isViscous={false} 
              viscous={65} 
              colors={["#c2c1c8","#eeefe6","#ffffff"]} 
              autoDemo 
              autoSpeed={0.5} 
              autoIntensity={3.7} 
              isBounce={false} 
              resolution={0.75} 
              backgroundImage="/images/binfengtu_small.jpg"
              bgScale={0.5}
              style={{ width: '100%', height: '100%' }}
            /> 
          </div>
          
          <div className="relative z-10 text-center space-y-16 max-w-4xl px-8">
            <div className="flex flex-col items-center gap-10">
              <div className="relative">
                <div className="w-32 h-32 flex items-center justify-center ink-glow">
                  <img 
                    src="/images/logo/Simplification.svg" 
                    alt="Logo" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                
                {/* 装饰光圈 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-[#c5a059]/20 rounded-full animate-spin-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-[#c5a059]/30 rounded-full animate-reverse-spin" />
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold tracking-[0.5em] text-[#e8dcc4] chinese-font ml-8 drop-shadow-2xl">
                豳风图
              </h1>
              
              <p className="text-xl md:text-2xl text-[#c5a059]/80 font-serif tracking-[0.3em] ml-2">
                数字长卷交互平台
              </p>
            </div>

            <p className="text-white/40 text-lg leading-loose tracking-[0.4em] font-serif italic max-w-2xl mx-auto border-y border-[#c5a059]/10 py-10">
              “七月流火，九月授衣。” <br />
              穿梭于千年前的诗经长卷，点选意象，<br />
              见证静态笔触被 AI 赋予生命的瞬间。
            </p>

            <button 
              onClick={handleExploreClick}
              className="group relative px-20 py-6 bg-transparent border border-[#c5a059]/40 text-[#c5a059] font-bold tracking-[0.8em] overflow-hidden transition-all duration-700 hover:text-black"
            >
              <div className="absolute inset-0 bg-[#c5a059] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 text-lg">入 卷 探 幽</span>
            </button>
            
            <div className="text-[9px] text-white/20 tracking-[0.3em] uppercase pt-12 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
              快捷键引导：[R] 探测区域 · [F] 锁定比例 · [P] 历史足迹 · [ESC] 退出
            </div>
          </div>
        </div>
      )}

      {state.currentView === 'explore' && (
        <>
          <ScrollScene 
            onHotspotClick={handleHotspotClick} 
            externalPos={jumpRequest}
            onViewChange={handleViewChange}
            radarActive={radarActive}
          />
          <MiniMap 
            x={state.position.x} 
            viewWidth={typeof window !== 'undefined' ? window.innerWidth : 1200}
            onJump={handleJump} 
          />
          
          {/* 控制面板 */}
          <div className="fixed bottom-10 left-10 flex gap-4 pointer-events-auto">
            <div className="glass-panel p-5 flex gap-10 items-center border-[#c5a059]/20 shadow-2xl">
              <div className="flex flex-col min-w-[120px]">
                <div className="text-[9px] text-white/30 tracking-widest uppercase mb-1">当前叙事段落</div>
                <span className="text-xl text-[#f0e6d2] font-serif tracking-widest">
                  {state.position.x < -SCROLL_WIDTH * 0.7 ? '隆冬 · 授衣' : 
                   state.position.x < -SCROLL_WIDTH * 0.4 ? '仲秋 · 剥枣' : 
                   '孟春 · 于耜'}
                </span>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="flex gap-6">
                 <button 
                  onClick={handleRadarClick}
                  className={`flex flex-col items-center gap-1 transition-all ${radarActive ? 'text-[#c5a059]' : 'text-white/40 hover:text-white'}`}
                 >
                   <div className="w-5 h-5 border border-current rounded-full flex items-center justify-center">
                     <div className="w-1 h-1 bg-current rounded-full" />
                   </div>
                   <span className="text-[8px] tracking-tighter">探测(R)</span>
                 </button>
                 <button 
                  onClick={handleHistoryClick}
                  className={`flex flex-col items-center gap-1 transition-all ${showHistory ? 'text-[#c5a059]' : 'text-white/40 hover:text-white'}`}
                 >
                   <div className="w-5 h-5 border border-current rounded p-[3px] flex flex-col gap-[2px]">
                     <div className="h-[1px] w-full bg-current" />
                     <div className="h-[1px] w-2/3 bg-current" />
                   </div>
                   <span className="text-[8px] tracking-tighter">足迹(P)</span>
                 </button>
              </div>
            </div>
            
            {showHistory && (
              <div className="glass-panel p-4 w-48 animate-in slide-in-from-bottom-4 duration-300">
                <div className="text-[9px] text-[#c5a059] mb-3 tracking-widest border-b border-[#c5a059]/10 pb-1">最近浏览</div>
                <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                  {history.length > 0 ? history.map(h => (
                    <button 
                      key={h.id}
                      onClick={() => handleHistoryItemClick(h)}
                      className="w-full text-left text-[11px] text-white/60 hover:text-[#c5a059] transition-colors truncate font-serif"
                    >
                      · {h.label}
                    </button>
                  )) : <div className="text-[10px] text-white/20 italic">尚无足迹</div>}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {state.currentView === 'intro' && <BackgroundView />}
      {state.currentView === 'method' && <MethodView />}

      {state.selectedHotspot && (
        <VideoPortal 
          hotspot={state.selectedHotspot} 
          onClose={handleVideoPortalClose} 
          onJumpTo={handleDeepJump}
          activeMode={state.activeMode}
          onModeChange={handleVideoModeChange}
        />
      )}
    </Layout>
  );
};

export default App;
