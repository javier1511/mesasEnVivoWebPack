




class Print {
    constructor(date, time, name, mobile, fondo, efectivo, tarjeta, dolares, pago, container) {
        this.date = date;
        this.time = time;
        this.name = name;
        this.mobile = mobile;
        this.fondo = fondo;
        this.efectivo = efectivo;
        this.tarjeta = tarjeta;
        this.dolares = dolares;
        this.pago = pago;
        this.container = container;
    }

    openTicketAndPrint() {

        const prinWindow = window.open();
        prinWindow.document.write(`
            <html>
                <head>
                    <link rel="stylesheet" href="./styles.css">
                </head>
                <body>
                    <div class="ticket">
                        <div class="ticket__header-container">
                            <img src="./images/logo.png" alt="" class="ticket__header">
                        </div>
                        <div class="ticket__body-container">
                            <div class="ticket__title-container">
                                <p class="ticket__title">Fecha:</p>
                                <p class="ticket__title">Hora:</p>
                                <p class="ticket__title">Nombre:</p>
                                <p class="ticket__title">Celular:</p>
                                <p class="ticket__title">Fondo:</p>
                                <p class="ticket__title">Efectivo:</p>
                                <p class="ticket__title">Tarjeta:</p>
                                <p class="ticket__title">Dólares:</p>
                                <p class="ticket__title">Pago:</p>
                            </div>
                            <div class="ticket__value-container"></div>
                        </div>
    
                        <div class="ticket__text-container">
                            <p class="ticket__text">
                                DIAMANTE CASINO OPERADORA COMERCIALIZADORA Y ARRENDADORA DE MÉXICO S.A. DE C.V.
                                PERSONA MORAL DE RÉGIMEN GENERAL DE LEY AVENIDA HIDALGO 6806 COLONIA ARENAL
                                TAMPICO TAMAULIPAS C.P. 89344 RFC CAM970528IYA EXPEDIDO EN DIAMANTE CASINO
                                AVENIDA HIDALGO 6806 COLONIA ARENAL TAMPICO TAMAULIPAS C.P. 89344 PER.SEGOB
                                DGJS/DGAAD/DCRCA/P-01/2017
                            </p>
                        </div>
    
                        <div class="ticket__footer-container">
                            <img src="./images/DIAMANTE.png" alt="" class="ticket__footer">
                        </div>
                    </div>
                </body>
            </html>
        `);
    
        prinWindow.document.close();  // Finaliza la escritura del documento
    
        // 🔥 CORRECCIÓN: Selecciona el contenedor dentro de la nueva ventana emergente
        const popupContainer = prinWindow.document.querySelector('.ticket__value-container');
    
        const values = [
            this.date, this.time, this.name, this.mobile,
            this.fondo, this.efectivo, this.tarjeta, this.dolares, this.pago
        ];
    
        values.forEach(value => {
            const element = document.createElement("p");
            element.classList.add("ticket__value");
            element.textContent = value;
            popupContainer.appendChild(element);
        });
    }
}

export default Print;
