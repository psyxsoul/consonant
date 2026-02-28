const fetch = require('node-fetch');

async function debug_features() {
    console.log("-> Authenticating via API directly using fetch...");
    const res = await fetch("https://consonant-backend-t1g5.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@synveritas.app", password: "password123" })
    });
    
    // Fallback if Render fails:
    let data;
    if (!res.ok) {
       console.log("-> Falling back to EC2 API IP...");
       const ec2Res = await fetch("http://16.112.109.183:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "admin@synveritas.app", password: "password123" })
       }).catch(e => console.log(e.message));
       if (ec2Res) data = await ec2Res.json();
    } else {
       data = await res.json();
    }
    
    if (data && data.user) {
        console.log("Logged In Features:", JSON.stringify(data.user.features, null, 2));
        console.log("Role:", data.user.role);
    } else {
        console.log("Auth Failed.");
        console.log(data);
    }
}
debug_features();
