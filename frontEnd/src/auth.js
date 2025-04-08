export class Auth {
    constructor(){
        this.isAuthenticated = this.checkAuth();
    }

    logout(){
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        window.location.href = "http://localhost:8080/"
    }
    checkAuth(){
        return localStorage.getItem('token') !== null;
    }
    protectedRoute(){
        if(!this.isAuthenticated){
             window.location.href = "http://localhost:8080/"
             alert("Inicia sesion")

        }
    }

}

export default Auth;