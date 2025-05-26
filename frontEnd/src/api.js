
//SALES//
const API_URL = "https://juegoenvivo1-701fa226890c.herokuapp.com/players";

const getPlayers = async () => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        return data; // Retorna los datos para un uso posterior si es necesario

    } catch (error) {
        console.error(`Problema con la solicitud fetch: ${error.message}`, error);
        throw error;
    }
};

export default getPlayers;
//SALES//

//SALES TRANSACTIONS//

