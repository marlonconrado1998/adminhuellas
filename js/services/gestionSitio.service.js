(function(){
    'use strict';

    app.service('sitioService', sitioService)

    /** @ngInject */
    sitioService.$inject = ['generalService'];

    function sitioService(generalService){

        var gestionService = this;

        // funciones 
        gestionService.getMetadata = getMetadata;
        gestionService.setMetadata = setMetadata;
        
        
        function getMetadata () {
            return generalService.EJECUTAR_SERVICES('GET', 'api_webSite.php/metadata');
        }

        function setMetadata (metadata) {
            return generalService.EJECUTAR_SERVICES('POST', 'api_webSite.php/metadata', {metadata: metadata});
        }
    }

}());