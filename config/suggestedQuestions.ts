import { Hotspot } from '../types';
import { getChapterContent } from './chapterContent';

/** 未选中热点时（画卷浏览页）的通用推荐 */
export const GENERIC_SUGGESTED_QUESTIONS = [
  '你正在读画卷哪一段？可先点击画面中的金色热点。',
  '《豳风图》七篇诗意在卷中从左至右如何排布？',
  '马和之“蚂蝗描”在这幅长卷里有什么特点？',
] as const;

const CHAPTER_QUESTIONS: Record<string, [string, string, string]> = {
  七月: [
    '「七月流火」在画面中如何体现物候与农时？',
    '这一段的男耕女织场景，与《诗经·七月》哪几句最对应？',
    '马和之如何把长达八章的农事历浓缩进长卷构图？',
  ],
  东山: [
    '「东山」诗中征人归乡的心理，在画面人物神态上如何表现？',
    '这一场景与《豳风·东山》哪一章的意象最贴近？',
    '马和之如何用虚实结合表现“未到家先想家”？',
  ],
  破斧: [
    '画面中残破兵器的意象，如何呼应「既破我斧，又缺我斨」？',
    '凯旋与苦涩并存的心境，在构图或人物上有何体现？',
    '「破斧」与周公东征的历史背景有何关联？',
  ],
  伐柯: [
    '「伐柯取柯」的比喻在画面中如何视觉化？',
    '这一场景如何体现周代婚姻礼法与媒妁之义？',
    '斧柄与斧刃的对应关系，在构图上有何讲究？',
  ],
  九罭: [
    '「九罭」捕鱼大网在画面中象征什么政治寓意？',
    '捕获鳟、鲂等大鱼的意象，与贤才任用有何联系？',
    '宴席款待场面如何体现西周礼贤下士之风？',
  ],
  狼跋: [
    '老狼进退两难的窘态，如何象征周公的处境？',
    '「赤舄几几」的威仪细节在画中如何呈现？',
    '这一场景如何为周公辩护流言与诽谤？',
  ],
};

export function getGenericSuggestedQuestions(): string[] {
  return [...GENERIC_SUGGESTED_QUESTIONS];
}

export function getSuggestedQuestions(hotspot: Hotspot): string[] {
  const chapter = getChapterContent(hotspot);
  const label = chapter.label || hotspot.label;
  const preset = CHAPTER_QUESTIONS[label];

  if (preset) {
    return [...preset];
  }

  const categoryHint = hotspot.category ? `「${hotspot.category}」` : '本段';
  const questions: string[] = [
    `《${label}》这一场景在《豳风图》中描绘了哪些${categoryHint}相关的农事或礼俗细节？`,
    `马和之画「${hotspot.label}」时，笔墨与构图上有何特点？`,
  ];

  if (chapter.subtitle) {
    questions.push(`「${chapter.subtitle}」与画面中的意象有何对应关系？`);
  } else if (hotspot.category) {
    questions.push(`「${hotspot.category}」主题与《诗经·豳风》有何关联？`);
  } else {
    questions.push(`「${label}」与《诗经·豳风》的叙事结构有何关联？`);
  }

  return questions.slice(0, 3);
}
