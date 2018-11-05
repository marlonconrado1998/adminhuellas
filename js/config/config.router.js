
app.config(["$stateProvider", "$urlRouterProvider", '$compileProvider', '$locationProvider',
    function ($stateProvider, $urlRouterProvider, $compileProvider, $locationProvider) {

        $compileProvider.debugInfoEnabled(false);
        // $locationProvider.hashPrefix(".com");

        $urlRouterProvider.otherwise("/Dashboard/Inicio");

        $urlRouterProvider.when("/info_animal",
            ['$match', '$stateParams', '$state', '$location',
                function ($match, $stateParams, $state, $location) {
                    if (!$stateParams.method_gallery || !$stateParams.method_update) {
                        $state.transitionTo($state, $match, false);
                        $location.path('/Dashboard/animales');
                    }
                }
            ]);

        $stateProvider.state({
            name: 'Dashboard',
            url: '/Dashboard',
            templateUrl: 'pages/dashboard.html',
            abstract: true
        }).state({
            name: 'Login',
            url: '/Login',
            templateUrl: 'pages/login.html'
        }).state({
            name: 'Dashboard.Inicio',
            url: '/Inicio',
            templateUrl: 'pages/inicio.html'
        }).state({
            name: 'Dashboard.animales',
            url: '/animales',
            templateUrl: 'pages/animales.html'
        }).state({
            name: 'Dashboard.adopcion',
            url: '/adopcion',
            templateUrl: 'pages/adopcion.html'
        }).state({
            name: 'Dashboard.historias',
            url: '/historias',
            templateUrl: 'pages/historias.html'
        }).state({
            name: 'Dashboard.registro_animal',
            url: '/registro_animal',
            templateUrl: 'pages/registro_animal.html'
        }).state({
            name: 'Dashboard.Solicitudes',
            url: '/Solicitudes',
            templateUrl: 'pages/solicitudes.html'
        }).state({
            name: 'Dashboard.Reportes',
            url: '/Reportes',
            templateUrl: 'pages/reportes.html'
        }).state({
            name: 'Dashboard.Info_animal',
            url: '/info_animal',
            templateUrl: 'pages/modal/modal_animales.html',
            params: {
                data: {},
                method_gallery: function () { },
                method_update: function () { }
            },
            controller: "ModalInstanceCtrl",
            controllerAs: "$ctrl"
        }).state({
            name: 'Dashboard.Legalizaciones',
            url: '/Legalizaciones',
            templateUrl: 'pages/legalizacion.html'
        });
    }
]);

function toggleMenuSidebar() {
    $('.sidebar-offcanvas').toggleClass('active');
    $('.divClose').fadeToggle();
}

$(document).ready(function () {
    $(document).on('click', '.divClose, .itemClose, #bt-toggle-menu', toggleMenuSidebar);
});

