app.service('gestionAnimalService', gestionAnimalService);

/** @ngInject */
gestionAnimalService.$inject = ['generalService'];

function gestionAnimalService(generalService) {

    var service = this;

    //VARIABLES
    service.campos_adopcion = [];
    service.campos_animal = [];
    service.animales = [];

    //FUNCTIONS
    service.solicitarAdopcion = solicitarAdopcion;
    service.buscarAnimal = buscarAnimal;
    service.registrarAnimal = registrarAnimal;
    service.obtenerAnimal = obtenerAnimal;

    function solicitarAdopcion() {
        return generalService.EJECUTAR_SERVICES('GET', 'js/config/gestionAnimal.config.json', null);
    }

    function buscarAnimal(animal) {
        var defered = $q.defer();
        $http.get("js/config/gestionAnimal.config.json")
            .then(function(response) {
                service.campos_animal = response.data.camp;
                defered.resolve(service.campos_animal);
            })
            .catch(function(error) {
                defered.reject(error);
            });
        return defered.promise;
    }

    function registrarAnimal(url, datos) {
        return generalService.EJECUTAR_SERVICES('POST', url, { "data": datos });
    }

    function obtenerAnimal() {
        return generalService.EJECUTAR_SERVICES('GET', "api_gestionAnimal.php/animal");
    }
}