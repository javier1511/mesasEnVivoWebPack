
class Get {
    constructor(url, token) {
        this.url = url;
        this.token = token;
    }

    async get() {
        try {

            const token = localStorage.getItem("token");
            console.log(token);

            if(!this.token){
                throw new Error("Token no proporcionado")
            }
            const response = await fetch(this.url, {
                headers: {
                    "x-access-token": this.token, // Agregar token en el header
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud');
            }
            const data = await response.json();
            return data; // Asegurarse de devolver los datos aquí
        } catch (error) {
            console.error('Hubo un problema con la solicitud fetch:', error.message);
            alert('Error: ' + error.message);
            return []; // Devuelve un array vacío para evitar errores en el código que consume estos datos
        }
    }
}


export default Get;