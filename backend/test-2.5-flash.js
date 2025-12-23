const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModel() {
    const modelName = "gemini-2.5-flash";
    console.log(`\n🔄 Testing specific model: ${modelName}`);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hi");
        console.log(`   ✅ SUCCESS: ${result.response.text().trim()}`);
    } catch (e) {
        console.log(`   ❌ FAILED: ${e.message}`);
    }
}

testModel();
