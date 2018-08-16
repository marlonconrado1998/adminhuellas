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

    function login(data) {
        return generalService.EJECUTAR_SERVICES("POST", "api_login.php/login", { "data": data });    
    }
}
