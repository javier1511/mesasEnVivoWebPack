import Popup from "./Popup.js";

class Calculator {
    constructor(calculatorDisplay, calculatorButtons, clearButton, enterButton, popup) {
        this.activeInput = null;  // Guardará el input actualmente activo
        this.calculatorDisplay = calculatorDisplay;
        this.calculatorButtons = calculatorButtons;
        this.currentValue = "";
        this.clearButton = clearButton;
        this.enterButton = enterButton;
        this.popup = popup; // Guardamos la referencia del popup
        
        this.buttonsMethod();
        this.eventListeners();
    }

    setActiveInput(input) {
        this.activeInput = input;
        this.currentValue = input.value || ""; // Iniciar con el valor actual del input
        this.calculatorDisplay.textContent = this.currentValue || "0";
    }

    buttonsMethod() {
        this.calculatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!this.activeInput) return; // No hacer nada si no hay input activo

                const value = button.getAttribute('data-value');

                if (value) {
                    this.currentValue += value;
                    this.calculatorDisplay.textContent = this.currentValue;
                }

                if (button.id === 'clear-btn') {
                    this.currentValue = '';
                    this.calculatorDisplay.textContent = '0';
                }

                if (button.id === 'enter-btn') {
                    this.activeInput.value = this.currentValue;
                    this.popup.closePopup();
                }
            });
        });
    }

    handleKeyPress = (event) => {
        if (!this.activeInput) return; // Evitar acciones si no hay input activo
        
        const key = event.key;

        if (!isNaN(key)) {
            this.currentValue += key;
            this.calculatorDisplay.textContent = this.currentValue;
        }
        if (key === 'Enter') {
            event.preventDefault();
            this.activeInput.value = this.currentValue;
            this.popup.closePopup();
        }
        if (key === 'Backspace' || key === 'Delete') {
            this.currentValue = '';
            this.calculatorDisplay.textContent = '0';
        }
        if (key === 'Escape') {
            this.popup.closePopup();
        }
    }

    eventListeners() {
        document.addEventListener('keydown', this.handleKeyPress);

        // Agregar event listener a los inputs para que la calculadora sepa cuál está activo
        document.querySelectorAll("#cash, #card, #usd, #cashIn, #payment").forEach(input => {
            input.addEventListener('click', () => {
                this.setActiveInput(input);
                this.popup.openPopup();
            });
        });
    }
}

export default Calculator;
