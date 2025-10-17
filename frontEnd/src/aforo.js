import "../src/styles/index.css";

import Auth from "./auth.js";
import Get from "./Get.js";

const token = localStorage.getItem("token");
console.log(token)
const auth = new Auth()
auth.protectedRoute();


const logout = document.querySelector("#logout");

logout.addEventListener("click", () => auth.logout())


const startDate = document.querySelector("#fechaInicio");
const endDate = document.querySelector("#fechaFinal");

const dataContainer = document.querySelector(".aforo__data-container")
const reportButton = document.querySelector("#getReportButton");
let lastDownloadPayload = {porFecha : [], fechaInicio: null, fechaFin: null, totalAforo: null} 



   const formattedDate = (date) => {
     let newDate = "-";
     if(typeof date === "string" && date.trim()){
        const iso = date.split("T")[0];
        const [y, m, d] = iso.split("-");
        if(y && m && d) newDate = `${d}/${m}/${y}`
    
     }
          return newDate; // <-- añadido

   }



const getAforoReport = async () => {

    const fechaQueryInicio = startDate.value;
    const fechaQueryFinal = endDate.value;

    if(!fechaQueryInicio || ! fechaQueryFinal){
        alert("Debes selecciona la fecha")
        return
    }

    
 


        const getAforoData = new Get(`https://juegoenvivo1-701fa226890c.herokuapp.com/aforo?fechaInicio=${fechaQueryInicio}&fechaFin=${fechaQueryFinal}`, token)
        const {porFecha = [], fechaInicio, fechaFin, totalAforo} = await getAforoData.get()
                  lastDownloadPayload = {porFecha, fechaInicio, fechaFin, totalAforo};



        clearDynamicData();

        if(porFecha.length === 0){
            const noData = document.createElement("p");
            noData.textContent = "No se encontraron datos en las fechas seleccionadas";
            noData.classList.add("aforo__report-dynamic");
            dataContainer.appendChild(noData)
            return
        }

        dynamicReport(porFecha);
        renderTotals(fechaInicio, fechaFin, totalAforo)
        
   
}



reportButton.addEventListener("click", getAforoReport);

const dynamicReport = (lista) => {
    lista.forEach((item) => {

        const row = document.createElement("div");
        row.classList.add("aforo__dynamic");
        row.dataset.item = JSON.stringify(item);

        const itemFecha = document.createElement("p");
               itemFecha.classList.add("aforo__dynamic__text");
   
        itemFecha.textContent =formattedDate(item.fecha);
 

   
        row.appendChild(itemFecha);

        const itemAforo = document.createElement("p");
        itemAforo.classList.add("aforo__dynamic__text");
        itemAforo.textContent = item.aforoClientes ?? "-";
        row.appendChild(itemAforo);

        dataContainer.appendChild(row)




    })
}

const clearDynamicData = () => {
  const existingData = document.querySelectorAll(".aforo__dynamic");
  existingData.forEach((element) => element.remove());
};


const renderTotals = (fechaInicio, fechaFin, totalAforo) => {
    const wrap = document.createElement("div");
    wrap.classList.add("aforo__dynamic");

    const titleDate = document.createElement("p");
    titleDate.classList.add("aforo__dynamic__text-totals");

    titleDate.textContent = `Del ${formattedDate(fechaInicio)} al ${formattedDate(fechaFin)}`;
    wrap.appendChild(titleDate);


    const tTotals = document.createElement("p");
    tTotals.classList.add("aforo__dynamic__text-totals");
    tTotals.textContent = totalAforo;
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


const buildRowsForExport = ({porFecha, fechaInicio, fechaFin, totalAforo}) => {
    const rows = porFecha.map((s) => ({

        Fecha:(s.fecha || "").split("T")[0],
        Clientes: Number(s.aforoClientes ?? 0)
    }))

    rows.push({
        Fecha: `Del ${formattedDate(fechaInicio)} al ${formattedDate(fechaFin)}`,
        Clientes: Number(totalAforo ?? 0)
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
    const {porFecha, fechaInicio, fechaFin, totalAforo} = lastDownloadPayload;

    if(!porFecha || porFecha.length === 0 ){
        alert("No hay datos para exportar");
        return;
    }

    const rows = buildRowsForExport({porFecha, fechaInicio, fechaFin, totalAforo});
const safeStart = (fechaInicio || "inicio").replace(/[^\w\-]+/g, "_");
const safeEnd   = (fechaFin || "fin").replace(/[^\w\-]+/g, "_");
const filename  = `registros_${safeStart}_a_${safeEnd}.csv`;


  downloadCSVFromArrayOfObjects(rows, filename);
})