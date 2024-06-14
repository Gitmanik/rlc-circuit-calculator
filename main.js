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

function calculate()
{
    if (!check_values())
    {
        MicroModal.show('modal-wrong-value');
        return;
    }

    // const signalType = document.getElementById('signal').value;
    const signalType = 'square';

    if (signalType === 'harmonic') {
        const L = parseFloat(document.getElementById('L').value);
        const M = parseFloat(document.getElementById('M').value);
        harmonicFunction(L, M);
    } else if (signalType === 'triangle') {
        const A = parseFloat(document.getElementById('A').value);
        const F = parseFloat(document.getElementById('F').value);
        triangleFunction(A, F);
    } else if (signalType === 'square') {
        // const AM = parseFloat(document.getElementById('AM').value);
        // const X = parseFloat(document.getElementById('X').value);
        // const H = parseFloat(document.getElementById('H').value);
        squareFunction();
    }
   
    const R = r_input.value;
    const R2 = r2_input.value;
    const L = l_input.value;
    const C = c_input.value;


    const b1 = 0;
    const b0 = 1/(L*C);
    const a2 = 1;
    const a1 = (R+R2)/(C*R*R2);
    const a0 = 1/(L*C);


    for (let i = 0; i < total - 1; i++) {
        y2p[i] = -(a1 / a2) * y1p[i] - (a0 / a2) * y[i] + (b1 / a2) * u1p[i] + (b0 / a2) * u[i];
        y1p[i + 1] = y1p[i] + h * y2p[i];
        y[i + 1] = y[i] + h * y1p[i] + (h * h / 2.0) * y2p[i];
    }

    input_function_chart.data.labels = time;
    input_function_chart.data.datasets[0].data = u;
    input_function_chart.update();
    
    output_function_chart.data.labels = time;
    output_function_chart.data.datasets[0].data = y;
    output_function_chart.update();

    
    const wmax = 20;
    const dw = 0.1;
    const w = math.range(0, wmax + dw, dw).toArray();
    const j = math.complex(0, 1);
    const Ljw = w.map(omega => {
        var v4 = b0;
        return v4;
    });
					//ewentualnie zmienic 1 linijke na "math.add(math.pow(math.multiply(j, omega), 2)," i w Ljw i Mjw podzielic wspolczynniki /a2)
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

    bode_ampl_chart.data.labels = w;
    bode_ampl_chart.data.datasets[0].data = Aw.map( x=>  math.multiply(x, 1));
    bode_ampl_chart.update();
    bode_phase_chart.data.labels = w;
    bode_phase_chart.data.datasets[0].data = Fw.map( x => math.multiply(x, 1));
    bode_phase_chart.update();
}

function diracDeltaApprox(x, epsilon) {
    return (1 / (epsilon * Math.sqrt(2 * Math.PI))) * Math.exp(-x * x / (2 * epsilon * epsilon));
}

function harmonicFunction(L = 2.5, M = 8.0) {
    const w = 2.0 * Math.PI * L / T;
    for (let i = 0; i < total; i++) {
        const t = i * h;
        u[i] = M * Math.sin(w * t);
        u1p[i] = M * w * Math.cos(w * t);
    }
}

function triangleFunction(ampl = 100, freq = 2) {
    for (let i = 0; i < total; i++) {
        const t = i * h;
        u[i] = ampl * (2 * Math.abs(2 * (t * freq - Math.floor(t * freq + 0.5))) - 1);
        u1p[i] = 4 * ampl * Math.sign(2 * (t * freq - Math.floor(t * freq + 0.5))) * freq;
        const deltaArg = t * freq - Math.floor(t * freq + 0.5);
    }
}

function squareFunction(ampl = 5, delay = 0.5, period = 0.5) {
    for (let i = 0; i < total; i++) {
        const t = i * h;
        u[i] = ampl * Math.sign(Math.sin(2 * Math.PI * period * (t - delay)));
        u1p[i] = 0;
    }
}


const h = 0.01;
const T = 10.0;
const total = Math.floor(T / h) + 1;
const time = Array.from({ length: total }, (_, i) => i * h);

let u = new Array(total).fill(0);
let u1p = new Array(total).fill(0);

let y = new Array(total).fill(0);
let y1p = new Array(total).fill(0);
let y2p = new Array(total).fill(0);
