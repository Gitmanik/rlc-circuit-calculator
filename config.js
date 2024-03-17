var bode_chart_config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Amplitude',
            backgroundColor: "powderblue",
            borderColor: "powderblue",
            fill: false
        },
        {
            label: 'Phase',
            backgroundColor: "rgb(255, 99, 255)",
            borderColor: "rgb(255, 99, 255)",
            fill: false,
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
            text: 'test',
            display: true
        },
        interaction: {
            intersect: false,
            mode: 'index',
          },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: false,
                    fontColor: 'white'
                }
            }],
            y1: {
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '°C'
                }
            },
            y2: {
                type: 'logarithmic',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
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
            label: 'Input function',
            data: null,
            backgroundColor: "darkred",
            borderColor: "red",
          }
        ]
      }
}



var default_values = {
    r: 100,
    r2: 100,
    l: 0.001,
    c: 0.001
}