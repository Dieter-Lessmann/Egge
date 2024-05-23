var map = L.map('map');

var defaultLayer = L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);

var baseLayers = {
    'OpenStreetMap Default': defaultLayer,
    'OpenStreetMap German Style': L.tileLayer.provider('OpenStreetMap.DE'),
    'Esri WorldStreetMap': L.tileLayer.provider('Esri.WorldStreetMap'),
    'Esri WorldTopoMap': L.tileLayer.provider('Esri.WorldTopoMap'),
    'Esri WorldImagery': L.tileLayer.provider('Esri.WorldImagery'),
    'Esri WorldShadedRelief': L.tileLayer.provider('Esri.WorldShadedRelief'),
    'Esri WorldGrayCanvas': L.tileLayer.provider('Esri.WorldGrayCanvas'),
};

var overlayLayers = {
    'Waymarked Trails Hiking': L.tileLayer.provider('WaymarkedTrails.hiking'),
    'Waymarked Trails Cycling': L.tileLayer.provider('WaymarkedTrails.cycling'),
    'Waymarked Trails MTB': L.tileLayer.provider('WaymarkedTrails.mtb'),
    'Waymarked Trails Ski Slopes': L.tileLayer.provider('WaymarkedTrails.slopes'),
    'Waymarked Trails Riding': L.tileLayer.provider('WaymarkedTrails.riding'),
};

L.control.layers(baseLayers, overlayLayers, {collapsed: false}).addTo(map);

// Extrahiere die Höheninformationen aus den Koordinaten
function extractElevation(coordinates) {
    return coordinates.map(coord => coord[2]);
}

// Erstelle das Höhenprofil-Diagramm
function createElevationProfileChart(elevationData) {
    // Verwende eine Chart-Bibliothek wie Chart.js oder D3.js, um das Diagramm zu erstellen
    // Hier ist ein vereinfachtes Beispiel mit Chart.js

    var ctx = document.getElementById('elevationChart').getContext('2d');

    var elevationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: elevationData.map((elevation, index) => index),
            datasets: [{
                label: 'Elevation Profile',
                data: elevationData,
                borderColor: 'blue',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Elevation (m)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Distance (points)'
                    }
                }
            }
        }
    });
}

// Füge Event-Listener hinzu, um die Breite des Tracks beim Mouseover zu ändern
map.on('layeradd', function (event) {
    if (event.layer instanceof L.Path && event.layer.options.className === 'leaflet-interactive') {
        var trackElement = event.layer._path;
        trackElement.addEventListener('mouseover', function () {
            trackElement.setAttribute('stroke-width', '5');
        });
        trackElement.addEventListener('mouseout', function () {
            trackElement.setAttribute('stroke-width', '1');
        });
    }
});
