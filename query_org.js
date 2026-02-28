const fetch = require('node-fetch');

async function check() {
    // 1. Get super_admin token
    let res = await fetch('https://consonant.synveritas.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@synveritas.app', password: 'password123' })
    });
    let data = await res.json();
    console.log("Logged in User:", JSON.stringify(data.user, null, 2));

    if (data.token) {
        // 2. Fetch all orgs to see license features
        let orgRes = await fetch('https://consonant.synveritas.app/api/orgs', {
            headers: { 'Authorization': `Bearer ${data.token}` }
        });
        let orgData = await orgRes.json();
        const myOrg = orgData.find(o => o.slug === 'synveritas');
        console.log("\nMy Org Details:", JSON.stringify(myOrg, null, 2));
    }
}
check();
