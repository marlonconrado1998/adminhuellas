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

    inicioCtrl.labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"];
    inicioCtrl.series = ['Gatos', 'Perros'];
    inicioCtrl.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    inicioCtrl.onClick = function (points, evt) {
        console.log(points, evt);
    };
    inicioCtrl.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    inicioCtrl.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: true,
                    position: 'right'
                }
            ]
        }
    };
}