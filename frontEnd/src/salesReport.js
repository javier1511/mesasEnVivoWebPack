import "../src/styles/index.css"
import Get from "./Get.js";
let lastDailyReportData = [];

const inputInicio = document.querySelector("#initialDate");
const inputFinal = document.querySelector("#finalDate");
const salesReportContainer = document.querySelector(".sales-report__data-container");

const token = localStorage.getItem("token");
console.log(token)



import Auth from "./auth.js";
const auth = new Auth()
auth.protectedRoute();

const formatearMoneda = (cantidad) => {
    if(isNaN(cantidad)) return "0.00";
    return Number(cantidad).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }) 
}



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
    const url = `https://juegoenvivo1-701fa226890c.herokuapp.com/dailyreport?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    const getDailyReportRequest = new Get(url, token);

    // Llamar a la API y obtener los datos
    const dailyReportData = await getDailyReportRequest.get();

     lastDailyReportData = dailyReportData || [];

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

const selectReport = (reports) => {
    clearDynamicData(); // Elimina solo los datos dinámicos

    reports.forEach(report => {
        const row = document.createElement("div");
        row.classList.add("sales-report__dynamic");

        const dateElement = document.createElement("p");
        dateElement.classList.add("sales-report__dynamic__text");

        // Si es la fila TOTAL, no formateamos como fecha
        if (report.fecha === "TOTAL") {
            dateElement.textContent = "TOTAL";
            // Opcional: marcar la fila como total para darle estilo
            row.classList.add("sales-report__total-row");
        } else {
            // Formatear la fecha a dd/mm/yyyy
            let [year, month, day] = report.fecha.split("-");
            let formattedDate = `${day}/${month}/${year}`;
            dateElement.textContent = formattedDate;
        }

        row.appendChild(dateElement);

        const cashInElement = document.createElement("p");
        cashInElement.classList.add("sales-report__dynamic__text");
        cashInElement.textContent = formatearMoneda(report.totalCashIn);
        row.appendChild(cashInElement);

        const efectivoElement = document.createElement("p");
        efectivoElement.classList.add("sales-report__dynamic__text");
        efectivoElement.textContent = formatearMoneda(report.totalCash);
        row.appendChild(efectivoElement);

        const tarjetaElement = document.createElement("p");
        tarjetaElement.textContent = formatearMoneda(report.totalCredit);
        tarjetaElement.classList.add("sales-report__dynamic__text");
        row.appendChild(tarjetaElement);

        const dolaresElement = document.createElement("p");
        dolaresElement.textContent = formatearMoneda(report.totalDollar);
        dolaresElement.classList.add("sales-report__dynamic__text");
        row.appendChild(dolaresElement);

        const enCajaElement = document.createElement("p");
        enCajaElement.textContent = formatearMoneda(report.caja);
        enCajaElement.classList.add("sales-report__dynamic__text");
        row.appendChild(enCajaElement);

        const netwinElement = document.createElement("p");
        netwinElement.textContent = formatearMoneda(report.netwin);
        netwinElement.classList.add("sales-report__dynamic__text");
        row.appendChild(netwinElement);

        const paymentElement = document.createElement("p");
        paymentElement.textContent = formatearMoneda(report.totalPayment);
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

const exportToCSV = () => {
    if (!lastDailyReportData || lastDailyReportData.length === 0) {
        alert("No hay datos para exportar. Primero genera un reporte.");
        return;
    }

    // Cabecera del CSV (puedes cambiar textos)
    const headers = [
        "Fecha",
        "Cash In",
        "Efectivo",
        "Tarjeta",
        "Dólares",
        "En Caja",
        "Netwin",
        "Payment"
    ];

    const rows = lastDailyReportData.map(report => {
        // Fecha: respetamos lo que viene del backend
        const fecha = report.fecha;

        // IMPORTANTE: aquí uso los valores "crudos" del backend,
        // sin formatear a moneda para que Excel los tome como número.
        return [
            fecha,
            report.totalCashIn ?? 0,
            report.totalCash ?? 0,
            report.totalCredit ?? 0,
            report.totalDollar ?? 0,
            report.caja ?? 0,
            report.netwin ?? 0,
            report.totalPayment ?? 0
        ];
    });

    // Construir texto CSV
    const csvContent = [
        headers.join(","),                // primera línea: headers
        ...rows.map(r => r.join(","))     // resto: filas
    ].join("\n");

    // Crear Blob y disparar descarga
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const fechaInicio = inputInicio.value || "";
    const fechaFin = inputFinal.value || "";
    a.download = `reporte_ventas_${fechaInicio}_a_${fechaFin}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
document.querySelector("#getReportButton").addEventListener("click", getDailyReport);
document.querySelector("#exportCsvButton").addEventListener("click", exportToCSV);
