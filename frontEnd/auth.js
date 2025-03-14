export class Auth {
    constructor(){
        this.isAuthenticated = this.checkAuth();
    }

    logout(){
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        window.location.href = "http://127.0.0.1:5501/frontEnd/login.html"
    }
    checkAuth(){
        return localStorage.getItem('token') !== null;
    }
    protectedRoute(){
        if(!this.isAuthenticated){
             window.location.href = "http://127.0.0.1:5501/frontEnd/login.html"
             alert("Inicia sesion")

        }
    }

}

export default Auth;