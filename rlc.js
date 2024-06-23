function bodePlot(w, b0, a2, a1, a0) {

    const j = math.complex(0, 1);
    const Ljw = w.map(omega => {
        var v4 = b0;
        return v4;
    });

    const Mjw = w.map(omega => {
        var m3 = math.pow(math.multiply(a2, math.multiply(j, omega)), 2);
        var m4 = math.multiply(a1, math.multiply(j, omega));
        var m5 = a0;
        return math.add(m3, m4, m5);
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

function sinFunction(total, ampl, freq) {
    const u = new Array(total).fill(0);
    const u1p = new Array(total).fill(0);
    const w = 2.0 * Math.PI * freq;
    for (let i = 0; i < total; i++) {
        const t = i * h;
        u[i] = ampl * Math.sin(w * t);
        u1p[i] = ampl * w * Math.cos(w * t);
    }
    return {u, u1p};
}

function triangleFunction(total, ampl, freq) {
    const u = new Array(total).fill(0);
    const u1p = new Array(total).fill(0);
    for (let i = 0; i < total; i++) {
        const t = i * h;
        u[i] = ampl * (2 * Math.abs(2 * (t * freq - Math.floor(t * freq + 0.5))) - 1);
        u1p[i] = 4 * ampl * Math.sign(2 * ((t * freq - Math.floor(t * freq + 0.5))) * freq);
    }
    return {u, u1p};
}

function squareFunction(total, ampl, freq) {
    const u = new Array(total).fill(0);
    const u1p = new Array(total).fill(0);
    for (let i = 0; i < total; i++) {
        const t = i * h;
        u[i] = ampl * Math.sign(Math.sin(2 * Math.PI * 1/freq * t));
    }
    return {u, u1p};
}

function heavisideFunction(total, A)
{
    const u = new Array(total).fill(0);
    const u1p = new Array(total).fill(0);
    for (i = 0; i < total; i++)
    {
            if (i == 0)
                u[i] = 0;
            else u[i] = A;
    }
    return {u, u1p};
}

function calculateStateModel(ux, A, B, C, D, total, h) {

    var y = math.zeros(total);
    var u = math.matrix(ux);
    let xi_1 = math.matrix([[0],[0]]);
    
    for (let i = 0; i < total; i++) {

        let Ax = math.multiply(A, xi_1);
        let Bu = math.multiply(B, u.get([i]));
        let Cx = math.multiply(C, xi_1);
        let Du = math.multiply(D, u.get([i]));

        let xi = math.add(Ax, Bu);
        xi = math.multiply(xi, h);
        xi = math.add(xi_1, xi);

        xi_1 = xi;
        
        y.set([i], math.add(Cx, Du).get([0]));
    }
    return y;
}

function calculateTaylor(total, u, u1p, a2, a1, a0, b1, b0, h)
{
    var y = math.zeros(total);
    var y1p = math.zeros(total);
    var y2p = math.zeros(total);

    for (let i = 0; i < total - 1; i++) {
        y2p.set([i], ((-a1/a2) * y1p.get([i]) - (a0/a2) * y.get([i]) + (b0/a2) * u[i]));
        y1p.set([i + 1], y1p.get([i]) + h * y2p.get([i]) );
        y.set([i + 1], y.get([i]) + h * y1p.get([i]) + (h * h / 2.0) * y2p.get([i]));
    }
    return y;
}
