
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: process.env.DASHSCOPE_BASE_URL,
});

async function test() {
  console.log('Testing DashScope API...');
  console.log('API Key:', process.env.DASHSCOPE_API_KEY ? process.env.DASHSCOPE_API_KEY.slice(0, 8) + '...' : 'Not Set');
  console.log('Base URL:', process.env.DASHSCOPE_BASE_URL);

  try {
    const completion = await client.chat.completions.create({
      model: 'qwen-plus', // 尝试使用 qwen-plus (Qwen 2.5/3 level quality)
      messages: [{ role: 'user', content: 'Hello' }],
    });
    console.log('Success!', completion.choices[0].message);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
