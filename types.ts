
export enum Season {
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  AUTUMN = 'AUTUMN',
  WINTER = 'WINTER'
}

export enum HotspotLevel {
  CHAPTER = 'CHAPTER', // 章节级（全景可见）
  SCENE = 'SCENE',     // 场景级（中距可见）
  DETAIL = 'DETAIL'    // 细节级（近距可见）
}

export interface VideoVersion {
  id: string;
  tag: string; // 如：写意、更风、墨韵
  url: string;
  styleDesc: string;
}

export interface Annotation {
  time: number; // 视频播放秒数
  text: string;
  position: { x: number; y: number }; // 0-100 视频覆盖层坐标
}

export interface Hotspot {
  id: string;
  x: number; // 0-100 比例
  y: number; // 0-100 比例
  width: number;
  height: number;
  label: string;
  category: string;
  season: Season;
  level: HotspotLevel;
  description: string;
  videoUrl: string; // 默认版本
  originalImage?: string; // 原画对比图
  prompt: string;
  versions?: VideoVersion[];
  annotations?: Annotation[];
  relatedHotspotIds?: string[];
}

export interface AppState {
  currentView: 'home' | 'explore' | 'intro' | 'method';
  selectedHotspot: Hotspot | null;
  isPanning: boolean;
  scale: number;
  position: { x: number; y: number };
  activeMode: 'immersive' | 'interpret' | 'compare';
}
