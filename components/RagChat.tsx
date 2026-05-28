import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Hotspot } from '../types';
import { generateResponse, isApiKeyConfigured } from '../services/geminiService';
import { loadKnowledgeBase, searchKnowledge, buildContext } from '../services/ragService';
import { buildHotspotContext, getChapterContent } from '../config/chapterContent';
import { getSuggestedQuestions, getGenericSuggestedQuestions } from '../config/suggestedQuestions';
import { buildReadingContextString } from '../src/lib/readingReport';

interface RagChatProps {
    visible: boolean;
    hotspot?: Hotspot | null;
    scrollChapter?: string;
    hotspotHistory?: Hotspot[];
    onUserQuestion?: (text: string, timestamp: number) => void;
}

const RagChat: React.FC<RagChatProps> = ({
    visible,
    hotspot,
    scrollChapter = '',
    hotspotHistory = [],
    onUserQuestion,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isKnowledgeLoaded, setIsKnowledgeLoaded] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastHotspotIdRef = useRef<string | null>(null);
    const hadUserMessagesRef = useRef(false);

    const suggestedQuestions = useMemo(
        () => (hotspot ? getSuggestedQuestions(hotspot) : getGenericSuggestedQuestions()),
        [hotspot]
    );

    const chapterLabel = hotspot ? getChapterContent(hotspot).label : scrollChapter;

    const readingContext = useMemo(
        () => buildReadingContextString(scrollChapter, hotspotHistory),
        [scrollChapter, hotspotHistory]
    );

    useEffect(() => {
        loadKnowledgeBase().then(() => {
            setIsKnowledgeLoaded(true);
        });
    }, []);

    useEffect(() => {
        if (!visible) {
            setIsOpen(false);
            lastHotspotIdRef.current = null;
            hadUserMessagesRef.current = false;
        }
    }, [visible]);

    const appendSceneMessage = useCallback((h: Hotspot, appendOnly: boolean) => {
        const chapter = getChapterContent(h);
        const sceneText = `您正在解读「${chapter.label}」${chapter.subtitle ? `（${chapter.subtitle}）` : ''}。可点击下方推荐问题，或直接提问。`;
        const msg: Message = {
            id: `scene-${h.id}-${Date.now()}`,
            role: 'assistant',
            content: sceneText,
            timestamp: Date.now(),
        };
        if (appendOnly) {
            setMessages((prev) => [...prev, msg]);
        } else {
            setMessages([msg]);
        }
    }, []);

    useEffect(() => {
        if (!visible || !isKnowledgeLoaded) return;

        if (hotspot) {
            const prevId = lastHotspotIdRef.current;
            if (prevId === hotspot.id) return;

            const appendOnly = prevId !== null && hadUserMessagesRef.current;
            lastHotspotIdRef.current = hotspot.id;
            appendSceneMessage(hotspot, appendOnly);
            return;
        }

        if (lastHotspotIdRef.current !== null) {
            lastHotspotIdRef.current = null;
            setMessages((prev) => {
                const switchMsg: Message = {
                    id: `scene-clear-${Date.now()}`,
                    role: 'assistant',
                    content:
                        '已离开热点解读。您可继续浏览长卷，或点击画面中的金色热点进入场景问答。',
                    timestamp: Date.now(),
                };
                return prev.length > 0 && hadUserMessagesRef.current ? [...prev, switchMsg] : [
                    {
                        id: 'welcome',
                        role: 'assistant',
                        content:
                            '您好！我是豳风图智能导览助手。浏览长卷时可随时提问；点击画面热点后将结合当前场景作答。',
                        timestamp: Date.now(),
                    },
                ];
            });
            return;
        }

        if (messages.length === 0) {
            setMessages([
                {
                    id: 'welcome',
                    role: 'assistant',
                    content:
                        '您好！我是豳风图智能导览助手。浏览长卷时可随时提问；点击画面热点后将结合当前场景作答。',
                    timestamp: Date.now(),
                },
            ]);
        }
    }, [visible, hotspot, isKnowledgeLoaded, appendSceneMessage, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (textOverride?: string) => {
        const text = (textOverride ?? inputValue).trim();
        if (!text || isLoading) return;

        if (!isApiKeyConfigured()) {
            alert('请先在 .env.local 文件中配置 VITE_DEEPSEEK_API_KEY');
            return;
        }

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: text,
            timestamp: Date.now(),
        };

        hadUserMessagesRef.current = true;
        onUserQuestion?.(userMessage.content, userMessage.timestamp);
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const hotspotContext = hotspot ? buildHotspotContext(hotspot) : '';
            const relevantEntries = searchKnowledge(userMessage.content, {
                topK: 3,
                hotspot: hotspot ?? null,
                scrollChapter: scrollChapter || undefined,
            });
            const context = buildContext(relevantEntries);

            const response = await generateResponse(userMessage.content, {
                context,
                hotspotContext,
                readingContext,
            });

            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: response,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('发送消息失败:', error);
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: '抱歉，发生了错误，请稍后再试。',
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!visible) return null;

    return (
        <>
            {!isOpen && (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="fixed right-0 top-1/2 -translate-y-1/2 z-[110] flex flex-col items-center gap-2 py-5 pl-2 pr-2.5 rounded-l-md glass-panel border border-r-0 border-[#c5a059]/25 shadow-2xl text-[#c5a059] hover:pr-3.5 hover:text-[#e8dcc4] transition-all duration-300 group"
                    aria-label="展开智能导览"
                >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8b7355] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <span
                        className="text-[10px] tracking-[0.35em] text-[#c5a059]/80 group-hover:text-[#c5a059]"
                        style={{ writingMode: 'vertical-rl' }}
                    >
                        智能导览
                    </span>
                    <svg className="w-3 h-3 text-white/30 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <>
                    <button
                        type="button"
                        className="fixed inset-0 z-[100] bg-black/25 backdrop-blur-[1px]"
                        aria-label="收起智能导览"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed right-0 top-20 bottom-20 z-[110] w-96 max-w-[min(24rem,calc(100vw-2rem))] glass-panel flex flex-col shadow-2xl border-l border-[#c5a059]/20 animate-in slide-in-from-right duration-300">
                    <div className="flex items-center justify-between p-4 border-b border-[#c5a059]/20">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8b7355] flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-[#e8dcc4] font-bold text-sm tracking-wider">智能导览</h3>
                                <p className="text-[#c5a059]/60 text-xs truncate">
                                    {chapterLabel
                                        ? hotspot
                                            ? `当前：${chapterLabel}`
                                            : `视口：${chapterLabel}`
                                        : '豳风图助手'}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-white/40 hover:text-white transition-colors shrink-0 p-1"
                            aria-label="收起面板"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {suggestedQuestions.length > 0 && (
                        <div
                            key={hotspot?.id ?? `scroll-${scrollChapter}`}
                            className="px-4 pt-3 pb-1 border-b border-white/5 flex flex-wrap gap-2"
                        >
                            {suggestedQuestions.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => handleSend(q)}
                                    disabled={isLoading}
                                    className="text-left text-[10px] leading-snug px-2.5 py-1.5 rounded border border-[#c5a059]/25 text-[#c5a059]/90 bg-[#c5a059]/5 hover:bg-[#c5a059]/15 transition-colors disabled:opacity-40"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${
                                        msg.role === 'user'
                                            ? 'bg-[#c5a059] text-white'
                                            : 'bg-white/5 text-[#e8dcc4] border border-[#c5a059]/20'
                                    }`}
                                >
                                    <div className="text-sm leading-relaxed">
                                        {msg.role === 'user' ? (
                                            msg.content
                                        ) : (
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    strong: ({ ...props }) => (
                                                        <strong className="text-[#ffd700] font-bold" {...props} />
                                                    ),
                                                    ul: ({ ...props }) => (
                                                        <ul className="list-disc pl-4 space-y-1 mb-2 text-white/90" {...props} />
                                                    ),
                                                    ol: ({ ...props }) => (
                                                        <ol className="list-decimal pl-4 space-y-1 mb-2 text-white/90" {...props} />
                                                    ),
                                                    li: ({ ...props }) => <li className="marker:text-[#c5a059]" {...props} />,
                                                    h1: ({ ...props }) => (
                                                        <h3 className="text-base font-bold text-[#c5a059] mt-3 mb-2" {...props} />
                                                    ),
                                                    h2: ({ ...props }) => (
                                                        <h4 className="text-sm font-bold text-[#c5a059] mt-2 mb-1" {...props} />
                                                    ),
                                                    h3: ({ ...props }) => (
                                                        <h5 className="text-sm font-bold text-[#c5a059] mt-2 mb-1" {...props} />
                                                    ),
                                                    blockquote: ({ ...props }) => (
                                                        <blockquote
                                                            className="border-l-2 border-[#c5a059] pl-3 italic text-white/70 my-2"
                                                            {...props}
                                                        />
                                                    ),
                                                    img: ({ ...props }) => (
                                                        <span className="block my-3">
                                                            <img
                                                                {...props}
                                                                alt={props.alt || '图片'}
                                                                className="rounded-lg shadow-md border border-[#c5a059]/30 max-w-full h-auto mx-auto"
                                                                loading="lazy"
                                                            />
                                                        </span>
                                                    ),
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                    <span className="text-xs opacity-50 mt-1 block">
                                        {new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-[#c5a059]/20 rounded-lg p-3">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce" />
                                        <div
                                            className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce"
                                            style={{ animationDelay: '150ms' }}
                                        />
                                        <div
                                            className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce"
                                            style={{ animationDelay: '300ms' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-[#c5a059]/20">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={
                                    chapterLabel
                                        ? hotspot
                                            ? `关于「${chapterLabel}」的问题…`
                                            : `画卷在「${chapterLabel}」段，想问什么？`
                                        : '询问关于豳风图的问题…'
                                }
                                disabled={isLoading}
                                className="flex-1 bg-white/5 border border-[#c5a059]/30 rounded-lg px-4 py-2 text-[#e8dcc4] placeholder-white/30 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                            />
                            <button
                                onClick={() => handleSend()}
                                disabled={isLoading || !inputValue.trim()}
                                className="bg-[#c5a059] hover:bg-[#8b7355] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-[#c5a059]/40 text-xs mt-2 text-center">解读模式 · I/C 切换沉浸</p>
                    </div>
                </div>
                </>
            )}
        </>
    );
};

export default RagChat;
