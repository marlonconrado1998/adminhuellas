//Servicio del controlador de reportes
app.service('reportesService', reportesService)

/** @ngInject */
reportesService.$inject = ['generalService',];

function reportesService(generalService) {

    var servi = this;

    servi.reportList = []; //Lista de reportes disponibles
    servi.obtenerReporte = makeReport;
    servi.obtenerGrafico = makeGrafic;
    servi.obtenerListaReportes = getListReport;
    servi.SolicitarReporteSeleccionado = getSelectedReport;
    
    getListReport();
    //Obtiene listado de reportes que pueden realizarse
    function getListReport() {
        return generalService.EJECUTAR_SERVICES('GET', "api_reportes.php/getReportsList");
    }

    //Realiza la consulta de un reporte seleccionado de la lista
    function getSelectedReport(idreport) {
        return generalService.EJECUTAR_SERVICES('GET', "api_reportes.php/getReport/" + idreport);
    }

    //Muestra el panel para reporte
    function makeReport() {
        generalService.MOSTRAR_REPORTE();
    }

    //Elabora el grafico para reporte
    function makeGrafic(type, data, series, labels, options, dataSetOveride, event) {
        return generalService.MOSTRAR_GRAFICO(type, data, series, labels, options, dataSetOveride, event);
    }

}
