const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const newApiKey = 'AIzaSyAfZnueJjObVmxb1fs1qghwHDSk7E4Rz-M';

console.log('📝 Updating GEMINI_API_KEY in .env...');

if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
let keyUpdated = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('GEMINI_API_KEY=')) {
        lines[i] = `GEMINI_API_KEY=${newApiKey}`;
        keyUpdated = true;
        break;
    }
}

if (!keyUpdated) {
    lines.push(`GEMINI_API_KEY=${newApiKey}`);
}

fs.writeFileSync(envPath, lines.join('\n'), 'utf8');
console.log('✅ GEMINI_API_KEY updated successfully!');
