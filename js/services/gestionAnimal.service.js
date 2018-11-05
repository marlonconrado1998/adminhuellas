app.service('gestionAnimalService', gestionAnimalService);

/** @ngInject */
gestionAnimalService.$inject = ['generalService'];

function gestionAnimalService(generalService) {

    var service = this;

    //VARIABLES
    service.campos_adopcion = [];
    service.campos_animal = [];
    service.animales = [];
    service.informacion_animal = {};

    //FUNCTIONS
    service.solicitarAdopcion = solicitarAdopcion;
    service.buscarAnimal = buscarAnimal;
    service.registrarAnimal = registrarAnimal;
    service.obtenerListaAnimales = obtenerListaAnimales;
    service.obtenerGaleriaAnimal = obtenerGaleriaAnimal;
    service.actualizarDatosAnimal = actualizarDatosAnimal;
    service.eliminarImagen = eliminarImagen;
    service.subirImagen = subirImagen;
    service.buscarGaleria = buscarGaleria;
    service.dropGaleria = dropGaleria;
    service.predeterminarGaleria = predeterminarGaleria;
    service.mostrarSesiones = mostrarSesiones;
    service.mostrarSesion = mostrarSesion;
    service.buscarValorItem = buscarValorItem;
    service.agregarSesion = agregarSesion;
    service.getHistoriaMedica = getHistoriaMedica;


    function solicitarAdopcion() {
        return generalService.EJECUTAR_SERVICES('GET', 'js/config/gestionAnimal.config.json', null);
    }

    function buscarAnimal(animal, url) {
        return generalService.EJECUTAR_SERVICES('GET', 'api_gestionAnimal.php/buscarAnimal/' + animal);
    }

    function registrarAnimal(url, datos) {
        return generalService.EJECUTAR_SERVICES('POST', url, {
            "data": datos
        });
    }

    function obtenerListaAnimales() {
        return generalService.EJECUTAR_SERVICES('GET', "api_gestionAnimal.php/listaAnimales");
    }

    function obtenerGaleriaAnimal(animal) {
        return generalService.EJECUTAR_SERVICES('GET', "api_gestionAnimal.php/galeriaAnimal/" + animal);
    }

    function actualizarDatosAnimal(data) {
        return generalService.EJECUTAR_SERVICES('PUT', "api_gestionAnimal.php/actualizarAnimal", {
            "data": data
        });
    }

    function eliminarImagen(data) {
        return generalService.EJECUTAR_SERVICES('DELETE', "api_gestionAnimal.php/eliminarImagen", {
            "data": data
        });
    }

    function subirImagen(data) {
        return generalService.EJECUTAR_SERVICES('POST', "api_gestionAnimal.php/subirImagen", {
            "data": data
        });
    }

    function buscarGaleria(idanimal) {
        return generalService.EJECUTAR_SERVICES('GET', "api_gestionAnimal.php/buscarGaleria/" + idanimal);
    }

    function dropGaleria(file) {
        return generalService.EJECUTAR_SERVICES('DELETE', "api_gestionAnimal.php/dropGaleria/" + file.id);
    }

    function predeterminarGaleria(data) {
        return generalService.EJECUTAR_SERVICES('PUT', "api_gestionAnimal.php/predeterminarGaleria", data);
    }

    function mostrarSesiones(idanimal) {
        return generalService.EJECUTAR_SERVICES('GET', "api_gestionAnimal.php/buscarSesiones/" + idanimal);
    }

    function mostrarSesion(idsesion, idespecie) {
        return generalService.EJECUTAR_SERVICES('GET', "api_gestionAnimal.php/buscarSesion/" + idsesion + "/" + idespecie);
    }
    
    function buscarValorItem(idespecie) {
        return generalService.EJECUTAR_SERVICES('GET', "api_gestionAnimal.php/buscarValorItem/" + idespecie);
    }
    
    function agregarSesion(sesion) {
        return generalService.EJECUTAR_SERVICES('POST', "api_gestionAnimal.php/agregarSesion", {data: sesion});
    }

    function getHistoriaMedica (idanimal) {
        return generalService.EJECUTAR_SERVICES('GET', `api_gestionAnimal.php/historia_medica/${idanimal}`);        
    }

}