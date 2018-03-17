app.controller('gestionAnimalCtrl', gestionAnimalCtrl);

gestionAnimalCtrl.$inject = ['$uibModal'];

function gestionAnimalCtrl($uibModal) {

    var gestionCtrl = this;

    gestionCtrl.modal = function(animal) {
        var modalInstance = $uibModal.open({
            templateUrl: 'modal.html',
            size: 'md',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            resolve: {
                items: function() {
                    return animal;
                }
            }
        });
    };
    gestionCtrl.animales = [{
        nombre: "Chanda",
        raza: "Pastor alemán",
        peso: "20kg",
        color: "Azul",
        sexo: "Hembra",
        fecha: new Date(),
        estado: "Gusanos dasdbasdasd asdgas dyasgd asydgasd saygduyas duyasgda sdyas dasyuda",
        imagen: "https://perro.shop/wp-content/uploads/pastor_aleman2.jpg"
    }, {
        nombre: "Tomi",
        raza: "Bull terry",
        peso: "40kg",
        color: "Amarillo",
        sexo: "Macho",
        fecha: new Date(),
        estado: "Pata rota",
        imagen: "http://4.bp.blogspot.com/-CVpZ-bIuvc8/Uqst3oHwdSI/AAAAAAAAEuI/Gq5H4d8hANM/s1600/bull+terrier.jpg"
    }, {
        nombre: "Neider",
        raza: "Pitbull",
        peso: "20kg",
        color: "Azul",
        sexo: "Hembra",
        fecha: new Date(),
        estado: "Desnutrición",
        imagen: "https://www.muyperruno.com/wp-content/uploads/2016/07/perro-pitbull-2.jpg"
    }, {
        nombre: "Roberto",
        raza: "Pastor alemán",
        peso: "20kg",
        color: "Azul",
        sexo: "Hembra",
        fecha: new Date(),
        estado: "Malderrabia",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN5aCiqeaIEGsX-ZOTFdUb1lnOWA8_Dcnc9o1rkV9fmwYrULfOuA"
    }];
    gestionCtrl.mostrarAnimal = function(animal) {
        swal({
            title: "",
            text: "Información",
            confirmButtonText: "Aceptar",
            confirmButtonClass: "btn-success",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonClass: "btn-danger",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            width: 350
        });
    };
}
app.controller('ModalInstanceCtrl', ModalInstanceCtrl);

ModalInstanceCtrl.$inject = ['$uibModalInstance', 'items'];

function ModalInstanceCtrl($uibModalInstance, items) {

    var gestionCtrl = this;
    gestionCtrl.animal = items;

    gestionCtrl.cerrar = function() {
        $uibModalInstance.dismiss('cancel');
    }
}