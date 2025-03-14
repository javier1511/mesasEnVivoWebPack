    class DeleteById {
        constructor(url, token) {
            this.url = url;
            this.token = token;
        }

        async sendDeleteByIdRequest() {
            try {

                const token = localStorage.getItem("token"); // ✅ Asegurar que el token se obtiene
                console.log(token)

                if (!this.token) {
                    throw new Error("Token no proporcionado");
                }
                // Enviamos la solicitud DELETE
                const response = await fetch(this.url, {
                    method: 'DELETE',
                    headers: {
                        "x-access-token": this.token, // Agregar token en el header
                        'Content-Type': 'application/json'
                    }
                });

                // Verificamos si la respuesta es exitosa
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error en la solicitud');x
                }

                alert("Transacción eliminada con éxito");

                // Recargamos la página
                window.location.reload();

                // Retornamos los datos obtenidos
         

            } catch (error) {
                console.error('Hubo un problema con la solicitud fetch', error.message);
                alert('Error: ' + error.message);
            }
        }
    }


    export default DeleteById