class Popup {
    constructor(selector) {
        this.selector = selector;
        this.overlay = document.createElement("div");
        this.overlay.classList.add("overlay");
        document.body.appendChild(this.overlay); // Agrega el overlay al DOM
    }

    openPopup() {
        this.overlay.classList.add("active"); // Activa el overlay
        this.selector.classList.add("popup__opened");
    }

    closePopup() {
        this.selector.classList.remove("popup__opened");
        this.overlay.classList.remove("active"); // Oculta el overlay
    }
}

export default Popup;
