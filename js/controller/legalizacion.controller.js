/**
 *@author: Neider Galofre Morales
 *@description: Controlador que permite gestionar las legalizaciones de adopcion.
 */

app.controller('legalizacionController', legalizacionController)

/** @ngInject */
legalizacionController.$inject = ['legalizacionService', 'solicitudService', '$uibModal'];

function legalizacionController(legalizacionService, solicitudService, $uibModal) {
    var legalizacionCtrl = this;

    // VARIABLES
    legalizacionCtrl.mensaje = '';
    legalizacionCtrl.listaLegalizaciones = legalizacionService.listaLegalizaciones;

    //Metodo para obtener la lista de las legalizaciones pendientes
    legalizacionCtrl.obtenerListaLegalizaciones = function () {
        legalizacionCtrl.mensaje = "Cargando...";
        legalizacionService.obtenerListaLegalizaciones().then(function (response) {
            legalizacionCtrl.listaLegalizaciones = response.data;
            legalizacionCtrl.mensaje = '';
            if (legalizacionCtrl.listaLegalizaciones.length == 0) {
                legalizacionCtrl.mensaje = 'No hay legalizaciones pendientes para mostrar.';
            }
        }).catch(function (error) {
            legalizacionCtrl.mensaje = 'Error al cargar la lista de legalizaciones pendientes.';
        });
    }

    //Modal para gestionar legalizaciones
    legalizacionCtrl.modal = function (datos) {
        var legalizacion = angular.copy(datos);
        solicitudService.obtenerInformacionAnimal(legalizacion.animal)
            .then(function (response) {
                legalizacion.animal = response.data;

                solicitudService.obtenerGaleriaAnimal(legalizacion.animal)
                    .then(function (response) {
                        legalizacion.animal.galeria = response.data;

                        solicitudService.obtenerInformacionAdoptante(legalizacion.adoptante)
                            .then(function (response) {
                                legalizacion.adoptante = response.data;

                                var modalInstance = $uibModal.open({
                                    templateUrl: 'pages/modal/modal_legalizacion.html',
                                    size: 'md',
                                    controller: 'modalLegalizacionCtrl',
                                    backdrop: true,
                                    controllerAs: '$ctrl',
                                    resolve: {
                                        items: function () {
                                            return {
                                                data: legalizacion,
                                                method: solicitudService.responderSolicitud
                                            };
                                        }
                                    }
                                });
                                modalInstance.result.then(function () { }, function (value) {
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
    }
}

//CONTROLADOR MODAL LEGALIZACIONES ================================================ 
app.controller('modalLegalizacionCtrl', modalLegalizacionCtrl);

modalLegalizacionCtrl.$inject = ['$uibModalInstance', 'items', 'gestionAnimalService', '$location'];

function modalLegalizacionCtrl($uibModalInstance, items, gestionAnimalService, $location) {

    var legalizacionCtrl = this;

    legalizacionCtrl.legalizacion_item = items.data;
    legalizacionCtrl.galeria = [];

    var msg = {
        name: "Fundacion huellas de amor",
        email: "customershuellas@gmail.com",
        subject: "Legalizacion de adopcion",
        body: '',
        to: ''
    }

    legalizacionCtrl.cerrar = function () {
        $uibModalInstance.dismiss("Modal closed");
    };

    //Confirmar una legalizacion 
    legalizacionCtrl.confirmarLegalizacion = function () {
        gestionAnimalService.informacion_animal = legalizacionCtrl.legalizacion_item.animal;
        gestionAnimalService.informacion_animal.persona = legalizacionCtrl.legalizacion_item.adoptante;
        $location.path("/Dashboard/adopcion");
        legalizacionCtrl.cerrar();
    }

    //Aplazar una legalizacion
    legalizacionCtrl.aplazarLegalizacion = function () {
        datos = legalizacionCtrl.legalizacion_item;
        swal({
            type: 'info',
            title: "Aplazar legalización",
            html: "<div>Escribe el lugar, la fecha y hora de encuentro para realizar la legalización de adopcion.</div>" +
                "<input type='text' class='swal2-input text-center' placeholder='Lugar de encuentro' id='lugar_encuentro' value='" + legalizacionCtrl.legalizacion_item.lugar + "'>" +
                "<div><span class='w-50 text-center text-gray float-left'>Fecha</span>" +
                "<span class='w-50 text-center text-gray float-left'>Hora</span></div>" +
                "<input type='date' class='swal2-input w-50 text-gray text-center' id='fecha_encuentro' value='" + legalizacionCtrl.legalizacion_item.fecha + "'>" +
                "<input type='time' class='swal2-input w-50 text-gray text-center' value='" + legalizacionCtrl.legalizacion_item.hora + "' id='hora_encuentro'>",
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
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
                    msg.body = 'Hola ' + datos.adoptante.nombre + ' ' + datos.adoptante.apellido + '.<br><br>' +
                        '<p>La solicitud con referencia ' + datos.referencia + ', que fue aceptada en la fecha ' + datos.fecha_aceptacion + ' a sido <strong>APLAZADA</strong>.</p><br>' +
                        '<span>¡Estos son los nuevos datos de encuentro.</span><br><br>' +
                        '<span><i>Lugar de encuentro: ' + data.lugar + '</i></span><br>' +
                        '<span><i>Fecha de encuentro: ' + data.fecha + '</i></span><br>' +
                        '<span><i>Hora de encuentro: ' + data.hora + '</i></span>';
                    msg.to = datos.adoptante.correo;
                    data.estado = 'Aceptada';
                    datos.estado = 'Aceptada';
                    data.referencia = datos.referencia;

                    return items.method({ msg, datos: data }).then(function (response) {
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
                legalizacionCtrl.cerrar();
                swal({
                    type: 'success',
                    title: '¡Solicitud aplazada!',
                    confirmButtonText: 'Ok'
                })
            }
        });
    };

    //Rechazar una legalizacion
    legalizacionCtrl.rechazarLegalizacion = function (datos) {
        datos = legalizacionCtrl.legalizacion_item;
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
                        '<p>La solicitud con referencia ' + datos.referencia + ', que fue aceptada el dia ' + datos.fecha_aceptacion + ' para realizar la legalizacion a sido <strong>CANCELADA</strong>.</p>' +
                        '<br><br><span><i>"' + value + '"</i></span>' +
                        '<br><br>Puedes realizar otro proceso de adopcion cuando gustes.';
                    msg.to = datos.adoptante.correo;
                    datos.estado = 'Rechazada';
                    datos.hora = "00:00";
                    datos.fecha = "0000-00-00";
                    datos.lugar = "";
                    return items.method({ msg, datos }).then(function (response) {
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
                legalizacionCtrl.cerrar();
                swal({
                    type: 'success',
                    title: '¡La solicitud a sido rechazada!',
                    confirmButtonText: 'Ok'
                });
            }
        });
    };
}