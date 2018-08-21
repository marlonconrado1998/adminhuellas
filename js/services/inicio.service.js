app.service('inicioService', inicioService)

/** @ngInject */
inicioService.$inject = ["generalService"];

function inicioService(generalService) {

    var inicioService = this;

    inicioService.buscarInfoGeneral = buscarInfoGeneral;

    function buscarInfoGeneral() {
        return generalService.EJECUTAR_SERVICES("GET", "api_gestionAnimal.php/infoGeneral");
    }
}
