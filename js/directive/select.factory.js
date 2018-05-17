app.factory("selectFactory", ["generalService", 'GeneralURL', function (generalService, GeneralURL) {
    
    var fac = this;
    var ciudades = [{ nombre: "Cartagena", id: 1 }, { nombre: "Barranquilla", id: 3 }, { nombre: "Bogotá", id: 2 }];
    var especies = [{ nombre: "Perro", id: 1 }, { nombre: "Gato", id: 2 }];
    var razas = [{ nombre: "Criollo", id: 1, especie: "Perro" }, { nombre: "Pug", id: 2, especie: "Perro" }, { nombre: "Criollo", id: 3, especie: "Gato" }];
    var colores = ["Negro", "Blanco", "Café"];
    var sexos = ["Macho", "Hembra"];

    var url = GeneralURL + "api_generalRequest.php/";

    var all = {
        getCiudades: function () {
            if (ciudades.length == 0) {
                ciudades = generalService.EJECUTAR_SERVICES("GET", url + "ciudad");
            }
            return ciudades;
        },
        getEspecies: function () {
            if (especies.length == 0) {
                especies = generalService.EJECUTAR_SERVICES("GET", url + "especie");
            }
            return especies;
        },
        getSexos: function () {
            return sexos;
        },
        getRazas: function () {
            if (razas.length == 0) {
                razas = generalService.EJECUTAR_SERVICES("GET", url + "raza");
            }
            return razas;
        },
        getColores: function () {
            if (colores.length == 0) {
                colores = generalService.EJECUTAR_SERVICES("GET", url + "color");
            }
            return colores;
        },
        getAll : function () {
            if (colores.length == 0 && razas.length == 0 && especies.length == 0 && ciudades.length == 0) {
                return false;
            }
                return {
                    ciudades: ciudades,
                    especies: especies,
                    sexos: sexos,
                    razas: razas,
                    colores: colores
                }
           
        }
    };
    return all;
}]);