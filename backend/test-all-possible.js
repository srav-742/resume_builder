const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAll() {
    console.log('--- Testing API Key across multiple models ---');
    const models = [
        "gemini-2.0-flash-exp",
        "gemini-2.5-flash-lite",
        "gemini-1.5-flash",
        "gemini-pro"
    ];

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found!');
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    for (const m of models) {
        console.log(`\n🔄 Testing ${m}:`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hi");
            console.log(`   ✅ SUCCESS: ${result.response.text().trim().substring(0, 20)}`);
        } catch (e) {
            console.log(`   ❌ FAILED:`);
            console.log(e.message);
        }
    }
}

testAll();
