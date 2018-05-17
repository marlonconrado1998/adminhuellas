app.controller('gestionAnimalCtrl', gestionAnimalCtrl);

gestionAnimalCtrl.$inject = ['$uibModal', 'gestionAnimalService', "GeneralURL", "selectFactory", "Upload"];

function gestionAnimalCtrl($uibModal, gestionAnimalService, GeneralURL, selectFactory, Upload) {

    var gestionCtrl = this;
    gestionCtrl.campos_adopcion = gestionAnimalService.campos_adopcion;
    gestionCtrl.campos_animal = gestionAnimalService.campos_animal;
    gestionCtrl.informacion_animal = {};  
    gestionCtrl.animales = gestionAnimalService.animales;
    gestionCtrl.optionsSelect = {};
    gestionCtrl.imagenesAnimalRegistro = [];

    gestionCtrl.modal = function(animal) {
        var modalInstance = $uibModal.open({
            templateUrl: 'pages/modal/modal_animales.html',
            size: 'lg',
            controller: 'ModalInstanceCtrl',
            backdrop: true,
            controllerAs: '$ctrl',
            resolve: {
                items: function() {
                    return { data: animal };
                }
            }
        });
        modalInstance.result.then(function() {}, function(info) {
            console.log(info);
        });
    };

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

    gestionCtrl.registrarAnimal = function(animal) {

        var url = GeneralURL + 'api_gestionAnimal.php/registrarAnimal'
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

    gestionCtrl.onCamposParaRegistroAnimal = function() {
        gestionCtrl.optionsSelect = {
            "sexos": selectFactory.getSexos(),
            "especies": selectFactory.getEspecies(),
            "razas": selectFactory.getRazas(),
            "ciudades": selectFactory.getCiudades(),
            "colores": selectFactory.getColores()
        };
    }

    gestionCtrl.uploadMultipleFiles = function(files) {
        var existe = false;

        if (gestionCtrl.imagenesAnimalRegistro.length + files.length <= 5) {
            angular.forEach(files, function(file) {
                angular.forEach(gestionCtrl.imagenesAnimalRegistro, function(value) {
                    if (value.name == file.name) {
                        alert("Ya fue agregada esa imagen.");
                        existe = true;
                    }
                });
                if (!existe) {
                    Upload.base64DataUrl(file).then(function(response) {
                        gestionCtrl.imagenesAnimalRegistro.push({
                            "image": response,
                            "name": file.name
                        });
                    });
                }
            });
        } else {
            alert("Error: Maximo 5 fotos por animal");
        }
    };


    gestionCtrl.onDeleteImage = function(position_image) {
        gestionCtrl.imagenesAnimalRegistro.splice(position_image, 1)
    }

    gestionCtrl.onShowImage = function(position_image) {
        var aux = gestionCtrl.imagenesAnimalRegistro[position_image];
        gestionCtrl.imagenesAnimalRegistro[position_image] = gestionCtrl.imagenesAnimalRegistro[gestionCtrl.imagenesAnimalRegistro.length - 1];
        gestionCtrl.imagenesAnimalRegistro[gestionCtrl.imagenesAnimalRegistro.length - 1] = aux;
    }

    gestionCtrl.onCropImage = function(position_image) {

    }

    gestionCtrl.onBuscarAnimal = function() {
        gestionAnimalService.obtenerAnimal()
            .then(function(response) {
                gestionCtrl.animales = response.data;
            }).catch(function(error) {
                console.error(error);
            });
    }
    gestionCtrl.onBuscarAnimal();
}

//Controller MODAL==============================================//
app.controller('ModalInstanceCtrl', ModalInstanceCtrl);

ModalInstanceCtrl.$inject = ['$uibModalInstance', 'items', "$http", 'selectFactory', 'Upload'];

function ModalInstanceCtrl($uibModalInstance, items, $http, selectFactory, Upload) {

    var gestionCtrl = this;
    gestionCtrl.animal = {};
    gestionCtrl.imageCrop = '';
    gestionCtrl.imageCroped = '';
    gestionCtrl.files = [];
    gestionCtrl.optionsSelect = selectFactory.getAll();

    gestionCtrl.cerrar = function() {
        $uibModalInstance.dismiss('cancel');
    };

    gestionCtrl.registrarDatos = function() {
        console.log(gestionCtrl.animal);
    }

    gestionCtrl.addImages = function(images) {
        if (gestionCtrl.files.length >= 5) {
            return false;
        }
        Upload.base64DataUrl(images).then(function(imagesB64) {
            var iter = imagesB64.length;
            while (iter--) {
                if (gestionCtrl.files.length < 5) {
                    gestionCtrl.files.push(imagesB64[iter]);
                }
            }
        });
    }

    gestionCtrl.updateImage = function (index, imageCroped) {
        gestionCtrl.files[index] = imageCroped;
    }

    gestionCtrl.deleteImage = function (index) {
        gestionCtrl.files.splice(index, 1);
    }

    gestionCtrl.previewImage = function (file) {
        var view = open();
        view.document.write("<img src='"+file+"'>")
    }

    gestionCtrl.cerrar = function() {
        $uibModalInstance.dismiss('cancel');
    };
    gestionCtrl.asignarAttr = function() {
        for (var attr in items.data) {
            gestionCtrl.animal[attr] = items.data[attr];
        }
    }

    gestionCtrl.asignarAttr();

}