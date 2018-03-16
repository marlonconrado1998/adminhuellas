var app = angular.module('app', [
    'ui.router'
]);

<<<<<<< HEAD
app.config(["$stateProvider", "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider) {
        
        $urlRouterProvider.otherwise("/Inicio");

        $stateProvider.state({
            name: 'form',
            url: '/form',
            templateUrl: 'pages/forms/basic_elements.html'
        }).state({
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
            templateUrl: 'pages/widgets.html'
        });  
    }
]);
