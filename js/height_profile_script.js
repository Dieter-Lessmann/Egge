// Funktion zum Laden der Koordinaten aus der track_egge_2.js Datei
function loadCoordinates() {
    return track_egge_2.features[0].geometry.coordinates;
}

// Deklaration der Variable außerhalb des Ereignishandlers
var coordinates = loadCoordinates(); // Initialisierung der Koordinaten

// Funktion zur Erstellung des Höhenprofils
function createHeightProfile(coordinates, cumulativeDistances, canvas) {
    var heights = extractHeights(coordinates);

    var existingChart = Chart.getChart(canvas);
    if (existingChart) {
        existingChart.destroy();
    }

    var ctx = canvas.getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: cumulativeDistances,
            datasets: [{
                label: 'Höhenprofil',
                data: heights,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Höhe (m)'
                    }
                },
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Distanz (km)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            var index = tooltipItems[0].dataIndex;
                            var distance = cumulativeDistances[index];
                            return 'Distanz: ' + distance.toFixed(2) + ' km';
                        },
                        label: function(tooltipItem) {
                            var height = tooltipItem.raw;
                            if (typeof height === 'number') {
                                return 'Höhe: ' + height.toFixed(0) + ' m';
                            } else {
                                return 'Höhe: ' + height + ' m';
                            }
                        }
                    }
                }
            },
            onHover: function(evt, elements) {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const latLng = getLatLngFromChartX(index);
                    if (latLng) {
                        try {
                            window.opener.updateMarker(latLng[0], latLng[1]);
                        } catch (error) {
                            console.error("Error calling updateMarker:", error);
                        }
                    }
                }
            }
        }
    });
}

function calculateCumulativeDistances(coordinates) {
    let cumulativeDistances = [0];
    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
        const distance = calculateDistance(coordinates[i - 1], coordinates[i]);
        totalDistance += distance;
        cumulativeDistances.push(totalDistance);
    }
    return cumulativeDistances;
}

function calculateDistance(coord1, coord2) {
    var R = 6371;
    var lat1 = deg2rad(coord1[1]);
    var lon1 = deg2rad(coord1[0]);
    var lat2 = deg2rad(coord2[1]);
    var lon2 = deg2rad(coord2[0]);

    var dlat = lat2 - lat1;
    var dlon = lon2 - lon1;

    var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dlon / 2) * Math.sin(dlon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var distance = R * c;
    return distance;
}

function extractHeights(coordinates) {
    return coordinates.map(coord => {
        const height = parseFloat(coord[2]);
        return isNaN(height) ? 0 : height;
    });
}

function getLatLngFromChartX(chartX) {
    const index = Math.round(chartX);
    if (index >= 0 && index < coordinates.length) {
        const lat = coordinates[index][1];
        const lng = coordinates[index][0];
        return [lat, lng];
    }
    return null;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

window.onload = function() {
    var canvas = document.getElementById('heightProfile');
    if (canvas) {
        var coordinates = loadCoordinates();
        var cumulativeDistances = calculateCumulativeDistances(coordinates);
        createHeightProfile(coordinates, cumulativeDistances, canvas);
    } else {
        console.error("Canvas element not found.");
    }
};
