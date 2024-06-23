var input_function_chart;
var output_function_chart;
var bode_ampl_chart, bode_phase_chart;

var r_input;
var r2_input;
var l_input;
var c_input;

var function_input, solver_input;

var previousValues = {};

window.addEventListener('load', async function()
{
    MicroModal.init();
    loadGlobals();
    setupEvents();
    loadDefaultValues();
    calculate();
});

function loadGlobals()
{
    r_input = document.getElementById('R_input');
    r2_input = document.getElementById('R2_input');
    l_input = document.getElementById('L_input');
    c_input = document.getElementById('C_input');

    function_input = document.getElementById('Function_type');
    solver_input = document.getElementById('Solver_type');
    ampl_input = document.getElementById('Ampl_input');
    freq_input = document.getElementById('Freq_input');
    
    // input_function_chart = new Chart(document.getElementById('input_function'), input_function_config);
    // output_function_chart = new Chart(document.getElementById('output_function'), output_function_config);
    bode_ampl_chart = new Chart(document.getElementById('bode_ampl'), bodeAmplitudeChartConfig);
    bode_phase_chart = new Chart(document.getElementById('bode_phase'), bodePhaseChartConfig);
}

function savePreviousValue(e) {
    previousValues[e.target.id] = e.target.value;
}

function checkValueAndCalculate(e) {
    if (!checkValues())
    {
        MicroModal.show('modal-wrong-value');
        e.target.value = previousValues[e.target.id];
        return;
    }
    calculate();
}

function setupEvents()
{
    r_input.onkeydown = savePreviousValue;
    r2_input.onkeydown = savePreviousValue;
    l_input.onkeydown = savePreviousValue;
    c_input.onkeydown = savePreviousValue;
    c_input.onkeydown = savePreviousValue;

    ampl_input.onkeydown = savePreviousValue;
    freq_input.onkeydown = savePreviousValue;
    

    ampl_input.onkeyup = checkValueAndCalculate;
    freq_input.onkeyup = checkValueAndCalculate;

    r_input.onkeyup = checkValueAndCalculate;
    r2_input.onkeyup = checkValueAndCalculate;
    l_input.onkeyup = checkValueAndCalculate;
    c_input.onkeyup = checkValueAndCalculate;

    function_input.onchange = checkValueAndCalculate;
    solver_input.onchange = checkValueAndCalculate;
}

function loadDefaultValues()
{
    r_input.value = default_values.r;
    r2_input.value = default_values.r2;
    l_input.value = default_values.l;
    c_input.value = default_values.c;

    ampl_input.value = default_values.ampl;
    freq_input.value = default_values.freq;
}

function checkValues() {
    if (isNaN(Number(r_input.value)) ||
        isNaN(Number(r2_input.value)) ||
        isNaN(Number(l_input.value)) ||
        isNaN(Number(c_input.value)) ||
        isNaN(Number(ampl_input.value)) ||
        isNaN(Number(freq_input.value))
        )
        return false;

    const R = parseFloat(r_input.value);
    const R2 = parseFloat(r2_input.value);
    const L = parseFloat(l_input.value);
    const C = parseFloat(c_input.value);
    const F = parseFloat(freq_input.value);

    if (R == 0 || R2 == 0 || L == 0 || C == 0 || F == 0)
        return false;
    
    return true;
}

function calculate()
{
    const total = Math.floor(T / h) + 1;
    const time = Array.from({ length: total }, (_, i) => i * h);

    if (!checkValues())
    {
        MicroModal.show('modal-wrong-value');
        return;
    }

    const signalType = function_input.value;
    const solverType = solver_input.value;

    const A = parseFloat(ampl_input.value);
    const F = parseFloat(freq_input.value);

    const R = parseFloat(r_input.value);
    const R2 = parseFloat(r2_input.value);
    const L = parseFloat(l_input.value);
    const C = parseFloat(c_input.value);

    let u, u1p;

    if (signalType === 'harmonic') {
        var x = sinFunction(total, A, F);
        u = x.u;
        u1p = x.u1p;
    } else if (signalType === 'triangle') {
        var x  = triangleFunction(total, A, F);
        u = x.u;
        u1p = x.u1p;
    } else if (signalType === 'square') {
        let x = squareFunction(total, A, F);
        u = x.u;
        u1p = x.u1p;
    } else if (signalType === 'heaviside') {
        let x = heavisideFunction(total, A);
        u = x.u;
        u1p = x.u1p;
    }

    // Transmittance coefficients
    const a2 = 1;
    const a1 = (R+R2)/(C*R*R2);
    const a0 = 1/(L*C);
    const b1 = 0;
    const b0 = 1/(L*C);

    var y;
    
    switch (solverType)
    {
        case 'taylor':
            y = calculateTaylor(total, u, u1p, a2, a1, a0, b1, b0, h);
            break;
        case 'state':
            y = calculateStateModel(u, 
                math.matrix([
                    [0, -1/L], 
                    [1/C, ((-(R+R2))/(C*R*R2))]
                ]), 
            math.matrix([[1/L], [0]]),
            math.matrix([0, 1]),
            math.matrix([0]), 
            total, h);
            break;
    }

    // Plot input and output function
    const inputTrace = {
        x: time,
        y: u,
        mode: 'lines',
        name: 'Input Signal'
    };

    const outputTrace = {
        x: time,
        y: y.toArray(),
        mode: 'lines',
        name: 'Output Signal'
    };

    Plotly.newPlot('input_function', [inputTrace], inputChartConfig);
    Plotly.newPlot('output_function', [outputTrace], outputChartConfig);

    // Calculate and plot bode diagrams
    const w = math.range(0, wmax + dw, dw).toArray();
    const { Aw, Fw } = bodePlot(w, b0, a2, a1, a0);

    bode_ampl_chart.data.labels = w.map( x => x.toFixed(1));
    bode_ampl_chart.data.datasets[0].data = Aw.map(x => math.multiply(x, 1000));
    bode_ampl_chart.update();
    bode_phase_chart.data.labels = w.map( x => x.toFixed(1));
    bode_phase_chart.data.datasets[0].data = Fw.map(x => math.multiply(x, 1000));
    bode_phase_chart.update();
}
