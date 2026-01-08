
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import ScrollScene from './components/ScrollScene';
import MiniMap from './components/MiniMap';
import VideoPortal from './components/VideoPortal';
import MethodView from './components/MethodView';
import BackgroundView from './components/BackgroundView';
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

  const handleNavigate = (view: AppState['currentView']) => {
    setState(prev => ({ ...prev, currentView: view, selectedHotspot: null }));
  };

  const handleHotspotClick = (h: Hotspot) => {
    setState(prev => ({ ...prev, selectedHotspot: h }));
    setHistory(prev => {
      const filtered = prev.filter(item => item.id !== h.id);
      return [h, ...filtered].slice(0, 10);
    });
  };

  const handleJump = (targetX: number) => {
    setJumpRequest({ x: targetX, y: 0, scale: 1 });
  };

  const handleDeepJump = (target: Hotspot) => {
    setState(prev => ({ ...prev, selectedHotspot: null }));
    const targetX = -(target.x / 100) * SCROLL_WIDTH + window.innerWidth / 2;
    setJumpRequest({ x: targetX, y: 0, scale: 1.5 });
    
    // 飞行完成后开启新弹窗
    setTimeout(() => {
      handleHotspotClick(target);
    }, 1300);
  };

  const handleViewChange = useCallback((pos: { x: number; y: number; scale: number }) => {
    setState(prev => ({ ...prev, position: { x: pos.x, y: pos.y }, scale: pos.scale }));
  }, []);

  return (
    <Layout currentView={state.currentView} onNavigate={handleNavigate}>
      {state.currentView === 'home' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden relative">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/bg/1920/1080')] opacity-5 blur-3xl scale-125 animate-pulse" />
          
          <div className="relative z-10 text-center space-y-16 max-w-4xl px-8">
            <div className="flex flex-col items-center gap-10">
              <div className="relative">
                <div className="w-32 h-32 flex items-center justify-center ink-glow">
                  <img 
                    src="https://raw.githubusercontent.com/xjjm123123123/ai-digital-scroll-platform/main/public/images/logo/logo.png?v=transparent" 
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
              onClick={() => handleNavigate('explore')}
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
                  onClick={() => setRadarActive(true)}
                  className={`flex flex-col items-center gap-1 transition-all ${radarActive ? 'text-[#c5a059]' : 'text-white/40 hover:text-white'}`}
                 >
                   <div className="w-5 h-5 border border-current rounded-full flex items-center justify-center">
                     <div className="w-1 h-1 bg-current rounded-full" />
                   </div>
                   <span className="text-[8px] tracking-tighter">探测(R)</span>
                 </button>
                 <button 
                  onClick={() => setShowHistory(!showHistory)}
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
                      onClick={() => handleDeepJump(h)}
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
          onClose={() => setState(prev => ({ ...prev, selectedHotspot: null }))} 
          onJumpTo={handleDeepJump}
          activeMode={state.activeMode}
          onModeChange={(m) => setState(prev => ({ ...prev, activeMode: m }))}
        />
      )}
    </Layout>
  );
};

export default App;
