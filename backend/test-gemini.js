// Quick test script to verify Gemini API works
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiAPI() {
    console.log('🧪 Testing Gemini API...\n');

    // Check API key
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found in .env');
        return;
    }
    console.log('✅ API Key found:', process.env.GEMINI_API_KEY.substring(0, 20) + '...');

    try {
        // Initialize
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        console.log('✅ Model initialized: gemini-1.5-flash-latest\n');

        // Test generation
        console.log('📝 Sending test prompt...');
        const result = await model.generateContent("Say Hello World and confirm you are working.");
        const response = result.response;
        const text = response.text();

        console.log('\n✅ API Response:');
        console.log('─'.repeat(50));
        console.log(text);
        console.log('─'.repeat(50));
        console.log('\n🎉 Gemini API is working perfectly!');

    } catch (error) {
        console.error('\n❌ Error testing Gemini API:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.status) {
            console.error('HTTP Status:', error.status);
        }
        console.error('\nFull error:', error);
    }
}

testGeminiAPI();
