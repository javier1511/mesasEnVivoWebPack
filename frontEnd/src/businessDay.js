import "../src/styles/index.css"
import Get from "./Get.js";

const inputInicio = document.querySelector("#fechaInicio");
const inputFinal = document.querySelector("#fechaFinal");
const salesReportContainer = document.querySelector(".aforo__data-container");
const reportButton = document.querySelector("#getReportButton");

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
    const url = `http://localhost:4000/businessDay?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    const getDailyReportRequest = new Get(url, token);

    // Llamar a la API y obtener los datos
    const dailyReportData = await getDailyReportRequest.get();

    // Mostrar los datos en consola solo si existen
    if (dailyReportData.length > 0) {
        console.log(dailyReportData);
        dynamicReport(dailyReportData);
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


reportButton.addEventListener("click", getDailyReport);

const dynamicReport = (lista) => {
    lista.forEach((item) => {

        const row = document.createElement("div");
        row.classList.add("businessDay__dynamic");
        row.dataset.item = JSON.stringify(item);

        const itemStatus = document.createElement("p");
               itemStatus.classList.add("aforo__dynamic__text");
               itemStatus.textContent = item.status;
               row.appendChild(itemStatus);
   
 

   


        const itemDate = document.createElement("p");
        itemDate.classList.add("aforo__dynamic__text");
        itemDate.textContent = item.date;
        row.appendChild(itemDate);


        const itemCloseBy = document.createElement("p");
        itemCloseBy.classList.add("aforo__dynamic__text");
        itemCloseBy.textContent = item.closeBy ?? "-";
        row.appendChild(itemCloseBy)


        salesReportContainer.appendChild(row)




    })
}

const clearDynamicData = () => {
  const existingData = document.querySelectorAll(".aforo__dynamic");
  existingData.forEach((element) => element.remove());
};





