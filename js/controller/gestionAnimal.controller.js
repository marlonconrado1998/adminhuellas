app.controller('gestionAnimalCtrl', gestionAnimalCtrl);

gestionAnimalCtrl.$inject = ['$uibModal'];

function gestionAnimalCtrl($uibModal) {

    var gestionCtrl = this;

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
            // console.log(info);
        });
    };
    gestionCtrl.animales = [{
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
    gestionCtrl.mostrarAnimal = function() {
        //        swal({
        //            title: 'Submit email to run ajax request',
        //            showCancelButton: true,
        //            confirmButtonText: 'Submit',
        //            showLoaderOnConfirm: true,
        //            preConfirm: () => {
        //                return new Promise((resolve) => {
        //                    gestionCtrl.animales.splice(0, 1);
        //                    resolve();
        //                })
        //            },
        //            allowOutsideClick: () => !swal.isLoading()
        //        }).then((result) => {
        //            if (result.value) {
        //                swal({
        //                    type: 'success',
        //                    title: 'Ajax request finished!',
        //                    html: 'Submitted email: ' + result.value
        //                })
        //            }
        //        })
    };
}
app.controller('ModalInstanceCtrl', ModalInstanceCtrl);

ModalInstanceCtrl.$inject = ['$uibModalInstance', 'items', "$http"];

function ModalInstanceCtrl($uibModalInstance, items, $http) {

    var gestionCtrl = this;
    gestionCtrl.animal = items.data;
    gestionCtrl.css = items.tipo;

    $http.get("js/config/gestionAnimal.config.json").then(function(result) {
        gestionCtrl.form = result.data.camp;
        console.log(gestionCtrl.form);
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