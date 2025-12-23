import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCiZ5e_adTah6tPV_PKy6lwCUareAukKpo";

console.log("🔍 Testing Gemini API Key...\n");

// Test different model versions
const modelsToTest = [
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-2.5-flash-lite"
];

async function testModel(modelName) {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent("Say 'Hello' in one word");
        const response = await result.response;
        const text = response.text();

        console.log(`✅ ${modelName}: SUCCESS`);
        console.log(`   Response: ${text.substring(0, 50)}...\n`);
        return true;
    } catch (error) {
        console.log(`❌ ${modelName}: FAILED`);
        console.log(`   Error: ${error.message}\n`);
        return false;
    }
}

async function runTests() {
    console.log("Testing various Gemini models...\n");
    console.log("=".repeat(60) + "\n");

    const results = [];

    for (const modelName of modelsToTest) {
        const success = await testModel(modelName);
        results.push({ model: modelName, success });
    }

    console.log("=".repeat(60));
    console.log("\n📊 SUMMARY:\n");

    const working = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (working.length > 0) {
        console.log("✅ Working models:");
        working.forEach(r => console.log(`   - ${r.model}`));
        console.log(`\n🎯 RECOMMENDED MODEL: ${working[0].model}`);
    } else {
        console.log("❌ No models are working. Possible issues:");
        console.log("   - API key is invalid or expired");
        console.log("   - API key doesn't have Generative Language API enabled");
        console.log("   - Quota exceeded");
        console.log("   - Billing not enabled on the Google Cloud project");
    }

    if (failed.length > 0) {
        console.log("\n❌ Failed models:");
        failed.forEach(r => console.log(`   - ${r.model}`));
    }

    console.log("\n" + "=".repeat(60));
}

runTests().catch(console.error);
