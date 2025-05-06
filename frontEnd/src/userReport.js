import "../src/styles/index.css"
import Get from "./Get.js"


const inputInicioUsers = document.querySelector("#initialDateUser");
const inputFinalUser = document.querySelector("#finalDateUser");
const userReportContainer = document.querySelector("#usersReportDataContainer")

const token = localStorage.getItem("token");
console.log(token);


import Auth from "./auth.js";
const authUser = new Auth();
authUser.protectedRoute();


const formatearMonedaUsers = (cantidad) => {
    if(isNaN(cantidad)) return "0.00";
    return Number(cantidad).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    })
}

const logout = document.querySelector("#logout");
logout.addEventListener("click", () => authUser.logout())

const getDailyReportUser = async () => {
    const fechaInicioUser = inputInicioUsers.value;
    const fechaFinalUser = inputFinalUser.value;
  
    // 1) Validar ambas fechas
    if (!fechaInicioUser || !fechaFinalUser) {
      console.error("Debes seleccionar ambas fechas");
      return;
    }
  
    // 2) Construir URL y llamar a la API
    const url = `http://localhost:4000/dailyreportusers?fechaInicioUser=${fechaInicioUser}&fechaFinUser=${fechaFinalUser}`;
    const getDailyReportRequestUser = new Get(url, token);
    const dailyReportDataUser = await getDailyReportRequestUser.get();
  
    // 3) Procesar respuesta
    if (dailyReportDataUser.length > 0) {
      console.log(dailyReportDataUser);
      selectedReportUsers(dailyReportDataUser);
    } else {
      console.warn("No se encontraron ventas en el rango seleccionado");
      clearDynamicData();
      const noDataMessage = document.createElement("p");
      noDataMessage.textContent = "No se encontraron ventas en el rango seleccionado.";
      noDataMessage.classList.add("sales-report__dynamic");
      userReportContainer.appendChild(noDataMessage);
    }
  
    return dailyReportDataUser;
  };
  
  // Ejemplo de cómo enlazarlo a un botón
  document.querySelector("#getReportButtonUsers").addEventListener("click", getDailyReportUser);


const selectedReportUsers = (reports) => {
  clearDynamicData();

  reports.forEach(reports => {

    const row = document.createElement("div");
    row.classList.add("users-reports__dynamic");


    const userUsersElement = document.createElement("p");
    userUsersElement.classList.add("users-reports__dynamic__text");
    userUsersElement.textContent = reports.userId;
    row.appendChild(userUsersElement);

    const userUsernameElement = document.createElement("p");
    userUsernameElement.classList.add("users-reports__dynamic__text");
    userUsernameElement.textContent = reports.username;
    row.appendChild(userUsernameElement)
    



    const cashInUsersElement = document.createElement("p");
    cashInUsersElement.classList.add("users-reports__dynamic__text");
    cashInUsersElement.textContent = formatearMonedaUsers(reports.totalCashIn)
    row.appendChild(cashInUsersElement);

    const cashUsersElement = document.createElement("p");
    cashUsersElement.classList.add("users-reports__dynamic__text");
    cashUsersElement.textContent = formatearMonedaUsers(reports.totalCash)   
    row.appendChild(cashUsersElement);
    
    const creditUsersElement = document.createElement("p");
    creditUsersElement.classList.add("users-reports__dynamic__text");
    creditUsersElement.textContent = formatearMonedaUsers(reports.totalCredit);
    row.appendChild(creditUsersElement);

    const dollarUserElement = document.createElement("p");
    dollarUserElement.classList.add("users-reports__dynamic__text");
    dollarUserElement.textContent = formatearMonedaUsers(reports.totalDollars);
    row.appendChild(dollarUserElement);

    const paymentUserElement = document.createElement("p");
    paymentUserElement.classList.add("users-reports__dynamic__text");
    paymentUserElement.textContent = formatearMonedaUsers(reports.totalPayment);
    row.appendChild(paymentUserElement);

    const cajaUser = document.createElement("p");
    cajaUser.classList.add("users-reports__dynamic__text");
    cajaUser.textContent = formatearMonedaUsers(reports.caja);
    row.appendChild(cajaUser)

    const netwinUser = document.createElement("p");
    netwinUser.classList.add("users-reports__dynamic__text");
    netwinUser.textContent = formatearMonedaUsers(reports.netwin);
    row.appendChild(netwinUser)

    userReportContainer.appendChild(row)

  })
}


const clearDynamicData = () => {
  const existingData = document.querySelectorAll(".sales-report__dynamic");
  existingData.forEach(element => element.remove());
};
