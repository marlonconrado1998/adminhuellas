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
        sessionStorage.setItem("user", null);
        getAccount();
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
                setAccount(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function setAccount(data) {
        if (data == null) {
            loginCtrl.mensaje = "Usuario o contraseña invalido."
        } else {
            $location.path("/Inicio");            
        }
        loginCtrl.loading = false;
        sessionStorage.setItem("user", JSON.stringify(data));
        getAccount();
    }

    function getAccount() {
        loginService.account = JSON.parse(sessionStorage.getItem("user"));
        if (loginService.account == null || loginService.account == undefined) {
            // $location.path("/Login");
            loginService.loged = false;
        } else {
            // $location.path("/Inicio");
            loginService.loged = true;
        }
        loginCtrl.account = loginService.account;
        loginCtrl.loged = loginService.loged;
    }
}