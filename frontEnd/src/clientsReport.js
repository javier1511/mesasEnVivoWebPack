import "../src/styles/index.css"
let clientsCountId = null;
const token = localStorage.getItem("token");
console.log(token)
import Auth from "./auth.js";
const auth = new Auth()
auth.protectedRoute();


const logout = document.querySelector("#logout");

logout.addEventListener("click", () => auth.logout())


import Get from "./Get.js";

const getCountByDate = async () => {
    const getCountRequest = new Get("https://juegoenvivo1-701fa226890c.herokuapp.com/countplayers", token);
    const data = await getCountRequest.get();
    console.log(data);
    return data;
};

getCountByDate();

const inputCountReport = document.querySelector(".clientsReport__input");
const clientsCountContainer = document.querySelector(".clientsReport__data");

const displayCountPlayersByDate = async () => {
    let queryCount = inputCountReport.value; // Formato YYYY-MM-DD
    const payloadCount = await getCountByDate();

    let dataDisplayCount = payloadCount
        .filter((eventDataCount) => {
            if (queryCount === '') return true;

            // Convierte la fecha del objeto al formato YYYY-MM-DD
            let [day, month, year] = eventDataCount.date.split('/');
            let formattedDate = `${year}-${month}-${day}`;

            return formattedDate === queryCount;
        })
        .map((object) => {
            const { date, totalClientes } = object;

            return `    
            <div class="clientsReport__container">
                <p class="clientsReport__data">${date}</p>
                <p class="clientsReport__data">${totalClientes}</p>
            </div>
            `;
        })
        .join('');

    clientsCountContainer.innerHTML = dataDisplayCount || "<p>No se encontraron jugadores.</p>";
};

// Ejecutar al cambiar el input
inputCountReport.addEventListener("input", displayCountPlayersByDate);

// Ejecutar al cargar
displayCountPlayersByDate();
