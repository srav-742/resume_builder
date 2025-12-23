const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const config = dotenv.parse(envContent);

console.log('--- Diagnosis of ALL potential keys ---');
Object.keys(config).forEach(key => {
    if (key.includes('KEY') || key.includes('SECRET') || key.includes('API')) {
        const val = config[key];
        console.log(`${key}: ${val ? val.substring(0, 10) + '...' + val.substring(val.length - 5) : 'MISSING'}`);
    }
});
console.log('--- End of Diagnosis ---');
