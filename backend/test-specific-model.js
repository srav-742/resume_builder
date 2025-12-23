const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModel() {
    const modelName = "gemini-2.5-flash-lite";
    console.log(`\n🔄 Testing specific model: ${modelName}`);

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found!');
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = "Reply with 'TEST SUCCESSFUL' only";

        console.log('   📤 Sending prompt...');
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        console.log(`   ✅ SUCCESS!`);
        console.log(`   📥 Response: ${response.trim()}`);
    } catch (error) {
        console.log(`   ❌ FAILED`);
        console.log(`   → Status: ${error.status || 'Unknown'}`);
        console.log(`   → Message: ${error.message}`);
    }
}

testModel();
