// Quick test to verify gemini-2.5-flash-lite works
const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function quickTest() {
    console.log('========== QUICK GEMINI TEST ==========');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    try {
        const result = await model.generateContent('Write a short career analysis summary for a software developer.');
        const text = result.response.text();
        console.log('✅ SUCCESS!');
        console.log('Response preview:', text.substring(0, 200));
        console.log('Full response length:', text.length, 'characters');
        console.log('\n🎉 AI Analysis will work correctly now!');
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Status:', error.status);
    }
}

quickTest();
