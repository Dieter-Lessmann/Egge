function loadCoordinates() {
    return track_egge_2.features[0].geometry.coordinates;
}

var coordinates = loadCoordinates();

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
                            return value.toFixed(1); // Formatierung auf eine Nachkommastelle
                        }
                    }
                }
            },
            responsive: true,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    display: false
                }
            },
            onClick: function (event, elements) {
                if (elements.length > 0) {
                    var index = elements[0].index;
                    var coordinatesStr = JSON.stringify(coordinates);
                    var coordinateIndex = cumulativeDistances.findIndex(d => d.toFixed(1) == cumulativeDistances[index].toFixed(1));
                    var clickedCoordinate = coordinates[coordinateIndex];

                    var parentWindow = window.opener;
                    if (parentWindow && parentWindow.updateMarker) {
                        var lat = clickedCoordinate[1];
                        var lng = clickedCoordinate[0];
                        parentWindow.updateMarker(lat, lng);
                    } else {
                        console.error("Parent window or updateMarker function is not available");
                    }
                }
            }
        }
    });
}
