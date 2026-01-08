
import React from 'react';
import { SCROLL_WIDTH } from '../constants';

interface MiniMapProps {
  x: number;
  viewWidth: number;
  onJump: (x: number) => void;
}

const MiniMap: React.FC<MiniMapProps> = ({ x, viewWidth, onJump }) => {
  const mapWidth = 240;
  const viewportIndicatorWidth = (viewWidth / SCROLL_WIDTH) * mapWidth;
  const viewportIndicatorLeft = (Math.abs(x) / SCROLL_WIDTH) * mapWidth;

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scrollTarget = (clickX / mapWidth) * SCROLL_WIDTH;
    onJump(-scrollTarget + viewWidth / 2);
  };

  return (
    <div 
      className="fixed bottom-10 right-10 w-[240px] h-[40px] glass-panel rounded-sm border border-white/10 p-1 cursor-crosshair group z-50 overflow-hidden"
      onClick={handleClick}
    >
      <div className="w-full h-full relative bg-white/5 overflow-hidden">
        {/* 装饰渐变 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent opacity-50" />
        
        {/* 指示器 */}
        <div 
          className="absolute h-full border-x border-[#c5a059] bg-[#c5a059]/10 transition-all duration-75"
          style={{
            width: `${viewportIndicatorWidth}px`,
            left: `${viewportIndicatorLeft}px`
          }}
        />

        {/* 季节标记 */}
        <div className="absolute top-0 left-2 h-full flex items-center pointer-events-none">
          <span className="text-[9px] text-white/40 tracking-widest">初春</span>
        </div>
        <div className="absolute top-0 right-2 h-full flex items-center pointer-events-none">
          <span className="text-[9px] text-white/40 tracking-widest">隆冬</span>
        </div>
      </div>
      
      {/* 提示信息 */}
      <div className="absolute -top-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#c5a059] tracking-widest whitespace-nowrap">
        全卷导览 / 拖拽定位
      </div>
    </div>
  );
};

export default MiniMap;
