import "../src/styles/index.css"

let pokerSalesId = null;

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


const pokerGetTransactions = async () => {
    const getPokerRequest = new Get('https://juegoenvivo1-701fa226890c.herokuapp.com/poker', token)
    const pokerData = await getPokerRequest.get();
    console.log(pokerData)
    return pokerData
}

pokerGetTransactions();


const inputPokerTransactionsQueryDate = document.querySelector("#pokerQueryDate");
const inputPokerTransactionsQueryName = document.querySelector("#pokerQueryName")
const pokerDataContainer = document.querySelector(".pokerTransactions__api-container");
const idInPopup = document.querySelector("#pokerIdEditTransaction")
const nameInPopup = document.querySelector("#pokerNameEditTransaction")
const cashInPopup = document.querySelector("#pokerCashEditTransaction")
const creditInPopup = document.querySelector("#pokerCreditEditTransaction")
const dollarsInPopup = document.querySelector("#pokerDollarsEditTransaction")
const rakeInPopup = document.querySelector("#pokerRakeEditTransaction")
const paymentInPopup = document.querySelector("#pokerPaymentEditTransaction")
const pokerTransactionsForm = document.querySelector(".pokerTransactions__form")
const pokerErrorTransactionContainer = document.querySelector(".pokerTransactions__form-errorMessages")



const formatearMonedaPoker = (cantidad) => {
    if(isNaN(cantidad)) return "$0.00";
    return Number(cantidad).toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    })
}



const pokerDisplayTransactions = async () => {

    let queryPokerDate = inputPokerTransactionsQueryDate.value.trim().toLowerCase();
    let queryPokerName = inputPokerTransactionsQueryName.value.trim().toLowerCase();

    const pokerPayloadTransactions = await pokerGetTransactions();

    let pokerDataDisplayTransactions = pokerPayloadTransactions
    .filter((pokerEventDataTransacctions) => {

        const matchesName = queryPokerName === '' || pokerEventDataTransacctions.name?.toLowerCase().includes(queryPokerName);
        const matchesDate = queryPokerDate === '' || pokerEventDataTransacctions.date?.toLowerCase().includes(queryPokerDate);
        return matchesName && matchesDate

    })
    .map((object) => {
        const{_id, player, cash, name, credit, dollars, rake, payment, date, time} = object;

        let pokerFormattedDate = "";
        if(date){
            const [year, month, day] = date.split('T')[0].split('-');
            pokerFormattedDate = `${day}/${month}/${year}`
        }


        return `
        
        <p class="transactions__data-value">${_id}</p>
      

    <p class="pokerTransactions__data-value pokerTransactions__data-name"
    data-id="${_id}" 
    data-dollar="${dollars}" 
    data-credit="${credit}" 
    data-name="${name}" 
    data-cash="${cash}"
    data-payment="${payment}"
    data-rake="${rake}">
    ${name}
</p>

        
    

        <p class="pokerTransactions__data-value">${pokerFormattedDate}</p>
   

  
        <p class="pokerTransactions__data-value">${time}</p>
        
        <p class="pokerTransactions__data-value">${formatearMonedaPoker(cash)}</p>
            <p class="pokerTransactions__data-value">${formatearMonedaPoker(credit)}</p>
            <p class="pokerTransactions__data-value">${formatearMonedaPoker(dollars)}</p>
            <p class="pokerTransactions__data-value">${formatearMonedaPoker(payment)}</p>
<p class="pokerTransactions__data-value">${formatearMonedaPoker(rake)}</p>







        
        `;
    })
    .join('')



pokerDataContainer.innerHTML = pokerDataDisplayTransactions;
    pokerAddClickEvents(); // Agregar eventos a los elementos recién creados

}

pokerDisplayTransactions();
inputPokerTransactionsQueryDate.addEventListener("input", pokerDisplayTransactions);
inputPokerTransactionsQueryName.addEventListener("input", pokerDisplayTransactions);


const pokerPopupContainer = document.querySelector(".pokerTransactions__popup");
const popupPokerTransactions = new Popup(pokerPopupContainer);


const pokerAddClickEvents = () => {

    const dataSetValue = document.querySelectorAll(".pokerTransactions__data-name")

    dataSetValue.forEach(valueElement => {
        valueElement.addEventListener("click", (event) => {

            const pokerTarget = event.target;
            pokerSalesId = pokerTarget.dataset.id;
            const dataSetCash = pokerTarget.dataset.cash;
            const dataSetCredit = pokerTarget.dataset.credit;
            const dataSetDollar = pokerTarget.dataset.dollar;
            const dataSetName = pokerTarget.dataset.name;
            const dataSetRake = pokerTarget.dataset.rake;
            const dataSetPayment = pokerTarget.dataset.payment;

            popupPokerTransactions.openPopup()

            idInPopup.value =pokerSalesId
nameInPopup.value = dataSetName;
cashInPopup.value = dataSetCash;
creditInPopup.value = dataSetCredit;
dollarsInPopup.value = dataSetDollar; 
rakeInPopup.value = dataSetRake;
paymentInPopup.value = dataSetPayment;
        })
    })
     
}



const pokerPopupClose = document.querySelector(".pokerTransactions__popup-close")
pokerPopupClose.addEventListener("click", () => popupPokerTransactions.closePopup())



const validatePopupDeleteForm = () => {
   
    let popupErrors = [];

    if (idInPopup.value === "" || nameInPopup.value === "" || cashInPopup.value === "" || creditInPopup.value === "" || dollarsInPopup.value === "" || rakeInPopup.value === "" || paymentInPopup.value === "" ){
        popupErrors.push("Estos valores no pueden ir vacios")
    }
    
    return popupErrors


}




pokerTransactionsForm.addEventListener("submit", async(event) => {
    event.preventDefault();


    const errors = validatePopupDeleteForm();
    if(errors.length > 0 ){
        errors.forEach(error => {
            const errorTransactionPokerElement = document.createElement("div");
            errorTransactionPokerElement.textContent = error;
            pokerErrorTransactionContainer.appendChild(errorTransactionPokerElement)
        })
        return
    }


    if(!pokerSalesId){
          alert('No se ha seleccionado ninguna transaccion para eliminar');
        return;
    }

    const token = localStorage.getItem("token");

    if(!token){
        alert("No tienes permiso para eliminar esta transacción. Inicia sesión nuevamente.");
        return;
    }

    const deleteSalesByIdRequest = new DeleteById(`https://juegoenvivo1-701fa226890c.herokuapp.com/poker/${pokerSalesId}`, token);
const resultDelete = await deleteSalesByIdRequest.sendDeleteByIdRequest();

if(resultDelete){
    popupSales.closePopup()
}

})