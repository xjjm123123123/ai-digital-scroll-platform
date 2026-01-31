// 测试 Gemini API 基础调用 (无 Config)
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

const envLocalPath = path.join(process.cwd(), '.env.local');
let API_KEY = '';

try {
    const envContent = fs.readFileSync(envLocalPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
    if (match) API_KEY = match[1].trim();
} catch (e) { }

if (!API_KEY) {
    console.error('API Key not found');
    process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

async function testAPI() {
    try {
        console.log('Testing gemini-2.5-flash without config...');

        // 最简单的调用，不带任何 config
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: '请详细解释"七月流火"的含义，不少于300字。',
        });

        console.log(`Length: ${response.text.length}`);
        console.log('Response:');
        console.log(response.text);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI();
