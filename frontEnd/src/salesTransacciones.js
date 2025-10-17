import "../src/styles/index.css";

let salesId = null;

import Get from "./Get.js";
import DeleteById from "./DeleteById.js";
import Popup from "./Popup.js";
import Auth from "./auth.js";

const token = localStorage.getItem("token");
console.log(token);
const auth = new Auth();
auth.protectedRoute();

const logout = document.querySelector("#logout");
const dateQuery = document.querySelector("#queryDate");
const transactionsContainer = document.querySelector(".transactions__api-container");
const playerInput = document.querySelector("#queryName");

// Botones / elementos adicionales
const reportButton = document.querySelector(".transactions-report__button");
const exportBtn = document.querySelector("#exportCsv");

// Popup edición
const salesPopupContainer = document.querySelector(".transactions__popup");
const popupSales = new Popup(salesPopupContainer);

const idPopup = document.querySelector("#idEditTransaction");
const namePopup = document.querySelector("#nameEditTransaction");
const cashPopup = document.querySelector("#cashEditTransaction");
const creditPopup = document.querySelector("#creditEditTransaction");
const dollarsPopup = document.querySelector("#dollarsEditTransaction");
const cashInPopup = document.querySelector("#cashInEditTransaction");
const paymentPopup = document.querySelector("#paymentEditTransaction");

const popupClose = document.querySelector(".transactions__popup-close");

// Lista jugadores (popup buscar por nombre/móvil)
const inputQueryName = document.querySelector("#lookByName");
const inputQueryMobile = document.querySelector("#lookByMobile");
const dataContainerPopup = document.querySelector(".sales__data");
const popUpContainer = document.querySelector(".sales__list");
const popupDateAndPlayer = new Popup(popUpContainer);
const closeImage = document.querySelector(".sales__list-close");

// Contenedor de errores del form (opcional)
const errorTransactionContainer = document.querySelector(".transactions__errors");

// Guardaremos lo último que renderizamos para exportarlo
let lastDownloadPayload = { sales: [], totals: {}, date: null, name: null };

logout.addEventListener("click", () => auth.logout());
popupClose.addEventListener("click", () => popupSales.closePopup());
closeImage?.addEventListener("click", () => popupDateAndPlayer.closePopup());

const formatearMoneda = (cantidad) => {
  const n = Number(cantidad ?? 0);
  if (Number.isNaN(n)) return "$0.00";
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
};

// ---------------------------
// FECHA ON LOAD (YYYY-MM-DD)
// ---------------------------
const onLoadDate = () => {
  const now = new Date();
  let day = now.getDate();
  let month = now.getMonth() + 1;
  let year = now.getFullYear();

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  const formattedDateOnload = `${year}-${month}-${day}`;
  const dateInputTransactions = document.querySelector("#queryDate");
  if (dateInputTransactions) dateInputTransactions.value = formattedDateOnload;
};

window.onload = () => {
  onLoadDate();
};

// ---------------------------
// CONSULTA Y RENDER
// ---------------------------
async function getTransactions() {
  const fechaQuery = dateQuery.value;
  if (!fechaQuery) {
    alert("Debes seleccionar la fecha");
    return;
  }
  const playerNameInput = playerInput.value.trim();

  // Construye URL segura
  const urlObj = new URL("https://juegoenvivo1-701fa226890c.herokuapp.com/sales");
  urlObj.searchParams.set("date", fechaQuery);
  if (playerNameInput) urlObj.searchParams.set("name", playerNameInput);
  const url = urlObj.toString();

  const getTransactionsRequest = new Get(url, token);
  const { sales = [], totals = {}, date, name } = await getTransactionsRequest.get();

  // guarda lo que renderizaste (para exportar)
  lastDownloadPayload = { sales, totals, date, name: name ?? null };

  clearDynamicData(); // limpia antes de pintar

  if (sales.length === 0) {
    const noData = document.createElement("p");
    noData.textContent = "No se encontraron ventas en la fecha seleccionada";
    noData.classList.add("transactions__report-dynamic");
    transactionsContainer.appendChild(noData);
    // si quieres, igual mostramos totales
    renderTotals(totals, date);
    return;
  }

  dynamicReport(sales);
  renderTotals(totals, date);
}

reportButton.addEventListener("click", getTransactions);

// ---------------------------
// RENDER DETALLE
// ---------------------------
function dynamicReport(sales) {
  sales.forEach((item) => {
    const row = document.createElement("div");
    row.classList.add("transactions__report-dynamic");
    row.dataset.item = JSON.stringify(item); // pega todos los datos

    // fecha (venga en ISO)
    const pFecha = document.createElement("p");
    pFecha.classList.add("transactions__report__dynamic__text");

    let formattedDate = "—";
    if (item?.date && typeof item.date === "string") {
      const [y, m, d] = item.date.split("T")[0].split("-");
      formattedDate = `${d}/${m}/${y}`;
    }

    pFecha.textContent = formattedDate;
    row.appendChild(pFecha);

    // nombre
    const pName = document.createElement("p");
    pName.classList.add("transactions__report__dynamic__name");
    pName.textContent = item.name ?? "—";
    row.appendChild(pName);

    // user
    const pUser = document.createElement("p");
    pUser.classList.add("transactions__report__dynamic__text");
    pUser.textContent = item.user ?? "-";
    row.appendChild(pUser);

    // time
    const pTime = document.createElement("p");
    pTime.classList.add("transactions__report__dynamic__text");
    pTime.textContent = item.time ?? "-";
    row.append(pTime);

    // cashIn
    const pCashIn = document.createElement("p");
    pCashIn.classList.add("transactions__report__dynamic__text");
    pCashIn.textContent = formatearMoneda(item.cashIn ?? 0);
    row.appendChild(pCashIn);

    // cash
    const pCash = document.createElement("p");
    pCash.classList.add("transactions__report__dynamic__text");
    pCash.textContent = formatearMoneda(item.cash ?? 0);
    row.appendChild(pCash);

    // credit
    const pCredit = document.createElement("p");
    pCredit.classList.add("transactions__report__dynamic__text");
    pCredit.textContent = formatearMoneda(item.credit ?? 0);
    row.appendChild(pCredit);

    // dollars
    const pDollar = document.createElement("p");
    pDollar.classList.add("transactions__report__dynamic__text");
    pDollar.textContent = formatearMoneda(item.dollars ?? 0);
    row.appendChild(pDollar);

    // payment
    const pPayment = document.createElement("p");
    pPayment.classList.add("transactions__report__dynamic__text");
    pPayment.textContent = formatearMoneda(item.payment ?? 0);
    row.appendChild(pPayment);

    transactionsContainer.appendChild(row);
  });
}

// Click en nombre para abrir popup y cargar valores
transactionsContainer.addEventListener("click", (e) => {
  const nameEl = e.target.closest(".transactions__report__dynamic__name");
  if (!nameEl) return;

  const row = nameEl.closest(".transactions__report-dynamic");
  const data = JSON.parse(row.dataset.item); // recuperas TODO
  console.log("click data:", data);

  salesId = data._id; // 👈 importante para eliminar
  popupSales.openPopup();

  idPopup.value = data._id;
  namePopup.value = data.name ?? "";
  cashPopup.value = data.cash ?? 0;
  creditPopup.value = data.credit ?? 0;
  dollarsPopup.value = data.dollars ?? 0;
  cashInPopup.value = data.cashIn ?? 0;
  paymentPopup.value = data.payment ?? 0;
});

// ---------------------------
// RENDER TOTALES
// ---------------------------
function renderTotals(totals, dateStr) {
  const wrap = document.createElement("div");
  wrap.classList.add("transactions__report-dynamic");

  const titulo = document.createElement("p");
  titulo.classList.add("transactions__report__dynamic__totals");

  // Fecha robusta
  let formattedDate = "—";
  if (typeof dateStr === "string" && dateStr.trim()) {
    const iso = dateStr.split("T")[0]; // "YYYY-MM-DD"
    const [y, m, d] = iso.split("-");
    if (y && m && d) formattedDate = `${d}/${m}/${y}`;
  }
  titulo.textContent = `Totales del ${formattedDate}`;
  wrap.appendChild(titulo);

  // Campos informativos (en tu agregado vienen como "NA")
  const tName = document.createElement("p");
  tName.classList.add("transactions__report__dynamic__totals");
  tName.textContent = totals.name ?? "NA";
  wrap.appendChild(tName);

  const tUser = document.createElement("p");
  tUser.classList.add("transactions__report__dynamic__totals");
  tUser.textContent = totals.user ?? "NA";
  wrap.appendChild(tUser);

  const tTime = document.createElement("p");
  tTime.classList.add("transactions__report__dynamic__totals");
  tTime.textContent = totals.time ?? "NA";
  wrap.appendChild(tTime);

  // Totales numéricos
  const tCashIn = document.createElement("p");
  tCashIn.classList.add("transactions__report__dynamic__totals");
  tCashIn.textContent = `${formatearMoneda(totals.cashIn ?? 0)}`;
  wrap.appendChild(tCashIn);

  const tCash = document.createElement("p");
  tCash.classList.add("transactions__report__dynamic__totals");
  tCash.textContent = `${formatearMoneda(totals.cash ?? 0)}`;
  wrap.appendChild(tCash);

  const tCredit = document.createElement("p");
  tCredit.classList.add("transactions__report__dynamic__totals");
  tCredit.textContent = `${formatearMoneda(totals.credit ?? 0)}`;
  wrap.appendChild(tCredit);

  const tDollars = document.createElement("p");
  tDollars.classList.add("transactions__report__dynamic__totals");
  tDollars.textContent = `${formatearMoneda(totals.dollars ?? 0)}`;
  wrap.appendChild(tDollars);

  const tPayment = document.createElement("p");
  tPayment.classList.add("transactions__report__dynamic__totals");
  tPayment.textContent = `Payment: ${formatearMoneda(totals.payment ?? 0)}`;
  wrap.appendChild(tPayment);

  transactionsContainer.appendChild(wrap);
}

// ---------------------------
// LIMPIAR RENDER
// ---------------------------
const clearDynamicData = () => {
  const existingData = document.querySelectorAll(".transactions__report-dynamic");
  existingData.forEach((element) => element.remove());
};

// ---------------------------
// BUSCAR JUGADORES (popup)
// ---------------------------
const getPlayersInReportByDateAndName = async () => {
  const getRequestInSales = new Get("https://juegoenvivo1-701fa226890c.herokuapp.com/players", token);
  const data = await getRequestInSales.get();
  console.log(data);
  return data;
};

const displayUserData = async () => {
  let queryName = inputQueryName.value.trim().toLowerCase();
  let queryMobile = inputQueryMobile.value.trim().toLowerCase();
  const payloadData = await getPlayersInReportByDateAndName();

  let dataDisplayReportByDateAndName = payloadData
    .filter((evenData) => {
      const matchesName =
        queryName === "" || evenData.name?.toLowerCase().includes(queryName);
      const matchesMobile =
        queryMobile === "" || evenData.mobile?.toLowerCase().includes(queryMobile);
      return matchesName && matchesMobile;
    })
    .map((object) => {
      const { name, mobile } = object;
      return `
        <div class="sales__item">
          <div class="sales__item-container">
            <p class="sales__text">Nombre</p>
            <p class="sales__value sales__value-name" data-name="${name}">${name}</p>
          </div>
          <div class="sales__item-container">
            <p class="sales__text">Teléfono</p>
            <p class="sales__value">${mobile}</p>
          </div>
        </div>
      `;
    })
    .join("");

  dataContainerPopup.innerHTML =
    dataDisplayReportByDateAndName || "<p>No se encontraron jugadores.</p>";

  const valueNames = document.querySelectorAll(".sales__value-name");
  valueNames.forEach((element) => {
    element.addEventListener("click", (event) => {
      const { name } = event.target.dataset;
      playerInput.value = name;
      popupDateAndPlayer.closePopup();
    });
  });
};

displayUserData();
inputQueryName.addEventListener("input", displayUserData);
inputQueryMobile.addEventListener("input", displayUserData);
playerInput.addEventListener("click", () => popupDateAndPlayer.openPopup());

// ---------------------------
// FORM ELIMINAR / EDITAR (ejemplo elimina)
// ---------------------------
const formTransactions = document.querySelector(".transactions__form");

const validateTransactionForm = () => {
  const errors = [];
  if (
    namePopup.value === "" ||
    cashPopup.value === "" ||
    creditPopup.value === "" ||
    dollarsPopup.value === ""
  ) {
    errors.push("Estos valores no pueden ir vacíos");
  }
  return errors;
};

formTransactions.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (errorTransactionContainer) errorTransactionContainer.innerHTML = "";

  const errors = validateTransactionForm();
  if (errors.length > 0) {
    if (errorTransactionContainer) {
      errors.forEach((error) => {
        const el = document.createElement("p");
        el.textContent = error;
        errorTransactionContainer.appendChild(el);
      });
    } else {
      alert(errors.join("\n"));
    }
    return;
  }

  if (!salesId) {
    alert("No se ha seleccionado ninguna transacción para eliminar");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("No tienes permiso para eliminar esta transacción. Inicia sesión nuevamente.");
    return;
  }

  const deleteSalesByIdRequest = new DeleteById(`https://juegoenvivo1-701fa226890c.herokuapp.com/sales/${salesId}`, token);
  const resultDelete = await deleteSalesByIdRequest.sendDeleteByIdRequest();

  if (resultDelete) {
    popupSales.closePopup();
    // refrescar la lista:
    getTransactions();
  }
});

// ---------------------------
// EXPORT CSV (lo que se ha renderizado)
// ---------------------------
function buildRowsForExport({ sales, totals, date, name }) {
  const rows = sales.map((s) => ({
    Fecha: (s.date || "").split("T")[0], // YYYY-MM-DD
    Hora: s.time ?? "",
    Nombre: s.name ?? "",
    UserId: s.user ?? "",
    CashIn: Number(s.cashIn ?? 0),
    Cash: Number(s.cash ?? 0),
    Credit: Number(s.credit ?? 0),
    Dollars: Number(s.dollars ?? 0),
    Payment: Number(s.payment ?? 0),
  }));

  // Fila TOTAL al final
  rows.push({
    Fecha: date || "",
    Hora: "NA",
    Nombre: "NA",
    UserId: "NA",
    CashIn: Number(totals.cashIn ?? 0),
    Cash: Number(totals.cash ?? 0),
    Credit: Number(totals.credit ?? 0),
    Dollars: Number(totals.dollars ?? 0),
    Payment: Number(totals.payment ?? 0),
  });

  return rows;
}

function downloadCSVFromArrayOfObjects(rows, filename = "reporte.csv") {
  if (!rows || !rows.length) return;

  const escapeCSV = (v) => {
    if (v == null) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const headers = Object.keys(rows[0]);
  const headLine = headers.map(escapeCSV).join(",");
  const body = rows
    .map((r) => headers.map((h) => escapeCSV(r[h])).join(","))
    .join("\n");
  const csv = "\uFEFF" + headLine + "\n" + body; // BOM UTF-8 para Excel

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

exportBtn.addEventListener("click", () => {
  const { sales, totals, date, name } = lastDownloadPayload;

  if (!sales || sales.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const rows = buildRowsForExport({ sales, totals, date, name });
  const safeName = (name || "todos").replace(/[^\w\-]+/g, "_");
  const safeDate = (date || "fecha").replace(/[^\w\-]+/g, "_");
  const filename = `ventas_${safeDate}_${safeName}.csv`;

  downloadCSVFromArrayOfObjects(rows, filename);
});

/*const inputTransactionsQuery = document.querySelector("#queryDate")
const dataContainer = document.querySelector(".transactions__api-container")

const idPopup = document.querySelector("#idEditTransaction");
const namePopup = document.querySelector("#nameEditTransaction")
const cashPopup = document.querySelector("#cashEditTransaction");
const creditPopup = document.querySelector("#creditEditTransaction");
const dollarsPopup = document.querySelector("#dollarsEditTransaction");
const cashInPopup = document.querySelector("#cashInEditTransaction");
const paymentPopup = document.querySelector("#paymentEditTransaction")
const formTransactions = document.querySelector(".transactions__form")
const inputName = document.querySelector("#queryName");
const errorTransactionContainer = document.querySelector(".transactions__form-errorMessages")*/



/*const displayTransactions = async () => {
    let queryTransactions = inputTransactionsQuery.value.trim().toLowerCase();
    let queryName = inputName.value.trim().toLowerCase();

    const payloadTransactions = await getTransactions();

    let dataDisplayTransactions = payloadTransactions
    .filter((eventDataTransactions) => {
      
        const matchesName = queryName === '' || eventDataTransactions.name?.toLowerCase().includes(queryName);
        const matchesDate = queryTransactions === '' || eventDataTransactions.date?.toLowerCase().includes(queryTransactions);
        return matchesName && matchesDate;
    })
    .map((object) => {
        const {_id, player, user, name, cash, credit, dollars, date, time,cashIn,payment} = object;


        let formattedDate = "";
        if (date) {
            const [year, month, day] = date.split('T')[0].split('-');
            formattedDate = `${day}/${month}/${year}`;
        }
    





        return `
 
        <p class="transactions__data-value">${_id}</p>
      

    <p class="transactions__data-value transactions__data-name"
    data-id="${_id}" 
    data-dollar="${dollars}" 
    data-credit="${credit}" 
    data-name="${name}" 
    data-cash="${cash}"
    data-payment="${payment}"
    data-user="${user}"
    data-cashin="${cashIn}">
    ${name}
</p>

  <p class="transactions__data-value">${user}</p>
        
    

        <p class="transactions__data-value">${formattedDate}</p>
   

  
        <p class="transactions__data-value">${time}</p>
        
    
<p class="transactions__data-value">${formatearMoneda(cashIn)}</p>
    <p class="transactions__data-value">${formatearMoneda(cash)}</p>
    <p class="transactions__data-value">${formatearMoneda(credit)}</p>
<p class="transactions__data-value">${formatearMoneda(dollars)}</p>


<p class="transactions__data-value">${formatearMoneda(payment)}</p>





 `;
    })
    .join('');

    dataContainer.innerHTML = dataDisplayTransactions   
    addClickEvents(); // Agregar eventos a los elementos recién creados






}


inputTransactionsQuery.addEventListener('input', displayTransactions);
inputName.addEventListener('input', displayTransactions);*/

/*const salesPopupContainer = document.querySelector(".transactions__popup");
const popupSales = new Popup(salesPopupContainer)


const addClickEvents = () => {
    const dataNames = document.querySelectorAll(".transactions__data-name");

    dataNames.forEach(nameElement => {
        nameElement.addEventListener("click", (event) => {

         
            const target = event.target;
            salesId = target.dataset.id;
            const cash = target.dataset.cash;
            const credit = target.dataset.credit;
            const dollar = target.dataset.dollar
            const name = target.dataset.name
            const cashin = target.dataset.cashin;
            console.log("Valor de cashIn en el popup:", cashin);


            const payment = target.dataset.payment
            popupSales.openPopup();

         
                idPopup.value = salesId; // ✅ Esto funciona correctamente
                cashPopup.value = cash;
                creditPopup.value = credit;
                dollarsPopup.value = dollar;
                namePopup.value = name
                cashInPopup.value = cashin;
                console.log("cashInPopup:", cashInPopup);

                paymentPopup.value = payment;
          
            

        });
    });
};*/


/*
const getSalesTransactions = async () => {
    try {

     



      
        const response = await fetch('https://juegoenvivodiamantetampico-5f11edf34527.herokuapp.com
/sales');
        
        if (!response.ok) {
            throw new Error(`Error con la solicitud fetch: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        try {
            selectedTransactions(data);
        } catch (errorSales) {
            throw new Error('Error en la solicitud de render: ' + errorSales.message);
        }

    } catch (error) {
        console.error('Problema con la solicitud fetch: ' + error.message, error);
    }
};

getSalesTransactions();

const nameTransactionsContainer = document.querySelector("#nameTransactions")
const dateTransactionsContainer = document.querySelector("#dateTransactions")
const timeTransactionsContainer = document.querySelector("#timeTransactions")
const idTransactionsContainer = document.querySelector("#idTransactions")
const cashTransactionsContainer = document.querySelector("#cashTransactions")
const cardTransactionsContainer = document.querySelector("#creditTransactions")
const dollarsTrransactionsContainer = document.querySelector("#dollarsTransactions")
const checkBoxTransactionsContainer = document.querySelector("#checkBoxTransactions")



//FORM VALUES //

const nameEditTransaction = document.querySelector("#nameEditTransaction")
const cashEditTransaction = document.querySelector("#cashEditTransaction")
const creditEditTransaction = document.querySelector("#creditEditTransaction")
const dollarsEditTransaction = document.querySelector("#dollarsEditTransaction")
const closeTransactionForm = document.querySelector(".transactions__popup-close")
const formContainer = document.querySelector(".transactions__popup")
const formTransactions = document.querySelector(".transactions__form")





const selectedTransactions = (transactions) => {

transactions.forEach(transaction => {

    const nameTransactionElement = document.createElement("p");
    nameTransactionElement.textContent = transaction.name
    nameTransactionsContainer.appendChild(nameTransactionElement)

    const dateTransactionElement = document.createElement("p")
    dateTransactionElement.textContent = transaction.date;
    dateTransactionsContainer.appendChild(dateTransactionElement)

    const timeTransactionElement = document.createElement("p")
    timeTransactionElement.textContent = transaction.time;
    timeTransactionsContainer.appendChild(timeTransactionElement)

    const idTransactionElement = document.createElement("p")
    idTransactionElement.textContent = transaction._id
    idTransactionsContainer.appendChild(idTransactionElement)

    const cashTransactionElement = document.createElement("p");
    cashTransactionElement.textContent = transaction.cash;
    cashTransactionsContainer.appendChild(cashTransactionElement)

    const cardTransactionElement = document.createElement("p")
    cardTransactionElement.textContent = transaction.credit
    cardTransactionsContainer.appendChild(cardTransactionElement)

    const dollarTransactionElement = document.createElement("p")
    dollarTransactionElement.textContent = transaction.dollars;
    dollarsTrransactionsContainer.appendChild(dollarTransactionElement)

    const checkBoxTransactionElement = document.createElement("input");
    checkBoxTransactionElement.type =  "checkbox"
    checkBoxTransactionsContainer.appendChild(checkBoxTransactionElement)


    const popupTrasactions = () => {

        formContainer.classList.add("transactions__opened")



        nameEditTransaction.value = transaction.name
        cashEditTransaction.value = transaction.cash
        creditEditTransaction.value = transaction.credit;
        dollarsEditTransaction.value = transaction.dollars

        playerId = transaction._id
        console.log(playerId)





    }

    checkBoxTransactionElement.addEventListener("click", popupTrasactions)



    
    
    

    



})

}
*/



/*

const validateTransactionForm = () => {

    let errors = [];

  



    if (namePopup.value === "" || cashPopup.value === "" || creditPopup.value === "" || dollarsPopup.value === "") {
        errors.push("Estos valores no pueden ir vacíos");
    }
    


    

return errors


}


formTransactions.addEventListener("submit", async(event) => {
event.preventDefault();


const errors = validateTransactionForm();
if(errors.length > 0){
    errors.forEach(error => {
        const errorTransactionElement = document.createElement("p");
        errorTransactionElement.textContent = error;
        errorTransactionContainer.appendChild(errorTransactionElement)
        
    })
    return
}


    if(!salesId){
        alert('No se ha seleccionado ninguna transaccion para eliminar');
        return;
    }

    const token = localStorage.getItem("token"); // ✅ Obtener el token antes de eliminar

    if (!token) {
        alert("No tienes permiso para eliminar esta transacción. Inicia sesión nuevamente.");
        return;
    }

const deleteSalesByIdRequest = new DeleteById(`http://localhost:4000/sales/${salesId}`, token);
const resultDelete = await deleteSalesByIdRequest.sendDeleteByIdRequest();

if(resultDelete){
    popupSales.closePopup()
}


})*/