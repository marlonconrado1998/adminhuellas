app.controller('gestionAnimalCtrl', gestionAnimalCtrl);

gestionAnimalCtrl.$inject = ['$uibModal', 'gestionAnimalService', "selectFactory", "Upload"];

function gestionAnimalCtrl($uibModal, gestionAnimalService, selectFactory, Upload) {

    var gestionCtrl = this;
    //VARIABLES

    gestionCtrl.animales = gestionAnimalService.animales;
    gestionCtrl.optionsSelect = selectFactory.getAll();
    gestionCtrl.imagenesAnimalRegistro = [];
    gestionCtrl.mensajeListaAnimales = '';

    gestionCtrl.modal = function (animal) {
        gestionAnimalService.buscarAnimal(animal).then(function (response) {
            var modalInstance = $uibModal.open({
                templateUrl: 'pages/modal/modal_animales.html',
                size: 'lg',
                controller: 'ModalInstanceCtrl',
                backdrop: true,
                controllerAs: '$ctrl',
                resolve: {
                    items: function () {
                        return {
                            data: response.data,
                            method_gallery: gestionAnimalService.obtenerGaleriaAnimal,
                            method_update: gestionAnimalService.actualizarDatosAnimal
                        };
                    }
                }
            });
            modalInstance.result.then(function () { }, function (value) {
                if (typeof value != 'undefined') {
                    if (value.actualizar) {
                        gestionCtrl.onBuscarAnimal('');
                    }
                    gestionAnimalService.informacion_animal = value;
                }
            });
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

ModalInstanceCtrl.$inject = ['$uibModalInstance', 'items', 'selectFactory', 'Upload', 'gestionAnimalService'];

function ModalInstanceCtrl($uibModalInstance, items, selectFactory, Upload, gestionAnimalService) {

    var gestionCtrl = this;

    gestionCtrl.animal = items.data;
    var originalData;

    gestionCtrl.imageCrop = '';
    gestionCtrl.imageCroped = '';
    gestionCtrl.files = [];
    gestionCtrl.optionsSelect = selectFactory.getAll();
    gestionCtrl.editable = false;
    gestionCtrl.loading = false;

    // console.log(gestionCtrl.animal);
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
                items.method_update(gestionCtrl.animal)
                    .then(function (response) {
                        gestionCtrl.animal.actualizar = true;
                        $uibModalInstance.dismiss(gestionCtrl.animal);
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
        $uibModalInstance.dismiss(gestionCtrl.animal);
    };

    gestionCtrl.asignarAttr = function () {
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

    // Sube la imagen
    gestionCtrl.uploadImage = function (file, pos) {

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
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                gestionAnimalService.dropGaleria(file).then(function (response) {
                    gestionCtrl.deleteImage(pos);
                    swal({
                        type: 'success',
                        title: 'Imagen eliminada correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }).catch(function () { })
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
    function desPredeterminar () {
        for (var i = 0; i < gestionCtrl.animal.galeria.length; i++) {
            if (gestionCtrl.animal.galeria[i].predeterminado === 1) {
                gestionCtrl.animal.galeria[i].predeterminado = 0;
                return true;
            }
        }
    }

    gestionCtrl.asignarAttr();

}