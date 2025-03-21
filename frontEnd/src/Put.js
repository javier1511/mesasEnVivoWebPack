class Put {
    constructor(url, formData){
        this.url = url;
        this.formData = formData
    }

    async sendPutRequest(){
        try{
            const response = await fetch(this.url,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(this.formData)
            });
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud');
            }

            const data = await response.json();
            console.log('Respues del servidor', data)
            window.location.reload();
            return data
            

        }catch(error){
            console.error('Hubo un prolema con la solicitud fetch', error.message);
            alert('Error' + error.message)
 

        }


    }
    
}

export default Put;