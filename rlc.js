
function bodePlot(b0, a2, a1, a0) {
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
    return { Aw, Fw };
}

function sinFunction(ampl, freq) {
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

function calculateOutput(ux, a2, a1, a0, b1, b0, total, h) {

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
