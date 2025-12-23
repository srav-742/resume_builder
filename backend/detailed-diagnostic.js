// Advanced diagnostic test for Gemini API
const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function detailedDiagnostic() {
    console.log('\n🔍 DETAILED GEMINI API DIAGNOSTIC\n');
    console.log('='.repeat(60));

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY not found!');
        return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`✅ API Key: ${apiKey.substring(0, 20)}...`);
    console.log(`   Length: ${apiKey.length} characters\n`);

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try the absolute simplest model names
    const modelsToTest = [
        'gemini-pro',
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-1.5-flash-8b',
    ];

    for (const modelName of modelsToTest) {
        console.log(`\n📡 Testing: ${modelName}`);
        console.log('-'.repeat(60));

        try {
            console.log('   🔧 Initializing model...');
            const model = genAI.getGenerativeModel({ model: modelName });

            console.log('   📤 Sending minimal prompt...');
            const result = await model.generateContent("Hi");
            const response = result.response.text();

            console.log(`   ✅ SUCCESS! Model is working!`);
            console.log(`   📥 Response: ${response.substring(0, 50)}...`);
            console.log(`   🎯 THIS MODEL WORKS: ${modelName}`);

            return modelName; // Return first working model

        } catch (error) {
            console.log(`   ❌ Failed`);
            console.log(`   📋 Error details:`);
            console.log(`      Status: ${error.status || 'Unknown'}`);
            console.log(`      Message: ${error.message?.substring(0, 100) || 'No message'}`);

            // Check for specific error types
            if (error.message && error.message.includes('API key not valid')) {
                console.log(`      🚫 API KEY IS INVALID`);
            } else if (error.message && error.message.includes('API has not been used')) {
                console.log(`      🚫 API NOT ENABLED IN THIS PROJECT`);
            } else if (error.message && error.message.includes('billing')) {
                console.log(`      🚫 BILLING ISSUE - Enable billing in Cloud Console`);
            } else if (error.status === 404) {
                console.log(`      🚫 MODEL NOT AVAILABLE FOR YOUR API KEY`);
            } else if (error.status === 429) {
                console.log(`      🚫 QUOTA EXCEEDED`);
            } else if (error.status === 403) {
                console.log(`      🚫 PERMISSION DENIED - Check API restrictions`);
            }
        }
    }

    console.log('\n');
    console.log('='.repeat(60));
    console.log('❌ NO MODELS WORKING');
    console.log('='.repeat(60));
    console.log('\n🔧 POSSIBLE ISSUES:\n');
    console.log('1. API not fully enabled');
    console.log('   → Wait 2-3 minutes after enabling');
    console.log('   → Or try disabling and re-enabling\n');
    console.log('2. API key has restrictions');
    console.log('   → Go to: https://console.cloud.google.com/apis/credentials');
    console.log('   → Click on your API key');
    console.log('   → Under "API restrictions", select "Don\'t restrict key"');
    console.log('   → Save\n');
    console.log('3. Billing not enabled');
    console.log('   → https://console.cloud.google.com/billing\n');
    console.log('4. Wrong region/project');
    console.log('   → Make sure you enabled API in the SAME project as your key\n');

    return null;
}

detailedDiagnostic().catch(error => {
    console.error('\n💥 Fatal error:', error);
});
