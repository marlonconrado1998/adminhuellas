var app = angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngWizard',
    'ngFileUpload',
    'ngImgCrop',
    'chart.js'
]);

app.run(["$rootScope", "$location",
    function ($rootScope, $location) {
        $rootScope.$on("$locationChangeStart",
            function () {

                if (sessionStorage.getItem("user") == null || sessionStorage.getItem("user") == undefined) {
                    $location.path("/Login");
                } else {
                    if ($location.path() == "/Login") {
                        // window.history.back();
                        $location.path("/Inicio");
                    }
                }
            });
    }]);