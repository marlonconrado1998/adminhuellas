app.service('legalizacionService', legalizacionService)

/** @ngInject */
legalizacionService.$inject = ["generalService"];

function legalizacionService(generalService) {

    var service = this;

    //VARIABLES
    service.listaLegalizaciones = [];

    //FUNCTIONS
    service.obtenerListaLegalizaciones = getList;

    function getList() {
        return generalService.EJECUTAR_SERVICES("GET", "api_legalizaciones.php/obtenerListalegalizaciones");
    }
}
