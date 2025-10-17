import "../src/styles/index.css";

import Get from "./Get.js";

import Auth from "./auth.js";

const token = localStorage.getItem("token");
console.log(token)
const auth = new Auth()
auth.protectedRoute();
 

const logout = document.querySelector("#logout");

logout.addEventListener("click", () => auth.logout())

const startDate = document.querySelector("#fechaInicio");
const endDate = document.querySelector("#fechaFinal");
const dataContainer = document.querySelector(".charRegisterReport__data-container")
const reportButton = document.querySelector("#getReportButton")
let lastDownloadPayload = {porFecha : [], fechaInicio: null, fechaFin: null, totalGeneral: null} 


const getDailyRegisterReport = async() => {

    const fechaQueryInicio = startDate.value;
    const fechaQueryFinal = endDate.value;

    if(!fechaQueryInicio || !fechaQueryFinal){
        alert("Debes seleccionar la fecha");
        return
    }
 

        const getRegisterData = new Get(`https://juegoenvivo1-701fa226890c.herokuapp.com/countPlayers?fechaInicio=${fechaQueryInicio}&fechaFin=${fechaQueryFinal}`, token)
        const {porFecha = [], fechaInicio, fechaFin, totalGeneral} = await getRegisterData.get();

          lastDownloadPayload = {porFecha, fechaInicio, fechaFin, totalGeneral};


        clearDynamicData();

        if(porFecha.length === 0){
            const noData = document.createElement("p");
            noData.textContent = "No se encontraron datos en la fecha seleccionada";
            noData.classList.add("chartRegisterDailyReport__report-dynamic");
            dataContainer.appendChild(noData)
            return;
        }

        dynamicReport(porFecha)
        renderTotals(fechaInicio, fechaFin, totalGeneral)



}


reportButton.addEventListener("click", getDailyRegisterReport)

const dynamicReport = (lista) => {
    lista.forEach((item) => {
        const row = document.createElement("div");
        row.classList.add("chartRegisterDailyReport__dynamic");
        row.dataset.item = JSON.stringify(item);

        const itemFecha = document.createElement("p");
        itemFecha.classList.add("chartRegisterDailyReport__dynamic__text");

        let formattedDate = "-";
        if(item?.fecha && typeof item.fecha === "string"){
            const [y, m, d] = item.fecha.split("T")[0].split("-");
            formattedDate =  `${d}/${m}/${y}`;
        }

        itemFecha.textContent = formattedDate;
        row.appendChild(itemFecha)

        const itemClients = document.createElement("p");
        itemClients.classList.add("chartRegisterDailyReport__dynamic__text");
        itemClients.textContent = item.totalClientes ?? "-";
        row.appendChild(itemClients);


        dataContainer.appendChild(row)
    })
}

   const formattedDate = (date) => {
     let newDate = "-";
     if(typeof date === "string" && date.trim()){
        const iso = date.split("T")[0];
        const [y, m, d] = iso.split("-");
        if(y && m && d) newDate = `${d}/${m}/${y}`
    
     }
          return newDate; // <-- añadido

   }


const clearDynamicData = () => {
  const existingData = document.querySelectorAll(".chartRegisterDailyReport__dynamic");
  existingData.forEach((element) => element.remove());
};


const renderTotals = (fechaDeInicio, fechaFin, totalGeneral) => {

    const wrap = document.createElement("div");
    wrap.classList.add("chartRegisterDailyReport__dynamic");

    const titleDate = document.createElement("p");
    titleDate.classList.add("chartRegisterDailyReport__dynamic__text-totals");



   titleDate.textContent = `Del ${formattedDate(fechaDeInicio)} al ${formattedDate(fechaFin)}`;
   wrap.appendChild(titleDate);
   


    const tTotals = document.createElement("p");
    tTotals.classList.add("chartRegisterDailyReport__dynamic__text-totals");
    tTotals.textContent = totalGeneral;
    wrap.appendChild(tTotals);

    dataContainer.appendChild(wrap)



}

const onLoadDate = (input) => {
  const now = new Date();
  let day = now.getDate();
  let month = now.getMonth() + 1;
  let year = now.getFullYear();

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  const formattedDateOnload = `${year}-${month}-${day}`;
  const dateInputTransactions = input;
  if (dateInputTransactions) dateInputTransactions.value = formattedDateOnload;
};

onLoadDate(startDate)
onLoadDate(endDate)

window.onload = () => {
  onLoadDate();
};


const buildRowsForExport = ({porFecha, fechaInicio, fechaFin, totalGeneral}) => {
    const rows = porFecha.map((s) => ({

        Fecha:(s.fecha || "").split("T")[0],
        Clientes: Number(s.totalClientes ?? 0)
    }))

    rows.push({
        Fecha: `Del ${formattedDate(fechaInicio)} al ${formattedDate(fechaFin)}`,
        Clientes: Number(totalGeneral ?? 0)
    })

    return rows



}

const downloadCSVFromArrayOfObjects = (rows, filename ="report.csv") => {
    if(!rows || !rows.length) return;

    const escapeCSV = (v) => {
           if (v == null) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;

    }

    const headers = Object.keys(rows[0]);

    const headLine = headers.map(escapeCSV).join(",");
    const body = rows
        .map((r) => headers.map((h) => escapeCSV(r[h])).join(","))
        .join("\n");
    const csv = "\uFEFF" + headLine + "\n" + body; // BOM UTF-8 para Excel

    const blob = new Blob([csv], {type : "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url)

}

const exportButton = document.querySelector("#exportButton");

exportButton.addEventListener("click", () => {
    const {porFecha, fechaInicio, fechaFin, totalGeneral} = lastDownloadPayload;

    if(!porFecha || porFecha.length === 0 ){
        alert("No hay datos para exportar");
        return;
    }

    const rows = buildRowsForExport({porFecha, fechaInicio, fechaFin, totalGeneral});
const safeStart = (fechaInicio || "inicio").replace(/[^\w\-]+/g, "_");
const safeEnd   = (fechaFin || "fin").replace(/[^\w\-]+/g, "_");
const filename  = `registros_${safeStart}_a_${safeEnd}.csv`;


  downloadCSVFromArrayOfObjects(rows, filename);
})