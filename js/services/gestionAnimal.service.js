
app.service('gestionAnimalService', gestionAnimalService);

/** @ngInject */
gestionAnimalService.$inject = ['$http', '$q'];

function gestionAnimalService($http, $q) {

    var service = this;

    //VARIABLES
    service.campos_adopcion = [];
    service.campos_animal = [];

    //FUNCTIONS
    service.solicitarAdopcion = solicitarAdopcion;
    service.buscarAnimal = buscarAnimal;

    function solicitarAdopcion() {
        var defered = $q.defer();
        $http.get("js/config/gestionAnimal.config.json")
            .then(function (response) {
                service.campos_adopcion = response.data.campos_adopcion;
                defered.resolve(service.campos_adopcion);
            })
            .catch(function (error) {
                defered.reject(error);
            });
        return defered.promise;
    }

    function buscarAnimal(animal) {
        var defered = $q.defer();
        $http.get("js/config/gestionAnimal.config.json")
            .then(function (response) {
                service.campos_animal = response.data.camp;
                defered.resolve(service.campos_animal);
            })
            .catch(function (error) {
                defered.reject(error);
            });
        return defered.promise;
    }

}