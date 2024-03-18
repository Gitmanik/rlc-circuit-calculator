var input_function_chart;
var output_function_chart;
var bode_chart;

window.addEventListener('load', async function()
{
    setup_charts();
    load_default_values();
    calculate();
});

function load_default_values()
{

}

function setup_charts()
{
    input_function_chart = new Chart(document.getElementById('input_function'), input_function_config);
    output_function_chart = new Chart(document.getElementById('output_function'), output_function_config);
    bode_chart = new Chart(document.getElementById('bode'), bode_chart_config);
}

// FIXME: Stub function
function calculate()
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

    input_function_chart.data.labels = data.map(row => row.year);
    input_function_chart.data.datasets[0].data = data.map(row => row.count);
    input_function_chart.update();

    output_function_chart.data.labels = data.map(row => row.year);
    output_function_chart.data.datasets[0].data = data.map(row => row.count);
    output_function_chart.update();

    data.forEach(n => {
        bode_chart.data.labels.push(n + "");
        bode_chart.data.datasets[0].data.push(n.year);
        bode_chart.data.datasets[1].data.push(n.count);
    });
    bode_chart.update();
}