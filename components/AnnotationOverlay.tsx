import React from 'react';
import { Annotation } from '../types';

interface AnnotationOverlayProps {
  annotations?: Annotation[];
  currentTime: number;
}

const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({ annotations, currentTime }) => {
  if (!annotations?.length) return null;

  return (
    <>
      {annotations.map((ann, idx) =>
        Math.abs(currentTime - ann.time) < 1.5 ? (
          <div
            key={idx}
            className="absolute p-4 glass-panel border-[#c5a059]/30 rounded-sm animate-in zoom-in slide-in-from-bottom-2 duration-500 max-w-[220px] z-20 pointer-events-none"
            style={{ left: `${ann.position.x}%`, top: `${ann.position.y}%` }}
          >
            <div className="text-[11px] text-[#f0e6d2] font-serif leading-relaxed italic border-l-2 border-[#c5a059] pl-3">
              {ann.text}
            </div>
          </div>
        ) : null
      )}
    </>
  );
};

export default AnnotationOverlay;
