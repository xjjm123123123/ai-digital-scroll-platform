
import { Season, Hotspot, HotspotLevel } from './types';

export const SCROLL_WIDTH = 12000;
export const SCROLL_HEIGHT = 1000;

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'h-new-1',
    x: 4.39,
    y: 60.16,
    width: 150,
    height: 180,
    label: '场景一',
    category: '细节',
    season: Season.SPRING,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 1',
    videoUrl: 'https://cdn.pixabay.com/video/2023/11/04/187707-880629555_tiny.mp4',
    prompt: 'Detail scene 1',
    relatedHotspotIds: []
  },
  {
    id: 'h-new-2',
    x: 15.07,
    y: 74.00,
    width: 150,
    height: 180,
    label: '场景二',
    category: '细节',
    season: Season.SPRING,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 2',
    videoUrl: 'https://cdn.pixabay.com/video/2023/11/04/187707-880629555_tiny.mp4',
    prompt: 'Detail scene 2',
    relatedHotspotIds: []
  },
  {
    id: 'h-new-3',
    x: 18.76,
    y: 65.82,
    width: 150,
    height: 180,
    label: '场景三',
    category: '细节',
    season: Season.SPRING,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 3',
    videoUrl: 'https://cdn.pixabay.com/video/2023/11/04/187707-880629555_tiny.mp4',
    prompt: 'Detail scene 3',
    relatedHotspotIds: []
  },
  {
    id: 'h-new-4',
    x: 31.17,
    y: 45.13,
    width: 150,
    height: 180,
    label: '场景四',
    category: '细节',
    season: Season.SUMMER,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 4',
    videoUrl: 'https://cdn.pixabay.com/video/2023/11/04/187707-880629555_tiny.mp4',
    prompt: 'Detail scene 4',
    relatedHotspotIds: []
  },
  {
    id: 'h-new-5',
    x: 39.45,
    y: 52.95,
    width: 150,
    height: 180,
    label: '场景五',
    category: '细节',
    season: Season.SUMMER,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 5',
    videoUrl: 'https://cdn.pixabay.com/video/2023/11/04/187707-880629555_tiny.mp4',
    prompt: 'Detail scene 5',
    relatedHotspotIds: []
  },
  {
    id: 'h-new-6',
    x: 51.58,
    y: 74.84,
    width: 150,
    height: 180,
    label: '场景六',
    category: '细节',
    season: Season.AUTUMN,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 6',
    videoUrl: 'https://cdn.pixabay.com/video/2023/11/04/187707-880629555_tiny.mp4',
    prompt: 'Detail scene 6',
    relatedHotspotIds: []
  },
  {
    id: 'h-new-7',
    x: 76.48,
    y: 47.77,
    width: 150,
    height: 180,
    label: '场景七',
    category: '细节',
    season: Season.AUTUMN,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 7',
    videoUrl: 'https://cdn.pixabay.com/video/2023/11/04/187707-880629555_tiny.mp4',
    prompt: 'Detail scene 7',
    relatedHotspotIds: []
  },
  {
    id: 'h-new-8',
    x: 80.80,
    y: 79.29,
    width: 150,
    height: 180,
    label: '场景八',
    category: '细节',
    season: Season.WINTER,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 8',
    videoUrl: 'https://cdn.pixabay.com/video/2023/11/04/187707-880629555_tiny.mp4',
    prompt: 'Detail scene 8',
    relatedHotspotIds: []
  }
];

export const COLORS = {
  INK: '#0c0c0c',
  SILK: '#f0e6d2',
  GOLD: '#c5a059',
  VERMILION: '#b22222',
  QING: '#2d5a5e'
};
