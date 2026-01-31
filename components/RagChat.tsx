import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { generateResponse, isApiKeyConfigured } from '../services/geminiService';
import { loadKnowledgeBase, searchKnowledge, buildContext } from '../services/ragService';

const RagChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isKnowledgeLoaded, setIsKnowledgeLoaded] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 加载知识库
    useEffect(() => {
        loadKnowledgeBase().then(() => {
            setIsKnowledgeLoaded(true);
        });
    }, []);

    // 自动滚动到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 初始欢迎消息
    useEffect(() => {
        if (messages.length === 0 && isKnowledgeLoaded) {
            const welcomeMessage: Message = {
                id: 'welcome',
                role: 'assistant',
                content: '您好！我是豳风图智能导览助手。您可以向我询问关于《豳风图》的历史背景、诗经解读、农事文化等问题。',
                timestamp: Date.now(),
            };
            setMessages([welcomeMessage]);
        }
    }, [isKnowledgeLoaded]);

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        // 检查 API Key
        if (!isApiKeyConfigured()) {
            alert('请先在 .env.local 文件中配置 VITE_GEMINI_API_KEY');
            return;
        }

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: inputValue.trim(),
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // 从知识库检索相关内容
            const relevantEntries = searchKnowledge(userMessage.content, 3);
            const context = buildContext(relevantEntries);

            // 调用 Gemini API
            const response = await generateResponse(userMessage.content, { context });

            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: response,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('发送消息失败:', error);
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: '抱歉，发生了错误，请稍后再试。',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
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

    return (
        <>
            {/* 浮动聊天按钮 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-10 right-10 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8b7355] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen ? 'rotate-90' : ''
                    }`}
                aria-label="打开聊天助手"
            >
                {isOpen ? (
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>

            {/* 聊天对话框 */}
            {isOpen && (
                <div className="fixed bottom-32 right-10 z-50 w-96 h-[600px] glass-panel flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                    {/* 头部 */}
                    <div className="flex items-center justify-between p-4 border-b border-[#c5a059]/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8b7355] flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-[#e8dcc4] font-bold text-sm tracking-wider">智能导览</h3>
                                <p className="text-[#c5a059]/60 text-xs">豳风图助手</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/40 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* 消息列表 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
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
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="text-[#ffd700] font-bold" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-white/90" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-white/90" {...props} />,
                                                    li: ({ node, ...props }) => <li className="marker:text-[#c5a059]" {...props} />,
                                                    h1: ({ node, ...props }) => <h3 className="text-base font-bold text-[#c5a059] mt-3 mb-2" {...props} />,
                                                    h2: ({ node, ...props }) => <h4 className="text-sm font-bold text-[#c5a059] mt-2 mb-1" {...props} />,
                                                    h3: ({ node, ...props }) => <h5 className="text-sm font-bold text-[#c5a059] mt-2 mb-1" {...props} />,
                                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-[#c5a059] pl-3 italic text-white/70 my-2" {...props} />,
                                                    img: ({ node, ...props }) => (
                                                        <span className="block my-3">
                                                            <img
                                                                {...props}
                                                                alt={props.alt || '图片'}
                                                                className="rounded-lg shadow-md border border-[#c5a059]/30 max-w-full h-auto mx-auto hover:scale-105 transition-transform duration-300"
                                                                loading="lazy"
                                                            />
                                                            {props.alt && props.alt !== '图片' && (
                                                                <span className="block text-center text-xs text-[#c5a059]/60 mt-1 italic">{props.alt}</span>
                                                            )}
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
                                        <div className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* 输入框 */}
                    <div className="p-4 border-t border-[#c5a059]/20">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="询问关于豳风图的问题..."
                                disabled={isLoading}
                                className="flex-1 bg-white/5 border border-[#c5a059]/30 rounded-lg px-4 py-2 text-[#e8dcc4] placeholder-white/30 focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !inputValue.trim()}
                                className="bg-[#c5a059] hover:bg-[#8b7355] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-[#c5a059]/40 text-xs mt-2 text-center">
                            按 Enter 发送 · Shift + Enter 换行
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default RagChat;
