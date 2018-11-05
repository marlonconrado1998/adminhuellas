//Controlador de login
app.controller('loginController', loginController)

/** @ngInject */
loginController.$inject = ['loginService', '$location'];

function loginController(loginService, $location) {
    var loginCtrl = this;

    //Variables
    loginCtrl.loged = loginService.loged; //Define si hay un logeo o no
    loginCtrl.user = null; //informacion del usuario logeado
    loginCtrl.password = null;//Contraseña de usuario
    loginCtrl.mensaje = null; //Mensaje durante logeo
    loginCtrl.loading = false; //muestra loader mientras carga
    loginCtrl.account = loginService.account; //informacion de la cuenta
    var cont = 0;
    getAccount();

    //Cierra sesion
    loginCtrl.logout = function () {
        sessionStorage.removeItem("user");
        $location.path("/Login");
        loginService.loged = false;
        loginCtrl.loged = loginService.loged;
    }

    //Muestra contraseña
    loginCtrl.showPass = function () {
        if (cont === 0) {
            $("#contrasena").attr("type", "text");
            cont = 1;
        } else {
            $("#contrasena").attr("type", "password");
            cont = 0;
        }
    }

    //Iniciar sesion
    loginCtrl.login = function () {
        loginCtrl.mensaje = null;
        loginCtrl.loading = true;
        loginService.login({ user: loginCtrl.user, password: loginCtrl.password })
            .then(function (response) {
                loginCtrl.loading = false;
                if (response.data == null) {
                    throw new Error();
                } else {
                    setAccount(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
                loginCtrl.mensaje = "Usuario o contraseña invalido."
            });
    }

    //Recupera datos de la cuenta, se verifican y se guadan en storage
    function setAccount(data) {        
        $location.path("/Dashboard/Inicio");
        sessionStorage.setItem("user", JSON.stringify(data));
        getAccount();
    }

    //Obtiene la informacion de la cuenta desde el storage
    function getAccount() {
        if (sessionStorage.getItem("user") == null || sessionStorage.getItem("user") == undefined) {
            loginService.loged = false;
        } else {
            loginService.account = JSON.parse(sessionStorage.getItem("user"));
            loginService.loged = true;
        }
        loginCtrl.account = loginService.account;
        loginCtrl.loged = loginService.loged;
    }
}