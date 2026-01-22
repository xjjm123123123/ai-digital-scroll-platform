
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SCROLL_WIDTH, SCROLL_HEIGHT, HOTSPOTS } from '../constants';
import { Hotspot, HotspotLevel } from '../types';

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
  const [loadedSegments, setLoadedSegments] = useState<Set<number>>(new Set());
  
  const SEGMENT_COUNT = 4;
  const SEGMENT_WIDTH = SCROLL_WIDTH / SEGMENT_COUNT;
  const bgImageUrl = '/images/binfengtu_small.jpg';

  useEffect(() => {
    const totalSegments = SEGMENT_COUNT;
    const loadedSegments: number[] = [];
    let hasError = false;

    const loadSegment = (index: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.src = bgImageUrl;
        
        img.onload = () => {
          loadedSegments.push(index);
          setLoadedSegments(new Set(loadedSegments));
          
          if (loadedSegments.length === totalSegments) {
            setBgImageSize({ width: img.width, height: img.height });
            setTimeout(() => {
              setIsImageLoaded(true);
            }, 500);
          }
          resolve();
        };
        
        img.onerror = () => {
          hasError = true;
          if (loadedSegments.length === totalSegments || hasError) {
            setBgImageSize({ width: SCROLL_WIDTH, height: SCROLL_HEIGHT });
            setTimeout(() => {
              setIsImageLoaded(true);
            }, 500);
          }
          resolve();
        };
      });
    };

    const loadAllSegments = async () => {
      const promises = Array.from({ length: totalSegments }, (_, i) => loadSegment(i));
      await Promise.all(promises);
    };

    loadAllSegments();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select('g');

    const zoom = d3.zoom()
      .scaleExtent([1, 1])
      .translateExtent([[0, 0], [SCROLL_WIDTH, SCROLL_HEIGHT]])
      .on('start', () => {
        setIsDragging(true);
        setLastInteractionTime(performance.now());
        setIsAutoScrolling(false);
      })
      .on('zoom', (event) => {
        const { x, y, k } = event.transform;
        
        const containerHeight = containerRef.current?.clientHeight || SCROLL_HEIGHT;
        const containerWidth = containerRef.current?.clientWidth || SCROLL_WIDTH;
        
        const scale = (containerHeight * 0.25) / SCROLL_HEIGHT;
        const offsetY = containerHeight * 0.1;
        
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
    
    const containerHeight = containerRef.current?.clientHeight || SCROLL_HEIGHT;
    const scale = (containerHeight * 0.25) / SCROLL_HEIGHT;
    const offsetY = containerHeight * 0.1;
    setDisplayScale(scale);
    svg.call(zoom.transform, d3.zoomIdentity.translate(0, offsetY).scale(1));

    const handleMouseMove = () => {
      setLastInteractionTime(performance.now());
      setIsAutoScrolling(false);
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);

    return () => {
      svg.on('.zoom', null);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      const timeSinceLastInteraction = lastInteractionTime === 0 ? 10001 : currentTime - lastInteractionTime;
      const shouldAutoScroll = timeSinceLastInteraction > 10000 && !isDragging;
      
      if (shouldAutoScroll && zoomRef.current && svgRef.current) {
        setIsAutoScrolling(true);
        
        const currentTransform = d3.zoomTransform(svgRef.current);
        const scrollSpeed = 0.5;
        const newX = currentTransform.x + scrollSpeed * (deltaTime / 16.67);
        const maxScroll = SCROLL_WIDTH * 0.25 - (containerRef.current?.clientWidth || 0);
        
        const finalX = newX > maxScroll ? 0 : newX;
        
        d3.select(svgRef.current)
          .call(zoomRef.current.transform, d3.zoomIdentity.translate(finalX, currentTransform.y).scale(currentTransform.k));
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDragging, lastInteractionTime]);

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
    if (radarActive) return true;
    // 缩放固定为1，显示所有热区
    return true;
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-[#080808] cursor-grab active:cursor-grabbing overflow-hidden relative">
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
              <p className="text-[#f0e6d2]/40 text-sm mt-2">Loading Scroll</p>
              <div className="mt-4 flex gap-1">
                {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      loadedSegments.has(i) ? 'bg-[#c5a059]' : 'bg-[#c5a059]/20'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[#f0e6d2]/30 text-xs mt-2">
                {loadedSegments.size} / {SEGMENT_COUNT}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 分段背景层 - GPU 加速 - 仅在图像加载完成后渲染 */}
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
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                left: i * SEGMENT_WIDTH,
                width: SEGMENT_WIDTH,
                height: bgImageSize.height,
                backgroundImage: 'url(/images/binfengtu_small.jpg)',
                backgroundSize: `${bgImageSize.width}px ${bgImageSize.height}px`,
                backgroundPosition: `-${i * SEGMENT_WIDTH}px 0`,
                backgroundRepeat: 'no-repeat'
              }}
            />
          ))}
        </div>
      )}

      {/* SVG 层 - 始终渲染以保持交互功能 */}
      <svg ref={svgRef} className={`w-full h-full absolute top-0 left-0 ${!isImageLoaded ? 'opacity-0' : ''}`} shapeRendering="optimizeSpeed">
        <g transform={`translate(0, ${(containerRef.current?.clientHeight || SCROLL_HEIGHT) * 0.1})`}>
          {HOTSPOTS.filter(h => isHotspotVisible(h.level)).map((h) => (
            <g 
              key={h.id} 
              className="cursor-pointer group animate-in fade-in duration-500" 
              transform={`translate(${(h.x / 100) * SCROLL_WIDTH}, ${(h.y / 100) * SCROLL_HEIGHT})`}
              onClick={() => onHotspotClick(h)}
            >
              {/* 热区边界 */}
              <rect 
                width={h.width} 
                height={h.height} 
                fill={radarActive ? "rgba(197, 160, 89, 0.12)" : "rgba(197, 160, 89, 0.02)"} 
                stroke={radarActive ? "rgba(197, 160, 89, 0.7)" : "rgba(197, 160, 89, 0.2)"} 
                strokeWidth={radarActive ? "1.5" : "0.5"}
                strokeDasharray={radarActive ? "none" : "3 3"}
                className="transition-all duration-700 group-hover:fill-[#c5a059]/15 group-hover:stroke-[#c5a059]"
              />
              
              {/* 四角笔触装饰 */}
              <g className="opacity-40 group-hover:opacity-100 transition-opacity">
                <path d="M 0 12 L 0 0 L 12 0" fill="none" stroke="#c5a059" strokeWidth="2" />
                <path d={`M ${h.width - 12} 0 L ${h.width} 0 L ${h.width} 12`} fill="none" stroke="#c5a059" strokeWidth="2" />
                <path d={`M 0 ${h.height - 12} L 0 ${h.height} 12 ${h.height}`} fill="none" stroke="#c5a059" strokeWidth="2" />
                <path d={`M ${h.width - 12} ${h.height} L ${h.width} ${h.height} ${h.width} ${h.height - 12}`} fill="none" stroke="#c5a059" strokeWidth="2" />
              </g>
              
              <foreignObject x="0" y={h.height + 6} width="300" height="80">
                <div className="flex flex-col opacity-60 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                  <span className="text-[8px] text-[#c5a059] uppercase tracking-[0.4em] font-bold">{h.category}</span>
                  <div className="flex items-center gap-2">
                    <span className={`${h.level === HotspotLevel.CHAPTER ? 'text-2xl' : 'text-lg'} text-white font-serif leading-tight`}>
                      {h.label}
                    </span>
                    {h.originalImage && <div className="red-seal scale-[0.6] origin-left -ml-2">对照</div>}
                  </div>
                </div>
              </foreignObject>

              <div className="ink-pulse absolute" style={{ left: h.width/2, top: h.height/2 }}>
                <div className="w-3 h-3 rounded-full bg-[#c5a059]" />
              </div>
            </g>
          ))}
        </g>
        {/* <defs>
        </defs> */}
      </svg>
    </div>
  );
};

export default ScrollScene;
