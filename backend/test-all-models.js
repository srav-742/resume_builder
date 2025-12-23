// Test with ALL possible Gemini model names
const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAllModels() {
    console.log('\n🧪 TESTING ALL GEMINI MODEL NAMES\n');
    console.log('='.repeat(60));

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found!');
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`✅ API Key: ${apiKey.substring(0, 15)}...\n`);

    // All possible model names to try
    const modelsToTest = [
        'gemini-pro',
        'gemini-1.0-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash-exp',
        'gemini-exp-1206',
        'models/gemini-pro',
        'models/gemini-1.5-flash'
    ];

    const genAI = new GoogleGenerativeAI(apiKey);
    let successCount = 0;

    for (const modelName of modelsToTest) {
        console.log(`\n🔄 Testing: ${modelName}`);
        console.log('-'.repeat(60));

        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = "Reply with 'OK' only";

            console.log('   📤 Sending prompt...');
            const result = await model.generateContent(prompt);
            const response = result.response.text();

            console.log(`   ✅ SUCCESS!`);
            console.log(`   📥 Response: ${response.trim()}`);
            console.log(`   🎯 WORKING MODEL: ${modelName}`);
            successCount++;

        } catch (error) {
            console.log(`   ❌ FAILED`);

            if (error.status === 404) {
                console.log(`   → 404: Model not found`);
            } else if (error.status === 429) {
                console.log(`   → 429: Quota exceeded`);
            } else if (error.status === 403) {
                console.log(`   → 403: Permission denied - API not enabled?`);
            } else if (error.status === 400) {
                console.log(`   → 400: Bad request - ${error.message}`);
            } else {
                console.log(`   → ${error.status || 'Unknown'}: ${error.message}`);
            }
        }
    }

    console.log('\n');
    console.log('='.repeat(60));
    console.log('📊 FINAL RESULTS');
    console.log('='.repeat(60));
    console.log(`Total models tested: ${modelsToTest.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${modelsToTest.length - successCount}`);

    if (successCount === 0) {
        console.log('\n❌ NO MODELS ARE WORKING!');
        console.log('\n🔧 TROUBLESHOOTING STEPS:\n');
        console.log('1. Enable Generative Language API:');
        console.log('   → https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
        console.log('   → Click "ENABLE"\n');
        console.log('2. Check API key restrictions:');
        console.log('   → https://console.cloud.google.com/apis/credentials');
        console.log('   → Make sure key has no IP/API restrictions\n');
        console.log('3. Try creating key in a NEW project:');
        console.log('   → https://aistudio.google.com/app/apikey');
        console.log('   → Select "Create API key in new project"\n');
    } else {
        console.log('\n✅ SUCCESS! At least one model is working!');
    }

    console.log('\n');
}

testAllModels().catch(error => {
    console.error('\n💥 Fatal error:', error);
});
