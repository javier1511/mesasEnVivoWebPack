import "../src/styles/index.css"
import Get from "./Get.js";
const token = localStorage.getItem("token");
console.log(token)


const getPlayersKpis = async () => {
    const getPlayersKpisRequest = new Get("http://localhost:4000/sales/summary", token);
    const data = await getPlayersKpisRequest.get();
    console.log(data);
    return data;
}




getPlayersKpis();

const inputKpisMobile = document.querySelector("#inputKpisMobile");
const inputKpisName = document.querySelector("#inputKpisName");
const kpisDataContainer = document.querySelector(".kpis__data-container");

const displayKpisPlayers = async () => {
    let queryMobile = inputKpisMobile.value.trim().toLowerCase();
    let queryName = inputKpisName.value.trim().toLowerCase();
    const payloadKpis = await getPlayersKpis();

    let dataDisplayKpis = payloadKpis
        .filter((eventDataKpis) => {
            const matchesMobile = queryMobile === '' || eventDataKpis.player.mobile?.toLowerCase().includes(queryMobile);
            const matchesName = queryName === '' || eventDataKpis.player.name?.toLowerCase().includes(queryName);
            return matchesMobile && matchesName;
        })
        .map((object) => {
            const { player, totalCash, totalCredit, totalDollars, totalPayment, netwin } = object;

            return ` 
            <p class="kpis__data">${player.name}</p>
            <p class="kpis__data">${player.mobile}</p>
            <p class="kpis__data">${totalCash}</p>
              <p class="kpis__data">${totalCredit}</p>
            <p class="kpis__data">${totalDollars}</p>
            <p class="kpis__data">${totalPayment}</p>
            <p class="kpis__data">${netwin}</p>
            `;
        })
        .join('');

    kpisDataContainer.innerHTML = dataDisplayKpis || "<p>No se encontraron transacciones.</p>";
}

displayKpisPlayers();

// Actualización dinámica
inputKpisMobile.addEventListener("input", displayKpisPlayers);
inputKpisName.addEventListener("input", displayKpisPlayers);