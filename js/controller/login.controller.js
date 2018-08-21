app.controller('loginController', loginController)

/** @ngInject */
loginController.$inject = ['loginService', '$location'];

function loginController(loginService, $location) {
    var loginCtrl = this;

    //Variables
    loginCtrl.loged = loginService.loged;
    loginCtrl.user = null;
    loginCtrl.password = null;
    loginCtrl.mensaje = null;
    loginCtrl.loading = false;
    loginCtrl.account = loginService.account;
    var cont = 0;
    getAccount();

    loginCtrl.logout = function () {
        sessionStorage.removeItem("user");
        $location.path("/Login");
        loginService.loged = false;
        loginCtrl.loged = loginService.loged;
    }

    loginCtrl.showPass = function () {
        if (cont === 0) {
            $("#contrasena").attr("type", "text");
            cont = 1;
        } else {
            $("#contrasena").attr("type", "password");
            cont = 0;
        }
    }

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

    function setAccount(data) {
        $location.path("/Inicio");
        sessionStorage.setItem("user", JSON.stringify(data));
        getAccount();
    }

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