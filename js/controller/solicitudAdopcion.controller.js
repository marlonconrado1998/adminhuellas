/**
 *@author: Neider Galofre Morales
 *@description: Controlador para gestionar las solicitudes de adopciones. 
 */
app.controller('solicitudAdopcionController', solicitudAdopcionController)

/** @ngInject */
solicitudAdopcionController.$inject = ['$uibModal', 'solicitudService', '$location'];

function solicitudAdopcionController($uibModal, solicitudService, $location) {
    var solicitudCtrl = this;

    // VARIABLES
    solicitudCtrl.mensaje = '';
    solicitudCtrl.listaSolicitudes = solicitudService.listaSolicitudes;

    //Obtiene un listado de solicitudes pendientes.
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

    //Modal para gestionar las solicitudes de adopcion
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
                                                data: solicitud,
                                                method: solicitudService.responderSolicitud
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
    //VARIABLES
    solicitudCtrl.solicitud = items.data;
    solicitudCtrl.galeria = [];
    solicitudCtrl.editable = false;

    var msg = {
        name: "Fundacion huellas de amor",
        email: "customershuellas@gmail.com",
        subject: "Respuesta de solicitud de adopcion",
        body: '',
        to: ''
    }

    //Funcion para actualizar datos de adoptante
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

    //Funcion para registrar los datos
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

    //Funcion para aceptar solicitudes
    solicitudCtrl.aceptarSolicitud = function () {
        datos = solicitudCtrl.solicitud;
        swal({
            type: 'info',
            title: "Respuesta de aceptación de solicitud",
            html: "<div>Escribe el lugar, la fecha y hora de encuentro para realizar la legalización de adopcion.</div>" +
                "<input type='text' class='swal2-input text-center' placeholder='Lugar de encuentro' id='lugar_encuentro'>" +
                "<div><span class='w-50 text-center text-gray float-left'>Fecha</span>" + "<span class='w-50 text-center text-gray float-left'>Hora</span></div>" +
                "<input type='date' class='swal2-input w-50 text-gray text-center' id='fecha_encuentro'>" +
                "<input type='time' class='swal2-input w-50 text-gray text-center' value='08:00' id='hora_encuentro'>",
            showCancelButton: true,
            confirmButtonText: 'Finalizar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: function () {
                var data = {
                    hora: document.getElementById("hora_encuentro").value,
                    fecha: document.getElementById("fecha_encuentro").value,
                    lugar: document.getElementById("lugar_encuentro").value.trim(),
                }
                if (data.fecha && data.lugar && data.hora) {
                    msg.body = 'Hola ' + datos.nombre_adoptante + '.<br><br>' +
                        '<p>La solicitud con referencia ' + datos.referencia + ', que realizaste el dia ' + datos.fecha_solicitud + ' a sido <strong>APROBADA</strong>.</p><br>' +
                        '<span>¡Felicitaciones! Ahora debemos legalizar la adopcion.</span><br><br>' +
                        '<span><i>Lugar de encuentro: ' + data.lugar + '</i></span><br>' +
                        '<span><i>Fecha de encuentro: ' + data.fecha + '</i></span><br>' +
                        '<span><i>Hora de encuentro: ' + data.hora + '</i></span>';
                    msg.to = datos.adoptante.correo;
                    data.estado = 'Aceptada';
                    datos.estado = 'Aceptada';
                    data.referencia = datos.referencia;
                    return items.method({msg, datos: data}).then(function (response) {
                        if (response) {
                            return true;
                        } else {
                            throw new Error();
                        }
                    }).catch(function () {
                        swal.showValidationError("Error, intentalo nuevamente...");
                        return false;
                    });
                } else {
                    swal.showValidationError("Por favor, llena todos los campos.");
                    return false;
                }
            }
        }).then(function (result) {
            if (result.value) {
                solicitudCtrl.cerrar();
                swal({
                    type: 'success',
                    title: '¡Solicitud aceptada!',
                    confirmButtonText: 'Ok'
                })
            }
        });
    };

    //Funcion para rechazar las solicitudes de adopcion
    solicitudCtrl.rechazarSolicitud = function (datos) {
        datos = solicitudCtrl.solicitud;
        swal({
            type: 'warning',
            title: "Respuesta de rechazo de solicitud",
            input: "textarea",
            showCancelButton: true,
            confirmButtonText: 'Finalizar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: function (value) {
                value = value.trim();
                if (value.length > 20) {
                    msg.body = 'Hola ' + datos.nombre_adoptante + '.<br><br>' +
                        '<p>La solicitud con referencia ' + datos.referencia + ', que realizaste el dia ' + datos.fecha_solicitud + ' a sido <strong>RECHAZADA</strong>.</p>' +
                        '<span><i>' + value + '</i></span>';
                    msg.to = datos.adoptante.correo;
                    datos.estado = 'Rechazada';
                    datos.hora = "00:00";
                    datos.fecha = "0000-00-00";
                    datos.lugar = "";
                    return items.method({msg, datos}).then(function (response) {
                        if (response) {
                            return true;
                        } else {
                            throw new Error();
                        }
                    }).catch(function () {
                        swal.showValidationError("Error, intentalo nuevamente...");
                        return false;
                    });
                } else {
                    swal.showValidationError("El mensaje debe contener minimo 20 caracteres.");
                    return false;
                }
            }
        }).then(function (result) {
            if (result.value) {
                solicitudCtrl.cerrar();
                swal({
                    type: 'success',
                    title: '¡Solicitud rechazada!',
                    confirmButtonText: 'Ok'
                });
            }
        });
    };
}