// List available Gemini models
const https = require('https');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('📋 Available Gemini Models:\n');
        const result = JSON.parse(data);

        if (result.models) {
            result.models.forEach(model => {
                console.log(`✅ ${model.name}`);
                if (model.supportedGenerationMethods) {
                    console.log(`   Methods: ${model.supportedGenerationMethods.join(', ')}`);
                }
                console.log('');
            });
        } else {
            console.error('Error:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err);
});
