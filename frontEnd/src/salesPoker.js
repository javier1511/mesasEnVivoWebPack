import "../src/styles/index.css"

let playerIdPoker = null;
let playerNamePoker = null;
let playerMobilePoker = null;
/*let userIdPoker = null*/

import logoComplete from "./images/logo.png";
import logoLarge from "./images/DIAMANTE.png";


let token = localStorage.getItem('token');
console.log(token)


/*if(token){

    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson);
    userIdPoker = payload.id;
    document.querySelector("#userIdPoker").value = userIdPoker
    console.log('User ID', payload.id);
}*/





import Auth from "./auth.js";
const authPoker = new Auth();

authPoker.protectedRoute();


const logoutPoker = document.querySelector("#logout");


logoutPoker.addEventListener("click", () => authPoker.logout());


import Get from "./Get.js";
import Popup from "./Popup.js";

const getPlayersInPokerSales = async () => {
    const getRequestInPoker = new Get('http://localhost:4000/players', token);
    const dataPoker = await  getRequestInPoker.get();
    console.log(dataPoker);
    return dataPoker;
}

getPlayersInPokerSales();


const inputQueryMobile = document.querySelector("#pokerFormText");
const displayDataPokerContainer = document.querySelector("#pokerData");
const pokerFormName = document.querySelector("#pokerFormName");
const pokerFormId = document.querySelector("#pokerFormId");
const pokerFormMobile = document.querySelector("#pokerFormMobile")
const pokerListOfPlayersContainer = document.querySelector(".poker__list")
const popupPoker = new Popup(pokerListOfPlayersContainer);
const pokerPopupClose = document.querySelector("#pokerPopupClose");
/*const pokerUserId = document.querySelector("#userIdPoker");*/

/*pokerUserId.value = userIdPoker;*/




const displayUserPoker = async () => {
  const queryPoker = inputQueryMobile.value;
  const payloadPoker = await getPlayersInPokerSales();

  const dataDisplayPoker = payloadPoker
    .filter(eventDataPoker => {
      if (!queryPoker) return true;
      // Si no hay mobile, devolvemos false
      return eventDataPoker.mobile
        ? eventDataPoker.mobile.toLowerCase().includes(queryPoker.toLowerCase())
        : false;
    })
    .map(({ _id, name, mobile }) => `

        <p class="poker__value poker__value-name"
           data-id="${_id}"
           data-mobile="${mobile}"
           data-name="${name}">
          ${name}
        </p>
        <p class="poker__value">${mobile}</p>

    `)
    .join('');

  displayDataPokerContainer.innerHTML = dataDisplayPoker || '<p>No se encontraron jugadores.</p>';

  // Añadimos los listeners
  document.querySelectorAll(".poker__value-name").forEach(elementPoker => {
    elementPoker.addEventListener("click", event => {
    const targetPoker = event.target;
    // ya no usamos `const` aquí, para que persista en la global:
    playerIdPoker       = targetPoker.dataset.id;
    playerMobilePoker   = targetPoker.dataset.mobile;
    playerNamePoker     = targetPoker.dataset.name;

    popupPoker.openPopup();

    pokerFormId.value     = playerIdPoker;
    pokerFormMobile.value = playerMobilePoker;
    pokerFormName.value   = playerNamePoker;

         popupPoker.closePopup();
    });
  });
};

console.log("jdPLayer",playerIdPoker)
displayUserPoker()

inputQueryMobile.addEventListener('input', displayUserPoker);
pokerFormName.addEventListener('click', () => popupPoker.openPopup())
pokerPopupClose.addEventListener('click', () => popupPoker.closePopup())


const pokerMain = document.querySelector(".poker__form");
const errorsContainerPoker = document.querySelector(".poker__errorMessages");

const validatePokerForm = () => {

    const formPokerNameValidation = document.querySelector("#pokerFormName").value.trim();
    const formPokerMobileValidation = document.querySelector("#pokerFormMobile").value.trim();
    const formPokerIdValidation = document.querySelector("#pokerFormId").value.trim();



    let pokerErrors = [];

    if(formPokerIdValidation.length < 3 || formPokerNameValidation.length > 50) {
        pokerErrors.push('El nombre debe tener entre 3 y 50 caracteres')
    }

    if(formPokerMobileValidation.length !== 10 || formPokerMobileValidation === "1234567890"){
        pokerErrors.push('El telefono debe ser de 10 digitos y no puede ser 1234567890')
    }

    if(!formPokerIdValidation){
        pokerErrors.push('El ID del jugador no puede ir vacio');
    }


    return pokerErrors

}


const setPokerTime = () => {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    const currentTimePoker = `${hours}:${minutes}:${seconds}`;

    const fechaInputPoker = document.querySelector("#pokerDate");

    const fechaGuardadaPoker = localStorage.getItem("fechaSeleccionadaPoker");
    if(fechaGuardadaPoker){
        fechaInputPoker.value = fechaGuardadaPoker
    }

    fechaInputPoker.addEventListener('change', function() {
        if(fechaInputPoker.value){
            localStorage.setItem("fechaSeleccionadaPoker", fechaInputPoker.value)
        }
    })

    document.querySelector("#pokerTime").value = currentTimePoker

}

window.onload = function () {
    setPokerTime()
}


pokerMain.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!confirm('¿Estas seguro de que deseas enviar esta venta?')){
        return;
    }

    errorsContainerPoker.innerHTML = '';

    const errorsPoker = validatePokerForm();

    if(errorsPoker.length > 0) {
        errorsPoker.forEach(error => {
            const errorPokerItem = document.createElement("div");
            errorPokerItem.textContent = error;
            errorsContainerPoker.appendChild(errorPokerItem)
        })
        return;
    }

    setPokerTime();


    const pokerFormData = {

        player: document.querySelector("#pokerFormId").value.toUpperCase(),
        cash: document.querySelector("#cashPoker").value || "0",

        name: document.querySelector("#pokerFormName").value.toUpperCase(),
        credit: document.querySelector("#cardPoker").value || "0",
        dollars: document.querySelector("#usdPoker").value || "0",
        payment:document.querySelector("#paymentPoker").value || "0",
        rake: document.querySelector("#rake").value || "0",
        date: document.querySelector("#pokerDate").value.toUpperCase(),
        time: document.querySelector("#pokerTime").value.toUpperCase()

    }

    console.log("Datos que se van a enviar", pokerFormData);


    try {

        const token = localStorage.getItem("token");

        if(!token){
            alert("Inicia sesion nuevamente");
              window.location.href = "http://localhost:8080/"
              return;
        }

        const response = await fetch("http://localhost:4000/poker", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token':token
            },
            body: JSON.stringify(pokerFormData)
        })
        if(!response.ok){
            const errorData = await response.json();
            alert(errorData.message);
            return
        }

        alert('Guardado exitosamente')
        // === GENERAR TICKET ===
                    const ticketHTML = `
                     <div class="ticket">
                           <div class="ticket__header-container">
                            <img src="${logoComplete}" alt="" class="ticket__header">
                        </div>
                          <div class="ticket__body-container">
                              <div class="ticket__title-container">
                                  <p class="ticket__title">Fecha:</p>
                                  <p class="ticket__title">Hora:</p>
                                  <p class="ticket__title">Nombre:</p>
                                  <p class="ticket__title">Celular:</p>
                                  <p class="ticket__title">Fondo:</p>
                                  <p class="ticket__title">Efectivo:</p>
                                  <p class="ticket__title">Tarjeta:</p>
                                  <p class="ticket__title">Dolares:</p>
                                  <p class="ticket__title">Pago:</p>
                              </div>
                              <div class="ticket__value-container">
                                  <p class="ticket__title">${pokerFormData.date}</p>
                                  <p class="ticket__title">${pokerFormData.time}</p>
                                  <p class="ticket__title">${pokerFormData.name}</p>
                                  <p class="ticket__title">${playerMobilePoker}</p>
             
                                  <p class="ticket__title">${pokerFormData.cash}</p>
                                  <p class="ticket__title">${pokerFormData.credit}</p>
                                  <p class="ticket__title">${pokerFormData.dollars}</p>
                                  <p class="ticket__title">${pokerFormData.payment}</p>
                              </div>
                          </div>
                          <div class="ticket__text-container">
                              <p class="ticket__text">DIAMANTE CASINO OPERADORA COMERCIALIZADORA Y ARRENDADORA
                DE MEXICO S.A. DE C.V. PERSONA MORAL DE REGIMEN GENERAL
                DE LEY AVENIDA HIDALGO 6806 COLONIA ARENAL TAMPICO TAMAULIPAS
                C.P. 89344 RFC CAM970528IYA EXPEDIDO EN DIAMANTE CASINO
                AVENIDA HIDALGO 6806 COLONIA ARENAL TAMPICO TAMAULIPAS.</p>
                          </div>
                          <div class="ticket__footer-container">
                            <img src="${logoLarge}" alt="" class="ticket__footer">
                        </div>
                      </div>
                    `;
            
                    // Crear una ventana emergente para imprimir
                    const printWindow = window.open();
            
                    if (!printWindow) {
                        alert("Por favor, permite las ventanas emergentes para continuar.");
                        return;
                    }
            
                    printWindow.document.write(`
                        <html>
                            <head>
                                <title>Ticket de Venta</title>
                          
                            </head>
                            <style>
                            .body {
                    
                                width: 100%;
                        
                            }
        
                            
        .ticket{
            background-color: white;
            width: 100%;
            
        }
        
        .ticket__header-container{
            width: 100%;
            display: flex;
            justify-content: center;
        }
            
        
        .ticket__title{
            font-size: 12px;
            font-weight: bold;
        }
        
        
        .ticket__body-container{
            display: grid;
            grid-template-columns: 50% 50%;
            text-align: center;
            padding-bottom: 10px;
        
        }
        
        .ticket__text{
            text-align: center;
            font-size: 10px;
        }
        
        .ticket__footer-container{
            width: 100%;
            display: flex;
            justify-content: center; 
            padding-top: 30px;
        }
        
        .ticket__footer{
            width: 20%;
        }
        
        .ticket__value{
            font-size: 16px;
        }
                        </style>
                            <body>
                                ${ticketHTML}
                                <script>
                                    setTimeout(() => {
                                        window.print();
                                        window.close();
                                    }, 500); // Retraso para asegurar que el DOM se renderice
                                </script>
                            </body>
                        </html>
                    `);
            
                    printWindow.document.close();  // Asegura que el contenido se cargue correctamente
        
                    // Recargar la página principal después de imprimir el ticket
                    printWindow.onafterprint = () => {
                        window.location.reload();
                    };
    } catch (error) {
        console.error('Error de conexion', error);
        alert('Error al conectar con el servidor')
        
    }
})