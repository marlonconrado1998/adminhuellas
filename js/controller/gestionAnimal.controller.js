app.controller('gestionAnimalCtrl', gestionAnimalCtrl);

gestionAnimalCtrl.$inject = ['$uibModal', 'gestionAnimalService', 'FORMULARIO'];

function gestionAnimalCtrl($uibModal, gestionAnimalService, FORMULARIO) {

    var gestionCtrl = this;
    //VARIABLES
    gestionCtrl.campos_adopcion = gestionAnimalService.campos_adopcion;
    gestionCtrl.campos_animal = gestionAnimalService.campos_animal;
    gestionCtrl.informacion_animal = {};
    gestionCtrl.formAnimales = FORMULARIO.animales;
    gestionCtrl.animales = gestionAnimalService.animales;

    gestionCtrl.modal = function(animal, tipo) {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal.html',
            size: 'md',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            resolve: {
                items: function() {
                    return { data: animal, tipo: tipo };
                }
            }
        });
        modalInstance.result.then(function() {}, function(info) {
            console.log(info);
        });
    };

    gestionCtrl.getForm = function() {
        console.log(gestionCtrl.formAnimales);
    }

    gestionCtrl.exitValidation = function(context) {
        // gestionCtrl.model.label = "Hola neider";
        console.log(context);
        return true;
    }

    gestionCtrl.onSolicitarAdopcion = function() {
        gestionAnimalService.solicitarAdopcion()
            .then(function(response) {
                gestionCtrl.campos_adopcion = gestionAnimalService.campos_adopcion;
            });
    }

    gestionCtrl.onBuscarAnimal = function(animal) {
        gestionCtrl.informacion_animal = {};
        angular.forEach(gestionCtrl.animales, function(value) {
            if (value.codigo == animal) {
                gestionCtrl.informacion_animal = value;
                angular.break;
                return;
            }
        });
        if (gestionCtrl.informacion_animal.codigo == null || gestionCtrl.informacion_animal.codigo == undefined) {
            gestionCtrl.adopcion.codigo_animal = "";
            gestionCtrl.informacion_animal.error = "Código de animal invalido, por favor intente nuevamente.";
        }
    }

    gestionCtrl.registrarAnimal = function(json) {
        var url = 'http://localhost/StartAdmin_back-end/webapis/api/api_gestionAnimal.php/registrarAnimal'
        gestionAnimalService.registrarAnimal(url, json)
            .then(function(response) {
                console.log(response);
                swal({
                    position: 'top-end',
                    type: 'success',
                    title: 'Animal registrado Exitosamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            }).catch(function(error) {
                console.log(error);
            });;
    }

    gestionCtrl.onBuscarAnimal = function() {
        gestionAnimalService.obtenerAnimal()
        .then(function(response) {
            gestionCtrl.animales = response.data;
        }).catch(function(error){
            console.error(error);
        });
    }
    gestionCtrl.onBuscarAnimal();
}


app.controller('ModalInstanceCtrl', ModalInstanceCtrl);

ModalInstanceCtrl.$inject = ['$uibModalInstance', 'items', "$http"];

function ModalInstanceCtrl($uibModalInstance, items, $http) {

    var gestionCtrl = this;
    gestionCtrl.animal = items.data;
    gestionCtrl.css = items.tipo;

    $http.get("js/config/gestionAnimal.config.json").then(function(result) {
        gestionCtrl.form = result.data.camp;
        if (typeof gestionCtrl.animal == 'object' && typeof gestionCtrl.form == 'object' && gestionCtrl.animal != null) {
            for (var item in gestionCtrl.animal) {
                angular.forEach(gestionCtrl.form, function(value, key) {
                    if (item === value["name"]) {
                        value["value"] = gestionCtrl.animal[item];
                        angular.break;
                    }
                });
            }
        }
    });
    gestionCtrl.cerrar = function() {
        $uibModalInstance.dismiss('cancel');
    };
    gestionCtrl.test = function() {
        alert("Bien");
    };
}