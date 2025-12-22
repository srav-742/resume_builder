// Test direct REST API call to Gemini (bypassing SDK)
const https = require('https');
require('dotenv').config();

async function testGeminiREST() {
    console.log('🧪 Testing Gemini REST API directly...\n');

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        console.error('❌ GEMINI_API_KEY not found');
        return;
    }

    console.log('✅ API Key found:', API_KEY.substring(0, 20) + '...\n');

    // Try v1 API (NOT v1beta)
    const MODEL = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

    const data = JSON.stringify({
        contents: [{
            parts: [{
                text: "Say 'Hello World' and confirm you are working."
            }]
        }]
    });

    console.log('📝 Calling v1 API with model:', MODEL);
    console.log('URL:', `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent`);
    console.log('');

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const urlObj = new URL(url);

    const req = https.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            console.log('Response status:', res.statusCode);
            console.log('');

            if (res.statusCode === 200) {
                const result = JSON.parse(responseData);
                const text = result.candidates[0].content.parts[0].text;
                console.log('✅ API Response:');
                console.log('─'.repeat(50));
                console.log(text);
                console.log('─'.repeat(50));
                console.log('\n🎉 Gemini v1 REST API is working!');
                console.log('✅ We can use this instead of the SDK!\n');
            } else {
                console.error('❌ Error response:');
                console.error(responseData);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Request error:', error);
    });

    req.write(data);
    req.end();
}

testGeminiREST();
