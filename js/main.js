var app = angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngWizard'
]);

app.config(["$stateProvider", "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise("/Inicio");

        $stateProvider.state({
            name: 'chart',
            url: '/chart',
            templateUrl: 'pages/charts/chartjs.html'
        }).state({
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
        });  
    }
]);
