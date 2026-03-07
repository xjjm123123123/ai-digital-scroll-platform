
import 'dotenv/config';

// 读取环境变量
// 注意：在 Node.js 环境下需要使用 dotenv 加载 .env 文件
// 这里的代码假设你已经安装了 dotenv 并在 package.json 中配置了 type: module

const API_KEY = process.env.VITE_DEEPSEEK_API_KEY;

if (!API_KEY) {
    console.error('❌ VITE_DEEPSEEK_API_KEY 未配置，请在 .env 文件中添加');
    process.exit(1);
}

console.log('正在测试 DeepSeek API 连接...');
console.log('使用 Key:', API_KEY.substring(0, 8) + '...');

async function testDeepSeek() {
    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: '你好，请用一句话介绍自己。' }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ DeepSeek API 连接成功！');
        console.log('回复内容:', data.choices[0].message.content);

    } catch (error) {
        console.error('❌ 测试失败:', error);
    }
}

testDeepSeek();
