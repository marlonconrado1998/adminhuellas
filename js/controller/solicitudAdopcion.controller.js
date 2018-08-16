app.controller('solicitudAdopcionController', solicitudAdopcionController)

/** @ngInject */
solicitudAdopcionController.$inject = ['$uibModal', 'solicitudService', '$location'];

function solicitudAdopcionController($uibModal, solicitudService, $location) {
    var solicitudCtrl = this;

    // VARIABLES
    solicitudCtrl.mensaje = '';
    solicitudCtrl.listaSolicitudes = solicitudService.listaSolicitudes;

    solicitudCtrl.obtenerListaSolicitudes = function () {
        solicitudCtrl.mensaje = "Cargando...";
        solicitudService.obtenerListaSolicitudes().then(function (response) {
            solicitudCtrl.listaSolicitudes = response.data;
            solicitudCtrl.mensaje = '';
            if (solicitudCtrl.listaSolicitudes.length == 0) {
                solicitudCtrl.mensaje = 'No hay solicitudes de adopcion para mostrar.';
            }
        }).catch(function (error) {
            solicitudCtrl.mensaje = 'Error al cargar la lista de solicitudes de adopciones.';
        });
    }

    solicitudCtrl.modal = function (solicitud) {
        solicitudService.obtenerInformacionAnimal(solicitud.idanimal)
            .then(function (response) {
                solicitud.animal = response.data;

                solicitudService.obtenerGaleriaAnimal(solicitud.idanimal)
                    .then(function (response) {
                        solicitud.animal.galeria = response.data;
                        
                        solicitudService.obtenerInformacionAdoptante(solicitud.identificacion_adoptante)
                            .then(function (response) {
                                solicitud.adoptante = response.data;

                                var modalInstance = $uibModal.open({
                                    templateUrl: 'pages/modal/modal_solicitudes.html',
                                    size: 'md',
                                    controller: 'modalSolicitudCtrl',
                                    backdrop: true,
                                    controllerAs: '$ctrl',
                                    resolve: {
                                        items: function () {
                                            return {
                                                data: solicitud
                                            };
                                        }
                                    }
                                });
                                modalInstance.result.then(function () { }, function (value) {
                                    console.log(value);
                                });

                            }).catch(function (error) {
                                console.log(error);
                            });
                    }).catch(function (error) {
                        console.log(error);
                    });
            }).catch(function (error) {
                console.log(error);
            });
    };

}

// ------------------------------------------------------------------------------------------------------
app.controller('modalSolicitudCtrl', modalSolicitudCtrl);

modalSolicitudCtrl.$inject = ['$uibModalInstance', 'items', "$http", 'selectFactory', 'Upload'];

function modalSolicitudCtrl($uibModalInstance, items, $http, selectFactory, Upload) {

    var solicitudCtrl = this;

    solicitudCtrl.solicitud = items.data;
    var originalData;

    solicitudCtrl.galeria = [];
    solicitudCtrl.editable = false;

    function startUpdate() {
        swal({
            type: 'question',
            title: '¿Seguro que quiere realizar estos cambios?',
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: 'Si',
            confirmButtonText: 'No',
            confirmButtonColor: '#dc1010a8',
            cancelButtonColor: '#0000ff94'
        }).then(function (result) {
            if (!result.value) {
                items.method_update(solicitudCtrl.solicitud)
                    .then(function (response) {
                        $uibModalInstance.dismiss(solicitudCtrl.solicitud);
                        swal({
                            type: 'success',
                            title: 'Datos Actualizados exitosamente!',
                            showConfirmButton: false,
                            timer: 1500
                        }).catch(function (error) {
                            console.log(error);
                        });
                    });
            }
        });
    }

    solicitudCtrl.registrarDatos = function () {
        if (_compare()) {
            startUpdate();
        } else {
            swal({
                type: 'warning',
                title: 'No hay cambios...',
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    solicitudCtrl.cerrar = function () {
        $uibModalInstance.dismiss("Modal closed");
    };

    solicitudCtrl.aceptarSolicitud = function () {
        //Swal con campos para dar respuesta por via email
    };

    solicitudCtrl.rechazarSolicitud = function () {
        //Swal con campos para dar respuesta por via email       
    };

    solicitudCtrl.asignarAttr = function () {
        // items.data.fecha_ingreso = new Date(items.data.fecha_ingreso);

        // items.method_gallery(solicitudCtrl.solicitud.idanimal)
        //     .then(function (response) {
        //         solicitudCtrl.solicitud.galeria = response.data;
        //     });

        // originalData = JSON.stringify(solicitudCtrl.solicitud);
    }

    solicitudCtrl.asignarAttr();

}