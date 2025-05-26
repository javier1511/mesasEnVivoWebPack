import "../src/styles/index.css"

const login = async (event) => {
    event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    try {
        const response = await fetch('https://juegoenvivo1-701fa226890c.herokuapp.com/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            alert('Inicio de sesión exitoso');
             window.location.href = 'sales.html';
        } else {
            const errorData = await response.json(); // Extraer datos del error del servidor
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert(error);
    }
};

const loginForm = document.querySelector(".login__form");

// Pasa la referencia de la función sin ejecutarla inmediatamente
loginForm.addEventListener("submit", login);





/*const login = function (event) {
    // Evitar que el formulario recargue la página
    event.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    fetch('https://juegoenvivodiamantetampico-5f11edf34527.herokuapp.com
/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            console.log('Token recibido:', data.token);

            localStorage.setItem('token', data.token);
            window.location.href = 'http://127.0.0.1:5500/frontEnd/sales.html';
        } else {
            alert('Inicio de sesión fallido');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error en el servidor o conexión fallida');
    });
};

const loginForm = document.querySelector(".login__form");

// Pasa la referencia de la función sin ejecutarla inmediatamente
loginForm.addEventListener("submit", login);*/
