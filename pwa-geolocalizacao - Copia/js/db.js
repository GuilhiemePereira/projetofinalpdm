import { openDB } from "idb";

let db;
let ultimaPosicao;

async function createDB() {
    db = await openDB("banco", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("pessoas")) {
                const store = db.createObjectStore("pessoas", { keyPath: "nome" });
                store.createIndex("nome", "nome");
            }
        }
    });
}

createDB();

function showResult(msg) {
    document.querySelector("output").innerHTML = msg;
}

export async function addData(dados) {
    const tx = db.transaction("pessoas", "readwrite");
    const store = tx.objectStore("pessoas");
    await store.put(dados);
    await tx.done;
}

export async function getData() {
    const tx = db.transaction("pessoas", "readonly");
    const store = tx.objectStore("pessoas");
    const dados = await store.getAll();

    if (dados.length === 0) {
        showResult("Nenhum registro encontrado!");
        return;
    }

    showResult(JSON.stringify(dados, null, 2));
}

document.getElementById("localizacao").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((pos) => {
        ultimaPosicao = pos;
    });
});

document.getElementById("btnSalvar").addEventListener("click", async () => {
    const nome = document.getElementById("input").value;
    const latManual = document.getElementById("latManual").value;
    const lngManual = document.getElementById("lngManual").value;

    if (!nome) {
        showResult("Digite um nome!");
        return;
    }

    let lat, lng;

    if (latManual && lngManual) {
        lat = latManual;
        lng = lngManual;
    } else if (ultimaPosicao) {
        lat = ultimaPosicao.coords.latitude;
        lng = ultimaPosicao.coords.longitude;
    } else {
        showResult("Digite latitude e longitude OU capture a localização!");
        return;
    }

    await addData({
        nome,
        lat,
        lng
    });

    showResult("Salvo com sucesso!");
});

document.getElementById("btnListar").addEventListener("click", getData);
