app.controller('gestionAnimalCtrl', gestionAnimalCtrl);

gestionAnimalCtrl.$inject = ['$uibModal', 'gestionAnimalService', "selectFactory", "Upload", "$state"];

function gestionAnimalCtrl($uibModal, gestionAnimalService, selectFactory, Upload, $state) {

    var gestionCtrl = this;
    //VARIABLES

    gestionCtrl.animales = gestionAnimalService.animales;
    gestionCtrl.optionsSelect = selectFactory.getAll();
    gestionCtrl.imagenesAnimalRegistro = [];
    gestionCtrl.mensajeListaAnimales = '';
    

    gestionCtrl.modal = function (animal) {
        gestionAnimalService.buscarAnimal(animal).then(function (response) {
            $state.go('Dashboard.Info_animal', {
                data: response.data,
                method_gallery: gestionAnimalService.obtenerGaleriaAnimal,
                method_update: gestionAnimalService.actualizarDatosAnimal
            })
        });
    };

    gestionCtrl.registrarAnimal = function (animal) {
        var url = 'api_gestionAnimal.php/registrarAnimal';
        animal.imagenes = gestionCtrl.imagenesAnimalRegistro;
        gestionAnimalService.registrarAnimal(url, animal)
            .then(function (response) {
                swal({
                    position: 'top-end',
                    type: 'success',
                    title: animal.nombre + ' ha sido registrado!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }).catch(function (error) {
                console.log(error);
            });
    }

    gestionCtrl.uploadMultipleFiles = function (files) {
        var existe = false;
        if (gestionCtrl.imagenesAnimalRegistro.length + files.length <= 5) {
            angular.forEach(files, function (file) {
                angular.forEach(gestionCtrl.imagenesAnimalRegistro, function (value) {
                    var b64;
                    Upload.base64DataUrl(file).then(function (response) {
                        b64 = response;
                        if (value.image == b64) {
                            alert("Ya fue agregada esa imagen.");
                            existe = true;
                        }
                    });
                });
                if (!existe) {
                    Upload.base64DataUrl(file).then(function (response) {
                        gestionCtrl.imagenesAnimalRegistro.push({
                            "image": response,
                            "name": file.name
                        });
                    });
                }
            });
        } else {
            alert("Error: Maximo 5 fotos por animal");
        }
    };

    gestionCtrl.onDeleteImage = function (position_image) {
        gestionCtrl.imagenesAnimalRegistro.splice(position_image, 1)
    }

    gestionCtrl.onShowImage = function (position_image) {
        var aux = gestionCtrl.imagenesAnimalRegistro[position_image];
        gestionCtrl.imagenesAnimalRegistro[position_image] = gestionCtrl.imagenesAnimalRegistro[gestionCtrl.imagenesAnimalRegistro.length - 1];
        gestionCtrl.imagenesAnimalRegistro[gestionCtrl.imagenesAnimalRegistro.length - 1] = aux;
    }

    gestionCtrl.onCropImage = function (position_image) {

    }

    gestionCtrl.onBuscarAnimal = function (refresh) {
        if (refresh == undefined && gestionCtrl.animales.length == 0) {
            gestionCtrl.mensajeListaAnimales = "Cargando...";
            gestionAnimalService.obtenerListaAnimales()
                .then(function (response) {
                    if (angular.isArray(response.data)) {
                        gestionAnimalService.animales = response.data;
                        gestionCtrl.animales = gestionAnimalService.animales;
                        if (gestionAnimalService.animales.length > 0) {
                            gestionCtrl.mensajeListaAnimales = "";
                        } else {
                            gestionCtrl.mensajeListaAnimales = "No hay animales para mostrar.";
                        }
                    }
                }).catch(function (error) {
                    console.error(error);
                    gestionCtrl.mensajeListaAnimales = "Hubo un error al cargar, intenta nuevamente.";
                });
        }

        if (refresh == '') {
            gestionCtrl.animales = [];
            gestionCtrl.onBuscarAnimal();
        }
    }

}

//Controller MODAL==============================================//
app.controller('ModalInstanceCtrl', ModalInstanceCtrl);

ModalInstanceCtrl.$inject = ['selectFactory', 'Upload', 'gestionAnimalService', '$stateParams', '$location'];

function ModalInstanceCtrl(selectFactory, Upload, gestionAnimalService, $stateParams, $location) {


    var gestionCtrl = this;
    var originalData;
    var items = $stateParams;

    gestionCtrl.animal = items.data;
    gestionCtrl.imageCrop = '';
    gestionCtrl.imageCroped = '';
    gestionCtrl.files = [];
    gestionCtrl.optionsSelect = selectFactory.getAll();
    gestionCtrl.editable = false; // En true permite modificar los datos del animal
    gestionCtrl.loading = false; // Muestra un loader al estar en true
    gestionCtrl.sesiones = []; // Lista de sesiones
    gestionCtrl.sesion = []; // Sesión seleccionada de la historia médica
    gestionCtrl.items = []; // Items de una historia médica
    gestionCtrl.list_valor_item = []; // Valor de item
    gestionCtrl.controlQuerys = false; // Controla que no se vuelva a hacer la misma consulta
    gestionCtrl.valorItem = {}; // Controla que no se vuelva a hacer la misma consulta
    gestionCtrl.permitido = gestionCtrl.animal.estado_actual == 'Adoptado' ||
        gestionCtrl.animal.estado_actual == 'Fallecido' ? false : true;

    gestionCtrl.onAgregarValorItem = function (option, valor) {
        gestionCtrl.list_valor_item.push(option);
    };

    function startUpdate() {
        swal({
            type: 'question',
            title: '¿Seguro que quiere realizar estos cambios?',
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Si',
            cancelButtonColor: '#dc1010a8',
            confirmButtonColor: '#0000ff94',
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return items.method_update(gestionCtrl.animal)
                    .then(function (response) {
                        gestionCtrl.animal.actualizar = true;
                        if (response.code == "OK") {
                            return true;
                        } else {
                            throw new Error();
                        }
                    }).catch(function (error) {
                        swal.showValidationError("Error, intentalo nuevamente...");
                        return false;
                    });
            }
        }).then(function (result) {
            if (result.value) {

                // $uibModalInstance.dismiss(gestionCtrl.animal);
                swal({
                    type: 'success',
                    title: 'Datos Actualizados exitosamente!',
                    showConfirmButton: false,
                    timer: 1500

                });
            }
        });
    }

    function _compare() {
        var datos = JSON.parse(originalData);
        for (var attr in gestionCtrl.animal) {
            if (typeof gestionCtrl.animal[attr] == 'object') {
                if (attr != "galeria") {
                    if (gestionCtrl.animal[attr].nombre != datos[attr].nombre) {
                        return true;
                    }
                }
            } else {
                if (gestionCtrl.animal[attr] != datos[attr]) {
                    return true;
                }
            }
        }
        return false;
    }

    gestionCtrl.registrarDatos = function () {
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

    gestionCtrl.addImages = function (images) {
        if (gestionCtrl.files.length >= 6) {
            return false;
        }
        Upload.base64DataUrl(images).then(function (imagesB64) {
            var iter = imagesB64.length;
            while (iter--) {
                if (gestionCtrl.files.length < 6) {
                    gestionCtrl.files.push(imagesB64[iter]);
                }
            }
        });
    }

    gestionCtrl.updateImage = function (index, imageCroped) {
        gestionCtrl.files[index] = imageCroped;
    }

    gestionCtrl.deleteFile = function (pos) {
        gestionCtrl.files.splice(pos, 1);
    };

    gestionCtrl.deleteImage = function (pos) {
        // gestionCtrl.files.splice(getPosicion(animal.id), 1);
        gestionCtrl.animal.galeria.splice(pos, 1);
    }

    gestionCtrl.previewImage = function (file) {
        var view = open();
        view.document.write("<img src='" + file + "'>")
    }

    gestionCtrl.cerrar = function () {
        gestionAnimalService.informacion_animal = gestionCtrl.animal;
        // $uibModalInstance.dismiss(gestionCtrl.animal);
    };

    gestionCtrl.asignarAttr = function () {

        if (!gestionCtrl.animal.idanimal) {
            $location.path('Dashboard/animales')
        } else {
            items.data.fecha_ingreso = new Date(items.data.fecha_ingreso);

            angular.forEach(gestionCtrl.optionsSelect.estados, function (value) {
                if (value.nombre == gestionCtrl.animal.estado_actual) {
                    gestionCtrl.animal.estado_actual = value;
                    return;
                }
            });
            angular.forEach(gestionCtrl.optionsSelect.razas, function (value) {
                if (value.nombre == gestionCtrl.animal.raza) {
                    gestionCtrl.animal.raza = value;
                    return;
                }
            });
            angular.forEach(gestionCtrl.optionsSelect.especies, function (value) {
                if (value.nombre == gestionCtrl.animal.especie) {
                    gestionCtrl.animal.especie = value;
                    return;
                }
            });
            angular.forEach(gestionCtrl.optionsSelect.colores, function (value) {
                if (value.nombre == gestionCtrl.animal.color) {
                    gestionCtrl.animal.color = value;
                    return;
                }
            });

            items.method_gallery(gestionCtrl.animal.idanimal)
                .then(function (response) {
                    gestionCtrl.animal.galeria = response.data;
                });

            originalData = JSON.stringify(gestionCtrl.animal);
        }
    }

    // Sube la imagen
    gestionCtrl.uploadImage = function (file, pos) {
        if (!gestionCtrl.animal.galeria) return false;
        if (gestionCtrl.animal.galeria.length >= 5) {
            swal({
                type: 'warning',
                title: 'Cantidad máxima de imágenes alcanzada',
                showConfirmButton: false,
                timer: 1500
            });
            return false;
        }
        var image = {
            file: file,
            idanimal: gestionCtrl.animal.idanimal,
            iduser: JSON.parse(sessionStorage.getItem("user")).identificacion,
            fecha: new Date()
        }
        gestionCtrl.loading = true;
        gestionAnimalService.subirImagen(image).then(function (response) {
            gestionCtrl.deleteFile(pos);
            gestionCtrl.loading = false;
            swal({
                type: 'success',
                title: 'Imagen cargada correctamente',
                showConfirmButton: false,
                timer: 1500
            });
            searchGalery();
        }).catch(function () { });
    }

    // Busca la galería del animal
    function searchGalery() {
        gestionAnimalService.buscarGaleria(gestionCtrl.animal.idanimal).then(function (response) {
            gestionCtrl.animal.galeria = response.data;
        }).catch(function () { })
    }


    gestionCtrl.dropGalery = function (file, pos) {
        if (file.predeterminado == 1) {
            swal({
                type: 'warning',
                title: 'No puede eliminar la imagen predeterminada',
                showConfirmButton: false,
                timer: 1500
            });
            return false;
        }
        swal({
            title: '¿Estás seguro?',
            text: "Esta imagen será eliminada",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            showLoaderOnConfirm: true,
            preConfirm: function () {
                return gestionAnimalService.dropGaleria(file)
                    .then(function (response) {
                        gestionCtrl.animal.actualizar = true;
                        if (response.code == "OK") {
                            return true;
                        } else {
                            throw new Error();
                        }
                    }).catch(function (error) {
                        swal.showValidationError("Error, intentalo nuevamente...");
                        return false;
                    });
            }
        }).then((result) => {
            if (result.value) {
                gestionCtrl.deleteImage(pos);
                swal({
                    type: 'success',
                    title: 'Imagen eliminada correctamente',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }

    gestionCtrl.predeterminarGalery = function (file) {
        var data = {
            idanimal: gestionCtrl.animal.idanimal,
            idgaleria: file.id
        }

        gestionAnimalService.predeterminarGaleria(data).then(function (response) {
            desPredeterminar();
            file.predeterminado = 1;
            swal({
                type: 'success',
                title: 'La imagen ha sido preterminada correctamente',
                showConfirmButton: false,
                timer: 1500
            });
        }).catch(function () { })
    }

    // Busca entre la galeria la imagen predeterminada y la despredetermina
    function desPredeterminar() {
        for (var i = 0; i < gestionCtrl.animal.galeria.length; i++) {
            if (gestionCtrl.animal.galeria[i].predeterminado === 1) {
                gestionCtrl.animal.galeria[i].predeterminado = 0;
                return true;
            }
        }
    }

    gestionCtrl.prepararImpresionSessiones = function () { }

    // Busca todas las sesiones que ha tenido un animal
    gestionCtrl.onMostrarSesiones = function () {
        gestionAnimalService.mostrarSesiones(gestionCtrl.animal.idanimal).then(function (resp) {
            if (angular.isArray(resp) && resp) {
                gestionCtrl.sesiones = resp;
            }
        }).catch(function (error) {
            console.error(error);
        });
    }

    // Busca la sesión seleccionada de la lista de sesiones
    gestionCtrl.onMostrarSesion = function (sesion) {
        gestionAnimalService.mostrarSesion(sesion.idsesion, gestionCtrl.animal.especie.id).then(function (resp) {
            if (resp) {
                gestionCtrl.sesion = resp;
                gestionCtrl.sesion.observacion = sesion.observacion;
                gestionCtrl.mostrarSesion = true;
            }
        }).catch(function (error) {
            console.error(error);
        })
    }

    // Agrega una nueva sesión a la historia médica
    gestionCtrl.onAddSesion = function (sesion) {

        var checks = getChecks();
        sesion.checks = checks;
        sesion.idanimal = gestionCtrl.animal.idanimal;

        gestionAnimalService.agregarSesion(sesion).then(function (resp) {
            if (resp) {
                gestionCtrl.onMostrarSesiones();
                swal({
                    position: 'top-end',
                    type: 'success',
                    title: 'La sesión se ha agregado correctamente',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }).catch(function (error) {
            console.error(error);
        });
    }

    // Busca la lista los valores de los items de la historia médica
    gestionCtrl.onBuscarValoresItem = function () {
        gestionAnimalService
            .buscarValorItem(gestionCtrl.animal.especie.id)
            .then(function (resp) {
                if (resp && angular.isArray(resp)) {
                    gestionCtrl.items = resp;
                }
            })
            .catch(function (error) {
                console.error(error);
            })
    }

    // Método que ejecuta  métodos relacionados con las historias clínicas 
    gestionCtrl.onExectQuerys = function () {
        if (gestionCtrl.controlQuerys == true) return false;
        gestionCtrl.onBuscarValoresItem();
        gestionCtrl.onMostrarSesiones();
        gestionCtrl.controlQuerys = true;
    }

    // Busca los valores items chequeados al agregar una sesion de historia médica
    function getChecks() {
        var listChecks = [];
        gestionCtrl.items.forEach(function (item) { // Recorre la lista de items
            item.valorItem.forEach(function (valorItem) { // Recorre la lista de valorres de cada item
                if (valorItem.check) { // Valida que el valor item esté seleccionado
                    valorItem.iditem = item.iditem;
                    listChecks.push(valorItem); // Agrega el item
                };
            });
        });
        return listChecks;
    }

    gestionCtrl.generarHistoria = function () {
        gestionAnimalService
            .getHistoriaMedica(gestionCtrl.animal.idanimal)
            .then(function (resp) {
                gestionCtrl.historia_medica = resp.data;
                // gestionCtrl.show_print = true;
                showModalPrint();
            })
            .catch(function (error) {
                console.error(error);
            })
    }

    function showModalPrint() {
        $("#print_medic_history").toggleClass("d-none report_panel");
    }

    gestionCtrl.printHistory = function () {
        window.print();
    }

    gestionCtrl.closePrintHistory = function () {
        showModalPrint();
    }

    gestionCtrl.asignarAttr();
}