// SwiftRide Map System
class SwiftRideMap {
    constructor() {
        this.map = null;
        this.userMarker = null;
        this.driverMarkers = [];
        this.pickupMarker = null;
        this.destinationMarker = null;
        this.userLocation = null;
        this.availableDrivers = [];
        
        this.init();
    }

    init() {
        this.initializeMap();
        this.setupUserLocation();
        this.simulateDrivers();
        this.setupMapEvents();
    }

    initializeMap() {
        // Initialize map with default coordinates (New York)
        this.map = L.map('rideMap').setView([40.7128, -74.0060], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);

        console.log('🗺️ SwiftRide Map initialized');
    }

    setupUserLocation() {
        // Try to get user's actual location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    
                    this.userLocation = [userLat, userLng];
                    this.map.setView(this.userLocation, 15);
                    this.addUserMarker(this.userLocation);
                    this.generateNearbyDrivers(this.userLocation);
                },
                (error) => {
                    console.log('Location access denied, using default location');
                    this.useDefaultLocation();
                }
            );
        } else {
            this.useDefaultLocation();
        }
    }

    useDefaultLocation() {
        // Default to New York if location not available
        this.userLocation = [40.7128, -74.0060];
        this.addUserMarker(this.userLocation);
        this.generateNearbyDrivers(this.userLocation);
    }

    addUserMarker(location) {
        // Create pulsing user marker
        const userIcon = L.divIcon({
            className: 'swiftride-marker user-marker',
            html: '',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        this.userMarker = L.marker(location, { icon: userIcon })
            .addTo(this.map)
            .bindPopup('Your Location')
            .openPopup();
    }

    generateNearbyDrivers(userLocation) {
        // Simulate 8 nearby drivers
        const driverCount = 8;
        this.availableDrivers = [];

        for (let i = 0; i < driverCount; i++) {
            const driver = this.createDriver(userLocation, i);
            this.availableDrivers.push(driver);
            this.addDriverMarker(driver);
        }

        // Start driver movement simulation
        this.startDriverMovement();
    }

    createDriver(userLocation, index) {
        const [userLat, userLng] = userLocation;
        
        // Generate random position near user (within 2km)
        const latOffset = (Math.random() - 0.5) * 0.02;
        const lngOffset = (Math.random() - 0.5) * 0.02;
        
        return {
            id: `driver_${index}`,
            position: [userLat + latOffset, userLng + lngOffset],
            name: `Driver ${index + 1}`,
            rating: (4.5 + Math.random() * 0.5).toFixed(1),
            car: `Toyota Camry ${2020 + index}`,
            available: true,
            moving: false
        };
    }

    addDriverMarker(driver) {
        const driverIcon = L.divIcon({
            className: `swiftride-marker driver-marker ${driver.moving ? 'driver-moving' : ''}`,
            html: '<i class="fas fa-car" style="color: white; font-size: 8px;"></i>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        const marker = L.marker(driver.position, { icon: driverIcon })
            .addTo(this.map)
            .bindPopup(this.createDriverPopup(driver));

        driver.marker = marker;
        this.driverMarkers.push(marker);
    }

    createDriverPopup(driver) {
        return `
            <div class="swiftride-popup">
                <div class="driver-info">
                    <div class="driver-avatar">${driver.name.split(' ').map(n => n[0]).join('')}</div>
                    <div class="driver-details">
                        <div class="driver-name">${driver.name}</div>
                        <div class="driver-rating">⭐ ${driver.rating}</div>
                        <div class="driver-car">${driver.car}</div>
                    </div>
                </div>
                <button class="btn-primary" onclick="swiftRideMap.selectDriver('${driver.id}')" style="width: 100%; margin-top: 10px;">
                    Select Driver
                </button>
            </div>
        `;
    }

    startDriverMovement() {
        // Simulate driver movement every 3 seconds
        setInterval(() => {
            this.availableDrivers.forEach(driver => {
                if (Math.random() > 0.7) { // 30% chance to move
                    this.moveDriver(driver);
                }
            });
        }, 3000);
    }

    moveDriver(driver) {
        const [lat, lng] = driver.position;
        const latOffset = (Math.random() - 0.5) * 0.001;
        const lngOffset = (Math.random() - 0.5) * 0.001;
        
        driver.position = [lat + latOffset, lng + lngOffset];
        driver.marker.setLatLng(driver.position);
        
        // Add moving animation
        driver.marker._icon.classList.add('driver-moving');
        setTimeout(() => {
            driver.marker._icon.classList.remove('driver-moving');
        }, 3000);
    }

    setupMapEvents() {
        // Add click event to set pickup/destination
        this.map.on('click', (e) => {
            this.handleMapClick(e.latlng);
        });
    }

    handleMapClick(latlng) {
        if (!this.pickupMarker) {
            this.setPickupLocation(latlng);
        } else if (!this.destinationMarker) {
            this.setDestinationLocation(latlng);
            this.calculateRoute();
        } else {
            // Reset and set new pickup
            this.clearRoute();
            this.setPickupLocation(latlng);
        }
    }

    setPickupLocation(latlng) {
        if (this.pickupMarker) {
            this.map.removeLayer(this.pickupMarker);
        }

        const pickupIcon = L.divIcon({
            className: 'swiftride-marker pickup-marker',
            html: '<i class="fas fa-map-marker-alt"></i>',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });

        this.pickupMarker = L.marker(latlng, { icon: pickupIcon })
            .addTo(this.map)
            .bindPopup('Pickup Location')
            .openPopup();

        this.showNotification('📍 Pickup location set! Now click destination.');
    }

    setDestinationLocation(latlng) {
        if (this.destinationMarker) {
            this.map.removeLayer(this.destinationMarker);
        }

        const destinationIcon = L.divIcon({
            className: 'swiftride-marker destination-marker',
            html: '<i class="fas fa-flag-checkered"></i>',
            iconSize: [24, 24],
            iconAnchor: [12, 24]
        });

        this.destinationMarker = L.marker(latlng, { icon: destinationIcon })
            .addTo(this.map)
            .bindPopup('Destination')
            .openPopup();

        this.showNotification('🎯 Destination set! Calculating route...');
    }

    calculateRoute() {
        if (this.pickupMarker && this.destinationMarker) {
            const pickupLatLng = this.pickupMarker.getLatLng();
            const destLatLng = this.destinationMarker.getLatLng();
            
            // Simulate route calculation
            this.drawRoute(pickupLatLng, destLatLng);
            
            // Calculate and display fare
            const distance = this.calculateDistance(pickupLatLng, destLatLng);
            const fare = this.calculateFare(distance);
            
            this.showNotification(`💰 Estimated fare: $${fare} | Distance: ${distance.toFixed(1)} km`);
        }
    }

    drawRoute(start, end) {
        // Simple straight line for demo - in real app, use routing service
        const route = L.polyline([start, end], {
            color: '#0066FF',
            weight: 5,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(this.map);

        this.currentRoute = route;
    }

    calculateDistance(start, end) {
        // Simple distance calculation (Haversine formula simplified)
        const latDiff = end.lat - start.lat;
        const lngDiff = end.lng - start.lng;
        return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Convert to km
    }

    calculateFare(distance) {
        const baseFare = 2.50;
        const perKm = 1.75;
        return (baseFare + distance * perKm).toFixed(2);
    }

    clearRoute() {
        if (this.currentRoute) {
            this.map.removeLayer(this.currentRoute);
            this.currentRoute = null;
        }
        if (this.pickupMarker) {
            this.map.removeLayer(this.pickupMarker);
            this.pickupMarker = null;
        }
        if (this.destinationMarker) {
            this.map.removeLayer(this.destinationMarker);
            this.destinationMarker = null;
        }
    }

    selectDriver(driverId) {
        const driver = this.availableDrivers.find(d => d.id === driverId);
        if (driver) {
            this.showNotification(`🚗 ${driver.name} selected! Arriving in 3 minutes.`);
            // In real app, this would send ride request to driver
        }
    }

    showNotification(message) {
        // Use your existing notification system
        if (window.swiftRideApp) {
            window.swiftRideApp.showNotification(message, 'success');
        } else {
            alert(message); // Fallback
        }
    }

    // Public method to center on user location
    centerOnUser() {
        if (this.userLocation) {
            this.map.setView(this.userLocation, 15);
            this.showNotification('📍 Centered on your location');
        }
    }
}

// Initialize map when DOM is loaded
let swiftRideMap;
document.addEventListener('DOMContentLoaded', () => {
    swiftRideMap = new SwiftRideMap();
    window.swiftRideMap = swiftRideMap; // Make it globally accessible
});
