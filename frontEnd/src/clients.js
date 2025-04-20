import "../src/styles/index.css"
let id = null; // Variable global para almacenar playerId
const token = localStorage.getItem("token");
console.log(token)
import Auth from "./auth.js";
const auth = new Auth()
auth.protectedRoute();




const logout = document.querySelector("#logout");

logout.addEventListener("click", () => auth.logout())


import Get from "./Get.js";
import Popup from "./Popup.js";
import Put from "./Put.js";
import DeleteById from "./DeleteById.js";

const getPlayers = async () => {
    const getRequest = new Get('http://localhost:4000/players', token);
    const data = await getRequest.get();
    console.log(data)
    return data; // Asegúrate de devolver los datos
};

getPlayers();


const form = document.querySelector(".clients__popup");
const popupCloseButton = document.querySelector(".clients__popup-close");
const nameEditElement = document.querySelector('#nameEdit');
const mobileEditElement = document.querySelector("#mobileEdit");
const emailEditElement = document.querySelector("#emailEdit");
const errorsContainer = document.querySelector(".register__errorMessages");
const inputQuery = document.querySelector(".clients__main-search");
const inputQueryEmail = document.querySelector("#queryEmail");
const inputQueryName = document.querySelector("#queryNombre");
const display = document.querySelector(".clientes__data-container");

const popupClient = new Popup(form);

const displayUsers = async () => {
    let queryMobile = inputQuery.value.trim().toLowerCase();
    let queryEmail = inputQueryEmail.value.trim().toLowerCase();
    let queryName = inputQueryName.value.trim().toLowerCase();
    
    const payload = await getPlayers();

    let dataDisplay = payload
        .filter((evenData) => {
            const matchesMobile = queryMobile === '' || evenData.mobile?.toLowerCase().includes(queryMobile);
            const matchesEmail = queryEmail === '' || evenData.email?.toLowerCase().includes(queryEmail);
            const matchesName = queryName === ''  || evenData.name?.toLowerCase().includes(queryName);
            return matchesMobile && matchesEmail && matchesName;
        })
        .map((object) => {
            const { _id, date, time, name, mobile, email, address, curp, gender } = object;
            let formattedDate = "";
            if (date) {
                const [year, month, day] = date.split('T')[0].split('-');
                formattedDate = `${day}/${month}/${year}`;
            }
        
    
    

            return `
     
                        <p class="clients__value clients__value-name" data-id="${_id}" data-email="${email}" data-mobile="${mobile}">${name}</p>
                
              
                        <p class="clients__value">${email}</p>
             
              
                        <p class="clients__value">${mobile}</p>
              
      
                        <p class="clients__value">${time}</p>
               
                  
                        <p class="clients__value">${curp}</p>
            
         
                        <p class="clients__value">${formattedDate}</p>
            
                    
                        <p class="clients__value">${address}</p>
                
               
                        <p class="clients__value">${gender}</p>
             
           
            `;
        })
        .join('');

    display.innerHTML = dataDisplay || '<p>No se encontraron jugadores.</p>';

    const registerValueNames = document.querySelectorAll(".clients__value-name");

    registerValueNames.forEach((element) => {
        element.addEventListener("click", () => {
            let playerName = element.textContent;
            let playerId = element.getAttribute("data-id");
            id = playerId
            let clientEmail = element.getAttribute("data-email");
            let clientMobile = element.getAttribute("data-mobile");

            nameEditElement.value = playerName;
            mobileEditElement.value = clientMobile;
          
            emailEditElement.value = clientEmail;
 
            popupClient.openPopup();
        });
    });
};

// Llamar a la función al inicio
displayUsers();

// Agregar eventos para buscar dinámicamente por número y email
inputQuery.addEventListener('input', displayUsers);
inputQueryEmail.addEventListener('input', displayUsers);
inputQueryName.addEventListener('input', displayUsers);
// Asegurar que `popupCloseButton` existe antes de asignar evento
if (popupCloseButton) {
    popupCloseButton.addEventListener("click", () => popupClient.closePopup());
}





// Añadir el event listener para cerrar el popup fuera del bucle


// Función para validar el formulario
const validateForm = () => {
    let errors = [];

    if (nameEditElement.value.length < 3 || nameEditElement.value.length > 30) {
        errors.push('El nombre no puede ser menor de 3 ni mayor a 30 caracteres');
    }

    if(!nameEditElement.value){
        errors.push('El nombre no puede ir vacio')
    }

    if (mobileEditElement.value.length !== 10) {
        errors.push('El número debe tener exactamente 10 dígitos');
    }
    return errors;
}

// Manejo del envío del formulario
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorsContainer.innerHTML = '';

    const errors = validateForm();
    if (errors.length > 0) {
        errors.forEach(error => {
            const errorElement = document.createElement("p");
            errorElement.textContent = error;
            errorsContainer.appendChild(errorElement);
        });
        return;
    }

    if (!id) {
        alert('No se ha seleccionado ningún jugador para editar.');
        return;}

    const formClientData = {
        name: nameEditElement.value.toUpperCase(),
        mobile: mobileEditElement.value,
        email: emailEditElement.value.toUpperCase()
    };
    const formId = id;

    const putClientRequest = new Put(`https://juegoenvivo1-701fa226890c.herokuapp.com/players/${formId}`, formClientData);
    await putClientRequest.sendPutRequest();
    popupClient.closePopup();
});

// Manejo del botón de eliminar cliente
/*const deleteButton = document.querySelector("#deleteButton");
deleteButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const idDelete = id;  // Asegúrate de que playerId tiene un valor válido
    if (!idDelete) {
        alert('No se ha seleccionado ningún cliente para eliminar');
        return;
    }

    const token = localStorage.getItem("token")
    const deleteClientByIdRequest = new DeleteById(`https://juegoenvivo1-701fa226890c.herokuapp.com
/players/${idDelete}`, token );
    const result = await deleteClientByIdRequest.sendDeleteByIdRequest();

    // Si la solicitud fue exitosa, cerrar el popup
    if (result) {
        popupClient.closePopup();
    }
});*/




/*// Función reutilizable para crear elementos
const createClientElement = (container, className, content) => {
    const element = document.createElement('p');
    element.classList.add(className);
    element.textContent = content;
    container.appendChild(element);
    return element; // Asegúrate de retornar el elemento creado
}

const renderData = (clients) => {



    // Filtro de clientes basado en el valor del input de búsqueda
    clients.forEach(client => {
        // Crear elementos reutilizando la función
        const nameElement = createClientElement(nameContainer, "clients__value-name", client.name);
        createClientElement(timeContainer, "clients__value", client.time);
        createClientElement(curpContainer, "clients__value", client.curp);
        createClientElement(dateContainer, "clients__value", client.date);
        createClientElement(mobileContainer, "clients__value", client.mobile);
        createClientElement(addressContainer, "clients__value", client.address);
        createClientElement(genderContainer, "clients__value", client.gender);
        createClientElement(emailContainer, "clients__value", client.email);

        const popup = () => {
            popupClient.openPopup();
            nameEditElement.value = client.name;
            emailEditElement.value = client.email;
            mobileEditElement.value = client.mobile;

            // Asignar el playerId globalmente
            playerId = client._id;
            console.log(playerId); // Ahora el playerId global se actualiza al hacer clic
        }

        // Añadir el event listener al elemento que representa el nombre
        nameElement.addEventListener("click", popup);
    });
}*/
