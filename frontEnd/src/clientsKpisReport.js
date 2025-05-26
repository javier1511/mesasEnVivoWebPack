import "../src/styles/index.css";
import Get from "./Get.js";
import Popup from "./Popup.js"

const token = localStorage.getItem("token");
import Auth from "./auth.js";
const auth = new Auth()
auth.protectedRoute();


const logout = document.querySelector("#logout");

logout.addEventListener("click", () => auth.logout())

if (!token) {
    console.error("Token no encontrado en localStorage.");
}

const getPlayersKpis = async () => {
    const getPlayersKpisRequest = new Get("https://juegoenvivo1-701fa226890c.herokuapp.com/sales/summary", token);
    const data = await getPlayersKpisRequest.get();
    return data;
};

// Elementos del DOM
const inputKpisMobile = document.querySelector("#inputKpisMobile");
const inputKpisName = document.querySelector("#inputKpisName");
const kpisDataContainer = document.querySelector(".kpis__data-container");
const inputKpisEfectivo = document.querySelector("#inputKpisEfectivo");
const inputKpisTarjeta = document.querySelector("#inputKpisTarjeta");
const inputKpisDolares = document.querySelector("#inputKpisDolares");
const inputKpisPago = document.querySelector("#inputKpisPago");

// Inputs de rango de fecha
const inputFechaDesde = document.querySelector("#inputFechaDesde");
const inputFechaHasta = document.querySelector("#inputFechaHasta");

const formatearMoneda = (cantidad) => {
    if (isNaN(cantidad)) return "$0.00";
    return Number(cantidad).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
};


const displayKpisPlayers = async () => {
    let queryMobile = inputKpisMobile?.value.trim().toLowerCase() || '';
    let queryName = inputKpisName?.value.trim().toLowerCase() || '';
    let queryEfectivo = inputKpisEfectivo?.value.trim() || '';
    let queryTarjeta = inputKpisTarjeta?.value.trim() || '';
    let queryDolares = inputKpisDolares?.value.trim() || '';
    let queryPago = inputKpisPago?.value.trim() || '';

    let desde = inputFechaDesde?.value || '';
    let hasta = inputFechaHasta?.value || '';

    const payloadKpis = await getPlayersKpis();

    const dataDisplayKpis = payloadKpis
        .filter((eventDataKpis) => {
            const player = eventDataKpis.player;

            const matchesMobile = queryMobile === '' || String(player.mobile ?? '').toLowerCase().includes(queryMobile);
            const matchesName = queryName === '' || String(player.name ?? '').toLowerCase().includes(queryName);

            const efectivo = parseFloat(eventDataKpis.totalCash ?? 0);
            const matchesEfectivo = queryEfectivo === '' || efectivo >= parseFloat(queryEfectivo);

            const tarjeta = parseFloat(eventDataKpis.totalCredit ?? 0);
            const matchesTarjeta = queryTarjeta === '' || tarjeta >= parseFloat(queryTarjeta);

            const dolares = parseFloat(eventDataKpis.totalDollars ?? 0);
            const matchesDolares = queryDolares === '' || dolares >= parseFloat(queryDolares);

            const pago = parseFloat(eventDataKpis.totalPayment ?? 0);
            const matchesPago = queryPago === '' || pago >= parseFloat(queryPago);

            const fechaCompra = (eventDataKpis.lastPurchaseDate ?? '').split('T')[0];

            const matchesFecha =
                (!desde || fechaCompra >= desde) &&
                (!hasta || fechaCompra <= hasta);

            return (
                matchesMobile &&
                matchesName &&
                matchesEfectivo &&
                matchesTarjeta &&
                matchesDolares &&
                matchesPago &&
                matchesFecha
            );
        })
        .map((object) => {
            const { player, totalCash, totalCredit, totalDollars, totalPayment, netwin, lastPurchaseDate } = object;

            let formattedDateKpis = "";
            if (lastPurchaseDate) {
                const [year, month, day] = lastPurchaseDate.split('T')[0].split('-');
                formattedDateKpis = `${day}/${month}/${year}`;
            }

            return `
                <p class="kpis__data">${player.name}</p>
<p class="kpis__data kpis__mobile">${player.mobile}</p>
            <p class="kpis__data">${formatearMoneda(totalCash)}</p>
<p class="kpis__data">${formatearMoneda(totalCredit)}</p>
<p class="kpis__data">${formatearMoneda(totalDollars)}</p>
<p class="kpis__data">${formatearMoneda(totalPayment)}</p>
<p class="kpis__data">${formatearMoneda(netwin)}</p>

                <p class="kpis__data">${formattedDateKpis}</p>
            `;
        })
        .join('');

       const kpisButton = document.querySelector(".kpis__button");
const textarea = document.querySelector(".kpis__modal textarea");
const numbersContainer = document.querySelector(".kpis__modal-numbers");
const titleContainer = document.querySelector(".kpis__modal-title-container");
const inputAgregarNumero = document.getElementById("inputAgregarNumero");
const btnAgregarNumero = document.getElementById("btnAgregarNumero");
const enviarMensajeBtn = document.getElementById("enviarMensajeBtn");

let mobiles = []; // Lista para almacenar los números

// Paso 1: Mostrar los números cuando se hace clic en el botón ".kpis__button"
kpisButton.addEventListener("click", () => {
    mobiles = Array.from(document.querySelectorAll(".kpis__mobile"))
        .map(el => "52" + el.textContent.trim()); // Agregar el prefijo "52"

    // Mostrar los números en el modal
    numbersContainer.innerHTML = mobiles.map(num => `<p class="kpis__number">${num}</p>`).join('');

    // Mostrar el contador de números
    titleContainer.innerHTML = `<p>Total de números: ${mobiles.length}</p>`;

    // Limpiar el campo de texto
    inputAgregarNumero.value = "";
});

// Paso 2: Agregar un número manualmente
btnAgregarNumero.addEventListener("click", () => {
    const inputValue = inputAgregarNumero.value.trim();

    // Validación: Verificar que el número tenga 10 dígitos
    if (!/^\d{10}$/.test(inputValue)) {
        return alert("Debe ser un número de 10 dígitos.");
    }

    const numeroCompleto = "52" + inputValue; // Añadir el prefijo "52"

    // Verificar si el número ya está en la lista
    if (mobiles.includes(numeroCompleto)) {
        return alert("Ese número ya fue agregado.");
    }

    // Agregar el número a la lista
    mobiles.push(numeroCompleto);
    inputAgregarNumero.value = ""; // Limpiar el campo de entrada

    // Actualizar la vista de números y el contador
    numbersContainer.innerHTML = mobiles.map(num => `<p class="kpis__number">${num}</p>`).join('');
    titleContainer.innerHTML = `<p>Total de números: ${mobiles.length}</p>`;
});

// Paso 3: Enviar el mensaje cuando se hace clic en "Enviar mensaje"
enviarMensajeBtn.addEventListener("click", async () => {
    const message = textarea?.value.trim();

    // Validación: Verificar que haya números y que el mensaje no esté vacío
    if (mobiles.length === 0) {
        return alert("No hay números seleccionados.");
    }

    if (!message) {
        return alert("El mensaje no puede estar vacío.");
    }

    const body = {
        numbers: mobiles,
        message: message
    };

    try {
        // Enviar la solicitud POST
        const response = await fetch("https://juegoenvivo1-701fa226890c.herokuapp.com/sendsms/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        console.log("Respuesta del servidor:", result);
        alert("Mensaje enviado con éxito.");
    } catch (error) {
        console.error("Error al enviar:", error);
        alert("Hubo un error al enviar el mensaje.");
    }
});


// ✅ Permitir agregar móviles individualmente haciendo clic
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("kpis__mobile")) {
        const numeroRaw = e.target.textContent.trim();
   


        
        // Validación de 10 dígitos
        if (!/^\d{10}$/.test(numeroRaw)) {
            return alert("El número no tiene el formato correcto.");
        }

        const numeroConPrefijo = "52" + numeroRaw;

        // Verificar si ya fue agregado
        if (mobiles.includes(numeroConPrefijo)) {
            return alert("Este número ya fue agregado.");
        }

        mobiles.push(numeroConPrefijo);

        // Actualizar visualización
        numbersContainer.innerHTML = mobiles.map(num => `<p class="kpis__number">${num}</p>`).join('');
        titleContainer.innerHTML = `<p class= "mobile__length" >Total de números: ${mobiles.length}</p>`;
    }
});


        
        
    kpisDataContainer.innerHTML = dataDisplayKpis || "<p>No se encontraron transacciones.</p>";
};

(async () => {
    await displayKpisPlayers();
})();


// Escuchar todos los inputs
[
    inputKpisMobile,
    inputKpisName,
    inputKpisEfectivo,
    inputKpisTarjeta,
    inputKpisDolares,
    inputKpisPago,
    inputFechaDesde,
    inputFechaHasta
].forEach(input => {
    if (input) input.addEventListener("input", displayKpisPlayers);
});
  

const modalContainer = document.querySelector(".kpis__modal-container");
const kpisPopup = new Popup(modalContainer);

const crmButton = document.querySelector("#abrirCrm");
crmButton.addEventListener("click", () => kpisPopup.openPopup())
const kpisModalCloseButton = document.querySelector(".kpis__popup-close");
kpisModalCloseButton.addEventListener("click", () => kpisPopup.closePopup())

