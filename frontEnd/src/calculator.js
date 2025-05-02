import Popup from "./Popup.js";

class Calculator {
  constructor(calculatorDisplay, calculatorButtons, clearButton, enterButton, popup) {
    this.activeInput = null;
    this.calculatorDisplay = calculatorDisplay;
    this.calculatorButtons = calculatorButtons;
    this.currentValue = "";
    this.clearButton = clearButton;
    this.enterButton = enterButton;
    this.popup = popup;

    this.buttonsMethod();
    this.eventListeners();
  }

  // Método para formatear con comas de miles
  formatNumber(value) {
    // eliminar todo lo que no sea dígito
    const digits = value.toString().replace(/\D/g, "");
    // insertar comas cada 3 dígitos desde el final
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  }

  setActiveInput(input) {
    this.activeInput = input;
    this.currentValue = input.value.replace(/,/g, "") || "";  
    // mostrar con formato
    this.calculatorDisplay.textContent = this.formatNumber(this.currentValue);
  }

  buttonsMethod() {
    this.calculatorButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (!this.activeInput) return;

        const value = button.getAttribute('data-value');

        if (value) {
          this.currentValue += value;
          this.calculatorDisplay.textContent = this.formatNumber(this.currentValue);
        }

        if (button.id === 'clear-btn') {
          this.currentValue = '';
          this.calculatorDisplay.textContent = '0';
        }

        if (button.id === 'enter-btn') {
          // opcional: guardar sin comas
          this.activeInput.value = this.currentValue.replace(/,/g, "");
          this.popup.closePopup();
        }
      });
    });
  }

  handleKeyPress = (event) => {
    if (!this.activeInput) return;
    const key = event.key;

    if (!isNaN(key) && key !== ' ') {
      this.currentValue += key;
      this.calculatorDisplay.textContent = this.formatNumber(this.currentValue);
    }
    if (key === 'Enter') {
      event.preventDefault();
      this.activeInput.value = this.currentValue.replace(/,/g, "");
      this.popup.closePopup();
    }
    if (key === 'Backspace' || key === 'Delete') {
      // eliminar último dígito
      this.currentValue = this.currentValue.slice(0, -1);
      this.calculatorDisplay.textContent = this.formatNumber(this.currentValue);
    }
    if (key === 'Escape') {
      this.popup.closePopup();
    }
  }

  eventListeners() {
    document.addEventListener('keydown', this.handleKeyPress);

    document.querySelectorAll("#cash, #card, #usd, #cashIn, #payment")
      .forEach(input => {
        input.addEventListener('click', () => {
          this.setActiveInput(input);
          this.popup.openPopup();
        });
      });
  }
}

export default Calculator;
