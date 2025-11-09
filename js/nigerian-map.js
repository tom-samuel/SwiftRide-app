// Nigeria Map Integration for Homepage
class NigeriaMap {
    constructor() {
        this.map = null;
        this.cities = [
            { name: "Lagos", lat: 6.5244, lng: 3.3792, rides: 15000, rating: 4.7 },
            { name: "Abuja", lat: 9.0765, lng: 7.3986, rides: 8000, rating: 4.8 },
            { name: "Port Harcourt", lat: 4.8156, lng: 7.0498, rides: 5000, rating: 4.6 },
            { name: "Ibadan", lat: 7.3775, lng: 3.9470, rides: 4000, rating: 4.5 },
            { name: "Kano", lat: 12.0022, lng: 8.5920, rides: 3000, rating: 4.6 },
            { name: "Benin City", lat: 6.3350, lng: 5.6037, rides: 2500, rating: 4.4 },
            { name: "Kaduna", lat: 10.5105, lng: 7.4165, rides: 2000, rating: 4.5 },
            { name: "Aba", lat: 5.1164, lng: 7.3667, rides: 1800, rating: 4.3 },
            { name: "Jos", lat: 9.8965, lng: 8.8583, rides: 1500, rating: 4.6 },
            { name: "Ilorin", lat: 8.4966, lng: 4.5421, rides: 1200, rating: 4.4 },
            { name: "Warri", lat: 5.5174, lng: 5.7501, rides: 1000, rating: 4.3 },
            { name: "Enugu", lat: 6.4584, lng: 7.5464, rides: 900, rating: 4.5 }
        ];
        this.init();
    }

    init() {
        this.initializeMap();
        this.addCityMarkers();
        this.setupCityInteractions();
        console.log('🗺️ Nigeria Map initialized with', this.cities.length, 'cities');
    }

    initializeMap() {
        // Initialize map centered on Nigeria
        this.map = L.map('nigeriaMap', {
            zoomControl: false,
            attributionControl: false,
            dragging: false,
            zoomSnap: 0,
            zoomDelta: 0,
            trackResize: false,
            boxZoom: false,
            doubleClickZoom: false,
            scrollWheelZoom: false
        }).setView([9.0820, 8.6753], 6);

        // Add custom styled tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '©OpenStreetMap, ©CartoDB',
            subdomains: 'abcd',
            maxZoom: 10,
            minZoom: 5
        }).addTo(this.map);

        // Add Nigeria outline
        this.addNigeriaOutline();
    }

    addNigeriaOutline() {
        // Simplified Nigeria coordinates for outline
        const nigeriaCoords = [
            [13.9, 2.7], [13.9, 14.7], [4.3, 14.7], [4.3, 2.7]
        ];

        L.polygon(nigeriaCoords, {
            color: 'transparent',
            fillColor: 'rgba(30, 58, 40, 0.3)',
            fillOpacity: 0.3,
            weight: 2,
            stroke: false
        }).addTo(this.map);
    }

    addCityMarkers() {
        this.cities.forEach(city => {
            // Create custom marker with pulse effect
            const marker = L.circleMarker([city.lat, city.lng], {
                color: '#FFD700',
                fillColor: '#FFD700',
                fillOpacity: 0.8,
                radius: 6,
                weight: 2
            }).addTo(this.map);

            // Add pulse animation
            this.addPulseEffect(marker);

            // Add popup with city info
            marker.bindPopup(this.createCityPopup(city));

            // Store city data in marker
            marker.cityData = city;
        });
    }

    addPulseEffect(marker) {
        const pulse = L.circleMarker(marker.getLatLng(), {
            color: '#FFD700',
            fillColor: '#FFD700',
            fillOpacity: 0.3,
            radius: 8,
            weight: 1
        }).addTo(this.map);

        // Animate pulse
        let scale = 1;
        const animatePulse = () => {
            scale = scale >= 2 ? 1 : scale + 0.05;
            pulse.setRadius(8 * scale);
            pulse.setStyle({ fillOpacity: 0.3 / scale });
            requestAnimationFrame(animatePulse);
        };
        animatePulse();
    }

    createCityPopup(city) {
        return `
            <div class="city-popup">
                <h3>${city.name}</h3>
                <div class="city-popup-stats">
                    <div class="popup-stat">
                        <i class="fas fa-car"></i>
                        <span>${city.rides.toLocaleString()}+ rides daily</span>
                    </div>
                    <div class="popup-stat">
                        <i class="fas fa-star"></i>
                        <span>${city.rating}★ rating</span>
                    </div>
                </div>
                <div class="popup-actions">
                    <button class="popup-btn" onclick="window.location.href='signup.html'">
                        Ride in ${city.name}
                    </button>
                </div>
            </div>
        `;
    }

    setupCityInteractions() {
        // Add hover effects for city markers
        this.map.eachLayer(layer => {
            if (layer.cityData) {
                layer.on('mouseover', function(e) {
                    this.openPopup();
                    this.setStyle({
                        fillColor: '#00D4AA',
                        color: '#00D4AA'
                    });
                });

                layer.on('mouseout', function(e) {
                    this.closePopup();
                    this.setStyle({
                        fillColor: '#FFD700',
                        color: '#FFD700'
                    });
                });
            }
        });
    }

    // Method to highlight specific city
    highlightCity(cityName) {
        this.map.eachLayer(layer => {
            if (layer.cityData && layer.cityData.name === cityName) {
                layer.setStyle({
                    fillColor: '#00D4AA',
                    color: '#00D4AA',
                    radius: 10
                });
                layer.openPopup();
            }
        });
    }
}

// Initialize Nigeria map when DOM is loaded
let nigeriaMap;
document.addEventListener('DOMContentLoaded', () => {
    nigeriaMap = new NigeriaMap();
    window.nigeriaMap = nigeriaMap;
});

// Add CSS for popups
const mapStyles = document.createElement('style');
mapStyles.textContent = `
    .city-popup {
        padding: 1rem;
        min-width: 200px;
    }
    
    .city-popup h3 {
        margin: 0 0 0.5rem 0;
        color: var(--nigeria-dark);
        font-weight: 700;
    }
    
    .city-popup-stats {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .popup-stat {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--gray-600);
    }
    
    .popup-stat i {
        color: var(--nigeria-green);
    }
    
    .popup-btn {
        background: var(--nigeria-green);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        width: 100%;
        transition: all 0.3s ease;
    }
    
    .popup-btn:hover {
        background: var(--primary-dark);
    }
    
    .leaflet-popup-content-wrapper {
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    
    .leaflet-popup-tip {
        background: white;
    }
`;
document.head.appendChild(mapStyles);
