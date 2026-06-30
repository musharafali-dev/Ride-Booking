import reflex as rx
from app.presentation.states.ride_state import RideState

def live_map():
    return rx.vstack(
        # Leaflet map styling and container
        rx.html("""
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
            <style>
                #map { height: 400px; width: 100%; border-radius: 12px; z-index: 1; }
            </style>
            <div id="map"></div>
        """),
        # Script to initialize Leaflet and handle real-time marker updates
        rx.script("""
            var map, pickupMarker, destMarker, driverMarker;

            function initMap() {
                if (map) return;
                map = L.map('map').setView([37.7749, -122.4194], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
            }

            // Global socket reference
            var ws;

            window.connectRideTracking = function(rideId) {
                initMap();
                if (ws) ws.close();
                
                ws = new WebSocket('ws://localhost:8000/ws/rides/' + rideId + '/track');
                
                ws.onmessage = function(event) {
                    var payload = JSON.parse(event.data);
                    
                    // Update driver coordinates or state on map
                    if (payload.latitude && payload.longitude) {
                        var lat = payload.latitude;
                        var lon = payload.longitude;
                        
                        if (!driverMarker) {
                            var driverIcon = L.icon({
                                iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
                                iconSize: [38, 38],
                                iconAnchor: [19, 19]
                            });
                            driverMarker = L.marker([lat, lon], {icon: driverIcon}).addTo(map);
                            driverMarker.bindPopup("Driver Location").openPopup();
                        } else {
                            driverMarker.setLatLng([lat, lon]);
                        }
                        map.panTo([lat, lon]);
                    }
                    
                    // Forward payload back to Reflex State handler
                    Reflex.get_state('ride_state').update_ride_state_from_ws(JSON.stringify(payload));
                };
            };

            // Poll for leaflet load completion and initialize map container
            var checkInterval = setInterval(function() {
                if (window.L) {
                    initMap();
                    clearInterval(checkInterval);
                }
            }, 100);
        """),
        width="100%"
    )
