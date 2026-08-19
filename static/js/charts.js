/* ============================================
   Price Benchmarking System - Charts
   ============================================ */

const PBCharts = {
    colors: {
        primary: '#1a237e',
        primaryLight: 'rgba(26, 35, 126, 0.8)',
        primaryLighter: 'rgba(26, 35, 126, 0.5)',
        primaryLightest: 'rgba(26, 35, 126, 0.1)',
        accent: '#0d47a1',
        accentLight: 'rgba(13, 71, 161, 0.8)',
        success: '#4caf50',
        successLight: 'rgba(76, 175, 80, 0.2)',
        warning: '#ff9800',
        warningLight: 'rgba(255, 152, 0, 0.2)',
        error: '#c62828',
        errorLight: 'rgba(198, 40, 40, 0.2)',
        grid: 'rgba(0, 0, 0, 0.05)',
        text: '#666'
    },

    palette: [
        '#1a237e', '#0d47a1', '#1565c0', '#1976d2', '#1e88e5',
        '#2196f3', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb'
    ],

    defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    font: { family: "'Segoe UI', Tahoma, sans-serif", size: 12 },
                    color: '#666'
                }
            },
            tooltip: {
                backgroundColor: '#333',
                titleFont: { family: "'Segoe UI', Tahoma, sans-serif" },
                bodyFont: { family: "'Segoe UI', Tahoma, sans-serif" },
                cornerRadius: 8,
                padding: 12
            }
        }
    },

    // === Category Bar Chart (Horizontal) ===
    renderCategoryBarChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const labels = Object.keys(data);
        const values = labels.map(k => data[k].avg_price);
        const entries = labels.map(k => data[k].total_entries);

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Price (₹)',
                    data: values,
                    backgroundColor: this.palette.slice(0, labels.length).map(c => c + 'cc'),
                    borderColor: this.palette.slice(0, labels.length),
                    borderWidth: 1,
                    borderRadius: 4,
                    barThickness: 28
                }]
            },
            options: {
                ...this.defaultOptions,
                indexAxis: 'y',
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: { display: false },
                    tooltip: {
                        ...this.defaultOptions.plugins.tooltip,
                        callbacks: {
                            label: (ctx) => {
                                const idx = ctx.dataIndex;
                                return `Avg: ₹${ctx.raw.toLocaleString()} | ${entries[idx]} entries`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: this.colors.grid },
                        ticks: {
                            color: this.colors.text,
                            callback: v => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
                        }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: this.colors.text, font: { size: 11 } }
                    }
                }
            }
        });
    },

    // === Vendor Doughnut Chart ===
    renderVendorDoughnutChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const labels = Object.keys(data);
        const values = labels.map(k => data[k].total_entries);

        new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: this.palette.slice(0, labels.length).map(c => c + 'cc'),
                    borderColor: 'white',
                    borderWidth: 3,
                    hoverBorderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                ...this.defaultOptions,
                cutout: '60%',
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: "'Segoe UI', Tahoma, sans-serif", size: 11 },
                            color: '#666',
                            padding: 12,
                            usePointStyle: true,
                            pointStyleWidth: 10
                        }
                    },
                    tooltip: {
                        ...this.defaultOptions.plugins.tooltip,
                        callbacks: {
                            label: (ctx) => {
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = ((ctx.raw / total) * 100).toFixed(1);
                                return `${ctx.label}: ${ctx.raw} entries (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    // === Location Line Chart ===
    renderLocationLineChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const labels = Object.keys(data);
        const avgPrices = labels.map(k => data[k].avg_price);
        const procurements = labels.map(k => data[k].total_procurements);

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Avg Price (₹)',
                        data: avgPrices,
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primaryLightest,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointBackgroundColor: this.colors.primary,
                        pointBorderColor: 'white',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Total Procurements',
                        data: procurements,
                        borderColor: this.colors.accent,
                        backgroundColor: 'transparent',
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        pointBackgroundColor: this.colors.accent,
                        pointBorderColor: 'white',
                        pointBorderWidth: 2,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                ...this.defaultOptions,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: "'Segoe UI', Tahoma, sans-serif", size: 12 },
                            color: '#666',
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: this.colors.grid },
                        ticks: { color: this.colors.text, maxRotation: 45, font: { size: 11 } }
                    },
                    y: {
                        position: 'left',
                        grid: { color: this.colors.grid },
                        ticks: {
                            color: this.colors.text,
                            callback: v => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
                        },
                        title: { display: true, text: 'Avg Price', color: this.colors.text }
                    },
                    y1: {
                        position: 'right',
                        grid: { display: false },
                        ticks: { color: this.colors.accent },
                        title: { display: true, text: 'Procurements', color: this.colors.accent }
                    }
                }
            }
        });
    },

    // === Price Comparison Bar Chart (Result Page) ===
    renderPriceComparisonChart(canvasId, predicted, historical) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const labels = ['Predicted', ...historical.map((_, i) => `Historical ${i + 1}`)];
        const values = [predicted, ...historical];
        const colors = values.map((_, i) => i === 0 ? this.colors.primary : this.colors.primaryLighter);

        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price (₹)',
                    data: values,
                    backgroundColor: colors.map(c => c + 'cc'),
                    borderColor: colors,
                    borderWidth: 1,
                    borderRadius: 6,
                    barThickness: 36
                }]
            },
            options: {
                ...this.defaultOptions,
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: { display: false },
                    tooltip: {
                        ...this.defaultOptions.plugins.tooltip,
                        callbacks: {
                            label: (ctx) => `₹${ctx.raw.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: this.colors.text, font: { size: 11 } }
                    },
                    y: {
                        grid: { color: this.colors.grid },
                        ticks: {
                            color: this.colors.text,
                            callback: v => '₹' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
                        }
                    }
                }
            }
        });
    },

    // === Radar Chart for Vendor Quality ===
    renderVendorRadarChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const labels = Object.keys(data);
        const avgPrices = labels.map(k => data[k].avg_price);
        const maxPrice = Math.max(...avgPrices);
        const normalizedPrices = avgPrices.map(p => (p / maxPrice) * 5);
        const qualities = labels.map(k => data[k].avg_quality);

        new Chart(canvas, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Quality Rating',
                        data: qualities,
                        borderColor: this.colors.primary,
                        backgroundColor: this.colors.primaryLightest,
                        pointBackgroundColor: this.colors.primary,
                        pointBorderColor: 'white',
                        pointBorderWidth: 2
                    },
                    {
                        label: 'Normalized Price',
                        data: normalizedPrices,
                        borderColor: this.colors.warning,
                        backgroundColor: this.colors.warningLight,
                        pointBackgroundColor: this.colors.warning,
                        pointBorderColor: 'white',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                ...this.defaultOptions,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        grid: { color: this.colors.grid },
                        pointLabels: { color: this.colors.text, font: { size: 11 } },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: "'Segoe UI', Tahoma, sans-serif", size: 12 },
                            color: '#666',
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
};

// Auto-initialize charts on page load
document.addEventListener('DOMContentLoaded', function() {
    // Trend charts are initialized from template inline scripts
});
