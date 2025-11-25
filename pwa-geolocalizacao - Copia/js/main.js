// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            let reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
            console.log('Service worker registrada! 😎', reg);
        } catch (err) {
            console.log('😥 Service worker registro falhou: ', err);
        }
    });
}

// Variáveis principais
let posicaoInicial;

const capturarLocalizacao = document.getElementById('localizacao');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
const iframeMapa = document.getElementById('iframeMapa');

// Captura da localização automática
const sucesso = (posicao) => {
    posicaoInicial = posicao;

    const lat = posicaoInicial.coords.latitude;
    const lng = posicaoInicial.coords.longitude;

    latitude.innerHTML = lat;
    longitude.innerHTML = lng;

    // Atualiza mapa
    iframeMapa.src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
};

const erro = (error) => {
    let msg = {
        0: "Erro desconhecido",
        1: "Permissão negada!",
        2: "Posição indisponível!",
        3: "Tempo excedido!"
    };
    console.log("Erro: " + msg[error.code]);
};

// Botão para capturar localização
capturarLocalizacao.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(sucesso, erro, {
        enableHighAccuracy: true
    });
});


// 📍 Botão para visualizar coordenadas manuais
document.getElementById("btnVerMapa").addEventListener("click", () => {
    const lat = document.getElementById("latManual").value;
    const lng = document.getElementById("lngManual").value;

    if (!lat || !lng) {
        alert("Preencha latitude e longitude!");
        return;
    }

    iframeMapa.src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
});
