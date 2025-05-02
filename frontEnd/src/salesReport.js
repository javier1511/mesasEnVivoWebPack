import "../src/styles/index.css"
import Get from "./Get.js";

const inputInicio = document.querySelector("#initialDate");
const inputFinal = document.querySelector("#finalDate");
const salesReportContainer = document.querySelector(".sales-report__data-container");

const token = localStorage.getItem("token");
console.log(token)

import Auth from "./auth.js";
const auth = new Auth()
auth.protectedRoute();


const logout = document.querySelector("#logout");

logout.addEventListener("click", () => auth.logout())


const getDailyReport = async () => {
    // Obtener los valores de los inputs
    const fechaInicio = inputInicio.value;
    const fechaFin = inputFinal.value;

    // Validar que los inputs no estén vacíos
    if (!fechaInicio || !fechaFin) {
        console.error("Debes seleccionar ambas fechas.");
        return;
    }

    // Construir la URL dinámica
    const url = `http://localhost:4000/dailyreport?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    const getDailyReportRequest = new Get(url, token);

    // Llamar a la API y obtener los datos
    const dailyReportData = await getDailyReportRequest.get();

    // Mostrar los datos en consola solo si existen
    if (dailyReportData.length > 0) {
        console.log(dailyReportData);
        selectReport(dailyReportData);
    } else {
        console.warn("No se encontraron ventas en el rango seleccionado.");
        clearDynamicData(); // Limpia solo los datos dinámicos
        const noDataMessage = document.createElement("p");

         
        noDataMessage.textContent = "No se encontraron ventas en el rango seleccionado.";
        noDataMessage.classList.add("sales-report__dynamic");
        salesReportContainer.appendChild(noDataMessage);
    }

    return dailyReportData;
};

// Evento para ejecutar la consulta al hacer clic en un botón
document.querySelector("#getReportButton").addEventListener("click", getDailyReport);

const selectReport = (reports) => {
    clearDynamicData(); // Elimina solo los datos dinámicos

    reports.forEach(report => {
        const row = document.createElement("div");
        row.classList.add("sales-report__dynamic"); // Clase para diferenciarlos y eliminarlos después

        const dateElement = document.createElement("p");
        dateElement.classList.add("sales-report__dynamic__text");

        // Formatear la fecha a dd/mm/yyyy
        let [year, month, day] = report.fecha.split('-');
        let formattedDate = `${day}/${month}/${year}`;
        dateElement.textContent = formattedDate;
        row.appendChild(dateElement);

        const cashInElement = document.createElement("p");
        cashInElement.classList.add("sales-report__dynamic__text");
        cashInElement.textContent = report.totalCashIn
        row.appendChild(cashInElement);

        const efectivoElement = document.createElement("p");
        efectivoElement.classList.add("sales-report__dynamic__text")
        efectivoElement.textContent = report.totalCash;
        row.appendChild(efectivoElement);

        const tarjetaElement = document.createElement("p");
        tarjetaElement.textContent = report.totalCredit;
        tarjetaElement.classList.add("sales-report__dynamic__text")
        row.appendChild(tarjetaElement);

        const dolaresElement = document.createElement("p");
        dolaresElement.textContent = report.totalDollar;
        dolaresElement.classList.add("sales-report__dynamic__text")
        row.appendChild(dolaresElement);

        const enCajaElement = document.createElement("p");
        enCajaElement.textContent = report.caja;
        enCajaElement.classList.add("sales-report__dynamic__text")
        row.appendChild(enCajaElement);

        const netwinElement = document.createElement("p");
        netwinElement.textContent = report.netwin;
        netwinElement.classList.add("sales-report__dynamic__text")
        row.appendChild(netwinElement);

        const paymentElement = document.createElement("p");
        paymentElement.textContent = report.totalPayment;
        paymentElement.classList.add("sales-report__dynamic__text");
        row.appendChild(paymentElement);

        salesReportContainer.appendChild(row);
    });
};

// Función para eliminar solo los datos dinámicos sin borrar los títulos
const clearDynamicData = () => {
    const existingData = document.querySelectorAll(".sales-report__dynamic");
    existingData.forEach(element => element.remove());
};
