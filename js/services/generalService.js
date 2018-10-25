(function () {
    'use strict';

    app.service('generalService', generalService);

    generalService.$inject = ['$http', '$q', 'GeneralURL'];

    function generalService($http, $q, GeneralURL) {

        var service = this;
        service.url = GeneralURL;
        service.EJECUTAR_SERVICES = makeRequest;
        service.MOSTRAR_REPORTE = makeReport;
        service.MOSTRAR_GRAFICO = chartReport;

        //Ejecutar peticiones
        function makeRequest(METHOD, URL, DATA) {

            METHOD = METHOD.toUpperCase();

            var defer = $q.defer();
            var url = service.url + URL;

            $http({
                "method": METHOD,
                "url": url,
                "data": DATA
            }).then(function (response) {
                defer.resolve(response.data);
            }).catch(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        //Muestra el panel para reportes
        function makeReport() {
            $("#report_panel").toggleClass("d-none report_panel");
        }

        //Crea el grafico para reporte
        function chartReport(type, data, series, labels, options = null, dataSetOveride = null, event = null) {
            var chart = {};

            chart.type = type;
            chart.data = data;
            chart.series = series;
            chart.labels = labels;
            chart.options = options;
            chart.dataSetOveride = dataSetOveride;
            chart.click = event;

            return chart;
        }
    }
})();