(function() {
    'use strict';

    app.service('generalService', generalService);

    generalService.$inject = ['$http', '$q', 'GeneralURL'];

    function generalService($http, $q, GeneralURL) {
        
        var service = this;
        service.url = GeneralURL;
        service.EJECUTAR_SERVICES = makeRequest;

        function makeRequest(METHOD, URL, DATA) {

            METHOD = METHOD.toUpperCase();

            var defer = $q.defer();
            var url = service.url + URL;
            
            $http({
                "method": METHOD,
                "url": url,
                "data": DATA
            }).then(function(response) {
                defer.resolve(response.data);
            }).catch(function(error) {
                defer.reject(error);
            });

            return defer.promise;
        }

    }
})();