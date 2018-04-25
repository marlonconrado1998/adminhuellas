/*******************************************************************
 * Programador: Marlon Conrado González		                       *
 * Fecha: 14/04/2018                                                *
 * Descripción: Directiva para generar formularios a partir de JSON *
 *******************************************************************/

(function() {
    'use strict';
    app.directive('ngForm', ngForm);

    function ngForm() {
        return {
            restrict: 'A',
            scope: {
                "arrayForm": "=",
                "submitFunction": "="
            },
            templateUrl: 'js/directive/formFundation/formTemplate.html',
            link: function(scope) {

                if (angular.isDefined(scope.submitFunction) && !angular.isArray(scope.arrayForm)) {
                    console.error("array-form is not an array");
                    return false;
                }
                if (angular.isDefined(scope.submitFunction) && !angular.isFunction(scope.submitFunction)) {
                    console.error("submit-function is not a function");
                    return false;
                }

                scope.send = function() {
                    var json = {};
                    angular.forEach(scope.arrayForm, function(obj) {
                        json[obj['name']] = obj['value'];
                    });
                    scope.submitFunction(json);
                }
            }
        };
    }
})();