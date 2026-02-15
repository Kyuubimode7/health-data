// 1. Initialize the Map
const map = L.map('map').setView([19.0760, 72.8777], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Supabase Connection Details (Replace these with your keys!)
const SB_URL = "https://lvskapwvphgbleqxyzvd.supabase.co"; 
const SB_KEY = "sb_publishable__dFLLpych1hftXXgm2V7gQ__tqaWpy9";

async function loadData() {
    console.log("Starting fetch request to Supabase...");

    try {
        const response = await fetch(`${SB_URL}/rest/v1/urban_health_database?select=*`, {
            headers: {
                "apikey": SB_KEY,
                "Authorization": `Bearer ${SB_KEY}`
            }
        });

        // Check if the server responded with an error (like 401 or 404)
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Network Error: ${response.status} - ${errorText}`);
            return;
        }

        const data = await response.json();
        console.log("Data successfully received from Supabase:", data);

        if (data.length === 0) {
            console.warn("The database returned 0 rows. Is your table empty?");
            return;
        }

        // 3. Add data to map
        data.forEach((item, index) => {
            if (item.geom) {
                console.log(`Rendering item ${index}:`, item.name || "Unnamed");
                L.geoJSON(item.geom).addTo(map);
            } else {
                console.warn(`Item ${index} is missing geometry data ('geom' column).`);
            }
        });

    } catch (err) {
        // This catches errors like a typo in the URL or no internet connection
        console.error("Critical Script Error:", err);
    }
}

loadData();
