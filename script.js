// Smart Waste Bin IoT System JavaScript

// Navigation between sections
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.classList.remove('active'));

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Initialize map if routes section is shown
    if (sectionId === 'routes') {
        initializeMap();
    }
}

// IoT Sensor Simulation
let sensorInterval;

function startSensorSimulation() {
    sensorInterval = setInterval(() => {
        const fillLevel = Math.floor(Math.random() * 100);
        const wasteLevel = document.getElementById('wasteLevel');
        const fillPercent = document.getElementById('fillPercent');

        wasteLevel.style.height = fillLevel + '%';
        fillPercent.textContent = fillLevel + '%';

        // Change color based on fill level
        if (fillLevel > 80) {
            wasteLevel.style.background = 'linear-gradient(to top, #e74c3c, #c0392b)';
        } else if (fillLevel > 50) {
            wasteLevel.style.background = 'linear-gradient(to top, #f39c12, #e67e22)';
        } else {
            wasteLevel.style.background = 'linear-gradient(to top, #27ae60, #2ecc71)';
        }
    }, 2000);
}

// Connection status simulation
function simulateConnection() {
    const statusIndicator = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');

    setInterval(() => {
        const isConnected = Math.random() > 0.1; // 90% uptime
        if (isConnected) {
            statusIndicator.style.color = '#27ae60';
            statusText.textContent = 'Connected';
        } else {
            statusIndicator.style.color = '#e74c3c';
            statusText.textContent = 'Disconnected';
        }
    }, 5000);
}

// Map initialization for route planning
let map;
let markers = [];
let routeLayer;

function initializeMap() {
    if (map) return; // Don't reinitialize

    // Initialize map centered on Manila, Philippines
    map = L.map('map').setView([14.5995, 120.9842], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add sample bin locations in the Philippines
    const binLocations = [
        { id: 1, lat: 14.5829, lng: 120.9772, name: 'Luneta Park', fill: 30 },
        { id: 2, lat: 14.5547, lng: 121.0244, name: 'Legaspi City', fill: 75 },
        { id: 3, lat: 14.5310, lng: 120.9822, name: 'SM Mall of Asia', fill: 45 },
        { id: 4, lat: 14.6760, lng: 121.0437, name: 'Quezon City', fill: 90 },
        { id: 5, lat: 14.5547, lng: 121.0369, name: 'Makati City', fill: 100 }
    ];

    binLocations.forEach(bin => {
        const marker = L.marker([bin.lat, bin.lng])
            .addTo(map)
            .bindPopup(`<b>Bin #${bin.id}</b><br>${bin.name}<br>Fill Level: ${bin.fill}%`);

        markers.push(marker);
    });

    // Add depot marker in Manila City Hall
    const depotMarker = L.marker([14.5995, 120.9842], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        })
        .addTo(map)
        .bindPopup('<b>Waste Collection Center - Manila</b>');

    markers.push(depotMarker);
}

// Route optimization simulation
function optimizeRoute() {
    if (!map) initializeMap();

    // Clear existing route
    if (routeLayer) {
        map.removeLayer(routeLayer);
    }

    // Sample optimized route coordinates for Philippines (simplified)
    const routeCoordinates = [
        [14.5995, 120.9842], // Depot - Manila City Hall
        [14.5547, 121.0369], // Bin 5 - Makati City
        [14.6760, 121.0437], // Bin 4 - Quezon City
        [14.5547, 121.0244], // Bin 2 - BGC
        [14.5310, 120.9822], // Bin 3 - SM Mall of Asia
        [14.5829, 120.9772], // Bin 1 - Luneta Park
        [14.5995, 120.9842] // Back to depot
    ];

    // Draw route
    routeLayer = L.polyline(routeCoordinates, {
        color: 'blue',
        weight: 4,
        opacity: 0.7
    }).addTo(map);

    // Fit map to route
    map.fitBounds(routeLayer.getBounds(), { padding: [20, 20] });

    // Update route stats
    document.getElementById('totalDistance').textContent = '28.5 km';
    document.getElementById('estimatedTime').textContent = '65 min';

    // Update route list with optimized order for Philippines
    const routeList = document.getElementById('routeList');
    routeList.innerHTML = `
        <li>Start: Waste Collection Center - Manila</li>
        <li>Bin #5 (100%) - Makati City</li>
        <li>Bin #4 (90%) - Quezon City</li>
        <li>Bin #2 (75%) - Legaspi City</li>
        <li>Bin #3 (45%) - SM Mall of Asia</li>
        <li>Bin #1 (30%) - Luneta Park</li>
        <li>End: Waste Collection Center - Manila</li>
    `;
}

// Collection simulation
function simulateCollection() {
    const routeItems = document.querySelectorAll('#routeList li');
    let currentIndex = 0;

    const simulationInterval = setInterval(() => {
        if (currentIndex < routeItems.length) {
            // Highlight current step
            routeItems.forEach(item => item.classList.remove('current'));
            routeItems[currentIndex].classList.add('current');

            // Simulate bin emptying for collection stops
            if (currentIndex > 0 && currentIndex < routeItems.length - 1) {
                const binCards = document.querySelectorAll('.bin-card');
                const binId = currentIndex; // Simplified mapping
                if (binCards[binId - 1]) {
                    const fillElement = binCards[binId - 1].querySelector('.waste-fill');
                    fillElement.style.height = '10%'; // Empty bin
                    binCards[binId - 1].querySelector('p').textContent = 'Fill Level: 10%';
                }
            }

            currentIndex++;
        } else {
            clearInterval(simulationInterval);
            alert('Collection route completed!');
            routeItems.forEach(item => item.classList.remove('current'));
        }
    }, 2000);
}

// Real-time data updates simulation
function updateBinData() {
    setInterval(() => {
        const binCards = document.querySelectorAll('.bin-card');
        binCards.forEach(card => {
            const fillElement = card.querySelector('.waste-fill');
            const fillText = card.querySelector('p');
            const lastUpdated = card.querySelectorAll('p')[2];

            // Simulate slight changes in fill levels
            const currentFill = parseInt(fillElement.style.height);
            const newFill = Math.max(0, Math.min(100, currentFill + (Math.random() - 0.5) * 10));

            fillElement.style.height = newFill + '%';
            fillText.textContent = `Fill Level: ${Math.round(newFill)}%`;
            lastUpdated.textContent = 'Last Updated: Just now';

            // Update alerts
            updateAlerts();
        });
    }, 10000); // Update every 10 seconds
}

function updateAlerts() {
    const alertsContainer = document.querySelector('.alerts');
    const binCards = document.querySelectorAll('.bin-card');

    let urgentAlerts = [];
    let warningAlerts = [];

    binCards.forEach(card => {
        const fillLevel = parseInt(card.querySelector('.waste-fill').style.height);
        const binName = card.querySelector('h3').textContent;

        if (fillLevel >= 100) {
            urgentAlerts.push(`${binName} is ${fillLevel}% full - collection required`);
        } else if (fillLevel >= 90) {
            warningAlerts.push(`${binName} is ${fillLevel}%  - requires immediate collection`);
        } else if (fillLevel >= 75) {
            warningAlerts.push(`${binName} is ${fillLevel}%  - schedule collection soon`);
        }
    });

    alertsContainer.innerHTML = '<h3>Alerts</h3>';
    urgentAlerts.forEach(alert => {
        alertsContainer.innerHTML += `<div class="alert urgent">${alert}</div>`;
    });
    warningAlerts.forEach(alert => {
        alertsContainer.innerHTML += `<div class="alert warning">${alert}</div>`;
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    startSensorSimulation();
    simulateConnection();
    updateBinData();

    // Add current class for route simulation
    const style = document.createElement('style');
    style.textContent = `
        #routeList li.current {
            background: #d4edda;
            border-left-color: #28a745;
        }
    `;
    document.head.appendChild(style);
});