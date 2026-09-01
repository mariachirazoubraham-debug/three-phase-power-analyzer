let lastResults = null;


/* ================= CALCULATE ================= */

function calculatePower() {

    const connection =
        document.getElementById("connection").value;

    const voltage =
        parseFloat(document.getElementById("voltage").value);

    const current =
        parseFloat(document.getElementById("current").value);

    const pf =
        parseFloat(document.getElementById("pf").value);

    const error =
        document.getElementById("error");


    error.textContent = "";


    if (
        isNaN(voltage) ||
        isNaN(current) ||
        isNaN(pf)
    ) {
        error.textContent =
            "Please enter all values.";

        return;
    }


    if (voltage <= 0 || current <= 0) {

        error.textContent =
            "Voltage and current must be positive.";

        return;
    }


    if (pf < 0 || pf > 1) {

        error.textContent =
            "Power factor must be between 0 and 1.";

        return;
    }


    /* ================= STAR / DELTA ================= */

    let phaseVoltage;
    let phaseCurrent;


    if (connection === "star") {

        phaseVoltage =
            voltage / Math.sqrt(3);

        phaseCurrent =
            current;

    } else {

        phaseVoltage =
            voltage;

        phaseCurrent =
            current / Math.sqrt(3);
    }


    /* ================= POWER ================= */

    const apparentPower =
        Math.sqrt(3) *
        voltage *
        current;


    const activePower =
        apparentPower * pf;


    const reactivePower =
        apparentPower *
        Math.sqrt(1 - pf * pf);


    const phaseAngle =
        Math.acos(pf) *
        180 /
        Math.PI;


    /* ================= DISPLAY ================= */

    document.getElementById("phaseVoltage")
        .textContent =
        phaseVoltage.toFixed(2);


    document.getElementById("phaseCurrent")
        .textContent =
        phaseCurrent.toFixed(2);


    document.getElementById("activePower")
        .textContent =
        (activePower / 1000).toFixed(2);


    document.getElementById("reactivePower")
        .textContent =
        (reactivePower / 1000).toFixed(2);


    document.getElementById("apparentPower")
        .textContent =
        (apparentPower / 1000).toFixed(2);


    document.getElementById("phaseAngle")
        .textContent =
        phaseAngle.toFixed(2);


    /* ================= SAVE RESULTS ================= */

    lastResults = {

        connection:
            connection === "star"
                ? "Star (Y)"
                : "Delta (Δ)",

        voltage,
        current,
        pf,

        phaseVoltage,
        phaseCurrent,

        activePower,
        reactivePower,
        apparentPower,

        phaseAngle
    };


    /* ================= TRIANGLE ================= */

    updatePowerTriangle(
        activePower,
        reactivePower,
        apparentPower
    );
}


/* ================= POWER TRIANGLE ================= */

function updatePowerTriangle(P, Q, S) {

    const x0 = 70;
    const y0 = 280;

    const maxWidth = 350;
    const maxHeight = 210;

    const scale =
        Math.max(
            P,
            Q,
            1
        );


    const width =
        (P / scale) *
        maxWidth;


    const height =
        (Q / scale) *
        maxHeight;


    const x1 =
        x0 + width;


    const y1 =
        y0 - height;


    const triangle =
        document.getElementById("triangleShape");


    triangle.setAttribute(
        "points",
        `${x0},${y0} ${x1},${y0} ${x1},${y1}`
    );


    document.getElementById("pLabel")
        .setAttribute(
            "x",
            x0 + width / 2
        );

    document.getElementById("pLabel")
        .setAttribute(
            "y",
            y0 + 30
        );


    document.getElementById("qLabel")
        .setAttribute(
            "x",
            x0 - 30
        );

    document.getElementById("qLabel")
        .setAttribute(
            "y",
            y0 - height / 2
        );


    document.getElementById("sLabel")
        .setAttribute(
            "x",
            x0 + width / 2
        );

    document.getElementById("sLabel")
        .setAttribute(
            "y",
            y0 - height / 2
        );
}


/* ================= DARK MODE ================= */

function toggleDarkMode() {

    document.body.classList.toggle("dark");

    const button =
        document.getElementById("darkBtn");

    if (
        document.body.classList.contains("dark")
    ) {
        button.textContent = "☀️";
    } else {
        button.textContent = "🌙";
    }
}


/* ================= LANGUAGE ================= */

let currentLanguage = "en";


function toggleLanguage() {

    currentLanguage =
        currentLanguage === "en"
            ? "fr"
            : "en";


    document.querySelectorAll("[data-en]")
        .forEach(element => {

            element.textContent =
                element.dataset[currentLanguage];

        });


    document.getElementById("languageBtn")
        .textContent =
        currentLanguage === "en"
            ? "🇫🇷 FR"
            : "🇬🇧 EN";
}


/* ================= RESET ================= */

function resetCalculator() {

    document.getElementById("voltage").value = "";

    document.getElementById("current").value = "";

    document.getElementById("pf").value = "";

    document.getElementById("error").textContent = "";


    [
        "phaseVoltage",
        "phaseCurrent",
        "activePower",
        "reactivePower",
        "apparentPower",
        "phaseAngle"
    ].forEach(id => {

        document.getElementById(id)
            .textContent = "—";

    });


    document.getElementById("triangleShape")
        .setAttribute(
            "points",
            "70,280 70,280 70,280"
        );


    lastResults = null;
}


/* ================= PDF REPORT ================= */

function downloadPDF() {

    if (!lastResults) {

        alert(
            "Please calculate the system first."
        );

        return;
    }


    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "PDF library could not be loaded."
        );

        return;
    }


    const {
        jsPDF
    } = window.jspdf;


    const pdf = new jsPDF();


    /* HEADER */

    pdf.setFontSize(22);

    pdf.text(
        "Three-Phase Power Analyzer",
        20,
        25
    );


    pdf.setFontSize(11);

    pdf.text(
        "Electrical Engineering Report",
        20,
        34
    );


    /* INPUTS */

    pdf.setFontSize(15);

    pdf.text(
        "Input Parameters",
        20,
        55
    );


    pdf.setFontSize(11);

    pdf.text(
        `Connection: ${lastResults.connection}`,
        20,
        68
    );

    pdf.text(
        `Line Voltage: ${lastResults.voltage.toFixed(2)} V`,
        20,
        78
    );

    pdf.text(
        `Line Current: ${lastResults.current.toFixed(2)} A`,
        20,
        88
    );

    pdf.text(
        `Power Factor: ${lastResults.pf.toFixed(3)}`,
        20,
        98
    );


    /* RESULTS */

    pdf.setFontSize(15);

    pdf.text(
        "Results",
        20,
        120
    );


    pdf.setFontSize(11);

    pdf.text(
        `Phase Voltage: ${lastResults.phaseVoltage.toFixed(2)} V`,
        20,
        135
    );

    pdf.text(
        `Phase Current: ${lastResults.phaseCurrent.toFixed(2)} A`,
        20,
        145
    );

    pdf.text(
        `Active Power: ${(lastResults.activePower / 1000).toFixed(2)} kW`,
        20,
        155
    );

    pdf.text(
        `Reactive Power: ${(lastResults.reactivePower / 1000).toFixed(2)} kVAR`,
        20,
        165
    );

    pdf.text(
        `Apparent Power: ${(lastResults.apparentPower / 1000).toFixed(2)} kVA`,
        20,
        175
    );

    pdf.text(
        `Phase Angle: ${lastResults.phaseAngle.toFixed(2)}°`,
        20,
        185
    );


    /* FORMULAS */

    pdf.setFontSize(15);

    pdf.text(
        "Formulas",
        20,
        210
    );


    pdf.setFontSize(11);

    pdf.text(
        "S = √3 × VL × IL",
        20,
        225
    );

    pdf.text(
        "P = S × cosφ",
        20,
        235
    );

    pdf.text(
        "Q = S × sinφ",
        20,
        245
    );


    /* FOOTER */

    pdf.setFontSize(9);

    pdf.text(
        "Generated by Three-Phase Power Analyzer",
        20,
        280
    );


    pdf.save(
        "Three-Phase-Power-Report.pdf"
    );
}
