app.service('solicitudService', solicitudService)

/** @ngInject */
solicitudService.$inject = ["generalService"];

function solicitudService(generalService) {

    var service = this;

    //VARIABLES
    service.listaSolicitudes = [];

    //FUNCTIONS
    service.obtenerListaSolicitudes = getList;
    service.obtenerInformacionAnimal = getAnimalInfo;
    service.obtenerGaleriaAnimal = getGalleryAnimal;
    service.obtenerInformacionAdoptante = getPerson;
    service.responderSolicitud = responderSolicitud;

    function getList() {
        return generalService.EJECUTAR_SERVICES("GET", "api_solicitudes.php/obtenerListaSolicitudes");
    }

    function getAnimalInfo(animal) {
        return generalService.EJECUTAR_SERVICES('GET', 'api_gestionAnimal.php/buscarAnimal/' + animal);
    }

    function getGalleryAnimal(animal) {
        return generalService.EJECUTAR_SERVICES('GET', "api_gestionAnimal.php/galeriaAnimal/" + animal);
    }

    function getPerson(id) {
        return generalService.EJECUTAR_SERVICES("GET", "api_adopcion.php/buscarPersona/" + id);
    }

    function responderSolicitud(data) {
        return generalService.EJECUTAR_SERVICES("POST", "api_solicitudes.php/responderSolicitud", { "data": data });
    }
}
