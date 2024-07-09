const defaultCurahHujan = [
    300, 50, 300, 750, 850, 750, 850, 50, 550, 550,
    750, 750, 850, 750, 50, 750, 300, 50, 300, 150,
    850, 150, 300, 50, 50, 150, 850, 300, 300, 550,
    150, 150, 150, 850, 750, 150, 750, 50, 550, 750,
    550, 850, 550, 300, 300, 300, 750, 850, 550, 150,
    50, 550, 50, 50, 850, 750, 850, 550, 550, 150,
    300, 750, 850, 750, 850, 50, 550, 550, 300, 50,
    150, 300, 50, 50, 150, 850, 150, 750, 750, 750,
    550, 850, 550, 300, 300, 300, 750, 850, 850, 150,
    50, 550, 50, 50, 850, 750, 850, 750, 150, 150
];

const defaultLamaHujan = [
    11, 20, 13, 19, 19, 6, 18, 15, 18, 25,
    18, 2, 19, 19, 25, 6, 27, 22, 31, 3,
    25, 12, 22, 17, 15, 6, 6, 27, 27, 15,
    1, 15, 25, 13, 31, 13, 6, 6, 27, 17,
    14, 22, 18, 18, 15, 20, 25, 22, 27, 27,
    31, 20, 5, 25, 20, 20, 14, 22, 18, 27,
    13, 31, 13, 6, 6, 27, 17, 5, 19, 19,
    18, 18, 15, 20, 25, 22, 27, 27, 19, 25,
    5, 25, 20, 20, 14, 22, 18, 27, 17, 15,
    2, 19, 19, 25, 6, 27, 22, 5, 13, 31
];

let simulasiChart;

function generateInputsByClick() {
    const numInputs = document.getElementById('numInputs').value;

    if(numInputs <= 0){
        return alert("Jumlah input tidak valid")
    }

    generateInputs(numInputs)
}

function generateInputs(numInputs, defaultVal = false) {
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';

    const inputContainer = document.getElementById('inputContainer');
    inputContainer.innerHTML = '';

    // Create Curah Hujan inputs
    const curahHujanDiv = document.createElement('div');
    curahHujanDiv.innerHTML = '<label>Curah Hujan Bulanan (mm):</label><br>';
    curahHujanDiv.classList.add('input-div')
    for (let i = 0; i < numInputs; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.classList.add('curahHujan');
        if(defaultVal){
            input.value = defaultCurahHujan[i]; // Use default values
        }else{
            input.value = ''
        }
        curahHujanDiv.appendChild(input);
    
    }
    inputContainer.appendChild(curahHujanDiv);

    // Create Lama Hujan inputs
    const lamaHujanDiv = document.createElement('div');
    lamaHujanDiv.classList.add('input-div')
    lamaHujanDiv.innerHTML = '<label>Lama Hujan Bulanan (hari):</label><br>';
    for (let i = 0; i < numInputs; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.max = '31'
        input.classList.add('lamaHujan');
        if(defaultVal){
            input.value = defaultLamaHujan[i]; // Use default values
        }else{
            input.value = ''
        }
        lamaHujanDiv.appendChild(input);
    }
    inputContainer.appendChild(lamaHujanDiv);
}


function buatSimulasiIntensitasCurahHujan() {
    let intervalAngkaAcak = getIntervalAngkaAcak()

    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';
    
    let zTerakhirCH = 10122034
    let zTerakhirLH = 10122002

    let banyakSimulasi = 100;
    let dataHasilSimulasi = []

    for(let i = 0; i < banyakSimulasi; i++){
        zTerakhirCH = simulasiAngkaAcak(11, 29, 997, zTerakhirCH)
        angkaAcakCH = zTerakhirCH / 997 * 100
        
        zTerakhirLH = simulasiAngkaAcak(19, 31, 811, zTerakhirLH)
        angkaAcakLH = zTerakhirLH / 811 * 100

        let nilaiSimulasiCH;
        let lastIntervalCH;
        let intervalAngkaAcakCH = intervalAngkaAcak['curahHujan']
        for(let interval in intervalAngkaAcakCH){
            if(angkaAcakCH <= interval ){
                nilaiSimulasiCH = intervalAngkaAcakCH[interval]
                break;
            }
            lastIntervalCH = interval
        }
        if(nilaiSimulasiCH == undefined){
            nilaiSimulasiCH = intervalAngkaAcakCH[lastIntervalCH]
        }


        let nilaiSimulasiLH;
        let lastIntervalLH;
        let intervalAngkaAcakLH = intervalAngkaAcak['lamaHujan']
        for(let interval in intervalAngkaAcakLH){
            if(angkaAcakLH < interval ){
                nilaiSimulasiLH = intervalAngkaAcakLH[interval]
                break;
            }
            lastIntervalLH = interval
        }
        if(nilaiSimulasiLH == undefined){
            nilaiSimulasiLH = intervalAngkaAcakLH[lastIntervalLH]
        }

        let intensitasCurahHujan = nilaiSimulasiCH / nilaiSimulasiLH
        let statusCuaca = getStatusCuaca(intensitasCurahHujan)
        
        dataHasilSimulasi.push({
            nilaiSimulasiCH: Math.round(nilaiSimulasiCH),
            nilaiSimulasiLH: Math.round(nilaiSimulasiLH),
            intensitasCurahHujan: Math.round(intensitasCurahHujan),
            statusCuaca: statusCuaca
        });

        const row = `<tr>
                        <td>${i + 1}</td>
                        <td>${Math.round(angkaAcakCH)}</td>
                        <td>${Math.round(angkaAcakLH)}</td>
                        <td>${Math.round(nilaiSimulasiCH)}</td>
                        <td>${Math.round(nilaiSimulasiLH)}</td>
                        <td>${Math.round(intensitasCurahHujan)}</td>
                        <td>${statusCuaca}</td>
                    </tr>`;
        resultsBody.insertAdjacentHTML('beforeend', row);
    }

    buatChartPerhitunganStatusCuaca(dataHasilSimulasi)
    buatChartHasilSimulasi(dataHasilSimulasi)
}

function getIntervalAngkaAcak() {
    const curahHujanInputs = document.querySelectorAll('.curahHujan');
    const lamaHujanInputs = document.querySelectorAll('.lamaHujan');

    // Pengolahan curah hujan
    let frekuensiCurahHujan = {}
    let frekuensiLamaHujan = {}

    for(let i = 0; i < curahHujanInputs.length; i++){
        let curCurahHujanVal = curahHujanInputs[i].value
        let curLamaHujanVal = lamaHujanInputs[i].value

        if(curCurahHujanVal == "" || curLamaHujanVal == ""){
            return alert("Input tidak valid!!")
        }

        if(curLamaHujanVal > 31){
            return alert("Input lama hujan tidak boleh lebih dari 31")
        }
        
        if(String(curCurahHujanVal) in frekuensiCurahHujan){
            frekuensiCurahHujan[String(curCurahHujanVal)] += 1
        }else{
            frekuensiCurahHujan[String(curCurahHujanVal)] = 1
        }

        if(String(curLamaHujanVal) in frekuensiLamaHujan){
            frekuensiLamaHujan[String(curLamaHujanVal)] += 1
        }else{
            frekuensiLamaHujan[String(curLamaHujanVal)] = 1
        }

    }

    // CH = curah hujan
    let sortedKeysCH = Object.keys(frekuensiCurahHujan).sort((a, b) => a - b);
    let intervalAngkaAcakCH = {}

    let probKumLastCH = 0;
    for(let i = 0; i < sortedKeysCH.length; i++){
        const curKey = sortedKeysCH[i]

        let probabilitas = frekuensiCurahHujan[curKey] / curahHujanInputs.length
        let probabilitasKumulatif = probabilitas + probKumLastCH
        probKumLastCH = probabilitasKumulatif
        let intervalAngkaAcakCHVal = probabilitasKumulatif * 100 - 1
        intervalAngkaAcakCH[intervalAngkaAcakCHVal] = curKey

    }

    // LH = lama hujan
    let sortedKeysLH = Object.keys(frekuensiLamaHujan).sort((a, b) => a - b);
    let intervalAngkaAcakLH = {}

    if(Object.keys(frekuensiLamaHujan).length < 8){
        let probKumLastLH = 0;
        for(let i = 0; i < sortedKeysLH.length; i++){
            const curKey = sortedKeysLH[i]
    
            let probabilitas = frekuensiLamaHujan[curKey] / curahHujanInputs.length
            let probKum = probabilitas + probKumLastLH
            probKumLastLH = probKum
            let intervalAngkaAcakLHVal = probKum * 100 - 1
            intervalAngkaAcakLH[intervalAngkaAcakLHVal] = curKey
    
        }
    }else{
        let rentang = Object.keys(frekuensiLamaHujan).at(-1) - Object.keys(frekuensiLamaHujan).at(0) 
        let banyakKelas = Math.round(1 + 3.3 * Math.log10(curahHujanInputs.length))
        let panjangKelas = Math.round(rentang / banyakKelas)
        let intervalFrekuensi = []
        let intervalAtasTerakhir = Object.keys(frekuensiLamaHujan).at(0) - 1
        for(let i = 0; i < banyakKelas; i++){
            let intervalAtas = intervalAtasTerakhir + panjangKelas
            intervalFrekuensi.push({[intervalAtas]:0})
            intervalAtasTerakhir = intervalAtas
        }

        let probKumLast = 0
        let j = 0
        for(let i = 0; i < intervalFrekuensi.length; i++){
            let curKey = parseInt(Object.keys(intervalFrekuensi[i])[0])
            while(j <= parseInt(Object.keys(intervalFrekuensi[i])[0])){
                if(String(j) in frekuensiLamaHujan){
                    intervalFrekuensi[i][curKey] += frekuensiLamaHujan[String(j)]
                }
                j += 1
            }
            let nilaiTengah = (curKey + (curKey - panjangKelas + 1)) / 2
            let probabilitas = intervalFrekuensi[i][curKey] / lamaHujanInputs.length
            let probKum = probKumLast + probabilitas
            probKumLast = probKum
            let intervalAngkaAcakLHVal = probKum * 100 - 1
            intervalAngkaAcakLH[intervalAngkaAcakLHVal] = nilaiTengah
        }
    }

    return {'curahHujan' : intervalAngkaAcakCH, 'lamaHujan': intervalAngkaAcakLH}
}

function simulasiAngkaAcak(a, c, m, zSebelum) {
    let zi = (zSebelum * a + c) % m
    return zi
}

function buatChartHasilSimulasi(dataHasilSimulasi) {
    const simulasiChartLabel = document.getElementById('label-grafik-simulasi')
    simulasiChartLabel.innerHTML = 'Hasil Simulasi Intensitas Curah Hujan per Bulan'

    const ctx = document.getElementById('simulasiChart');
    ctx.innerHTML = ''

    const intensitasCurahHujan = dataHasilSimulasi.map(data => data.intensitasCurahHujan);

    const data = {
        labels: Array.from({ length: intensitasCurahHujan.length }, (_, i) => i + 1),
        datasets: [{
            label: 'Intensitas Curah Hujan',
            data: intensitasCurahHujan,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    if(simulasiChart){
        simulasiChart.destroy()
    }

    simulasiChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            plugins : {
                legend : false
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Bulan ke-'
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Intensitas Curah Hujan'
                    },
                    beginAtZero: true
                }
            }
        }
    });
    
}

function buatChartPerhitunganStatusCuaca(dataHasilSimulasi){
    const cuacaChartLabel = document.getElementById('label-grafik-cuaca')
    cuacaChartLabel.innerHTML = "Jumlah Kemunculan Setiap Intensitas Curah Hujan"

    const ctxStatusCuaca = document.getElementById('statusCuacaChart').getContext('2d');
    ctxStatusCuaca.innerHTML = ''

    // Hitung jumlah kemunculan setiap status cuaca
    const statusCuacaCount = dataHasilSimulasi.reduce((acc, data) => {
        if (acc[data.statusCuaca]) {
            acc[data.statusCuaca]++;
        } else {
            acc[data.statusCuaca] = 1;
        }
        return acc;
    }, {});

     const statusCuacaLabels = [
        'Hujan Sangat Ringan',
        'Hujan Ringan',
        'Hujan Sedang',
        'Hujan Lebat',
        'Hujan Sangat Lebat'
    ];

    const statusCuacaData = statusCuacaLabels.map(label => statusCuacaCount[label] || 0);


    const statusCuacaColors = [
        'rgba(167, 230, 255, 0.7)', // Hujan Sangat Ringan
        'rgba(58, 190, 249, 0.7)', // Hujan Ringan
        'rgba(53, 114, 239, 0.7)',  // Hujan Sedang
        'rgba(47, 54, 196, 0.7)',  // Hujan Lebat
        'rgba(0, 20, 120, 0.7)'      // Hujan Sangat Lebat
    ];

    const dataStatusCuaca = {
        labels: statusCuacaLabels,
        datasets: [{
            label: 'Jumlah Kemunculan Status Cuaca',
            data: statusCuacaData,
            backgroundColor: statusCuacaColors,
            borderColor: statusCuacaColors.map(color => color.replace('0.7)', '1)')),
            borderWidth: 2
        }]
    };

    if(window.cuacaChart){
        window.cuacaChart.destroy()
    }

    window.cuacaChart = new Chart(ctxStatusCuaca, {
        type: 'bar',
        data: dataStatusCuaca,
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    title: {
                        display : true,
                        text : 'Jumlah Kemunculan'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function getStatusCuaca(intensitasCH){
    if(intensitasCH < 6){
        return "Hujan Sangat Ringan"
    }else if(intensitasCH < 20){
        return "Hujan Ringan"
    }else if(intensitasCH < 50){
        return "Hujan Sedang"
    }else if(intensitasCH < 100){
        return "Hujan Lebat"
    }else{
        return "Hujan Sangat Lebat"
    }
}


// Generate default inputs and run simulation on page load
window.onload = () => {
    generateInputs(100, true)
    buatSimulasiIntensitasCurahHujan();
};
