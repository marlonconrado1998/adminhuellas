app.controller('inicioController', inicioController)

/** @ngInject */
inicioController.$inject = ['inicioService'];

function inicioController(inicioService) {

    var inicioCtrl = this;
    inicioCtrl.infoGeneral = {};

    inicioCtrl.searchInfoGeneral = function () {
        inicioService.buscarInfoGeneral().then(function (response) {
            inicioCtrl.infoGeneral = response;
        });
    }

    inicioCtrl.searchInfoGeneral();
}