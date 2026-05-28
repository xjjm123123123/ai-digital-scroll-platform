
import { Season, Hotspot, HotspotLevel } from './types';

export const SCROLL_WIDTH = 12000;
export const SCROLL_HEIGHT = 1000;

const CHAPTER_CONTENT = {
  qiyue: {
    subtitle: '华夏最早的农事历书',
    background: '地位：全诗共八章，是《诗经·国风》中最长的作品。',
    contentDetail: '以时间为经，以生产生活为纬。从一月的寒风刺骨写到腊月的凿冰祭祀，详尽记录了西周时期豳地农民的一年：春天耕种采桑，夏天锄草消暑，秋天收获染丝，冬天修屋捕猎。它不仅是文学作品，更是研究先周社会结构、物候历法、劳动工具及饮食服饰极其珍贵的史料。'
  },
  chixiao: {
    subtitle: '周公的赤诚自白',
    background: '相传周公旦在武王死后摄政，遭到流言中伤，为向成王表明心迹而作。',
    contentDetail: '诗人化身为一只在风雨中辛勤筑巢的母鸟，向毁掉自己幼鸟的鸱鸮（猫头鹰）发出哀鸣。诗中细致描写了母鸟啄取草根织巢导致嘴部磨损、羽毛凋落的惨状，比喻周公为稳定王室、平定叛乱所付出的惨痛代价，具有深沉的忧患意识和悲剧色彩。'
  },
  dongshan: {
    subtitle: '战争创伤下的归家之情',
    background: '描写随周公东征三年后复员回乡的士兵。',
    contentDetail: '全诗通过士兵在归途中的心理独白，展现了极高的艺术感染力。第一章写行军之苦；第二章想象家乡房屋荒芜、鹇鹄啼叫的凄凉；第三章转而想象新婚妻子在家苦苦等候的情景。这种"未到家先想家"的虚实结合手法，开启了后世边塞诗和征夫诗的先河。'
  },
  pofu: {
    subtitle: '凯旋后的苦涩与荣耀',
    background: '周公东征胜利，将士们即将解甲归田。',
    contentDetail: '诗歌反复咏叹"既破我斧，又缺我斨"，通过兵器的残破侧面印证了战争的残酷与漫长。虽然武器毁坏了，但将士们对周公能够平定四方、带给他们安宁生活表示了深深的敬意和爱戴，反映了底层士兵在战后复杂的心境。'
  },
  fake: {
    subtitle: '婚姻制度的礼法标准',
    background: '确立社会契约与周礼的象征。',
    contentDetail: '以"砍树做斧柄"这一日常劳动为喻，提出核心观点：砍木头需要斧头，娶妻子必须通过媒妁。如果没有旧的斧柄做参考，就做不出新的斧柄；如果没有中介和礼仪，婚姻就不合法。这体现了当时社会已经进入了高度重视契约和礼法的文明阶段。'
  },
  jiuwei: {
    subtitle: '周初的政治礼仪',
    background: '描写公卿（一说周公）巡视地方时的盛大欢迎场面。',
    contentDetail: '"九罭"指拥有九个网眼的捕鱼大网。诗中以捕获大鱼（鳟、鲂）为起兴，象征着国家的贤才得以任用。随后笔锋转到丰盛的宴席和主宾之间热情的款待，展现了西周初期统治阶层内部和睦、礼贤下士的政治风气。'
  },
  langba: {
    subtitle: '困境中的威仪与德行',
    background: '针对诽谤周公的言论进行的辩护。',
    contentDetail: '诗中生动描绘了一只老狼进退两难的窘态：前行则踩到胡须，后退则被尾巴绊倒。这象征了周公在权位与流言之间的艰难处境。但诗歌笔锋一转，赞美周公即便在如此窘境下，依然能够保持赤色的鞋履和优雅的仪态，表现出一种不随波逐流、坚守道德准则的高贵格调。'
  }
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'h-new-1',
    x: 4.39,
    y: 60.16,
    width: 150,
    height: 180,
    label: '狼跋',
    category: '细节',
    season: Season.SPRING,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 1',
    videoUrl: 'https://bwbhoiykyolpcbjaxqmk.supabase.co/storage/v1/object/public/video/img_001.mp4',
    prompt: 'Detail scene 1',
    relatedHotspotIds: [],
    ...CHAPTER_CONTENT.langba
  },
  {
    id: 'h-new-2',
    x: 15.07,
    y: 74.00,
    width: 150,
    height: 180,
    label: '九罭',
    category: '细节',
    season: Season.SPRING,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 2',
    videoUrl: 'https://bwbhoiykyolpcbjaxqmk.supabase.co/storage/v1/object/public/video/img_002.mp4',
    prompt: 'Detail scene 2',
    relatedHotspotIds: [],
    ...CHAPTER_CONTENT.jiuwei
  },
  {
    id: 'h-new-3',
    x: 18.76,
    y: 65.82,
    width: 150,
    height: 180,
    label: '九罭',
    category: '细节',
    season: Season.SPRING,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 3',
    videoUrl: 'https://bwbhoiykyolpcbjaxqmk.supabase.co/storage/v1/object/public/video/image_003.mp4',
    prompt: 'Detail scene 3',
    relatedHotspotIds: [],
    ...CHAPTER_CONTENT.jiuwei
  },
  {
    id: 'h-new-4',
    x: 31.17,
    y: 45.13,
    width: 150,
    height: 180,
    label: '伐柯',
    category: '细节',
    season: Season.SUMMER,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 4',
    videoUrl: 'https://bwbhoiykyolpcbjaxqmk.supabase.co/storage/v1/object/public/video/img_004.mp4',
    prompt: 'Detail scene 4',
    relatedHotspotIds: [],
    ...CHAPTER_CONTENT.fake
  },
  {
    id: 'h-new-5',
    x: 39.45,
    y: 52.95,
    width: 150,
    height: 180,
    label: '破斧',
    category: '细节',
    season: Season.SUMMER,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 5',
    videoUrl: 'https://bwbhoiykyolpcbjaxqmk.supabase.co/storage/v1/object/public/video/image_005.mp4',
    prompt: 'Detail scene 5',
    relatedHotspotIds: [],
    ...CHAPTER_CONTENT.pofu
  },
  {
    id: 'h-new-6',
    x: 51.58,
    y: 74.84,
    width: 150,
    height: 180,
    label: '东山',
    category: '细节',
    season: Season.AUTUMN,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 6',
    videoUrl: 'https://bwbhoiykyolpcbjaxqmk.supabase.co/storage/v1/object/public/video/image_006.mp4',
    prompt: 'Detail scene 6',
    relatedHotspotIds: [],
    ...CHAPTER_CONTENT.dongshan
  },
  {
    id: 'h-new-7',
    x: 76.48,
    y: 47.77,
    width: 150,
    height: 180,
    label: '七月',
    category: '细节',
    season: Season.AUTUMN,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 7',
    videoUrl: 'https://bwbhoiykyolpcbjaxqmk.supabase.co/storage/v1/object/public/video/img_007.mp4',
    prompt: 'Detail scene 7',
    relatedHotspotIds: [],
    ...CHAPTER_CONTENT.qiyue
  },
  {
    id: 'h-new-8',
    x: 80.80,
    y: 79.29,
    width: 150,
    height: 180,
    label: '七月',
    category: '细节',
    season: Season.WINTER,
    level: HotspotLevel.DETAIL,
    description: '新增细节点位 8',
    videoUrl: 'https://bwbhoiykyolpcbjaxqmk.supabase.co/storage/v1/object/public/video/img_008.mp4',
    prompt: 'Detail scene 8',
    relatedHotspotIds: [],
    ...CHAPTER_CONTENT.qiyue
  }
];

export const COLORS = {
  INK: '#0c0c0c',
  SILK: '#f0e6d2',
  GOLD: '#c5a059',
  VERMILION: '#b22222',
  QING: '#2d5a5e'
};
