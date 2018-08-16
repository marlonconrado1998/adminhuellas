app.factory("selectFactory", ["generalService", function (generalService) {

    var fac = this;

    var ciudades;
    var especies;
    var razas;
    var colores;
    var estados;
    var sexos = [{ nombre: "Macho" }, { nombre: "Hembra" }];

    var url = "api_generalRequest.php/";

    fac.findUrl = function (variable) {
        generalService.EJECUTAR_SERVICES("GET", url + variable)
            .then(function (response) {
                if (variable == 'ciudad') {
                    ciudades = response.data;
                } else if (variable == 'especie') {
                    especies = response.data;
                } else if (variable == 'color') {
                    colores = response.data;
                } else if (variable == 'raza') {
                    razas = response.data;
                } else if (variable == 'estado') {
                    estados = response.data;
                }
            }).catch(function () {
                console.log("Ubo un error.");
            });
    }

    var all = {
        getCiudades: function () {
            if (ciudades == undefined) {
                fac.findUrl('ciudad');
            }
            return ciudades;
        },
        getEspecies: function () {
            if (especies == undefined) {
                fac.findUrl("especie");
            }
            return especies;
        },
        getSexos: function () {
            return sexos;
        },
        getRazas: function () {
            if (razas == undefined) {
                fac.findUrl("raza");
            }
            return razas;
        },
        getColores: function () {
            if (colores == undefined) {
                colores = fac.findUrl('color');
            }
            return colores;
        },
        getEstados: function () {
            if (estados == undefined) {
                estados = fac.findUrl('estado');
            }
            return estados;
        },
        getAll: function () {
            return {
                ciudades: all.getCiudades(),
                especies: all.getEspecies(),
                sexos: all.getSexos(),
                razas: all.getRazas(),
                colores: all.getColores(),
                estados: all.getEstados()
            }
        }
    };
    return all;
}]);