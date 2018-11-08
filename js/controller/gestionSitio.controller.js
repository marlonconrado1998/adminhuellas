(function () {
    'use strict';

    app.controller('SitioController', SitioController)

    /** @ngInject */
    SitioController.$inject = ['sitioService', 'Upload'];

    function SitioController(sitioService, Upload) {

        var vm = this;

        // variables
        vm.site = {};
        vm.metadata = [];

        // funciones 
        vm.onSubmit = onSubmit;
        vm.onAddImgp = onAddImgp;
        vm.getMetaData = getMetaData;

        // Ejecuta funciones
        getMetaData();

        function onSubmit(image) {
            sitioService.setMetadata(vm.metadata).then(function (resp) {
                if (resp.data) {
                    swal({
                        type: 'success',
                        title: "Cambios guardados correctamente",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }).catch(function (error) {
                // console.log(error)
            })
        }

        function onAddImgp(imgp) {
            Upload.upload({
                url: 'http://localhost/startadmin_back-end/webapis/api/api_webSite.php/imgp', //S3 upload url including bucket name
                method: 'POST',
                data: {
                    imgp: imgp[0]
                }
            }).then(function (resp) {
                swal({
                    type: 'success',
                    title: "Cambios guardados correctamente",
                    showConfirmButton: false,
                    timer: 1500
                });
            }).catch(function (error) {
                // console.log(error)
            })
        }

        function getMetaData() {
            sitioService.getMetadata().then(function (resp) {
                vm.metadata = resp.data;
            }).catch(function (error) {
                // console.log(error)
            })
        }
    }

}());