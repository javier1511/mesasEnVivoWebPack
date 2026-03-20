import "../src/styles/index.css";
import Get from "./Get.js";
import Popup from "./Popup.js";

import Auth from "./auth.js";
const auth = new Auth();
auth.protectedRoute();

const token = localStorage.getItem("token");

if (!token) {
  console.error("Token no encontrado en localStorage.");
}

// ======================
// DOM
// ======================
const logout = document.querySelector("#logout");
logout.addEventListener("click", () => auth.logout());

// Inputs filtros
const inputKpisMobile = document.querySelector("#inputKpisMobile");
const inputKpisName = document.querySelector("#inputKpisName");
const inputKpisEfectivo = document.querySelector("#inputKpisEfectivo");
const inputKpisTarjeta = document.querySelector("#inputKpisTarjeta");
const inputKpisDolares = document.querySelector("#inputKpisDolares");
const inputKpisPago = document.querySelector("#inputKpisPago");
const inputFechaDesde = document.querySelector("#inputFechaDesde");
const inputFechaHasta = document.querySelector("#inputFechaHasta");
const buscarKpisBtn = document.querySelector("#buscarKpis");

const kpisDataContainer = document.querySelector(".kpis__data-container");

// Modal / SMS
const kpisButton = document.querySelector(".kpis__button");
const textarea = document.querySelector(".kpis__modal textarea");
const numbersContainer = document.querySelector(".kpis__modal-numbers");
const titleContainer = document.querySelector(".kpis__modal-title-container");
const inputAgregarNumero = document.getElementById("inputAgregarNumero");
const btnAgregarNumero = document.getElementById("btnAgregarNumero");
const enviarMensajeBtn = document.getElementById("enviarMensajeBtn");

// Popup
const modalContainer = document.querySelector(".kpis__modal-container");
const kpisPopup = new Popup(modalContainer);

const crmButton = document.querySelector("#abrirCrm");
crmButton.addEventListener("click", () => kpisPopup.openPopup());

const kpisModalCloseButton = document.querySelector(".kpis__popup-close");
kpisModalCloseButton.addEventListener("click", () => kpisPopup.closePopup());

// ======================
// Helpers
// ======================
const formatearMoneda = (cantidad) => {
  if (isNaN(cantidad)) return "$0.00";
  return Number(cantidad).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
};

const showLoading = () => {
  kpisDataContainer.innerHTML = `<p class="kpis__loading">Cargando...</p>`;
};

// ======================
// Data KPIs
// ======================
let kpisData = [];
let isLoadingKpis = false;

const getPlayersKpis = async (startDate, endDate) => {
  const request = new Get(
    `http://localhost:4000/sales/summary/by-client?startDate=${startDate}&endDate=${endDate}`,
    token
  );

  const data = await request.get();
  console.log("KPIs payload:", data);
  return data;
};

// ======================
// Render local
// ======================
const renderKpisPlayers = () => {
  const queryMobile = inputKpisMobile?.value.trim().toLowerCase() || "";
  const queryName = inputKpisName?.value.trim().toLowerCase() || "";
  const queryEfectivo = inputKpisEfectivo?.value.trim() || "";
  const queryTarjeta = inputKpisTarjeta?.value.trim() || "";
  const queryDolares = inputKpisDolares?.value.trim() || "";
  const queryPago = inputKpisPago?.value.trim() || "";

  const html = (kpisData || [])
    .filter((eventDataKpis) => {
      const player = eventDataKpis.player || {};

      const matchesMobile =
        queryMobile === "" ||
        String(player.mobile ?? "").toLowerCase().includes(queryMobile);

      const matchesName =
        queryName === "" ||
        String(player.name ?? "").toLowerCase().includes(queryName);

      const efectivo = parseFloat(eventDataKpis.totalCash ?? 0);
      const matchesEfectivo =
        queryEfectivo === "" || efectivo >= parseFloat(queryEfectivo);

      const tarjeta = parseFloat(eventDataKpis.totalCredit ?? 0);
      const matchesTarjeta =
        queryTarjeta === "" || tarjeta >= parseFloat(queryTarjeta);

      const dolares = parseFloat(eventDataKpis.totalDollars ?? 0);
      const matchesDolares =
        queryDolares === "" || dolares >= parseFloat(queryDolares);

      const pago = parseFloat(eventDataKpis.totalPayment ?? 0);
      const matchesPago =
        queryPago === "" || pago >= parseFloat(queryPago);

      return (
        matchesMobile &&
        matchesName &&
        matchesEfectivo &&
        matchesTarjeta &&
        matchesDolares &&
        matchesPago
      );
    })
    .map((object) => {
      const {
        player,
        totalCash,
        totalCredit,
        totalDollars,
        totalPayment,
        netwin,
        lastPurchaseDate,
      } = object;

      let formattedDateKpis = "";
      if (lastPurchaseDate) {
        const [year, month, day] = lastPurchaseDate.split("T")[0].split("-");
        formattedDateKpis = `${day}/${month}/${year}`;
      }

      return `
        <p class="kpis__data">${player?.name ?? ""}</p>
        <p class="kpis__data kpis__mobile">${player?.mobile ?? ""}</p>
        <p class="kpis__data">${formatearMoneda(totalCash)}</p>
        <p class="kpis__data">${formatearMoneda(totalCredit)}</p>
        <p class="kpis__data">${formatearMoneda(totalDollars)}</p>
        <p class="kpis__data">${formatearMoneda(totalPayment)}</p>
        <p class="kpis__data">${formatearMoneda(netwin)}</p>
        <p class="kpis__data">${formattedDateKpis}</p>
      `;
    })
    .join("");

  kpisDataContainer.innerHTML = html || "<p>No se encontraron transacciones.</p>";
};

// ======================
// Buscar por fechas
// ======================
const loadKpisByDates = async () => {
  const startDate = inputFechaDesde?.value.trim() || "";
  const endDate = inputFechaHasta?.value.trim() || "";

  if (!startDate || !endDate) {
    alert("Debes seleccionar fecha inicial y fecha final.");
    return;
  }

  if (isLoadingKpis) return;
  isLoadingKpis = true;

  showLoading();

  try {
    kpisData = await getPlayersKpis(startDate, endDate);
    renderKpisPlayers();
  } catch (error) {
    console.error("Error al cargar KPIs:", error);
    kpisDataContainer.innerHTML = "<p>Error al cargar la información.</p>";
  } finally {
    isLoadingKpis = false;
  }
};

if (buscarKpisBtn) {
  buscarKpisBtn.addEventListener("click", loadKpisByDates);
}

// ======================
// Filtros locales
// ======================
[
  inputKpisMobile,
  inputKpisName,
  inputKpisEfectivo,
  inputKpisTarjeta,
  inputKpisDolares,
  inputKpisPago
].forEach((input) => {
  if (input) {
    input.addEventListener("input", () => {
      if (kpisData.length === 0) return;
      renderKpisPlayers();
    });
  }
});

// ======================
// SMS / selección de números
// ======================
let mobiles = [];

kpisButton.addEventListener("click", () => {
  mobiles = Array.from(document.querySelectorAll(".kpis__mobile"))
    .map((el) => "+52" + el.textContent.trim());

  numbersContainer.innerHTML = mobiles
    .map((n) => `<p class="kpis__number">${n}</p>`)
    .join("");

  titleContainer.innerHTML = `<p>Total de números: ${mobiles.length}</p>`;
  inputAgregarNumero.value = "";
});

btnAgregarNumero.addEventListener("click", () => {
  const val = inputAgregarNumero.value.trim();

  if (!/^\d{10}$/.test(val)) {
    alert("Debe ser un número de 10 dígitos.");
    return;
  }

  const num = "+52" + val;

  if (mobiles.includes(num)) {
    alert("Ese número ya fue agregado.");
    return;
  }

  mobiles.push(num);
  inputAgregarNumero.value = "";

  numbersContainer.innerHTML = mobiles
    .map((n) => `<p class="kpis__number">${n}</p>`)
    .join("");

  titleContainer.innerHTML = `<p>Total de números: ${mobiles.length}</p>`;
});

let isSending = false;

enviarMensajeBtn.addEventListener("click", async () => {
  if (isSending) return;

  const message = (textarea?.value || "").trim();

  if (mobiles.length === 0) {
    alert("No hay números seleccionados.");
    return;
  }

  if (!message) {
    alert("El mensaje no puede estar vacío.");
    return;
  }

  if (message.length > 159) {
    alert("El texto excede 159 caracteres.");
    return;
  }

  isSending = true;
  enviarMensajeBtn.disabled = true;

  const FROM = "DIAMANTE";
  const to = Array.from(
    new Set(
      mobiles
        .map((n) => String(n).trim())
        .filter(Boolean)
        .map((n) => (n.startsWith("+") ? n : "+" + n))
    )
  );

  const payload = { from: FROM, text: message, to };

  try {
    const res = await fetch("http://localhost:4000/sendsms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Error:", result.message || result.error);
      alert("Error al enviar: " + (result.message || "Fallo desconocido"));
      return;
    }

    alert("Mensaje enviado con éxito.");
  } catch (err) {
    console.error("Error al enviar:", err);
    alert("Hubo un error de red al enviar el mensaje.");
  } finally {
    isSending = false;
    enviarMensajeBtn.disabled = false;
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("kpis__mobile")) {
    const raw = e.target.textContent.trim();

    if (!/^\d{10}$/.test(raw)) {
      alert("El número no tiene el formato correcto.");
      return;
    }

    const num = "+52" + raw;

    if (mobiles.includes(num)) {
      alert("Este número ya fue agregado.");
      return;
    }

    mobiles.push(num);

    numbersContainer.innerHTML = mobiles
      .map((n) => `<p class="kpis__number">${n}</p>`)
      .join("");

    titleContainer.innerHTML = `<p class="mobile__length">Total de números: ${mobiles.length}</p>`;
  }
});

// ======================
// Balance
// ======================
const instasentToken = "issw_q4ayo9uwamoj5jx0p6txjffxztvisg5wwqf";

const getBalance = async () => {
  try {
    const response = await fetch("https://api.instasent.com/organization/account", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": instasentToken,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || data.error?.message);
      return;
    }

    console.log(data);

    const balanceText = document.querySelector(".kpis__balance");

    if (!balanceText) {
      console.warn("No existe el elemento .kpis__balance en el HTML");
      return;
    }

    balanceText.textContent = data.entity.available;
  } catch (error) {
    console.error("Error al obtener balance:", error);
  }
};

getBalance();