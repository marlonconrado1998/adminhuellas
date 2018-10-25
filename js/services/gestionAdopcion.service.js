// Servicio para controlador de adopciones
(function () {
    'use strict';

    app.service('gestionAdopcionService', gestionAdopcionService);

    /** @ngInject */
    gestionAdopcionService.$inject = ['generalService'];

    function gestionAdopcionService(generalService) {
        var service = this;
        service.guardarInformacion = guardarInformacion;
        service.buscarPersona = buscarPersona;
        service.registrarTestimonio = registrarTestimonio;
        service.ciudades = [];

        getCiudades();
        //Guarda la informacion del adoptante
        function guardarInformacion(data) {
            return generalService.EJECUTAR_SERVICES("POST", "api_adopcion.php/realizarAdopcion", { "data": data });
        }

        //Busca informacion de una persona
        function buscarPersona(data) {
            return generalService.EJECUTAR_SERVICES("GET", "api_adopcion.php/buscarPersona/" + data);
        }

        //Regisrar testimonio de usuario
        function registrarTestimonio(data) {
            return generalService.EJECUTAR_SERVICES("POST", "api_adopcion.php/guardarTestimonio", { "data": data });
        }

        //Busca el listado de las ciudades
        function getCiudades() {
       
            generalService.EJECUTAR_SERVICES("GET", "api_generalRequest.php/ciudad")
                .then(function (response) {
                    service.ciudades = response.data;
                }).catch(function (er) {

                 });
        }
    }

}());