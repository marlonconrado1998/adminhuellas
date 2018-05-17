app.config(["$stateProvider", "$urlRouterProvider", '$compileProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $compileProvider, $locationProvider) {

        $compileProvider.debugInfoEnabled(false);
        // $locationProvider.hashPrefix(".com");

        $urlRouterProvider.otherwise("/Inicio");

        $stateProvider.state({
            name: 'Inicio',
            url: '/Inicio',
            templateUrl: 'pages/inicio.html'
        }).state({
            name: 'animales',
            url: '/animales',
            templateUrl: 'pages/animales.html'
        }).state({
            name: 'adopcion',
            url: '/adopcion',
            templateUrl: 'pages/adopcion.html'
        }).state({
            name: 'historias',
            url: '/historias',
            templateUrl: 'pages/historias.html'
        }).state({
            name: 'login',
            url: '/login',
            templateUrl: 'pages/login.html'
        }).state({
            name: 'registro_animal',
            url: '/registro_animal',
            templateUrl: 'pages/registro_animal.html'
        });
    }
]);