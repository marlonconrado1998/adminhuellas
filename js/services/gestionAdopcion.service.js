(function () {
    'use strict';

    app.service('gestionAdopcionService', gestionAdopcionService);

    /** @ngInject */
    gestionAdopcionService.$inject = ['generalService'];

    function gestionAdopcionService(generalService) {
        var service = this;
        service.guardarInformacion = guardarInformacion;
        service.buscarPersona = buscarPersona;

        function guardarInformacion(data) {
            return generalService.EJECUTAR_SERVICES("POST", "api_adopcion.php/realizarAdopcion", {"data": data});
        }
       
        function buscarPersona(data) {
            return generalService.EJECUTAR_SERVICES("GET", "api_adopcion.php/buscarPersona/" + data);
        }


    }

}());