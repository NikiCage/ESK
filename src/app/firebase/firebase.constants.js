(function ()
{
    'use strict';

    const firebaseConst = {
            apiKey: "AIzaSyB7NvAee7SDChxGLLnHWVTYrG-AOf6pWC8",
            authDomain: "esk-2c1b5.firebaseapp.com",
            databaseURL: "https://esk-2c1b5.firebaseio.com",
            projectId: "esk-2c1b5",
            storageBucket: "esk-2c1b5.appspot.com",
            messagingSenderId: "1055896560175"
        };
    angular
        .module('app')
        .constant('firebaseConst', firebaseConst);
})();
