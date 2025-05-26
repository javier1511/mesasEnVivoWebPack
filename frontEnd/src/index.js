import "../src/styles/index.css"
import Post from "./Post.js";
import Auth from "./auth.js";
const auth = new Auth()
auth.protectedRoute();



//REGISTERPAGE//
const form = document.querySelector(".register__form");
const errorMessages = document.querySelector(".register__errorMessages");


class SetTime {
    constructor(dateInput, timeInput) {
        this.dateInput = dateInput;
        this.timeInput = timeInput;
    }

    createTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        const currentTime = `${hours}:${minutes}:${seconds}`;

        this.timeInput.value = currentTime; // ✅ Ahora asigna correctamente el valor al input
    }

    createDate() {
        const now = new Date();
        let day = now.getDate();
        let month = now.getMonth() + 1; // getMonth() devuelve de 0 a 11, así que sumamos 1
        const year = now.getFullYear();

        // Formatear correctamente para el input date en "YYYY-MM-DD"
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        const formattedDate = `${year}-${month}-${day}`; // ✅ Formato correcto para input date


        this.dateInput.value = formattedDate; // ✅ Ahora asigna correctamente el valor al input
    }
}

window.onload = function () {
    const dateInput = document.querySelector("#date");
    const timeInput = document.querySelector("#time");
    console.log(dateInput.value);

    const newDate = new SetTime(dateInput, timeInput);

    newDate.createTime();
    newDate.createDate();
};



const validateForm = function () {
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const mobile = document.querySelector('#mobile').value;

    let errors = [];




    // Validación del nombre
    if (name.length < 3 || name.length > 30) {
        errors.push('El nombre debe tener entre 3 y 30 caracteres');
    }

    // Validación del email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errors.push('El email no es válido');
    }

    // Validación del número de teléfono móvil
 if (mobile.length !== 10 || mobile === "1234567890"){
    errors.push('El telefono debe ser de 10 digitos o no debe ser 1234567890')   
 }

    const phonePattern = /^\d+$/;
    if (!phonePattern.test(mobile)) {
        errors.push('El teléfono celular solo debe contener números');
    }

    // Devuelve los errores
    return errors;
}






form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    errorMessages.innerHTML = '';

    const errors = validateForm();
    if (errors.length > 0) {
        errors.forEach(error => {
            const errorItem = document.createElement('div');
            errorItem.textContent = error;
            errorMessages.appendChild(errorItem);
        });
        return;
    }



    const formData = {
        name: document.querySelector("#name").value.toUpperCase(),
        address: document.querySelector("#address").value.toUpperCase(),
        curp: document.querySelector("#curp").value.toUpperCase(),
        email: document.querySelector("#email").value.toUpperCase(),
        mobile: document.querySelector('#mobile').value,
        gender: document.querySelector('#gender').value,
        time: document.querySelector('#time').value,
        date: document.querySelector('#date').value,
        areamobile: document.querySelector('#areamobile').value
    };

    console.log("Fecha antes de enviar:", formData.date); // 👈 Aquí

    
    // Crear una instancia de la clase y hacer la solicitud
    const postRequest = new Post('https://juegoenvivo1-701fa226890c.herokuapp.com/players', formData);
    await postRequest.sendPostRequest();
    
});




