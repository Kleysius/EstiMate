function getRandomColors() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return {
        backgroundColor: `rgba(${red},${green},${blue},0.5)`, // couleur avec transparence
        borderColor: `rgb(${red},${green},${blue})` // couleur sans transparence
    };
}

fetch('/dashboard/estimates')
    .then(response => response.json())
    .then(data => {
        const colors = data.totalCosts.map(() => getRandomColors());
        const ctx = document.getElementById('estimationChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.projectNames,
                datasets: [{
                    label: 'Coût estimé',
                    backgroundColor: colors.map(color => color.backgroundColor),
                    borderColor: colors.map(color => color.borderColor),
                    borderWidth: 2,
                    borderRadius: 10,
                    data: data.totalCosts
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            // Inclure un symbole euro dans les labels
                            callback: function (value, index, values) {
                                return value + ' €';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error:', error));