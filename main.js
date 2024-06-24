var inputFunctionChart;
var outputFunctionChart;
var bodeAmplitudeChart, bodePhaseChart;

var rInput;
var r2Input;
var lInput;
var cInput;
var amplitudeInput;
var frequencyInput;

var functionTypeInput, solverTypeInput;

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
    rInput = document.getElementById('R_input');
    r2Input = document.getElementById('R2_input');
    lInput = document.getElementById('L_input');
    cInput = document.getElementById('C_input');

    functionTypeInput = document.getElementById('Function_type');
    solverTypeInput = document.getElementById('Solver_type');
    amplitudeInput = document.getElementById('Ampl_input');
    frequencyInput = document.getElementById('Freq_input');
    
    bodeAmplitudeChart = new Chart(document.getElementById('bode_ampl'), bodeAmplitudeChartConfig);
    bodePhaseChart = new Chart(document.getElementById('bode_phase'), bodePhaseChartConfig);
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
    rInput.onkeydown = savePreviousValue;
    r2Input.onkeydown = savePreviousValue;
    lInput.onkeydown = savePreviousValue;
    cInput.onkeydown = savePreviousValue;
    cInput.onkeydown = savePreviousValue;

    amplitudeInput.onkeydown = savePreviousValue;
    frequencyInput.onkeydown = savePreviousValue;
    

    amplitudeInput.onkeyup = checkValueAndCalculate;
    frequencyInput.onkeyup = checkValueAndCalculate;

    rInput.onkeyup = checkValueAndCalculate;
    r2Input.onkeyup = checkValueAndCalculate;
    lInput.onkeyup = checkValueAndCalculate;
    cInput.onkeyup = checkValueAndCalculate;

    functionTypeInput.onchange = checkValueAndCalculate;
    solverTypeInput.onchange = checkValueAndCalculate;
}

function loadDefaultValues()
{
    rInput.value = defaultInputValues.r;
    r2Input.value = defaultInputValues.r2;
    lInput.value = defaultInputValues.l;
    cInput.value = defaultInputValues.c;

    amplitudeInput.value = defaultInputValues.ampl;
    frequencyInput.value = defaultInputValues.freq;
}

function checkValues() {
    if (isNaN(Number(rInput.value)) ||
        isNaN(Number(r2Input.value)) ||
        isNaN(Number(lInput.value)) ||
        isNaN(Number(cInput.value)) ||
        isNaN(Number(amplitudeInput.value)) ||
        isNaN(Number(frequencyInput.value))
        )
        return false;

    const R = parseFloat(rInput.value);
    const R2 = parseFloat(r2Input.value);
    const L = parseFloat(lInput.value);
    const C = parseFloat(cInput.value);
    const F = parseFloat(frequencyInput.value);

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

    const signalType = functionTypeInput.value;
    const solverType = solverTypeInput.value;
    const A = parseFloat(amplitudeInput.value);
    const F = parseFloat(frequencyInput.value);
    const R = parseFloat(rInput.value);
    const R2 = parseFloat(r2Input.value);
    const L = parseFloat(lInput.value);
    const C = parseFloat(cInput.value);

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
    const w = math.range(0, omegaMax + dOmega, dOmega).toArray();
    const { Aw, Fw } = bodePlot(w, b0, a2, a1, a0);

    bodeAmplitudeChart.data.labels = w.map( x => x.toFixed(1));
    bodeAmplitudeChart.data.datasets[0].data = Aw.map(x => math.multiply(x, 1000));
    bodeAmplitudeChart.update();
    bodePhaseChart.data.labels = w.map( x => x.toFixed(1));
    bodePhaseChart.data.datasets[0].data = Fw.map(x => math.multiply(x, 1000));
    bodePhaseChart.update();
}
