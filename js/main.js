var app = angular.module('app', [
    'ui.router'
]);

app.config(function ($stateProvider) {
    $stateProvider.state({
    	name: 'form',
        url: '/form',
        templateUrl: 'pages/forms/basic_elements.html'
    }).state({
        name: 'chart',
        url: '/chart',
        templateUrl: 'pages/charts/chartjs.html'
    }).state({
        name: 'animales',
        url: '/animales',
        templateUrl: 'pages/widgets.html'
    });    	
});