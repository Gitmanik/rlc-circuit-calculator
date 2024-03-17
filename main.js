var input_function_chart;
var output_function_chart;
var bode_chart;

window.addEventListener('load', async function()
{
    setup_charts();
    load_default_values();




    myChart = new Chart(document.getElementById('bode'), bode_chart_config);
    data.forEach(n => {
        myChart.data.labels.push(n + "");
        myChart.data.datasets[0].data.push(n.year);
        myChart.data.datasets[1].data.push(n.count);
    });
    myChart.update();
});

function load_default_values()
{

}

function setup_charts()
{
    // FIXME: usunac
    const data = [
        { year: 2010, count: 10 },
        { year: 2011, count: 20 },
        { year: 2012, count: 15 },
        { year: 2013, count: 25 },
        { year: 2014, count: 22 },
        { year: 2015, count: 30 },
        { year: 2016, count: 28 },
      ];
    

    input_function_chart = new Chart(document.getElementById('input_function'), input_function_config);
    input_function_chart.data.labels.push(data.map(row => row.year));
    input_function_chart.data.datasets.label = 'label';
    input_function_chart.data.datasets.data = data.map(row => row.count)

    output_function_chart = new Chart(document.getElementById('output_function'), output_function_config);
}