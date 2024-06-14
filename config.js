// Default calculator values
var default_values = {
    r: 100,
    r2: 100,
    l: 0.001,
    c: 0.001
}

// Chart configuration
var bode_ampl_chart_config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [
        {
            label: 'Amplitude',
            backgroundColor: "rgb(255, 99, 255)",
            borderColor: "rgb(255, 99, 255)",
            fill: false,
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            intersect: false,
            mode: 'index',
          },
        scales: {
            x: {
                display: true,
                scaleLabel: {
                    display: false,
                    fontColor: 'white'
                },
                // type: 'logarithmic'
            },
            y: {
                beginAtZero: false, // Set this to false to start y-axis from the minimum value of the dataset
                // type: 'logarithmic',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                }
            }
        }
    }
};

var bode_phase_chart_config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [
        {
            label: 'Phase',
            backgroundColor: "powderblue",
            borderColor: "powderblue",
            fill: false,
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            intersect: false,
            mode: 'index',
          },
        scales: {
            x: {
                display: true,
                scaleLabel: {
                    display: false,
                    fontColor: 'white'
                },
                // type: 'logarithmic'
            },
            y: {
                beginAtZero: false, // Set this to false to start y-axis from the minimum value of the dataset
                // type: 'logarithmic',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                }
            }
        }
    }
};

var input_function_config = {
    type: 'line',
    data: {
        labels: null,
        datasets: [
          {
            label: 'Input function',
            data: null,
          }
        ]
      }
}

var output_function_config = {
    type: 'line',
    data: {
        labels: null,
        datasets: [
          {
            label: 'Output function',
            data: null,
            backgroundColor: "darkred",
            borderColor: "red",
          }
        ]
      }
}
