// This script formats the Firebase private key for the .env file

const rawKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2B/lhhO3fE8Q/
kKIFSF1Oh73CILCOVuadzC/BIF+/qrHxN+jnZfXYhxERMeurCA0a0Xp8MnreFRiv
JfRvkhHV24zvZwBdLrbjfZ+hupcK2y8TsfrCwxrOaqTLVwqGmtUjcXI+gxrVA1Gz
bY2EBLD/qMb+KQXTDxzNpH4DrZo7jGiGaadg2RUP1Zk0S7glx0pIzfALLH6uE1W5
oXsTSb0i8K77boJQB5zzydUg417i8lH/BTax7kW4dGUwB75X4FvIO4oxd9l4NtOQ
8Rd5Z3ByeQczDkLtSksGV2QLCBhyfP9pQatQ70VimJ0bUPzIb/Z3W3j9hob9GWEo
+6DdwrN9AgMBAAECggEAJyCJqzuOgd/W1C77lJUccU/eKwcpzD7DrXGBZkrWKfW/
7/CroGmbMaK+uWp4lLfTUUtrv5x+KpRwTN2ksAK+0LAzmBYUzvLGnxmWoYXhB5Vb
hilAlHKppWro50hbW9mWLNsqymMV9mmTOzU2MQVtIlceBu28ccSS1WUhLRs4xsmn
SzzNYMYgH2xLlZowC/qgMs84funpD097u1cxbuEYc9T3+9dfnCIB55ugt1s7z1f6
vciP/WLhl+yKtUkXzHdHXToOg1KPQlKu8rVIBqpcbibkMZrIYQro+fXNEBBJ/RgA
jLalaJjPkm6AVYmU5wr7zVw/iUWlBljRvl01T4WGxQKBgQDtLNcnExiIIqOsa0vi
kYbWcYCGtu2UfK64v4Mgnz6iUNoOuhBLvMwWi/VjE7GeSMoCGox1VVXhj+DPMz4q
vmsBCFgdNxTqeN5HNgCTup1oN6BTKAv3CG4W09G4mTBaafcjIcz+EDp0un8IJlMC
hvEWW0AdW4zgWy+wWzudZNgv2wKBgQDEeqnE8zTJFi9qvhmOHuXbotR3TS/1h1vM
cpGzOdzZWG6fORMiGnaRVZxuXN1fgz7TnPTOjlrN1jcJ4OCsMfsulJyAhmyzMWUQ
e4A/fUBH3JQTmsreqRpRcJFtVSQ7CXMqymxn6070G3pD7IHG2hOMvrdM6+YXcwMA
8T4MN+WVhwKBgEjOWQWfsQopSAEnttXIQpIVqZSxFuFcHO6Nq50aBUoic63NpC77
t9K8CAnwA7hJM+nNaIykM4bYefRhEJZiecqJWzMss3j+vY0yoJ64zJUvbkHYq0Oc
DN9pCpoWPGek276nI5xiMu+eSFyiFx1RezSXsmjQr8A3fb4vY29/g3W9AoGBAJE2
q4Thz3CTkgYNbCvLEE2tYeSuyrRoD2PihWb2bBDDODc74rVA48L0iEJVJlQyV1vl
VFXZhqk9Gr6VUthRtHiv459mOq6R4kU1UgsakkjKcTKwJCI+zzHDxegNllJ/4HuO
0mJX2qm2KT5MbXo/sVVDm4whiZRpL54hrp8vLOK/AoGBALqxt//CPiHMjScGDdA0
uE0bz++5OHmLuH4qYdqeRa1+fwhvOuEJ/kZLIhknJmtLTooIfsJ9EZO/8rZLHaG2
jTbK1amhJZnJxBEBdZGIC0bjhEX3v1X5PxfueEp3D5bZTRrT4AzwWDBZAsAhuH3d
NARXndc763R49UzFcQZCTv4f
-----END PRIVATE KEY-----`;

// Convert actual newlines to literal \n
const formattedKey = rawKey.replace(/\n/g, '\\n');

console.log('\n✅ Your formatted Firebase private key for .env file:\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log('Copy the line below and paste it into your .env file:');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log(`FIREBASE_PRIVATE_KEY="${formattedKey}"`);
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('\n📝 Instructions:');
console.log('1. Open your .env file');
console.log('2. Find the line that starts with FIREBASE_PRIVATE_KEY=');
console.log('3. Replace the entire line with the line shown above');
console.log('4. Save the file');
console.log('5. Restart your server with: node server.js\n');
