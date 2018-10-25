//Servicio de controlador del login
app.service('loginService', loginService)

/** @ngInject */
loginService.$inject = ["generalService"];

function loginService(generalService) {

    var loginService = this;

    //VARIABLES
    loginService.loged = false;
    loginService.account = {};

    //FUNCTIONS
    loginService.login = login;
    loginService.getInfoUser = getInfoUser;

    //Logear
    function login(data) {
        return generalService.EJECUTAR_SERVICES("POST", "api_login.php/login", { "data": data });
    }

    //Obtiene la infomacion de un usuario
    function getInfoUser() {
        let us = sessionStorage.getItem("user");
        if (us) {
            return JSON.parse(us);
        } else {
            return {nombre: "", apellido: ""};
        }
    }
}
