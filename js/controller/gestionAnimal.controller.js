app.controller('gestionAnimalCtrl', gestionAnimalCtrl);

gestionAnimalCtrl.$inject = ['$uibModal', 'gestionAnimalService', 'FORMULARIO', "GeneralURL", "selectFactory", "Upload"];

function gestionAnimalCtrl($uibModal, gestionAnimalService, FORMULARIO, GeneralURL, selectFactory, Upload) {

    var gestionCtrl = this;
    //VARIABLES
    gestionCtrl.campos_adopcion = gestionAnimalService.campos_adopcion;
    gestionCtrl.campos_animal = gestionAnimalService.campos_animal;
    gestionCtrl.informacion_animal = {};
    gestionCtrl.formAnimales = FORMULARIO.animales;
    gestionCtrl.animales = gestionAnimalService.animales;
    gestionCtrl.optionsSelect = {};
    gestionCtrl.imagenesAnimalRegistro = [];

    gestionCtrl.modal = function (animal, tipo) {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal.html',
            size: 'md',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            resolve: {
                items: function () {
                    return { data: animal, tipo: tipo };
                }
            }
        });
        modalInstance.result.then(function () { }, function (info) {
            console.log(info);
        });
    };

    gestionCtrl.onSolicitarAdopcion = function () {
        gestionAnimalService.solicitarAdopcion()
            .then(function (response) {
                gestionCtrl.campos_adopcion = gestionAnimalService.campos_adopcion;
            });
    }

    gestionCtrl.onBuscarAnimal = function (animal) {
        gestionCtrl.informacion_animal = {};
        angular.forEach(gestionCtrl.animales, function (value) {
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

    gestionCtrl.registrarAnimal = function (animal) {
        var url = GeneralURL + 'api_gestionAnimal.php/registrarAnimal'
        console.log(animal);
        // gestionAnimalService.registrarAnimal(url, json)
        //     .then(function (response) {
        //         console.log(response);
                swal({
                    position: 'top-end',
                    type: 'success',
                    title: animal.nombre + ' ha sido registrado!',
                    showConfirmButton: false,
                    timer: 1500
                });
        //     }).catch(function (error) {
        //         console.log(error);
        //     });
    }

    gestionCtrl.onCamposParaRegistroAnimal = function () {
        gestionCtrl.optionsSelect = {
            "sexos": selectFactory.getSexos(),
            "especies": selectFactory.getEspecies(),
            "razas": selectFactory.getRazas(),
            "ciudades": selectFactory.getCiudades(),
            "colores": selectFactory.getColores()
        };
        console.log(selectFactory);
    }
   
    gestionCtrl.uploadMultipleFiles = function (files) {
        var existe = false;

        if (gestionCtrl.imagenesAnimalRegistro.length + files.length <= 5) {
            angular.forEach(files, function (file) {
                angular.forEach(gestionCtrl.imagenesAnimalRegistro, function (value) {
                    if (value.name == file.name) {
                       alert("Ya fue agregada esa imagen.");
                        existe = true;
                    }
                });
                if (!existe) {
                    Upload.base64DataUrl(file).then(function (response) {
                        gestionCtrl.imagenesAnimalRegistro.push({
                            "image": response,
                            "name": file.name
                        }
                        );
                    });
                }
            });
        } else {
            alert("Error: Maximo 5 fotos por animal");
        }

    };

    gestionCtrl.onBuscarAnimal = function () {
        gestionAnimalService.obtenerAnimal()
            .then(function (response) {
                console.log(response);
                gestionCtrl.animales = response.data;
            }).catch(function (error) {
                console.error(error);
            });
    }
    gestionCtrl.onBuscarAnimal();
}

//Controller MODAL==============================================//
app.controller('ModalInstanceCtrl', ModalInstanceCtrl);

ModalInstanceCtrl.$inject = ['$uibModalInstance', 'items', "$http"];

function ModalInstanceCtrl($uibModalInstance, items, $http) {

    var gestionCtrl = this;
    gestionCtrl.animal = items.data;
    gestionCtrl.css = items.tipo;

    $http.get("js/config/gestionAnimal.config.json").then(function (result) {
        gestionCtrl.form = result.data.camp;
        if (typeof gestionCtrl.animal == 'object' && typeof gestionCtrl.form == 'object' && gestionCtrl.animal != null) {
            for (var item in gestionCtrl.animal) {
                angular.forEach(gestionCtrl.form, function (value, key) {
                    if (item === value["name"]) {
                        value["value"] = gestionCtrl.animal[item];
                        angular.break;
                    }
                });
            }
        }
    });
    gestionCtrl.cerrar = function () {
        $uibModalInstance.dismiss('cancel');
    };
    gestionCtrl.test = function () {
        alert("Bien");
    };
}