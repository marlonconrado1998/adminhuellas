app.service('gestionAnimalService', gestionAnimalService);

/** @ngInject */
gestionAnimalService.$inject = ['generalService'];

function gestionAnimalService(generalService) {

    var service = this;

    //VARIABLES
    service.campos_adopcion = [];
    service.campos_animal = [];
    service.animales = [];
    service.informacion_animal = {};

    //FUNCTIONS
    service.solicitarAdopcion = solicitarAdopcion;
    service.buscarAnimal = buscarAnimal;
    service.registrarAnimal = registrarAnimal;
    service.obtenerListaAnimales = obtenerListaAnimales;
    service.obtenerGaleriaAnimal = obtenerGaleriaAnimal;
    service.actualizarDatosAnimal = actualizarDatosAnimal;

    function solicitarAdopcion() {
        return generalService.EJECUTAR_SERVICES('GET', 'js/config/gestionAnimal.config.json', null);
    }

    function buscarAnimal(animal, url) {
        return generalService.EJECUTAR_SERVICES('GET', 'api_gestionAnimal.php/buscarAnimal/' + animal);
    }

    function registrarAnimal(url, datos) {
        return generalService.EJECUTAR_SERVICES('POST', url, { "data": datos });
    }

    function obtenerListaAnimales() {
        return generalService.EJECUTAR_SERVICES('GET', "api_gestionAnimal.php/listaAnimales");
    }

    function obtenerGaleriaAnimal(animal) {
        return generalService.EJECUTAR_SERVICES('GET', "api_gestionAnimal.php/galeriaAnimal/" + animal);
    }

    function actualizarDatosAnimal(data) {
        return generalService.EJECUTAR_SERVICES('PUT', "api_gestionAnimal.php/actualizarAnimal", {"data": data});
    }
}