// 测试 Gemini API 调用 (Stream 模式)
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

// 优先读取 .env.local，然后是 .env
const envLocalPath = path.join(process.cwd(), '.env.local');
const envPath = path.join(process.cwd(), '.env');
let API_KEY = '';

try {
    const envContent = fs.readFileSync(envLocalPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
    if (match) {
        API_KEY = match[1].trim();
        console.log('✅ 从 .env.local 读取 API Key');
    }
} catch (error) {
    try {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
        if (match) {
            API_KEY = match[1].trim();
            console.log('✅ 从 .env 读取 API Key');
        }
    } catch (error2) {
        console.error('❌ 无法读取 .env 或 .env.local 文件');
    }
}

console.log('🔑 API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : '未配置');

if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.error('\n❌ 请先在 .env.local 文件中配置有效的 VITE_GEMINI_API_KEY');
    process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

async function testAPI() {
    try {
        console.log('\n📡 正在调用 Gemini API (Stream)...\n');

        const result = await genAI.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: '请详细解释"七月流火"的含义，以及它在豳风图中的体现，不少于300字。',
            config: {
                systemInstruction: '你是豳风图数字长卷平台的智能导览助手。回答要详实、准确，不要过于简略。',
                temperature: 0.7,
                maxOutputTokens: 2000,
            },
        });

        let fullText = '';
        process.stdout.write('📝 AI 回复：\n');

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            process.stdout.write(chunkText);
            fullText += chunkText;
        }

        console.log('\n\n----------------------------------------');
        console.log(`📏 总响应长度: ${fullText.length} 字符`);

        if (fullText.length < 200) {
            console.warn('\n⚠️ 警告：响应内容仍然过短！可能是 maxOutputTokens 限制或模型问题。');
        } else {
            console.log('\n✨ 测试通过！流式生成正常且长度符合预期。');
        }

    } catch (error) {
        console.error('\n❌ API 调用失败：', error.message);
        if (error.status === 400) {
            console.error('\n💡 提示：API Key 可能无效，请检查是否正确配置。');
        }
        process.exit(1);
    }
}

testAPI();
