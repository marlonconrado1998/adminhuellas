var app = angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngWizard',
    'ngFileUpload',
    'ngImgCrop'
]);

app.run(["$rootScope", "$location",
    function ($rootScope, $location) {
        $rootScope.$on("$locationChangeStart",
            function () {
                var account = JSON.parse(sessionStorage.getItem("user"));
                if (account == null || account == undefined) {
                    $location.path("/Login");
                } else {
                    if ($location.path() == "/Login") {
                        // window.history.back();
                        $location.path("/Inicio");
                    }
                }
            });
    }]);