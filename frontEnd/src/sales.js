import "../src/styles/index.css"

let playerId = null;
let playerName = null;
let playerMobile = null;
import logoComplete from "./images/logo.png";
import logoLarge from "./images/DIAMANTE.png";

import Print from "./Print.js";

let token = localStorage.getItem('token');
console.log(token)

import Auth from "./auth.js";
const auth = new Auth()
auth.protectedRoute();


const logout = document.querySelector("#logout");

logout.addEventListener("click", () => auth.logout())


import Get from "./Get.js";
import Popup from "./Popup.js";

const getPlayersInSales = async () => {
    const getRequestInSales = new Get('http://localhost:4000/players', token);
    const data = await getRequestInSales.get();
    console.log(data);
    return data;
};

getPlayersInSales();

const inputQuerySales = document.querySelector(".sales__form-text");
const displayDataSales = document.querySelector(".sales__data");
const salesFormName = document.querySelector("#salesName")
const salesFormId = document.querySelector("#salesId")
const salesFormMobile = document.querySelector('#salesMobile')
const salesForm = document.querySelector(".sales__form");
const listButton = document.querySelector(".sales__button")
const salesList = document.querySelector(".sales__list")
const popupSales = new Popup(salesList);
const salesCloseButton = document.querySelector(".sales__list-close")

const displayUserSales = async () => {
    let querySales = inputQuerySales.value;
    const payloadSales = await getPlayersInSales();

    let dataDisplaySales = payloadSales.filter((eventData) => {
        if (querySales === '') return true;
        return eventData.mobile?.toLowerCase().includes(querySales.toLowerCase());
    }).map((object) => {
        const { _id, name, mobile } = object;
        return `
        <div class="sales__item">
            <div class="sales__item-container">
                <p class="sales__text">Nombre</p>
                <p class="sales__value sales__value-name" data-id="${_id}" data-mobile="${mobile}">${name}</p>
            </div>
            <div class="sales__item-container">
                <p class="sales__text">Teléfono</p>
                <p class="sales__value">${mobile}</p>
            </div>
        </div>
        `;
    }).join('');

    displayDataSales.innerHTML = dataDisplaySales || '<p>No se encontraron jugadores.</p>';

    // Agregar evento de clic en cada nombre de jugador
    const salesValueNames = document.querySelectorAll(".sales__value-name");
    salesValueNames.forEach((element) => {
        element.addEventListener("click", () => {
            playerName = element.textContent; // Asignar el nombre seleccionado a playerName
            playerId = element.getAttribute("data-id"); // Asignar el ID seleccionado a playerId
            playerMobile = element.getAttribute("data-mobile");
            const playerNumber = element.closest('.sales__item').querySelector('.sales__item-container:nth-child(2) .sales__value').textContent;
            
            console.log("Nombre seleccionado:", playerName);
            console.log("ID seleccionado:", playerId);
            console.log("Número de teléfono seleccionado:", playerNumber);
            
            // Aquí puedes usar playerName, playerId y playerNumber como necesites
            salesFormName.value = playerName; // Ejemplo: asignar el nombre al input de ventas
            salesFormId.value = playerId;
            salesFormMobile.value = playerNumber;

            popupSales.closePopup();

          
            

                
           
        });
        
    });
    
};

displayUserSales();
inputQuerySales.addEventListener('input', displayUserSales);

salesFormName.addEventListener('click', () => popupSales.openPopup()); // Asegúrate de tener el método openPopup en Popup.js
salesCloseButton.addEventListener("click", () => popupSales.closePopup());







/*
const salesNameContainer = document.querySelector(".sales__name-container")
const salesMobileContainer = document.querySelector(".sales__mobile-container")
const salesIdContainer = document.querySelector(".sales__id-container")
const checkboxSalesContainer = document.querySelector(".sales__checkbox-container")
const salesInputName = document.querySelector("#salesName")
const salesInputMobile = document.querySelector("#salesMobile")
const salesInputId = document.querySelector("#salesId")
const formButton = document.querySelector(".form__button")
const salesFormMain = document.querySelector(".sales__list")
const salesForm = document.querySelector(".sales__form")
const errorsContainer = document.querySelector(".sales__errorMessages")
const salesMain = document.querySelector(".sales__form")






const selectPlayer = (clients) => {
    clients.forEach(client => {
        // Crear elementos de texto para el nombre, móvil y ID
        const salesNameElement = document.createElement("p");
        salesNameElement.textContent = client.name;
        salesNameContainer.appendChild(salesNameElement);

        const mobileSalesElement = document.createElement("p");
        mobileSalesElement.textContent = client.mobile;
        salesMobileContainer.appendChild(mobileSalesElement);

        const salesIdElement = document.createElement("p");
        salesIdElement.textContent = client._id;
        salesIdContainer.appendChild(salesIdElement);

        // Crear checkbox y agregar valores de mobile y _id como atributos data
        const checkboxSalesElement = document.createElement("input");
        checkboxSalesElement.type = "checkbox";
        checkboxSalesElement.value = client.name;
        checkboxSalesElement.setAttribute("data-mobile", client.mobile);
        checkboxSalesElement.setAttribute("data-id", client._id);
        checkboxSalesContainer.appendChild(checkboxSalesElement);

        // Evento change para el checkbox
        checkboxSalesElement.addEventListener('change', (event) => {
            if (event.target.checked) {
                salesInputName.value = event.target.value; // Nombre
                salesInputMobile.value = event.target.getAttribute("data-mobile"); // Mobile
                salesInputId.value = event.target.getAttribute("data-id"); // ID
            } else {
                salesInputName.value = "";
                salesInputMobile.value = "";
                salesInputId.value = "";
            }
        });
    });
}




const popupSales = () => {
    salesFormMain.classList.add("sales__opened")

            
    }
    
    
    salesInputName.addEventListener("click", popupSales)

        salesForm.addEventListener("submit", (event) => {
            event.preventDefault();
            salesFormMain.classList.remove("sales__opened")
        }
    )*/


//POPUP//

        //SALES//


        const salesMain = document.querySelector(".sales__form");
        const errorsContainer = document.querySelector(".sales__errorMessages");


    const validateSalesForm = () => {

        const salesInputName = document.querySelector("#salesName").value
const salesInputMobile = document.querySelector("#salesMobile").value
const salesInputId = document.querySelector("#salesId").value


let salesErrors = [];

if(salesInputName.length < 3 || salesInputName.length > 30){
    salesErrors.push('El nombre debe tener entre 3 y 30 caracteres')
}

if(salesInputMobile.length !== 10 || salesInputMobile === "1234567890"){
    salesErrors.push('El telefono debe ser de 10 digitos o no debe ser 1234567890')
}

if(salesInputId.length === ""){
    salesErrors.push('Este campo no puede ir vacio')
}





return salesErrors;



    }

    const setSalesTime = () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds

        const currentTime = `${hours}:${minutes}:${seconds}`;

        /*const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const formattedDate = `${day}/${month}/${year}`; // Cambié los separadores a /*/

        const fechaInput = document.querySelector("#salesDate");
     
        const fechaGuardada = localStorage.getItem("fechaSeleccionada");
        if(fechaGuardada){
            fechaInput.value = fechaGuardada
        }

        fechaInput.addEventListener("change", function () {
            if (fechaInput.value) {
                localStorage.setItem("fechaSeleccionada", fechaInput.value);
            }
        });
        
    

        document.querySelector("#salesTime").value = currentTime
   

        /*document.querySelector("#salesDate").value = formattedDate*/
 
    }




    window.onload = function() {
        setSalesTime()
    }




    salesMain.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        errorsContainer.innerHTML = '';
    
        const errors = validateSalesForm();
    
        if (errors.length > 0) {
            errors.forEach(error => {
                const errorSalesItem = document.createElement("div");
                errorSalesItem.textContent = error;
                errorsContainer.appendChild(errorSalesItem);
            });
            return;
        }
    
        setSalesTime();
    
        const salesFormData = {
            player: document.querySelector("#salesId").value.toUpperCase(),
            cash: document.querySelector("#cash").value || "0",
            cashIn: document.querySelector("#cashIn").value || "0",
            name: document.querySelector('#salesName').value.toUpperCase(),
            credit: document.querySelector('#card').value || "0",
            dollars: document.querySelector('#usd').value || "0",
            payment: document.querySelector("#payment").value || "0",
            date: document.querySelector('#salesDate').value.toUpperCase(),
            time: document.querySelector('#salesTime').value.toUpperCase()
        };
    
        console.log('Datos que se enviarán:', salesFormData);
    
        try {
            const token = localStorage.getItem('token');
    
            if (!token) {
                alert('No se encontró el token. Por favor, inicia sesión nuevamente.');
                return;
            }
    
            const response = await fetch('http://localhost:4000/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify(salesFormData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message);
                return;
            }
    
            alert('Guardado exitosamente');
    
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
                          <p class="ticket__title">${salesFormData.date}</p>
                          <p class="ticket__title">${salesFormData.time}</p>
                          <p class="ticket__title">${salesFormData.name}</p>
                          <p class="ticket__title">${playerMobile}</p>
                          <p class="ticket__title">${salesFormData.cashIn}</p>
                          <p class="ticket__title">${salesFormData.cash}</p>
                          <p class="ticket__title">${salesFormData.credit}</p>
                          <p class="ticket__title">${salesFormData.dollars}</p>
                          <p class="ticket__title">${salesFormData.payment}</p>
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
    font-size: 12px;
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
            console.error('Error de conexión:', error);
            alert('Error al conectar con el servidor');
        }
    });
    
    

    //CALCULADORA 2.0//

    import Calculator from "./calculator.js";

    
    const calculatorContainer = document.querySelector(".calculadora-container");
    const calculatorDisplay = document.querySelector(".calculadora__display");
    const calculatorButtons = document.querySelectorAll(".calculadora__button");
    const clearButton = document.querySelector("#clear-btn");
    const enterButton = document.querySelector("#enter-btn");
    
    const calculatorPopup = new Popup(calculatorContainer);
    
    // Iniciamos una sola instancia de Calculator para todos los inputs
    const calculator = new Calculator(calculatorDisplay, calculatorButtons, clearButton, enterButton, calculatorPopup);
    




    

  /*  //CALCULADORA//

    // Selección de los elementos
    const salesCashId = document.querySelector("#cash");
    const salesCardId = document.querySelector("#card");
    const salesUsdId = document.querySelector("#usd");
    const calculator = document.querySelector(".calculadora-container");
    const calculatorPopup = new Popup(calculator);
    let currentValue = '';
    const calculatorDisplay = document.querySelector(".calculadora__display");

    // Función para abrir el popup
    const openCalculatorPopup = () => {
        calculatorPopup.openPopup();
    };

    // Lista de elementos que tendrán el evento
    const elements = [salesCashId, salesCardId, salesUsdId];

    // Asignación del eventListener a cada elemento
    elements.forEach(element => {
        if (element) { // Verifica que el elemento exista
            element.addEventListener("click", openCalculatorPopup ());
            document.addEventListener('keydown', handleKeyPress); // Escuchar el teclado cuando se abre la calculadora

        }
    });



        
    const calculatorButtons = document.querySelectorAll(".calculadora__buttons-container");

    calculatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            if(value){
                currentValue = currentValue + value;
                calculatorDisplay.textContent = currentValue
            }

            if(button.id === 'clear-btn'){
                currentValue = '';
                calculatorDisplay.textContent = '0';
            }

            if(button.id === 'enter-btn'){
                elements.value = currentValue;
                document.removeEventListener('keydown',handleKeyPress)
            }
        })
    })

    function handleKeyPress(event){
        const key = event.key;
        
        if(!isNaN(key)){
            currentValue = currentValue + key;
            calculatorDisplay.textContent = currentValue
        }

        if(key === 'Enter') {
            elements.value = currentValue;
            calculatorPopup.closePopup();
        }

        if(key === 'Backspace' || key === "Delete"){
            currentValue = '';
            calculatorDisplay.textContent = '0';
        }

        if(key === 'Escape'){
            calculatorPopup.closePopup
        }


    }

    handleKeyPress();*/