
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
  const zoomRef = useRef<any>(null);
  const [currentScale, setCurrentScale] = useState(0.8);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select('g');

    const zoom = d3.zoom()
      .scaleExtent([0.1, 5])
      .translateExtent([[0, 0], [SCROLL_WIDTH, SCROLL_HEIGHT]])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setCurrentScale(event.transform.k);
        onViewChange({
          x: event.transform.x,
          y: event.transform.y,
          scale: event.transform.k
        });
      });

    zoomRef.current = zoom;
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.scale(0.8).translate(100, 100));

    return () => svg.on('.zoom', null);
  }, []);

  useEffect(() => {
    if (externalPos && zoomRef.current && svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(1200)
        .ease(d3.easeCubicInOut)
        .call(zoomRef.current.transform, d3.zoomIdentity.translate(externalPos.x, externalPos.y).scale(externalPos.scale));
    }
  }, [externalPos]);

  // 语义 LOD 实现
  const isHotspotVisible = (level: HotspotLevel) => {
    if (radarActive) return true;
    if (currentScale < 0.4) return level === HotspotLevel.CHAPTER;
    if (currentScale < 1.2) return level !== HotspotLevel.DETAIL;
    return true;
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-[#080808] cursor-grab active:cursor-grabbing overflow-hidden">
      <svg ref={svgRef} className="w-full h-full">
        <g>
          <rect width={SCROLL_WIDTH} height={SCROLL_HEIGHT} fill="url(#scrollGradient)" />
          <image 
            href="https://raw.githubusercontent.com/xjjm123123123/ai-digital-scroll-platform/main/public/images/binfengtu.jpg" 
            width={SCROLL_WIDTH} 
            height={SCROLL_HEIGHT} 
            preserveAspectRatio="xMidYMid slice"
            opacity="0.8"
            style={{ filter: 'brightness(1.1) contrast(1.1)' }}
          />
          <rect width={SCROLL_WIDTH} height={SCROLL_HEIGHT} fill="url(#grid)" />

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
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(197, 160, 89, 0.03)" strokeWidth="0.5"/>
          </pattern>
          <linearGradient id="scrollGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a0a0a" />
            <stop offset="50%" stopColor="#121212" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default ScrollScene;
