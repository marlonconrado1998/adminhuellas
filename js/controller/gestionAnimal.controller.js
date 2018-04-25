app.controller('gestionAnimalCtrl', gestionAnimalCtrl);

gestionAnimalCtrl.$inject = ['$uibModal', 'gestionAnimalService', 'FORMULARIO'];

function gestionAnimalCtrl($uibModal, gestionAnimalService, FORMULARIO) {

    var gestionCtrl = this;
    //VARIABLES
    gestionCtrl.campos_adopcion = gestionAnimalService.campos_adopcion;
    gestionCtrl.campos_animal = gestionAnimalService.campos_animal;
    gestionCtrl.informacion_animal = {};
    gestionCtrl.formAnimales = FORMULARIO.animales;
    console.log(gestionCtrl.formAnimales);

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
        var url = 'http://localhost/StartAdmin_back-end/webapis/api/api_gestionAnimal.php/'
        gestionAnimalService.registrarAnimal(url, json)
            .then(function(response) {
                console.log(response);
            }).catch(function(error) {
                console.log(error);
            });;
    }


    gestionCtrl.animales = [{
        codigo: 0,
        nombre: "Chanda",
        especie: "Perro",
        raza: "Pastor alemán",
        peso: 20,
        color: "Azul",
        sexo: "Hembra",
        fecha: new Date(),
        estado: "Gusanos dasdbasdasd asdgas dyasgd asydgasd saygduyas duyasgda sdyas dasyuda",
        imagen: "https://perro.shop/wp-content/uploads/pastor_aleman2.jpg"
    }, {
        codigo: 1,
        nombre: "Tomi",
        especie: "Perro",
        raza: "Bull terry",
        peso: 40,
        color: "Amarillo",
        sexo: "Macho",
        fecha: new Date(),
        estado: "Pata rota",
        imagen: "http://4.bp.blogspot.com/-CVpZ-bIuvc8/Uqst3oHwdSI/AAAAAAAAEuI/Gq5H4d8hANM/s1600/bull+terrier.jpg"
    }, {
        codigo: 2,
        nombre: "Neider",
        especie: "Perro",
        raza: "Pitbull",
        peso: 20,
        color: "Azul",
        sexo: "Hembra",
        fecha: new Date(),
        estado: "Desnutrición",
        imagen: "https://www.muyperruno.com/wp-content/uploads/2016/07/perro-pitbull-2.jpg"
    }, {
        codigo: 3,
        nombre: "Roberto",
        especie: "Perro",
        raza: "Pastor alemán",
        peso: 20,
        color: "Azul",
        sexo: "Hembra",
        fecha: new Date(),
        estado: "Malderrabia",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN5aCiqeaIEGsX-ZOTFdUb1lnOWA8_Dcnc9o1rkV9fmwYrULfOuA"
    }];
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