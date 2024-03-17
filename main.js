var config = {

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
            display: false
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
            y1: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '°C'
                }
            }],
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

window.addEventListener('load', async function()
{
    const data = [
        { year: 2010, count: 10 },
        { year: 2011, count: 20 },
        { year: 2012, count: 15 },
        { year: 2013, count: 25 },
        { year: 2014, count: 22 },
        { year: 2015, count: 30 },
        { year: 2016, count: 28 },
      ];
    
      new Chart(
        document.getElementById('input_function'),
        {
          type: 'line',
          data: {
            labels: data.map(row => row.year),
            datasets: [
              {
                label: 'Acquisitions by year',
                data: data.map(row => row.count)
              }
            ]
          }
        }
      );
      new Chart(
        document.getElementById('output_function'),
        {
          type: 'line',
          data: {
            labels: data.map(row => row.year),
            datasets: [
              {
                label: 'Acquisitions by year',
                data: data.map(row => row.count)
              }
            ]
          }
        }
      );

    myChart = new Chart(document.getElementById('bode').getContext('2d'), config);
    data.forEach(n => {
        myChart.data.labels.push(n + "");
        myChart.data.datasets[0].data.push(n.year);
        myChart.data.datasets[1].data.push(n.count);
    });
    myChart.update();
});