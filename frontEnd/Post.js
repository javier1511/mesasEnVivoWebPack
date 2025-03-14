
class Post {
    constructor(url, formData) {
        this.url = url;
        this.formData = formData;
    }

    async sendPostRequest() {
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respuesta del servidor', data);
            alert("Cliente registrado");
            window.location.reload();
       
            return data; // Puedes devolver los datos si los necesitas para algo más
            
        } catch (error) {
            console.error('Hubo un problema con la solicitud fetch:', error.message);
            alert('Error: ' + error.message);
        }
    }
}

export default Post;