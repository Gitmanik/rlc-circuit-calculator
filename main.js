var input_function_chart;
var output_function_chart;
var bode_ampl_chart, bode_phase_chart;

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

    function_input = document.getElementById('Function_type');
    ampl_input = document.getElementById('Ampl_input');
    freq_input = document.getElementById('Freq_input');
    
    input_function_chart = new Chart(document.getElementById('input_function'), input_function_config);
    output_function_chart = new Chart(document.getElementById('output_function'), output_function_config);
    bode_ampl_chart = new Chart(document.getElementById('bode_ampl'), bode_ampl_chart_config);
    bode_phase_chart = new Chart(document.getElementById('bode_phase'), bode_phase_chart_config);
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
    c_input.onkeydown = save_previous_value;

    ampl_input.onkeydown = save_previous_value;
    freq_input.onkeydown = save_previous_value;
    

    ampl_input.onkeyup = check_value_and_calculate;
    freq_input.onkeyup = check_value_and_calculate;

    r_input.onkeyup = check_value_and_calculate;
    r2_input.onkeyup = check_value_and_calculate;
    l_input.onkeyup = check_value_and_calculate;
    c_input.onkeyup = check_value_and_calculate;

    function_input.onchange = check_value_and_calculate;
}

function load_default_values()
{
    r_input.value = default_values.r;
    r2_input.value = default_values.r2;
    l_input.value = default_values.l;
    c_input.value = default_values.c;

    ampl_input.value = default_values.ampl;
    freq_input.value = default_values.freq;
}

function check_values() {
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
    if (!check_values())
    {
        MicroModal.show('modal-wrong-value');
        return;
    }

    const signalType = function_input.value;
    const A = parseFloat(ampl_input.value);
    const F = parseFloat(freq_input.value);

    const R = parseFloat(r_input.value);
    const R2 = parseFloat(r2_input.value);
    const L = parseFloat(l_input.value);
    const C = parseFloat(c_input.value);

    var u, u1p;

    if (signalType === 'harmonic') {
        u, u1p = harmonicFunction(A, F);
    } else if (signalType === 'triangle') {
        u, u1p = triangleFunction(A, F);
    } else if (signalType === 'square') {
        u = squareFunction(A, F);
    }
   
    // OUTPUT FUNCTION
    const b1 = 0;
    const b0 = 1/(L*C);
    const a2 = 1;
    const a1 = (R+R2)/(C*R*R2);
    const a0 = 1/(L*C);

    var y = simulate(u, -1/L, 1/C, -((R+R2)/(C*R*R2)), 1/L, 0, total, h);

    input_function_chart.data.labels = time;
    input_function_chart.data.datasets[0].data = u;
    input_function_chart.update();
    
    output_function_chart.data.labels = time;
    output_function_chart.data.datasets[0].data = y;
    output_function_chart.update();

    
    // BODE PLOT
    const j = math.complex(0, 1);
    const Ljw = w.map(omega => {
        var v4 = b0;
        return v4;
    });

    const Mjw = w.map(omega => {
        var m1 = math.pow(math.multiply(j, omega), 4);
        var m3 = math.pow(math.multiply(a2, math.multiply(j, omega)), 2);
        var m4 = math.multiply(a1, math.multiply(j, omega));
        var m5 = a0;
        return math.add(m1, m3, m4, m5);
    });

    const Hjw = Ljw.map((Ljw_i, index) => math.divide(Ljw_i, Mjw[index]));

    const Aw = Hjw.map(Hjw_i => math.abs(Hjw_i));
    const Fw = Hjw.map(Hjw_i => math.arg(Hjw_i));

    for (let k = 0; k < Fw.length; k++) {
        if (Fw[k] < 0) {
            Fw[k] += 2 * Math.PI;
        }
    }

    Fw.shift(0);
    Aw.shift(0);

    bode_ampl_chart.data.labels = w.map( x => x.toFixed(1));
    bode_ampl_chart.data.datasets[0].data = Aw.map(x => math.multiply(x, 1000));
    bode_ampl_chart.update();
    bode_phase_chart.data.labels = w.map( x => x.toFixed(1));
    bode_phase_chart.data.datasets[0].data = Fw.map(x => math.multiply(x, 1000));
    bode_phase_chart.update();
}


function harmonicFunction(ampl, freq) {
    var u = new Array(total).fill(0);
    var u1p = new Array(total).fill(0);
    const w = 2.0 * Math.PI * freq;
    for (let i = 0; i < total; i++) {
        const t = i * h;
        u[i] = ampl * Math.sin(w * t);
        u1p[i] = ampl * w * Math.cos(w * t);
    }
    return u, u1p;
}

function triangleFunction(ampl, freq) {
    var u = new Array(total).fill(0);
    var u1p = new Array(total).fill(0);
    for (let i = 0; i < total; i++) {
        const t = i * h;
        u[i] = ampl * (2 * Math.abs(2 * (t * freq - Math.floor(t * freq + 0.5))) - 1);
        u1p[i] = 4 * ampl * Math.sign(2 * ((t * freq - Math.floor(t * freq + 0.5))) * freq);
    }
    return u, u1p;
}

function squareFunction(ampl, freq) {
    var u = new Array(total).fill(0);
    var u1p = new Array(total).fill(0);
    for (let i = 0; i < total; i++) {
        const t = i * h;
        u[i] = ampl * Math.sign(Math.sin(2 * Math.PI * 1/freq * t));
    }
    return u;
}

function simulate(ux, a2, a1, a0, b1, b0, total, h) {

    var y = new Array(total).fill(0);

    // Define matrices and vectors using math.js
    let A = math.matrix([
        [0, a2],
        [a0, a1]
    ]);
    let B = math.matrix([b1, b0]);
    let C = math.matrix([0, 1]);
    let D = math.matrix([0]);

    // Initial state vector
    let xi_1 = math.matrix([[0],[0]]);

    for (let i = 0; i < total; i++) {

        // Calculate Ax
        let Ax = math.multiply(A, xi_1);
        // Calculate Bu
        let Bu = math.multiply(B, ux[i]);
        // Calculate Cx
        let Cx = math.multiply(C, xi_1);
        // Calculate Du
        let Du = math.multiply(D, ux[i]);

        // Update state vector xi
        let xi = math.add(Ax, Bu);
        xi = math.multiply(xi, h);
        xi = math.add(xi_1, xi);

        // Update previous state
        xi_1 = xi;
        
        // Update output
        y[i] = math.add(Cx, Du).get([0]);
    }
    return y;
}
