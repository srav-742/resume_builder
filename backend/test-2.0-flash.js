// Test gemini-2.0-flash model
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testModel() {
    console.log('🧪 Testing gemini-2.0-flash model...\n');

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log('✅ Model initialized: gemini-2.0-flash\n');

        console.log('📝 Sending test prompt...');
        const result = await model.generateContent("Say 'Hello World' and confirm you are gemini-2.0-flash working correctly.");
        const response = result.response;
        const text = response.text();

        console.log('\n✅ API Response:');
        console.log('─'.repeat(60));
        console.log(text);
        console.log('─'.repeat(60));
        console.log('\n🎉 gemini-2.0-flash is WORKING PERFECTLY!');
        console.log('✅ This model WILL work for career counselling!\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.status) console.error('Status:', error.status);
    }
}

testModel();
