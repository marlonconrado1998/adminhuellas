app.controller("adopcionController", adopcionController);

adopcionController.$inject = ['gestionAnimalService', 'gestionAdopcionService', 'selectFactory'];

function adopcionController(gestionAnimalService, gestionAdopcionService, selectFactory) {

    var gestionAdopcion = this;
    gestionAdopcion.informacion_animal = {};
    gestionAdopcion.informacion_animal.mensaje = ".";
    
    gestionAdopcion.ciudades = selectFactory.getCiudades();
    var AdopcionRegistrada;

    function showPrintWindow(contenido) {
        var ventana = window.open('', '');
        ventana.document.write(contenido);
        ventana.document.close();
        ventana.print();
        ventana.close();
    }

    function verifyData() {
        if (typeof gestionAnimalService.informacion_animal == 'object') {
            gestionAdopcion.informacion_animal = gestionAnimalService.informacion_animal;
            gestionAdopcion.onVerificarAnimal(gestionAnimalService.informacion_animal.idanimal);
            gestionAnimalService.informacion_animal = {};
        }
    }

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

    gestionAdopcion.onVerificarAnimal = function (animal) {
        if (animal != undefined) {
            gestionAdopcion.informacion_animal = {};
            gestionAdopcion.informacion_animal.mensaje = "Cargando...";

            gestionAnimalService.buscarAnimal(animal)
                .then(function (response) {
                    if(response.data.idanimal != undefined || response.data.idanima != null){
                        gestionAdopcion.informacion_animal = response.data;
    
                        if (response.data.estado_actual == 'Adoptado') {
                             gestionAdopcion.informacion_animal = {};
                            gestionAdopcion.informacion_animal.mensaje = "El animal con ese código ya fue adoptado.";
                        } else if (response.data.estado_actual == 'Cuarentena') {
                        gestionAdopcion.informacion_animal = {};
                        gestionAdopcion.informacion_animal.mensaje = "El animal se encuentra actualmente en cuarentena.";
                         } else if (response.data.estado_actual == 'Patio (No adoptable)') {
                             gestionAdopcion.informacion_animal = {};
                        gestionAdopcion.informacion_animal.mensaje = "El animal se encuentra actualmente en patio pero no esta listo para una adopcion.";
                        } else {
                            gestionAnimalService.obtenerGaleriaAnimal(animal)
                                .then(function (response) {
                                    gestionAdopcion.informacion_animal.galeria = response.data;
                                    gestionAdopcion.informacion_animal.mensaje = "";
                                }).catch(function(error){
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

    gestionAdopcion.onVerificarPersona = function (id) {
        if (id != undefined) {
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