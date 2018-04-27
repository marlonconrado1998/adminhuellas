app.factory("selectFactory", ["generalService", 'GeneralURL', function(generalService, GeneralURL) {
    var fac = this;
    var ciudades = [];
    var especies = [];
    var razas = [];
    var url = GeneralURL + "api_generalRequest.php/";

    var all = {
        getCiudades: function() {

            if (ciudades.length == 0) {
                ciudades = generalService.EJECUTAR_SERVICES("GET", url + "ciudad");
            }
            return ciudades;
        },
        getEspecies: function() {
            if (especies.length == 0) {
                especies = generalService.EJECUTAR_SERVICES("GET", url + "especie");
            }
            return especies;
        },
        getRazas: function() {
            if (razas.length == 0) {
                razas = generalService.EJECUTAR_SERVICES("GET", url + "raza");
            }
            return razas;
        },
    };

    return all;
}]);