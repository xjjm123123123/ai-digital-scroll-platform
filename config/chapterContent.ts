import { Hotspot } from '../types';

export const CHAPTER_CONTENT_MAP: Record<
  string,
  { label: string; subtitle: string; background: string; contentDetail: string }
> = {
  'h-new-8': {
    label: '七月',
    subtitle: '华夏最早的农事历书',
    background: '地位：全诗共八章，是《诗经·国风》中最长的作品。',
    contentDetail:
      '以时间为经，以生产生活为纬。从一月的寒风刺骨写到腊月的凿冰祭祀，详尽记录了西周时期豳地农民的一年：春天耕种采桑，夏天锄草消暑，秋天收获染丝，冬天修屋捕猎。它不仅是文学作品，更是研究先周社会结构、物候历法、劳动工具及饮食服饰极其珍贵的史料。',
  },
  'h-new-7': {
    label: '七月',
    subtitle: '华夏最早的农事历书',
    background: '地位：全诗共八章，是《诗经·国风》中最长的作品。',
    contentDetail:
      '以时间为经，以生产生活为纬。从一月的寒风刺骨写到腊月的凿冰祭祀，详尽记录了西周时期豳地农民的一年：春天耕种采桑，夏天锄草消暑，秋天收获染丝，冬天修屋捕猎。它不仅是文学作品，更是研究先周社会结构、物候历法、劳动工具及饮食服饰极其珍贵的史料。',
  },
  'h-new-6': {
    label: '东山',
    subtitle: '战争创伤下的归家之情',
    background: '描写随周公东征三年后复员回乡的士兵。',
    contentDetail:
      '全诗通过士兵在归途中的心理独白，展现了极高的艺术感染力。第一章写行军之苦；第二章想象家乡房屋荒芜、鹇鹄啼叫的凄凉；第三章转而想象新婚妻子在家苦苦等候的情景。这种"未到家先想家"的虚实结合手法，开启了后世边塞诗和征夫诗的先河。',
  },
  'h-new-5': {
    label: '破斧',
    subtitle: '凯旋后的苦涩与荣耀',
    background: '周公东征胜利，将士们即将解甲归田。',
    contentDetail:
      '诗歌反复咏叹"既破我斧，又缺我斨"，通过兵器的残破侧面印证了战争的残酷与漫长。虽然武器毁坏了，但将士们对周公能够平定四方、带给他们安宁生活表示了深深的敬意和爱戴，反映了底层士兵在战后复杂的心境。',
  },
  'h-new-4': {
    label: '伐柯',
    subtitle: '婚姻制度的礼法标准',
    background: '确立社会契约与周礼的象征。',
    contentDetail:
      '以"砍树做斧柄"这一日常劳动为喻，提出核心观点：砍木头需要斧头，娶妻子必须通过媒妁。如果没有旧的斧柄做参考，就做不出新的斧柄；如果没有中介和礼仪，婚姻就不合法。这体现了当时社会已经进入了高度重视契约和礼法的文明阶段。',
  },
  'h-new-3': {
    label: '九罭',
    subtitle: '周初的政治礼仪',
    background: '描写公卿（一说周公）巡视地方时的盛大欢迎场面。',
    contentDetail:
      '"九罭"指拥有九个网眼的捕鱼大网。诗中以捕获大鱼（鳟、鲂）为起兴，象征着国家的贤才得以任用。随后笔锋转到丰盛的宴席和主宾之间热情的款待，展现了西周初期统治阶层内部和睦、礼贤下士的政治风气。',
  },
  'h-new-2': {
    label: '九罭',
    subtitle: '周初的政治礼仪',
    background: '描写公卿（一说周公）巡视地方时的盛大欢迎场面。',
    contentDetail:
      '"九罭"指拥有九个网眼的捕鱼大网。诗中以捕获大鱼（鳟、鲂）为起兴，象征着国家的贤才得以任用。随后笔锋转到丰盛的宴席和主宾之间热情的款待，展现了西周初期统治阶层内部和睦、礼贤下士的政治风气。',
  },
  'h-new-1': {
    label: '狼跋',
    subtitle: '困境中的威仪与德行',
    background: '针对诽谤周公的言论进行的辩护。',
    contentDetail:
      '诗中生动描绘了一只老狼进退两难的窘态：前行则踩到胡须，后退则被尾巴绊倒。这象征了周公在权位与流言之间的艰难处境。但诗歌笔锋一转，赞美周公即便在如此窘境下，依然能够保持赤色的鞋履和优雅的仪态，表现出一种不随波逐流、坚守道德准则的高贵格调。',
  },
};

export const getChapterContent = (hotspot: Hotspot) => {
  const mapped = CHAPTER_CONTENT_MAP[hotspot.id];
  if (mapped) {
    return {
      label: mapped.label,
      subtitle: hotspot.subtitle || mapped.subtitle,
      background: hotspot.background || mapped.background,
      contentDetail: hotspot.contentDetail || mapped.contentDetail,
    };
  }
  return {
    label: hotspot.label,
    subtitle: hotspot.subtitle || '',
    background: hotspot.background || '',
    contentDetail: hotspot.contentDetail || '',
  };
};

export const buildHotspotContext = (hotspot: Hotspot): string => {
  const chapter = getChapterContent(hotspot);
  const parts = [
    `当前热点：${hotspot.label}`,
    chapter.label !== hotspot.label ? `篇章：${chapter.label}` : '',
    chapter.subtitle ? `副题：${chapter.subtitle}` : '',
    hotspot.category ? `类别：${hotspot.category}` : '',
    chapter.background ? `背景：${chapter.background}` : '',
    hotspot.description ? `场景描述：${hotspot.description}` : '',
    chapter.contentDetail ? `内容要点：${chapter.contentDetail}` : '',
  ].filter(Boolean);
  return parts.join('\n');
};
