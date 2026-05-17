import { SCROLL_WIDTH } from '../../constants';
import { Hotspot, ReadingReport, ReadingSession } from '../../types';

const makeSessionId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const chapterLabelFromProgress = (progress: number) => {
  if (progress < 1 / 7) return '狼跋';
  if (progress < 2 / 7) return '九罭';
  if (progress < 3 / 7) return '伐柯';
  if (progress < 4 / 7) return '破斧';
  if (progress < 5 / 7) return '东山';
  if (progress < 6 / 7) return '鸱鸮';
  return '七月';
};

export const createReadingSession = (): ReadingSession => ({
  sessionId: makeSessionId(),
  startedAt: Date.now(),
  hotspotClicks: [],
  viewSamples: [],
  videoOpens: [],
  videoSessions: [],
  chatQuestions: [],
});

export const recordHotspotClick = (session: ReadingSession, hotspot: Hotspot, timestamp = Date.now()) => {
  session.hotspotClicks.push({
    hotspotId: hotspot.id,
    label: hotspot.label,
    subtitle: hotspot.subtitle,
    category: hotspot.category,
    timestamp,
  });
};

export const recordViewSample = (
  session: ReadingSession,
  pos: { x: number; y: number; scale: number },
  timestamp = Date.now(),
  minIntervalMs = 800
) => {
  const last = session.viewSamples.length > 0 ? session.viewSamples[session.viewSamples.length - 1] : undefined;
  if (last && timestamp - last.timestamp < minIntervalMs) return;
  session.viewSamples.push({ x: pos.x, y: pos.y, scale: pos.scale, timestamp });
};

export const recordVideoOpen = (session: ReadingSession, hotspot: Hotspot, timestamp = Date.now()) => {
  session.videoOpens.push({ hotspotId: hotspot.id, label: hotspot.label, timestamp });
};

export const recordVideoClose = (
  session: ReadingSession,
  hotspot: Hotspot,
  openedAt: number,
  closedAt = Date.now()
) => {
  const durationMs = Math.max(0, closedAt - openedAt);
  session.videoSessions.push({
    hotspotId: hotspot.id,
    label: hotspot.label,
    openedAt,
    closedAt,
    durationMs,
  });
};

export const recordChatQuestion = (session: ReadingSession, text: string, timestamp = Date.now()) => {
  const t = text.trim();
  if (!t) return;
  session.chatQuestions.push({ text: t, timestamp });
};

const computeViewportDistance = (samples: Array<{ x: number }>) => {
  if (samples.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < samples.length; i++) {
    sum += Math.abs(samples[i].x - samples[i - 1].x);
  }
  return Math.round(sum);
};

const computeChaptersVisited = (samples: Array<{ x: number }>) => {
  if (samples.length === 0) return new Set<string>();
  const set = new Set<string>();
  for (const s of samples) {
    const progress = SCROLL_WIDTH > 0 ? Math.abs(s.x) / SCROLL_WIDTH : 0;
    set.add(chapterLabelFromProgress(progress));
  }
  return set;
};

const computeCategoryStats = (clicks: Array<{ category?: string }>) => {
  const counts = new Map<string, number>();
  for (const c of clicks) {
    const key = c.category || '未分类';
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const total = clicks.length || 1;
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count, ratio: count / total }))
    .sort((a, b) => b.count - a.count);
};

export const buildReadingReport = (
  session: ReadingSession,
  history: Hotspot[],
  lastViewPosition: { x: number; y: number; scale: number }
): ReadingReport => {
  const endedAt = session.endedAt ?? Date.now();
  const durationMs = Math.max(0, endedAt - session.startedAt);

  const uniqueHotspots = new Set(session.hotspotClicks.map(c => c.hotspotId));
  const viewportDistancePx = computeViewportDistance(session.viewSamples.length ? session.viewSamples : [lastViewPosition]);
  const chaptersVisitedSet = computeChaptersVisited(session.viewSamples.length ? session.viewSamples : [lastViewPosition]);
  const categoryStats = computeCategoryStats(session.hotspotClicks);

  const videoTotalDurationMs = session.videoSessions.reduce((sum, v) => sum + v.durationMs, 0);

  const recentHotspots = session.hotspotClicks
    .slice(-10)
    .reverse()
    .map(c => ({
      hotspotId: c.hotspotId,
      label: c.label,
      subtitle: c.subtitle,
      category: c.category,
      timestamp: c.timestamp,
    }));

  const progress = SCROLL_WIDTH > 0 ? Math.abs(lastViewPosition.x) / SCROLL_WIDTH : 0;
  const currentChapter = chapterLabelFromProgress(progress);

  const topCategory = categoryStats[0]?.category;
  const highlights: string[] = [];

  if (durationMs < 30_000) highlights.push('本次读画较为快速，偏向于浏览式的整体扫读。');
  else if (durationMs < 180_000) highlights.push('本次读画节奏适中，在浏览与停留之间保持了平衡。');
  else highlights.push('本次读画停留时间较长，呈现出研究型的细读倾向。');

  if (uniqueHotspots.size === 0) highlights.push('尚未点开热点内容，可尝试从任一段落的热点进入解读。');
  else highlights.push(`本次共触发 ${uniqueHotspots.size} 个热点，足迹集中在“${currentChapter}”附近。`);

  if (topCategory) highlights.push(`你的关注更偏向“${topCategory}”主题。`);

  const suggestions: string[] = [];
  if (history.length === 0) {
    suggestions.push('建议先开启“探测(R)”，在画卷上寻找金色热点框并点击进入。');
  } else {
    suggestions.push('可以从“足迹(P)”回看已浏览的场景，再对比其中的叙事线索。');
  }
  if (session.chatQuestions.length === 0) {
    suggestions.push('可以在右下角智能导览中提一个问题，让系统给出诗经与图像的关联解读。');
  } else {
    suggestions.push('可将你的提问进一步聚焦到一个关键词（如农时/礼俗），获得更连贯的解释链。');
  }
  if (session.videoSessions.length === 0) {
    suggestions.push('建议点开任一热点视频门户，在“解读”模式中查看注释框与篇章背景。');
  }

  return {
    sessionId: session.sessionId,
    startedAt: session.startedAt,
    endedAt,
    durationMs,
    overview: {
      hotspotsClicked: session.hotspotClicks.length,
      uniqueHotspotsClicked: uniqueHotspots.size,
      chaptersVisited: chaptersVisitedSet.size,
      viewportDistancePx,
      videosOpened: session.videoOpens.length,
      videoTotalDurationMs,
      questionsAsked: session.chatQuestions.length,
    },
    categoryStats,
    recentHotspots,
    highlights,
    suggestions,
  };
};

