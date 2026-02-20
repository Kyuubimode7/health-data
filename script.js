

// 1. Initialize the Map

const map = L.map('map').setView([19.0760, 72.8777], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Supabase Connection Details (Replace these with your keys!)
const SB_URL = "https://lvskapwvphgbleqxyzvd.supabase.co"; 
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2c2thcHd2cGhnYmxlcXh5enZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMjQ4MzAsImV4cCI6MjA4NjcwMDgzMH0.NMSsGYttv50Qk-M6dQQw_OwBC2JyqZw9SDwwc7zgAKE";

async function loadDelaunay() {
    const query = "?select=*&order=created_at.desc&limit=1";
    
    try {
        const response = await fetch(`${SB_URL}/rest/v1/urban_health_database${query}`, {
            headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` }
        });
        const data = await response.json();

        if (data && data.length > 0) {
            const row = data[0];
            
            // 1. Precise path to your coordinates based on your JSON snippet
            // row.geom -> FeatureCollection
            // features[0] -> The "onion" feature
            // geometry -> The MultiPoint
            const rawCoords = row.geom.features[0].geometry.coordinates;

            console.log("Found Raw Coordinates:", rawCoords);

            // 2. Clean coordinates for D3 
            // We take only [index 0, index 1] to ignore the 0.0 elevation
            const cleanPoints = rawCoords.map(p => [p[0], p[1]]);

            // 3. Compute Triangulation
            const delaunay = d3.Delaunay.from(cleanPoints);
            const triangles = delaunay.trianglePolygons();
            
            // 4. Draw on Leaflet
            for (const poly of triangles) {
                // Swap [lng, lat] to [lat, lng] for Leaflet
                const latLngs = poly.map(p => [p[1], p[0]]);
                
                L.polygon(latLngs, {
                    color: "#2c3e50", 
                    weight: 1.5, 
                    fillColor: "#3498db",
                    fillOpacity: 0.3
                }).addTo(map);
            }

            // 5. Center map on Mumbai area from your coordinates
            map.setView([18.97, 72.82], 15);
            
        }
    } catch (err) {
        console.error("Layout Error:", err);
    }
}

loadDelaunay();
