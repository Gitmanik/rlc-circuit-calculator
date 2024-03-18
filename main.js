var input_function_chart;
var output_function_chart;
var bode_chart;

var r_input;
var r2_input;
var l_input;
var c_input;

var previousValues = {};

window.addEventListener('load', async function()
{
    MicroModal.init();
    load_globals();
    setup_events();
    load_default_values();
    calculate();
});

function load_globals()
{
    r_input = document.getElementById('R_input');
    r2_input = document.getElementById('R2_input');
    l_input = document.getElementById('L_input');
    c_input = document.getElementById('C_input');
    
    input_function_chart = new Chart(document.getElementById('input_function'), input_function_config);
    output_function_chart = new Chart(document.getElementById('output_function'), output_function_config);
    bode_chart = new Chart(document.getElementById('bode'), bode_chart_config);
}

function save_previous_value(e) {
    previousValues[e.target.id] = e.target.value;
}

function check_value_and_calculate(e) {
    if (!check_values())
    {
        MicroModal.show('modal-wrong-value');
        e.target.value = previousValues[e.target.id];
        return;
    }
    calculate();
}

function setup_events()
{
    r_input.onkeydown = save_previous_value;
    r2_input.onkeydown = save_previous_value;
    l_input.onkeydown = save_previous_value;
    c_input.onkeydown = save_previous_value;

    r_input.onkeyup = check_value_and_calculate;
    r2_input.onkeyup = check_value_and_calculate;
    l_input.onkeyup = check_value_and_calculate;
    c_input.onkeyup = check_value_and_calculate;
}

function load_default_values()
{
    r_input.value = default_values.r;
    r2_input.value = default_values.r2;
    l_input.value = default_values.l;
    c_input.value = default_values.c;
}

function check_values() {
    if (isNaN(Number(r_input.value)) ||
        isNaN(Number(r2_input.value)) ||
        isNaN(Number(l_input.value)) ||
        isNaN(Number(c_input.value)))
        return false;
    return true;
}

// FIXME: Stub function
function calculate()
{
    if (!check_values())
    {
        MicroModal.show('modal-wrong-value');
        return;
    }
    
    console.log("calculating")
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