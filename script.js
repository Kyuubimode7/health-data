// 1. Initialize the Map
const map = L.map('map').setView([19.0760, 72.8777], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Supabase Connection Details
const SB_URL = "YOUR_PROJECT_URL";
const SB_KEY = "YOUR_ANON_KEY";

// 3. The Function to get data
async function loadData() {
    const response = await fetch(`${SB_URL}/rest/v1/urban_health_database?select=*`, {
        headers: {
            "apikey": SB_KEY,
            "Authorization": `Bearer ${SB_KEY}`
        }
    });

    const data = await response.json();

    data.forEach(item => {
        if (item.geom) {
            L.geoJSON(item.geom).addTo(map);
        }
    });
}

// Run the function
loadData();
