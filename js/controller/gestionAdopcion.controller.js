// Controlador para gestionar adopciones
app.controller("adopcionController", adopcionController);

// @Inject
adopcionController.$inject = ['gestionAnimalService', 'gestionAdopcionService', 'selectFactory'];

function adopcionController(gestionAnimalService, gestionAdopcionService, selectFactory) {

    var gestionAdopcion = this;
    gestionAdopcion.informacion_animal = {}; //Informacion de animal
    gestionAdopcion.informacion_animal.mensaje = "."; //Mensaje para usuario

    gestionAdopcion.ciudades = gestionAdopcionService.ciudades;
    gestionAdopcion.ciudades = gestionAdopcionService.ciudades;
    var AdopcionRegistrada;

    //Imprimir documento
    function showPrintWindow(contenido) {
        var ventana = window.open('', '');
        ventana.document.write(contenido);
        ventana.document.close();
        ventana.print();
        ventana.close();
        swal({
            type: 'question',
            title: '¿Desea hacer un testimonio?',
            text: 'A continuacion ingrese la opinio del adoptante y la foto del momento en que realiza la adopcion.',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then(function (result) {
            if(result.value){
                gestionAdopcion.registrarTestimonio();
            }
        });
    }

    // Verificar datos al entrar al panel de adopcion
    function verifyData() {
        gestionAdopcion.onVerificarAnimal(gestionAnimalService.informacion_animal.idanimal);
        if (typeof gestionAnimalService.informacion_animal.persona == 'object') {
            gestionAdopcion.onVerificarPersona(gestionAnimalService.informacion_animal.persona.identificacion);
        }
        gestionAnimalService.informacion_animal = {};
    }

    //Finalizar proceso de adopcion
    function finalizarAdopcion(datos, contenidoDocumento) {
        datos.animal = gestionAdopcion.informacion_animal.idanimal;
        gestionAdopcionService.guardarInformacion(datos)
            .then(function (response) {
                gestionAnimalService.animales = [];
                AdopcionRegistrada = true;
                swal({
                    type: 'success',
                    title: 'Proceso de adopcion realizado con exito!',
                    text: 'A continuacion debe realizar la impresion del documento de compromiso.',
                    showConfirmButton: true,
                    confirmButtonText: "Ok, imprimir",
                }).then(function (result) {
                    showPrintWindow(contenidoDocumento);
                });
            })
            .catch(function (error) {
                console.log("error", error);
            });
    }

    //Verificar informacion de un animal
    gestionAdopcion.onVerificarAnimal = function (animal) {
        if (animal != undefined && animal != null) {
            gestionAdopcion.informacion_animal = {};
            gestionAdopcion.informacion_animal.mensaje = "Cargando...";

            gestionAnimalService.buscarAnimal(animal)
                .then(function (response) {
                    if (response.data.idanimal != undefined || response.data.idanimal != null) {
                        gestionAdopcion.informacion_animal = response.data;

                        if (response.data.estado_actual != 'Patio (Adoptable)') {
                            gestionAdopcion.informacion_animal = {};
                            if (response.data.estado_actual == 'Adoptado') {
                                gestionAdopcion.informacion_animal.mensaje = "El animal con ese código ya fue adoptado.";
                            } else {
                                gestionAdopcion.informacion_animal.mensaje = "El animal no puede adoptarse porque tiene el estado: " + response.data.estado_actual.toUpperCase(); + ".";
                            }
                        } else {
                            gestionAnimalService.obtenerGaleriaAnimal(animal)
                                .then(function (response) {
                                    gestionAdopcion.informacion_animal.galeria = response.data;
                                    gestionAdopcion.informacion_animal.mensaje = "";
                                }).catch(function (error) {
                                });
                        }
                    } else {
                        gestionAdopcion.informacion_animal.mensaje = "No se encontró animal con ese código.";
                    }
                })
                .catch(function () {
                    gestionAdopcion.informacion_animal.mensaje = "No se encontró animal con ese código.";
                });
        }
    }

    //Verificar informacion de persona adoptante
    gestionAdopcion.onVerificarPersona = function (id) {
        if (id != undefined && id != null) {
            gestionAdopcionService.buscarPersona(id)
                .then(function (response) {
                    if (response.data != null) {
                        gestionAdopcion.adopcion = response.data;
                        gestionAdopcion.adopcion.telefono = parseInt(response.data.telefono);
                        gestionAdopcion.adopcion.telefono_oficina = parseInt(response.data.telefono_oficina);
                        gestionAdopcion.adopcion.identificacion = parseInt(response.data.identificacion);

                        angular.forEach(gestionAdopcion.ciudades, function (value) {
                            if (value.nombre == gestionAdopcion.adopcion.ciudad) {
                                gestionAdopcion.adopcion.ciudad = value;
                            }
                            if (value.nombre == gestionAdopcion.adopcion.ciudad_empresa) {
                                gestionAdopcion.adopcion.ciudad_empresa = value;
                            }
                        });
                    }
                }).catch(function (error) {
                });
        }
    }

    //Abre formulario testimonios de los adoptantes
    gestionAdopcion.registrarTestimonio = function () {
        swal({
            type: '',
            title: "Agregar testimonio",
            html: `<br><h4>Imagen para el testimonio</h4>
                <input type="file" id="imagen_testimonio" class="swal2-file"><br><br>
                <h4>Descripcion de testimonio</h4>
                <textarea id="descripcion_testimonio" cols="30" rows="10" class="swal2-textarea"></textarea>`,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: function (value) {
                var imagen = document.getElementById("imagen_testimonio");
                imagen = imagen.files[0];
                var descripcion = "";
                descripcion = $("#descripcion_testimonio").val();

                if (imagen == undefined || descripcion.trim() == "") {
                    swal.showValidationError("Obligatorio la imagen y la descripcion...");
                } else {
                    return { descripcion, imagen }
                }
            }
        }).then(function (result) {
            if (result.value) {
                var f = new FileReader();
                f.readAsDataURL(result.value.imagen);
                f.onloadend = function (e) {
                    result.value.imagen = e.target.result;
                    finalizarRegistroTestimonio(result.value);
                }
                result.value.adoptante = gestionAdopcion.adopcion.identificacion;
            }
        });
    }

    //Registra testimonios de los adoptantes
    function finalizarRegistroTestimonio(datos) {
        gestionAdopcionService.registrarTestimonio(datos).then(function (response) {
            swal({
                type: 'success',
                title: '¡Se ha guardado el testimonio exitosamente!',
                confirmButtonText: 'Ok'
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

    //Organiza datos de adopcion para imprimir
    gestionAdopcion.imprimirAdopcion = function (datos) {

        var _especie = typeof gestionAdopcion.informacion_animal.especie == "object" ? gestionAdopcion.informacion_animal.especie.nombre : gestionAdopcion.informacion_animal.especie;
        var _raza = typeof gestionAdopcion.informacion_animal.raza == "object" ? gestionAdopcion.informacion_animal.raza.nombre : gestionAdopcion.informacion_animal.raza;
        var _sexo = typeof gestionAdopcion.informacion_animal.sexo == "object" ? gestionAdopcion.informacion_animal.sexo.nombre : gestionAdopcion.informacion_animal.sexo;

        var cuerpo = document.getElementById("textoCompromiso").innerHTML;
        var logotipo = '<div style="display: flex; justify-content: center; opacity: 0.5"><img src="images/logo_main.svg" style="height:4.5cm"></div>';
        var contenido = logotipo +
            '<br><div style="font-family: Arial; margin: 0cm 1cm;">' +
            '<h3 style="text-align: center">ACTA DE COMPROMISO DE ADOPCIÓN</h3><br><br>' +
            '<p>Fecha: ' + new Date().toLocaleDateString() + '.</p>' +
            '<p>Yo, <strong>' + datos.nombre.toUpperCase() + " " + datos.apellido.toUpperCase() + '</strong> , con C.C ' + datos.identificacion + ', deseo recibir en adopción a:</p>' +
            '<p>Nombre actual del animal: ' + gestionAdopcion.informacion_animal.nombre + '.</p>' +
            '<p>Especie de animal: ' + _especie + '.</p>' +
            '<p>Raza del animal: ' + _raza + '.</p>' +
            '<p>Sexo: ' + _sexo + '.</p>' +
            '<p>Edad: ' + gestionAdopcion.informacion_animal.edad + ' años.</p>' +
            cuerpo +
            '<br><br><br><br><div style="width:10cm; margin:auto"><hr><p style="text-align:center">Firma del adoptante</p></div>' +
            '</div>';
        if (!AdopcionRegistrada) {
            swal({
                type: 'question',
                title: '¿Desea finalizar proceso de adopcion?',
                text: 'Al confirmar se registra en la base de datos la informacion.',
                showConfirmButton: true,
                showCancelButton: true,
                cancelButtonText: 'Si',
                confirmButtonText: 'No',
                confirmButtonColor: '#dc1010a8',
                cancelButtonColor: '#0000ff94'
            }).then(function (result) {
                if (!result.value) {
                    finalizarAdopcion(datos, contenido);
                }
            });
        } else {
            showPrintWindow(contenido);
        }
    }

    verifyData();

}