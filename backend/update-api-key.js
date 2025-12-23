// Script to update GEMINI_API_KEY in .env file
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const newApiKey = 'AIzaSyBMddt0z2nyk8zPtsfarE1ugfqyodO8sbc';

try {
    console.log('📝 Updating GEMINI_API_KEY in .env file...\n');

    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
        console.log('✅ Found existing .env file');
    }

    const lines = envContent.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('GEMINI_API_KEY=')) {
            const oldKey = lines[i].split('=')[1];
            lines[i] = `GEMINI_API_KEY=${newApiKey}`;
            updated = true;
            console.log(`✅ Replaced: ${oldKey?.substring(0, 15)}...`);
            console.log(`   New key: ${newApiKey.substring(0, 15)}...`);
            break;
        }
    }

    if (!updated) {
        lines.push(`GEMINI_API_KEY=${newApiKey}`);
        console.log('✅ Added new GEMINI_API_KEY');
    }

    fs.writeFileSync(envPath, lines.join('\n'));

    console.log('\n✨ API Key updated! Testing now...\n');

} catch (error) {
    console.error('❌ Error:', error.message);
}
