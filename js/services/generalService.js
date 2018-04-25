(function() {
    'use strict';

    app.service('generalService', generalService);

    generalService.$inject = ['$http', '$q'];

    function generalService($http, $q) {
        var service = this;

        service.EJECUTAR_SERVICES = makeRequest;

        function makeRequest(METHOD, URL, DATA) {

            METHOD = METHOD.toUpperCase();

            var defer = $q.defer();
            $http({
                "method": METHOD,
                "url": URL,
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