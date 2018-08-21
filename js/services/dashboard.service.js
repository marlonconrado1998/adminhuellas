app.service("dashboardService", dashboardService);

dashboardService.$injecy = ["generalService", "gestionAnimalService"];

function dashboardService(generalService, gestionAnimalService) {

    var service = this;

    // VARIABLES
    service.totalAnimales = gestionAnimalService.animales.length;

    //  FUNCTIONS
    service.getAnimalCount = getAnimalCount;

    function getAnimalCount() {
            return gestionAnimalService.obtenerListaAnimales();
    }

    function f() {
        generalService.EJECUTAR_SERVICES("", "");
    }

}