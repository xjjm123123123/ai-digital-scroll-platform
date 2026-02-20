
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SCROLL_WIDTH, SCROLL_HEIGHT, HOTSPOTS } from '../constants';
import { Hotspot, HotspotLevel } from '../types';
import { fetchHotspots } from '../src/lib/hotspotService';

interface ScrollSceneProps {
  onHotspotClick: (hotspot: Hotspot) => void;
  externalPos?: { x: number; y: number; scale: number };
  onViewChange: (pos: { x: number; y: number; scale: number }) => void;
  radarActive: boolean;
}

const ScrollScene: React.FC<ScrollSceneProps> = ({ onHotspotClick, externalPos, onViewChange, radarActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<any>(null);
  const [currentScale, setCurrentScale] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [bgImageSize, setBgImageSize] = useState({ width: SCROLL_WIDTH, height: SCROLL_HEIGHT });
  const [displayScale, setDisplayScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastInteractionTime, setLastInteractionTime] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  
  // 数据库热点数据
  const [hotspots, setHotspots] = useState<Hotspot[]>(HOTSPOTS);

  useEffect(() => {
    const loadHotspots = async () => {
      const data = await fetchHotspots();
      if (data && data.length > 0) {
        setHotspots(data);
      }
    };
    loadHotspots();
  }, []);
  
  // 切片配置
  const TILE_COUNT = 10;
  const ORIGINAL_WIDTH = 65230;
  const ORIGINAL_HEIGHT = 2773;
  const TILE_WIDTH = ORIGINAL_WIDTH / TILE_COUNT; // 6523
  
  // 最小加载时间（毫秒）- 优化体验，保留 2秒 动画展示
  const MIN_LOAD_TIME = 2000;

  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    
    // 模拟进度条
    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(99, Math.floor((elapsedTime / MIN_LOAD_TIME) * 100));
      setLoadingProgress(progress);
    }, 100);
    
    const finishLoading = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOAD_TIME - elapsedTime);
      
      setTimeout(() => {
        clearInterval(progressInterval);
        setLoadingProgress(100);
        setIsImageLoaded(true);
      }, remainingTime);
    };

    // 预加载第一张切片以确认尺寸（虽然我们已经硬编码了）
    const img = new Image();
    img.src = '/images/tiles/tile_0.jpg';
    
    img.onload = () => {
      setBgImageSize({ width: ORIGINAL_WIDTH, height: ORIGINAL_HEIGHT });
      finishLoading();
    };
    
    img.onerror = () => {
      // 即使失败也允许显示
      finishLoading();
    };

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select('g');
    
    // 初始化 zoom 行为
    const zoom = d3.zoom()
      .scaleExtent([1, 1])
      .on('start', () => {
        setIsDragging(true);
        setLastInteractionTime(performance.now());
        setIsAutoScrolling(false);
      })
      .on('zoom', (event) => {
        const { x, y, k } = event.transform;
        
        const containerHeight = containerRef.current?.clientHeight || SCROLL_HEIGHT;
        // 统一逻辑：保持高度占用容器的 80%
        const targetHeight = containerHeight * 0.8;
        const scale = targetHeight / ORIGINAL_HEIGHT;
        
        // 垂直居中偏移
        const offsetY = (containerHeight - targetHeight) / 2;
        
        g.attr('transform', `translate(${x}, ${offsetY}) scale(${scale})`);
        
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(${x}px, ${offsetY}px, 0) scale(${scale})`;
        }

        setCurrentScale(k);
        setLastInteractionTime(performance.now());
        setIsAutoScrolling(false);
        
        onViewChange({
          x: x,
          y: offsetY,
          scale: k
        });
      })
      .on('end', () => {
        setIsDragging(false);
        setLastInteractionTime(performance.now());
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // 统一的更新尺寸函数
    const updateDimensions = () => {
      if (!containerRef.current || !zoomRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const targetHeight = containerHeight * 0.8;
      const scale = targetHeight / ORIGINAL_HEIGHT;
      const offsetY = (containerHeight - targetHeight) / 2;
      const renderedWidth = ORIGINAL_WIDTH * scale;

      // 计算拖拽范围
      // 允许向左拖动直到右边缘对齐屏幕右边缘 (containerWidth - renderedWidth)
      // 允许向右拖动到 0 (左边缘对齐屏幕左边缘)
      const minX = Math.min(0, containerWidth - renderedWidth);
      const maxX = 0; 
      const buffer = SCROLL_WIDTH * 0.1; // 增加一点缓冲区

      // d3.zoom translateExtent 的逻辑是：
      // 视口变换后的坐标必须在 extent 范围内。
      // 对于平移 tx：
      // containerWidth - x1 <= tx <= -x0
      // 
      // 我们想要: minX - buffer <= tx <= maxX + buffer
      // 
      // 所以:
      // -x0 = maxX + buffer  =>  x0 = -(maxX + buffer)
      // containerWidth - x1 = minX - buffer  =>  x1 = containerWidth - minX + buffer
      
      const x0 = -(maxX + buffer);
      const x1 = containerWidth - minX + buffer;

      // 更新 zoom 的 extent
      zoomRef.current.translateExtent([
        [x0, 0], 
        [x1, containerHeight]
      ]);

      // 更新显示比例状态
      setDisplayScale(scale);
      
      // 如果当前没有在拖动，可能需要重置位置或保持相对位置？
      // 暂时只更新 extent，让 d3.zoom 处理约束
    };

    // 初始化调用
    updateDimensions();

    // 监听窗口大小变化
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      // 强制触发一次 transform 更新以应用新的 scale
      // 注意：这里可能需要获取当前的 transform 并重新应用
      if (svgRef.current) {
        const currentTransform = d3.zoomTransform(svgRef.current);
        // 我们不改变 x，但由于 render 里的 transform 依赖 containerHeight 计算的 scale，
        // 我们需要触发一次 zoom 事件或者手动更新 transform。
        // 最简单的是通过 d3 发送一个无操作的 zoom 变换
        svg.call(zoomRef.current.transform, currentTransform);
      }
    });

    resizeObserver.observe(containerRef.current);

    // 初始位置设置 - 从画卷右边开始（画卷从右到左展开）
    const containerHeight = containerRef.current.clientHeight;
    const containerWidth = containerRef.current.clientWidth;
    const targetHeight = containerHeight * 0.8;
    const scale = targetHeight / ORIGINAL_HEIGHT;
    const renderedWidth = ORIGINAL_WIDTH * scale;
    const initialX = containerWidth - renderedWidth;
    
    svg.call(zoom.transform, d3.zoomIdentity.translate(initialX, 0).scale(1));

    const handleMouseMove = () => {
      setLastInteractionTime(performance.now());
      setIsAutoScrolling(false);
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    return () => {
      svg.on('.zoom', null);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        resizeObserver.unobserve(containerRef.current);
        resizeObserver.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      const shouldAutoScroll = !isDragging;
      
      if (shouldAutoScroll && zoomRef.current && svgRef.current) {
        setIsAutoScrolling(true);
        
        const currentTransform = d3.zoomTransform(svgRef.current);
        const scrollSpeed = 0.3;
        const containerWidth = containerRef.current?.clientWidth || 0;
        const contentWidth = ORIGINAL_WIDTH * displayScale;
        const minX = containerWidth - contentWidth;
        
        let newX = currentTransform.x + scrollSpeed * (deltaTime / 16.67);
        
        if (newX > 0) {
          newX = minX;
        }
        
        d3.select(svgRef.current)
          .call(zoomRef.current.transform, d3.zoomIdentity.translate(newX, currentTransform.y).scale(currentTransform.k));
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDragging, displayScale]);

  useEffect(() => {
    if (externalPos && zoomRef.current && svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(1200)
        .ease(d3.easeCubicInOut)
        .call(zoomRef.current.transform, d3.zoomIdentity.translate(externalPos.x, externalPos.y).scale(externalPos.scale));
    }
  }, [externalPos]);

  // 语义 LOD 实现 - 缩放固定为1，简化可见性逻辑
  const isHotspotVisible = (level: HotspotLevel) => {
    // 始终显示所有热区
    return true;
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full bg-[#080808] cursor-grab active:cursor-grabbing overflow-hidden relative"
    >
      {/* 加载界面 */}
      {!isImageLoaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#080808]">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#c5a059]/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#c5a059] rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-[#c5a059] text-lg font-serif tracking-widest">正在加载长卷...</p>
              <p className="text-[#f0e6d2]/40 text-sm mt-2">Loading Scroll {loadingProgress}%</p>
            </div>
          </div>
        </div>
      )}

      {/* 独立背景层 - GPU 加速 - 仅在图像加载完成后渲染 */}
      {isImageLoaded && (
        <div 
          ref={bgRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: bgImageSize.width,
            height: bgImageSize.height,
            transformOrigin: '0 0',
            opacity: 0.9,
            willChange: 'transform',
            pointerEvents: 'none',
            transform: `translate3d(0px, ${(containerRef.current?.clientHeight || SCROLL_HEIGHT) * 0.1}px, 0) scale(${displayScale})`
        }}
      >
        {Array.from({ length: TILE_COUNT }).map((_, index) => {
          const tileWidth = Math.floor(ORIGINAL_WIDTH / TILE_COUNT);
          const currentWidth = index === TILE_COUNT - 1 ? (ORIGINAL_WIDTH - index * tileWidth) : tileWidth;
          const left = index * tileWidth;
          
          return (
            <img 
              key={index}
              src={`/images/tiles/tile_${index}.jpg`} 
              alt={`长卷切片 ${index}`} 
              style={{
                position: 'absolute',
                left: `${left}px`,
                top: 0,
                width: `${currentWidth}px`,
                height: '100%',
                objectFit: 'contain',
                display: 'block'
              }}
              draggable={false}
            />
          );
        })}
      </div>
      )}

      {/* SVG 层 - 始终渲染以保持交互功能 */}
      <svg ref={svgRef} className={`w-full h-full absolute top-0 left-0 ${!isImageLoaded ? 'opacity-0' : ''}`} shapeRendering="optimizeSpeed">
        <g transform={`translate(0, ${(containerRef.current?.clientHeight || SCROLL_HEIGHT) * 0.1})`}>
          {hotspots.filter(h => isHotspotVisible(h.level)).map((h) => {
            const padding = 10;
            const rectWidth = h.width + padding * 2;
            const rectHeight = h.height + padding * 2;
            const labelMap: Record<string, string> = {
              'h-new-1': '狼跋',
              'h-new-2': '九罭',
              'h-new-3': '九罭',
              'h-new-4': '伐柯',
              'h-new-5': '破斧',
              'h-new-6': '东山',
              'h-new-7': '七月',
              'h-new-8': '七月'
            };
            const displayLabel = labelMap[h.id] ?? h.label;

            return (
              <g 
                key={h.id} 
                className="cursor-pointer group animate-in fade-in duration-500" 
                // 使用 ORIGINAL_WIDTH/HEIGHT 确保热点位置与背景图对齐
                transform={`translate(${(h.x / 100) * ORIGINAL_WIDTH}, ${(h.y / 100) * ORIGINAL_HEIGHT})`}
                onClick={() => onHotspotClick(h)}
              >
                {/* 热区边界 */}
                <rect 
                  x={-padding}
                  y={-padding}
                  width={rectWidth} 
                  height={rectHeight} 
                  fill={radarActive ? "rgba(197, 160, 89, 0.12)" : "rgba(197, 160, 89, 0.02)"} 
                  stroke={radarActive ? "rgba(197, 160, 89, 0.7)" : "rgba(197, 160, 89, 0.2)"} 
                  strokeWidth={radarActive ? "1.6" : "0.8"}
                  strokeDasharray={radarActive ? "none" : "3 3"}
                  className="transition-all duration-700 group-hover:fill-[#c5a059]/15 group-hover:stroke-[#c5a059] hotspot-blink"
                />
                
                {/* 四角笔触装饰 */}
                <g className="opacity-40 group-hover:opacity-100 transition-opacity hotspot-blink">
                  <path d={`M ${-padding} ${-padding + 12} L ${-padding} ${-padding} L ${-padding + 12} ${-padding}`} fill="none" stroke="#c5a059" strokeWidth="2" />
                  <path d={`M ${rectWidth - 12 - padding} ${-padding} L ${rectWidth - padding} ${-padding} L ${rectWidth - padding} ${-padding + 12}`} fill="none" stroke="#c5a059" strokeWidth="2" />
                  <path d={`M ${-padding} ${rectHeight - 12 - padding} L ${-padding} ${rectHeight - padding} ${-padding + 12} ${rectHeight - padding}`} fill="none" stroke="#c5a059" strokeWidth="2" />
                  <path d={`M ${rectWidth - 12 - padding} ${rectHeight - padding} L ${rectWidth - padding} ${rectHeight - padding} ${rectWidth - padding} ${rectHeight - 12 - padding}`} fill="none" stroke="#c5a059" strokeWidth="2" />
                </g>
                
                <foreignObject x="0" y={rectHeight + 6 - padding} width="300" height="80">
                  <div className="flex flex-col opacity-60 group-hover:opacity-100 transition-all group-hover:translate-x-1 hotspot-blink">
                    <div className="flex items-center gap-2">
                      <span className={`${h.level === HotspotLevel.CHAPTER ? 'text-2xl' : 'text-lg'} text-white font-serif leading-tight`}>
                        {displayLabel}
                      </span>
                      {h.originalImage && <div className="red-seal scale-[0.6] origin-left -ml-2">对照</div>}
                    </div>
                  </div>
                </foreignObject>

                <div className="ink-pulse absolute" style={{ left: rectWidth / 2 - padding, top: rectHeight / 2 - padding }}>
                  <div className="w-3 h-3 rounded-full bg-[#c5a059]" />
                </div>
              </g>
            );
          })}
        </g>
        {/* <defs>
        </defs> */}
      </svg>
    </div>
  );
};

export default ScrollScene;
