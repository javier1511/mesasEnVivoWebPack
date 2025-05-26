import "../src/styles/index.css"

let salesId = null;

import Get from "./Get.js";
import DeleteById from "./DeleteById.js";
import Popup from "./Popup.js";
import Auth from "./auth.js";
const token = localStorage.getItem("token");
console.log(token)
const auth = new Auth()
auth.protectedRoute();


const logout = document.querySelector("#logout");

logout.addEventListener("click", () => auth.logout())




const getTransactions = async () => {
    const getSalesrequest = new Get('https://juegoenvivo1-701fa226890c.herokuapp.com/sales', token);
    const data = await getSalesrequest.get()
    console.log(data)
    return data

};

getTransactions()


const inputTransactionsQuery = document.querySelector("#queryDate")
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
const errorTransactionContainer = document.querySelector(".transactions__form-errorMessages")

const formatearMoneda = (cantidad) => {
    if (isNaN(cantidad)) return "$0.00";
    return Number(cantidad).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
};


const displayTransactions = async () => {
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

displayTransactions();
inputTransactionsQuery.addEventListener('input', displayTransactions);
inputName.addEventListener('input', displayTransactions);

const salesPopupContainer = document.querySelector(".transactions__popup");
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
};


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

const popupClose = document.querySelector(".transactions__popup-close")

popupClose.addEventListener("click", () => popupSales.closePopup())



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

const deleteSalesByIdRequest = new DeleteById(`https://juegoenvivo1-701fa226890c.herokuapp.com/sales/${salesId}`, token);
const resultDelete = await deleteSalesByIdRequest.sendDeleteByIdRequest();

if(resultDelete){
    popupSales.closePopup()
}


})