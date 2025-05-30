export class Auth {
    constructor(){
        this.isAuthenticated = this.checkAuth();
    }

    logout(){
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        window.location.href = "https://www.juegoenvivodiamantecasino.com/"
    }
    checkAuth(){
        return localStorage.getItem('token') !== null;
    }
    protectedRoute(){
        if(!this.isAuthenticated){
             window.location.href = "https://www.juegoenvivodiamantecasino.com/"
             alert("Inicia sesion")

        }
    }

}

export default Auth;