// Funktion zum Öffnen des Popupfensters mit dem Höhenprofil
function openHeightProfilePopup(heights) {
    // Hier ein Beispiel für das Erstellen des Höhenprofil-Popups in der aktuellen Seite
    var popupContainer = document.createElement('div');
    popupContainer.id = 'heightProfilePopup';
    popupContainer.style.width = '600px';
    popupContainer.style.height = '400px';
    popupContainer.style.border = '1px solid black';
    popupContainer.style.padding = '10px';

    var canvas = document.createElement('canvas');
    canvas.id = 'heightProfileCanvas';
    canvas.width = 600;
    canvas.height = 300; // Höhe abzüglich 100px für Achsenbeschriftungen
    popupContainer.appendChild(canvas);

    var closeButton = document.createElement('button');
    closeButton.textContent = 'Schließen';
    closeButton.onclick = function() {
        document.body.removeChild(popupContainer);
    };
    popupContainer.appendChild(closeButton);

    document.body.appendChild(popupContainer);

    var ctx = canvas.getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: heights.map((h, i) => i), // Index als x-Achse
            datasets: [{
                label: 'Height Profile',
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
                    title: {
                        display: true,
                        text: 'Punktindex'
                    }
                }
            }
        }
    });
}


