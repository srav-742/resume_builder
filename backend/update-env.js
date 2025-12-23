// Script to update .env file with the correct Firebase private key
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

// The complete private key (with literal \n)
const correctPrivateKey = `"-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2B/lhhO3fE8Q/\\nkKIFSF1Oh73CILCOVuadzC/BIF+/qrHxN+jnZfXYhxERMeurCA0a0Xp8MnreFRiv\\nJfRvkhHV24zvZwBdLrbjfZ+hupcK2y8TsfrCwxrOaqTLVwqGmtUjcXI+gxrVA1Gz\\nbY2EBLD/qMb+KQXTDxzNpH4DrZo7jGiGaadg2RUP1Zk0S7glx0pIzfALLH6uE1W5\\noXsTSb0i8K77boJQB5zzydUg417i8lH/BTax7kW4dGUwB75X4FvIO4oxd9l4NtOQ\\n8Rd5Z3ByeQczDkLtSksGV2QLCBhyfP9pQatQ70VimJ0bUPzIb/Z3W3j9hob9GWEo\\n+6DdwrN9AgMBAAECggEAJyCJqzuOgd/W1C77lJUccU/eKwcpzD7DrXGBZkrWKfW/\\n7/CroGmbMaK+uWp4lLfTUUtrv5x+KpRwTN2ksAK+0LAzmBYUzvLGnxmWoYXhB5Vb\\nhilAlHKppWro50hbW9mWLNsqymMV9mmTOzU2MQVtIlceBu28ccSS1WUhLRs4xsmn\\nSzzNYMYgH2xLlZowC/qgMs84funpD097u1cxbuEYc9T3+9dfnCIB55ugt1s7z1f6\\nvciP/WLhl+yKtUkXzHdHXToOg1KPQlKu8rVIBqpcbibkMZrIYQro+fXNEBBJ/RgA\\njLalaJjPkm6AVYmU5wr7zVw/iUWlBljRvl01T4WGxQKBgQDtLNcnExiIIqOsa0vi\\nkYbWcYCGtu2UfK64v4Mgnz6iUNoOuhBLvMwWi/VjE7GeSMoCGox1VVXhj+DPMz4q\\nvmsBCFgdNxTqeN5HNgCTup1oN6BTKAv3CG4W09G4mTBaafcjIcz+EDp0un8IJlMC\\nhvEWW0AdW4zgWy+wWzudZNgv2wKBgQDEeqnE8zTJFi9qvhmOHuXbotR3TS/1h1vM\\ncpGzOdzZWG6fORMiGnaRVZxuXN1fgz7TnPTOjlrN1jcJ4OCsMfsulJyAhmyzMWUQ\\ne4A/fUBH3JQTmsreqRpRcJFtVSQ7CXMqymxn6070G3pD7IHG2hOMvrdM6+YXcwMA\\n8T4MN+WVhwKBgEjOWQWfsQopSAEnttXIQpIVqZSxFuFcHO6Nq50aBUoic63NpC77\\nt9K8CAnwA7hJM+nNaIykM4bYefRhEJZiecqJWzMss3j+vY0yoJ64zJUvbkHYq0Oc\\nDN9pCpoWPGek276nI5xiMu+eSFyiFx1RezSXsmjQr8A3fb4vY29/g3W9AoGBAJE2\\nq4Thz3CTkgYNbCvLEE2tYeSuyrRoD2PihWb2bBDDODc74rVA48L0iEJVJlQyV1vl\\nVFXZhqk9Gr6VUthRtHiv459mOq6R4kU1UgsakkjKcTKwJCI+zzHDxegNllJ/4HuO\\n0mJX2qm2KT5MbXo/sVVDm4whiZRpL54hrp8vLOK/AoGBALqxt//CPiHMjScGDdA0\\nuE0bz++5OHmLuH4qYdqeRa1+fwhvOuEJ/kZLIhknJmtLTooIfsJ9EZO/8rZLHaG2\\njTbK1amhJZnJxBEBdZGIC0bjhEX3v1X5PxfueEp3D5bZTRrT4AzwWDBZAsAhuH3d\\nNARXndc763R49UzFcQZCTv4f\\n-----END PRIVATE KEY-----\\n"`;

console.log('📝 Reading current .env file...\n');

if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found at:', envPath);
    console.log('Please create a .env file first.\n');
    process.exit(1);
}

let envContent = fs.readFileSync(envPath, 'utf8');
console.log('Current .env content:');
console.log('═══════════════════════════════════════════');
console.log(envContent);
console.log('═══════════════════════════════════════════\n');

// Update or add FIREBASE_PRIVATE_KEY
const lines = envContent.split('\n');
let keyFound = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('FIREBASE_PRIVATE_KEY=')) {
        console.log(`✏️  Found FIREBASE_PRIVATE_KEY on line ${i + 1}, updating...\n`);
        lines[i] = `FIREBASE_PRIVATE_KEY=${correctPrivateKey}`;
        keyFound = true;
        break;
    }
}

if (!keyFound) {
    console.log('➕ FIREBASE_PRIVATE_KEY not found, adding it...\n');
    lines.push(`FIREBASE_PRIVATE_KEY=${correctPrivateKey}`);
}

const newEnvContent = lines.join('\n');

// Write back to file
fs.writeFileSync(envPath, newEnvContent, 'utf8');

console.log('✅ .env file updated successfully!\n');
console.log('New .env content:');
console.log('═══════════════════════════════════════════');
console.log(newEnvContent);
console.log('═══════════════════════════════════════════\n');

console.log('🎉 Done! Now run: node server.js\n');
