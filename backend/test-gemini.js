// Test Gemini API
const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log('========== GEMINI API TEST ==========');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('API Key (first 10 chars):', process.env.GEMINI_API_KEY?.substring(0, 10));
    console.log('=====================================\n');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found in .env file');
        process.exit(1);
    }

    const modelsToTest = [
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro'
    ];

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    for (const modelName of modelsToTest) {
        try {
            console.log(`\n🔄 Testing model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent('Say hello in one sentence.');
            const text = result.response.text();

            console.log(`✅ SUCCESS with ${modelName}`);
            console.log(`Response: ${text.substring(0, 100)}...`);
            console.log(`Response length: ${text.length} characters`);

            // If successful, we can stop testing
            console.log(`\n✅ GEMINI API IS WORKING! Use model: ${modelName}`);
            break;

        } catch (error) {
            console.error(`❌ FAILED with ${modelName}`);
            console.error(`Error message: ${error.message}`);

            if (error.status) {
                console.error(`HTTP Status: ${error.status}`);
            }

            if (error.errorDetails) {
                console.error(`Error details:`, error.errorDetails);
            }
        }
    }

    console.log('\n========== TEST COMPLETE ==========');
}

testGemini().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
