//Controlador para la principal
app.controller('inicioController', inicioController)

/** @ngInject */
inicioController.$inject = ['inicioService', 'reportesService'];

function inicioController(inicioService, reportesService) {

    var inicioCtrl = this;
    inicioCtrl.infoGeneral = {}; //Informacion general de

    inicioCtrl.searchInfoGeneral = function () {
        inicioService.buscarInfoGeneral().then(function (response) {
            inicioCtrl.infoGeneral = response;
        });
    }

    inicioCtrl.searchInfoGeneral();

    inicioCtrl.labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Noviembre", "Diciembre"];
    inicioCtrl.series = ['Perros', 'Gatos'];
    inicioCtrl.data = inicioService.dataChart;
    inicioCtrl.onClick = function (points, evt) { };
    inicioCtrl.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    inicioCtrl.options = {
        scales: {
            yAxes: [
                {
                    ticks: { beginAtZero: true },
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    ticks: { beginAtZero: true },
                    id: 'y-axis-2',
                    type: 'linear',
                    display: true,
                    position: 'right'
                }
            ]
        }
    };

    function getChartData() {
        // if (inicioService.dataChart[0].length == 0) {
        //     var p = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        //     var g = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        //     reportesService.SolicitarReporteSeleccionado(3).then(function (perros) {
        //         reportesService.SolicitarReporteSeleccionado(4).then(function (gatos) {

        //             let p1 = forData(p, perros.data);
        //             let p2 = forData(g, gatos.data);
        //             inicioCtrl.data = [p1, p2];
        //             inicioService.dataChart = [p1, p2];
        //         });
        //     }).catch(function (error) {
        //         console.log(error);
        //     });
        // } else {
        //     inicioCtrl.data = inicioService.dataChart;
        // }
    }

    function forData(array, data) {
        // for (let i = 0; i < data.length; i++) {
        //     array[(parseInt(data[i].fecha) - 1)] = data[i].cantidad;
        // }
        // return array;
    }

    getChartData();
}