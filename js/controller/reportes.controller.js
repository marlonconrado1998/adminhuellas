// Controlador de reportes
app.controller('reportesController', reportesController)

/** @ngInject */

reportesController.$inject = ['reportesService', '$location'];

function reportesController(reportesService, $location) {
    var ctrl = this;

    ctrl.reportList = reportesService.reportList; //Lista de reportes
    ctrl.cabecera = []; //Cabecera para tabla
    ctrl.datos_agrupadores = []; //DAtos para SELECT de seleccionar dato agrupador
    ctrl.datos = []; //Datos para trabajar el reporte
    ctrl.header_title = ""; //TItulo para el reporte
    ctrl.footer_title = ""; //Pie de pagina del reporte
    ctrl.cargando = true; //Muestra el LOADER mientras se hace el reporte
    ctrl.grafic = []; //Objeto grafico reporte
    ctrl.graficsTypes = [{ name: "Torta", type: "pie" },
    { name: "Barras", type: "bar" },
    { name: "Anillo", type: "doughnut" },
    { name: "Area", type: "polarArea" }]; //Tipos de graficos para reporte
    ctrl.colors = Chart.defaults.global.colors; //Array de colores en los graficos del reporte
    Chart.defaults.global.legend.display = true; //Mostrar la leyenda
    Chart.defaults.global.legend.position = "right"; //Posicion de la leyenda
    Chart.defaults.global.title.display = true; //Mostrar la titulo
    Chart.defaults.global.legend.labels.boxWidth = 20; //Ancho de colores de labels

    var event = function (points, evt) {
    };
    var dataSetOveride = [{ yAxisID: 'y-axis-left' }];
    var options = {
        scales: {
            yAxes: [
                {
                    ticks: { beginAtZero: true },
                    id: 'y-axis-left',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };

    getReportList();

    //Obtener listado de los reportes que se pueden hacer.
    function getReportList() {
        if (ctrl.reportList.length == 0) {
            reportesService.obtenerListaReportes()
                .then(function (response) {
                    reportesService.reportList = response.data;
                    ctrl.reportList = response.data;
                }).catch(function (error) {
                    console.log(error);
                });
        } else {
            ctrl.reportList = reportesService.reportList;
        }
    }

    //Obtener un reporte de la lista de reportes y consultar.
    ctrl.getSelectedReport = function (idreporte = null, nombre_reporte) {

        if (idreporte != null) {
            ctrl.cargando = true;

            ctrl.footer_title = "Final de reporte";

            reportesService.obtenerReporte();

            reportesService.SolicitarReporteSeleccionado(idreporte)
                .then(function (response) {
                    ctrl.datos = response.data;
                    dataOrganization(ctrl.datos[0], nombre_reporte);
                    ctrl.cargando = false;
                }).catch(function (error) {
                    ctrl.cargando = false;
                    console.log(error);
                });
        }
    }

    //Imprimir reporte
    ctrl.printReport = function () {
        window.print();
    }

    //Descargar el archivo como un reporte pdf
    ctrl.downloadReport = function () {
        // let contenido = document.getElementById("report_panel");
        // let pdf = new jsPDF();
        // console.log(pdf);
        // pdf.fromHTML(contenido.innerHTML, 15, 15, {
        //     'width': 170
        // });
        // pdf.save(`${ctrl.header_title}.pdf`);
        alert("Aun no es posible descargar...");
    }

    //Cerrar ventana de impresion de reporte
    ctrl.closePrintReport = function () {
        reportesService.obtenerReporte();
    }

    //Hacer cambios cunado cambie el tipo de grafico.
    ctrl.changeGraphics = function (chart) {
        if (chart.type.type !== "bar") {
            delete (chart.options);
            delete (chart.dataSetOveride);
            delete (chart.event);
            Chart.defaults.global.legend.display = true;
        } else {
            chart.options = options;
            chart.dataSetOveride = dataSetOveride;
            chart.event = event;
            Chart.defaults.global.legend.display = false;
        }
    }

    //Cambio de elemento de agrupacion de reporte
    ctrl.changeElelmentGroup = function (chart) {
        var estadistica_datos = [];
        var ser = [];
        var elemento = {};
        var indice;

        for (var i = 0; i < ctrl.datos.length; i++) {
            elemento = ctrl.datos[i];
            indice = ser.indexOf(elemento[chart.agrupador]);

            if (indice != -1) {
                estadistica_datos[indice] += 1;
            } else {
                ser.push(elemento[chart.agrupador]);
                estadistica_datos.push(1);
            }
        }

        if (ser.length <= 12) {
            var total = ctrl.getTotalData(estadistica_datos);
            for (let i = 0; i < ser.length; i++) {
                ser[i] = ser[i] + " = " + estadistica_datos[i] + " (" + ((estadistica_datos[i] * 100) / total).toFixed(2) + "%)";
            }

            Chart.defaults.global.title.text = "Datos por " + chart.agrupador;
            chart.data = estadistica_datos;
            chart.series = ser;
            chart.labels = ser;
            estadistica_datos = [];
            ser = [];
        } else {
            ctrl.datos_agrupadores.splice(ctrl.datos_agrupadores.indexOf(chart.agrupador), 1);
            chart.agrupador = ctrl.datos_agrupadores[0];
            ctrl.changeElelmentGroup(chart);
        }
    }

    //Organizar datos principales para el reporte
    function dataOrganization(firstArrayData, titulo) {
        ctrl.cabecera = [];
        ctrl.datos_agrupadores = [];
        ctrl.header_title = titulo.toUpperCase();

        for (const key in firstArrayData) {
            ctrl.cabecera.push(key);
            ctrl.datos_agrupadores.push(key);
        }

        // ctrl.datos_agrupadores = angular.copy(ctrl.cabecera);
        ctrl.grafic = [];
        ctrl.addNewGrafic();
    }

    //Hacer grafico para reporte
    function makeGrafic(type, data, series, labels, options = null, dataSetOveride = null, event = null) {
        var chart = {};
        chart.type = type;
        chart.data = data;
        chart.series = series;
        chart.labels = labels;
        chart.click = event;
        chart.agrupador = ctrl.datos_agrupadores[0];
        Chart.defaults.global.title.text = "Datos por " + chart.agrupador;
        ctrl.changeGraphics(chart);
        return chart;
    }

    // Agrega un grafico de reporte
    ctrl.addNewGrafic = function () {
        ctrl.grafic.push(makeGrafic(ctrl.graficsTypes[0], [], [], [], options, dataSetOveride, event));
        ctrl.changeElelmentGroup(ctrl.grafic[ctrl.grafic.length - 1]);
    }

    // Elimina un grafico
    ctrl.removeGrafic = function (indice) {
        ctrl.grafic.splice(indice, 1);
    }

    // Obtiene el total de elementos del grafico
    ctrl.getTotalData = function (data) {
        var total = 0;
        angular.forEach(data, function (value) {
            total += value;
        });
        return total;
    }
}
