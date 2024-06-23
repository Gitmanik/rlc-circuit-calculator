// Default calculator values
var default_values = {
    r: 10,
    r2: 25,
    l: 0.5,
    c: 0.1,
    delay: 0.0,
    freq: 1.0,
    ampl: 1.0
}

// Bode plot settings
const wmax = 20;
const dw = 0.1;

//Output function settings
const h = 0.01;
const T = 10.0;

// Chart configuration
var bodeAmplitudeChartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [
        {
            label: 'Amplitude [dB * 1000]',
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

var bodePhaseChartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [
        {
            label: 'Phase [φ*1000]',
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

const inputChartConfig = {
    title: 'Input Function',
    xaxis: { title: 'Time (s)' },
    yaxis: { title: 'Amplitude' },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
        color: 'white'
    }
};

const outputChartConfig = {
    title: 'Output Function',
    xaxis: { title: 'Time (s)' },
    yaxis: { title: 'Amplitude' },
      paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
        color: 'white'
    }
};
