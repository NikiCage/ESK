(function ()
{
    'use strict';

    angular
        .module('app')
        .run(runBlock);

    /** @ngInject */
    function runBlock( firebaseConst) {
        firebase.initializeApp(firebaseConst);
    }
})();