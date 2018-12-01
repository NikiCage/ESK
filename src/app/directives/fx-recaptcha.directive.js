(function ()
{
    'use strict';

    angular
        .module('app')
        .directive('fxRecaptcha', fxRecaptchaDirective);

    /** @ngInject */
    function fxRecaptchaDirective($timeout, $app)
    {
        return {
            restrict: 'A',
            compile : function (tElement) {
                console.log('fxRecaptcha');
                return function postLink(scope, iElement, iAttrs) {
                    $app.getOS() == 'browser' && $timeout(() => {
                        const applicationVerifier = new firebase.auth.RecaptchaVerifier(iElement[0]);
                        applicationVerifier.render();
                        scope.$emit("reCAPTCHA.init", applicationVerifier);

                        scope.$on('$destroy', applicationVerifier.clear);
                    }, 0);
                };
            }
        };
    }
})();