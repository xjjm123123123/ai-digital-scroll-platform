
import { Season, Hotspot, HotspotLevel } from './types';

export const SCROLL_WIDTH = 12000;
export const SCROLL_HEIGHT = 1000;

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'h1',
    x: 5,
    y: 30,
    width: 800,
    height: 600,
    label: '孟春 · 载芟载柞',
    category: '章节',
    season: Season.SPRING,
    level: HotspotLevel.CHAPTER,
    description: '《七月》开篇。描绘农夫在春日初暖时，清理荒地，准备耕耘。这是整幅画卷的起点。',
    videoUrl: 'https://cdn.pixabay.com/video/2023/11/04/187707-880629555_tiny.mp4',
    prompt: 'Ancient Chinese spring, ink wash style, farmers clearing land.',
    relatedHotspotIds: ['h1-detail', 'h2']
  },
  {
    id: 'h1-detail',
    x: 10,
    y: 40,
    width: 250,
    height: 300,
    label: '春耕祈丰',
    category: '农事',
    season: Season.SPRING,
    level: HotspotLevel.DETAIL,
    description: '细节展示老牛耕地。泥土翻飞，老农专注，体现了诗经中“三之日于耜，四之日举趾”的生机。',
    videoUrl: 'https://cdn.pixabay.com/video/2023/11/04/187707-880629555_tiny.mp4',
    originalImage: 'https://picsum.photos/seed/h1d/800/600',
    prompt: 'Detailed ink animation, ox plowing.',
    versions: [
      { id: 'v1', tag: '写意', url: 'https://cdn.pixabay.com/video/2023/11/04/187707-880629555_tiny.mp4', styleDesc: '注重意境与笔触晕染' },
      { id: 'v2', tag: '墨韵', url: 'https://cdn.pixabay.com/video/2022/04/19/114421-698115684_tiny.mp4', styleDesc: '强化水墨呼吸感' }
    ],
    annotations: [
      { time: 1, text: '犁铧破土的沉稳感', position: { x: 30, y: 70 } },
      { time: 4, text: '春日泥土的温润气息', position: { x: 60, y: 40 } }
    ],
    relatedHotspotIds: ['h4']
  },
  {
    id: 'h2',
    x: 22,
    y: 25,
    width: 300,
    height: 400,
    label: '桑林采撷',
    category: '动作',
    season: Season.SPRING,
    level: HotspotLevel.SCENE,
    description: '“春日迟迟，采蘩祁祁。” 女子在茂密桑林中采摘嫩叶。',
    videoUrl: 'https://cdn.pixabay.com/video/2021/04/24/72124-542618991_tiny.mp4',
    originalImage: 'https://picsum.photos/seed/h2/800/600',
    prompt: 'Women picking leaves, traditional style.',
    relatedHotspotIds: ['h5']
  },
  {
    id: 'h3',
    x: 45,
    y: 35,
    width: 400,
    height: 350,
    label: '五月鸣蜩',
    category: '节令',
    season: Season.SUMMER,
    level: HotspotLevel.SCENE,
    description: '夏至时分，蝉鸣阵阵，树影摇曳，传达出夏日的静谧。',
    videoUrl: 'https://cdn.pixabay.com/video/2021/08/03/83726-583803023_tiny.mp4',
    prompt: 'Summer leaves trembling, cicada sound implied.',
    relatedHotspotIds: ['h2', 'h4']
  },
  {
    id: 'h4',
    x: 68,
    y: 30,
    width: 350,
    height: 450,
    label: '八月剥枣',
    category: '收获',
    season: Season.AUTUMN,
    level: HotspotLevel.SCENE,
    description: '仲秋收获，农户用长竿击落红枣，动态矫健。',
    videoUrl: 'https://cdn.pixabay.com/video/2023/04/09/158097-816040859_tiny.mp4',
    originalImage: 'https://picsum.photos/seed/h4/800/600',
    prompt: 'Harvesting jujubes, falling fruits, active motion.',
    relatedHotspotIds: ['h1-detail']
  },
  {
    id: 'h5',
    x: 88,
    y: 28,
    width: 350,
    height: 550,
    label: '寒月织丝',
    category: '工艺',
    season: Season.WINTER,
    level: HotspotLevel.SCENE,
    description: '冬夜漫漫，室内机杼声不绝，刻画了灯火下的专注。',
    videoUrl: 'https://cdn.pixabay.com/video/2023/12/10/192735-893541459_tiny.mp4',
    prompt: 'Indoor weaving loom, silhouette.',
    relatedHotspotIds: ['h2']
  }
];

export const COLORS = {
  INK: '#0c0c0c',
  SILK: '#f0e6d2',
  GOLD: '#c5a059',
  VERMILION: '#b22222',
  QING: '#2d5a5e'
};
