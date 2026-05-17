import React from 'react';
import type { ReadingReport as ReadingReportModel } from '../types';

interface ReadingReportProps {
  report: ReadingReportModel;
  onClose: () => void;
}

const formatDuration = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m <= 0) return `${r}s`;
  return `${m}m ${r}s`;
};

const formatRatio = (ratio: number) => `${Math.round(ratio * 100)}%`;

const ReadingReport: React.FC<ReadingReportProps> = ({ report, onClose }) => {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-sm border-white/10 overflow-hidden shadow-[0_0_120px_rgba(197,160,89,0.12)]">
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#c5a059]/20">
          <div className="flex flex-col gap-1">
            <div className="text-[10px] text-[#c5a059]/70 tracking-[0.35em] uppercase">读画报告</div>
            <div className="text-2xl text-[#f0e6d2] font-serif tracking-widest">本次个性化读画</div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="关闭报告"
          >
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto no-scrollbar max-h-[calc(90vh-84px)] space-y-10">
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { k: '总时长', v: formatDuration(report.durationMs) },
              { k: '触发热点', v: `${report.overview.uniqueHotspotsClicked} 个` },
              { k: '视频停留', v: formatDuration(report.overview.videoTotalDurationMs) },
              { k: '提问次数', v: `${report.overview.questionsAsked} 次` },
            ].map(item => (
              <div key={item.k} className="p-4 bg-white/[0.02] border border-white/5">
                <div className="text-[10px] text-white/30 tracking-widest mb-2">{item.k}</div>
                <div className="text-xl text-[#f0e6d2] font-serif">{item.v}</div>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <div className="text-[10px] text-[#c5a059] tracking-[0.35em] uppercase flex items-center gap-3">
              <div className="h-[1px] w-8 bg-current" />
              本次亮点
            </div>
            <div className="space-y-2">
              {report.highlights.map((t, idx) => (
                <div key={idx} className="text-sm text-white/70 leading-loose font-serif pl-4 border-l border-[#c5a059]/25">
                  {t}
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-[10px] text-white/20 tracking-[0.35em] uppercase">主题偏好</div>
              {report.categoryStats.length === 0 ? (
                <div className="text-sm text-white/30 italic font-serif">尚未形成主题偏好数据</div>
              ) : (
                <div className="space-y-2">
                  {report.categoryStats.slice(0, 6).map(s => (
                    <div key={s.category} className="flex items-center gap-3">
                      <div className="w-20 text-[11px] text-white/60 font-serif truncate">{s.category}</div>
                      <div className="flex-1 h-[6px] bg-white/5 border border-white/5">
                        <div className="h-full bg-[#c5a059]/60" style={{ width: formatRatio(s.ratio) }} />
                      </div>
                      <div className="w-10 text-[11px] text-[#c5a059]/80 text-right">{formatRatio(s.ratio)}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-[11px] text-white/35 font-serif">
                视口移动：{report.overview.viewportDistancePx}px · 覆盖段落：{report.overview.chaptersVisited} 个
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] text-white/20 tracking-[0.35em] uppercase">最近足迹</div>
              {report.recentHotspots.length === 0 ? (
                <div className="text-sm text-white/30 italic font-serif">尚无足迹</div>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
                  {report.recentHotspots.map(h => (
                    <div key={`${h.hotspotId}-${h.timestamp}`} className="text-sm text-white/70 font-serif truncate">
                      · {h.label}{h.subtitle ? `：${h.subtitle}` : ''}
                      {h.category ? <span className="text-[10px] text-[#c5a059]/60 ml-2">[{h.category}]</span> : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4 pt-2 border-t border-white/5">
            <div className="text-[10px] text-[#c5a059] tracking-[0.35em] uppercase flex items-center gap-3">
              <div className="h-[1px] w-8 bg-current" />
              下一步建议
            </div>
            <div className="space-y-2">
              {report.suggestions.map((t, idx) => (
                <div key={idx} className="text-sm text-white/70 leading-loose font-serif pl-4 border-l border-[#c5a059]/25">
                  {t}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReadingReport;
