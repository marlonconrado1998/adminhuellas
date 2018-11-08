(function () {
    'use strict';

    app.component('fileUplaod', fileUplaod());

    function fileUplaod() {
        return {
            bindings: {
                addImg: "="
            },
            controller: ['Upload', function componentController(Upload) {

                var vm = this;

                // funciones
                vm.onSubmit = onSubmit;


                function onSubmit(image) {
                    Upload.base64DataUrl(image).then(function (image_b64) {
                        vm.image_preview = image_b64[0];
                        vm.addImg(image);
                    });
                }
            }],
            controllerAs: 'vm',
            templateUrl: 'js/components/file-upload/file-uplaod.html',
        }
    }

}());