import "../src/styles/index.css"
import Get from "./Get.js";
import Popup from "./Popup.js";


const startDate = document.querySelector("#initialDate");
const endDate = document.querySelector("#finalDate");
const players = document.querySelector("#player")
const dataContainer = document.querySelector(".reportByDateAndPlayer__data")
const popupContainer = document.querySelector(".sales__list")
const popupDateAndPlayer = new Popup(popupContainer)

const token = localStorage.getItem("token");
console.log(token);


import Auth from "./auth";
const auth = new Auth();
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


const getPlayersReport = async () => {

    const fechaDeInicio = startDate.value;
    const fechaFinal = endDate.value;
    const player = players.value;

    if(!fechaDeInicio || !fechaFinal || !player){
        alert("Debes seleccionar los 3 campos");
        return;
    }


    const url = `http://localhost:4000/playeranddate?fechaInicio=${fechaDeInicio}&fechaFin=${fechaFinal}&name=${player}`
    const getDailyReportByDateAndPlayer = new Get(url, token);

    const dailyReportDataByDateAndPlayer = await getDailyReportByDateAndPlayer.get()

    if(dailyReportDataByDateAndPlayer.length > 0){
        console.log(dailyReportDataByDateAndPlayer);
        requestReport(dailyReportDataByDateAndPlayer)
    }else{

           console.warn("No se encontraron ventas en el rango seleccionado.");
        clearDynamicData(); // Limpia solo los datos dinámicos
        const noDataMessage = document.createElement("p");

         
        noDataMessage.textContent = "No se encontraron ventas en el rango seleccionado.";
        noDataMessage.classList.add("clientAndDate-reports__dynamic");
        dataContainer.appendChild(noDataMessage);

    }

    return dailyReportDataByDateAndPlayer;

}

document.querySelector("#getReportButton").addEventListener("click", getPlayersReport)

const requestReport = (reports) => {
    clearDynamicData();

    reports.forEach(report => {
        const row = document.createElement("div");
        row.classList.add("clientAndDate-reports__dynamic");

        const dateElement = document.createElement("p");
        dateElement.classList.add("clientAndDate-report__dynamic__text")

        let[year, month, day] = report.fecha.split('-');
        let formattedDate = `${day}/${month}/${year}`;
        dateElement.textContent = formattedDate;
        row.appendChild(dateElement);


        const cashElement = document.createElement("p");
        cashElement.classList.add("clientAndDate-report__dynamic__text");
        cashElement.textContent = formatearMoneda(report.totalCash)
        row.appendChild(cashElement);

        const creditElement = document.createElement("p");
        creditElement.classList.add("clientAndDate-report__dynamic__text");
        creditElement.textContent = formatearMoneda(report.totalCredit);
        row.appendChild(creditElement);

        const dollarElement = document.createElement("p");
        dollarElement.classList.add("clientAndDate-report__dynamic__text");
        dollarElement.textContent = formatearMoneda(report.totalDollar)
        row.appendChild(dollarElement);

        const paymentElement = document.createElement("p");
        paymentElement.classList.add("clientAndDate-report__dynamic__text");
        paymentElement.textContent = formatearMoneda(report.totalPayment)
        row.appendChild(paymentElement);

        const netwinElement = document.createElement("p");
        netwinElement.classList.add("clientAndDate-report__dynamic__text");
        netwinElement.textContent = formatearMoneda(report.netwin);
        row.appendChild(netwinElement)


        dataContainer.appendChild(row)
    }) 


}

const clearDynamicData = () => {
    const existingData = document.querySelectorAll(".clientAndDate-reports__dynamic");
    existingData.forEach(element => element.remove());
};



const getPlayersInReportByDateAndName = async () => {
    const getRequestInSales = new Get('http://localhost:4000/players', token);
    const data = await getRequestInSales.get();
    console.log(data);
    return data;
};


const inputQueryName = document.querySelector("#lookByName")
const inputQueryMobile = document.querySelector("#lookByMobile")
const dataContainerPopup = document.querySelector(".sales__data")
const playerInput = document.querySelector("#player")




const displayUserData = async () => {
    let queryName = inputQueryName.value.trim().toLowerCase();
    let queryMobile = inputQueryMobile.value.trim().toLowerCase()
    const payloadData = await getPlayersInReportByDateAndName();
    
    
    let dataDisplayReportByDateAndName = payloadData
    .filter((evenData) => {

        const matchesName = queryName === '' || evenData.name?.toLowerCase().includes(queryName);
        const matchesMobile = queryMobile === '' || evenData.mobile?.toLowerCase().includes(queryMobile)
        return matchesName && matchesMobile
    })
    .map((object) => {
        const {name, mobile} = object;
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
    .join('')

    dataContainerPopup.innerHTML = dataDisplayReportByDateAndName || '<p>No se encontraron jugadores.</p>';

    const valueNames = document.querySelectorAll(".sales__value-name");
    valueNames.forEach((element) => {
        element.addEventListener("click", (event) => {

            const {name} = event.target.dataset;
            playerInput.value = name

            popupDateAndPlayer.closePopup()


        } )

    })



}

displayUserData();
inputQueryName.addEventListener("input", displayUserData);
inputQueryMobile.addEventListener("input", displayUserData)
playerInput.addEventListener("click", () => popupDateAndPlayer.openPopup())
const closeImage = document.querySelector(".sales__list-close");
closeImage.addEventListener("click", () => popupDateAndPlayer.closePopup())



const onLoadDate = () => {
    const now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month  < 10 ? '0' + month : month;

    const formattedDateOnload = `${year}-${month}-${day}`;

    const dateInputTransactions = document.querySelector("#initialDate");
    const endDate = document.querySelector("#finalDate")
    dateInputTransactions.value = formattedDateOnload;
    endDate.value = formattedDateOnload
}

window.onload = () => {
    onLoadDate();
}