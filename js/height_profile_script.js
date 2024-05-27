// Funktion zum Laden der Koordinaten aus der track_egge_2.js Datei
function loadCoordinates() {
    // Annahme: Die Funktion loadCoordinates() ist in track_egge_2.js definiert und gibt die Koordinaten zurück
    // Hier wird ein Beispiel verwendet, um die Funktionalität zu simulieren
    return track_egge_2.features[0].geometry.coordinates[0];
}

// Deklaration der Variable außerhalb des Ereignishandlers
var coordinates;

// Funktion zur Erstellung des Höhenprofils
function createHeightProfile(coordinates, cumulativeDistances, canvas) {
    console.log("Coordinates:", coordinates);
    console.log("Cumulative Distances:", cumulativeDistances);
    var heights = extractHeights(coordinates);
    console.log("Heights:", heights);

    // Überprüfe, ob das Diagramm bereits existiert, bevor es zerstört wird
    var existingChart = Chart.getChart(canvas);
    console.log("Existing Chart:", existingChart);
    if (existingChart) {
        existingChart.destroy();
        console.log("Existing Chart Destroyed");
    }

    try {
        var ctx = canvas.getContext('2d');
        console.log("Context:", ctx);
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: cumulativeDistances, // Verwende kumulative Distanzen als X-Achsen-Werte
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
                        type: 'linear', // Typ der Achse auf linear setzen
                        title: {
                            display: true,
                            text: 'Distanz (km)'
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                return value.toFixed(1); // Skalierte Distanzwerte mit 2 Nachkommastellen anzeigen
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
                                return 'Höhe: ' + height.toFixed(0) + ' m';
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
        console.log("Chart created:", chart);
    } catch (error) {
        console.error("Error creating chart:", error);
    }
}

// Funktion zur Berechnung der kumulativen Distanzen zwischen den Punkten
function calculateCumulativeDistances(coordinates) {
    let cumulativeDistances = [0];
    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
        const distance = calculateDistance(coordinates[i - 1], coordinates[i]);
        totalDistance += distance;
        cumulativeDistances.push(totalDistance);
    }
    console.log("Cumulative Distances Calculated:", cumulativeDistances);
    return cumulativeDistances;
}

// Funktion zur Berechnung der Distanz zwischen zwei Punkten (Haversine-Formel)
function calculateDistance(coord1, coord2) {
    var R = 6371; // Radius der Erde in Kilometern
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

    var distance = R * c; // Entfernung in Kilometern
    return distance;
}

// Funktion zur Extrahierung der Höhendaten aus den Koordinaten
function extractHeights(coordinates) {
    // Extrahiere die Höhendaten (drittes Element) aus jedem Koordinatenarray
    const heights = coordinates.map(coord => coord[2]);
    console.log("Extracted Heights:", heights);
    return heights;
}

// Funktion zur Konvertierung von Grad in Radiant
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Funktion zum Abrufen der Lat/Lng aus der X-Koordinate des Diagramms
function getLatLngFromChartX(chartX) {
    // Index des nächstgelegenen Punkts im Track finden
    const index = Math.round(chartX);
    if (index >= 0 && index < coordinates.length) {
        const lat = coordinates[index][1];
        const lng = coordinates[index][0];
        return [lat, lng];
    }
    return null;
}
