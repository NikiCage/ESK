(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', config]);
        //.config(['$stateProvider', '$urlRouterProvider', 'uiMask.ConfigProvider', '$httpProvider', config]);

    function config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('/', '/login');
        $urlRouterProvider.otherwise('/start');
        $stateProvider
            .state('app', {
                abstract: true,
                controller: 'appCntr as vm',
                templateUrl: "./app/app.html",
                resolve : {
                    Ping : function($firebaseAuth, $firebaseEvents) {
                        console.log('test');
                        return $firebaseAuth.authorize();
                    }
                }
            })
            .state('app.main', {
                abstract: true,
                templateUrl: "./app/templates/main.html",
                controller: 'mainCntr as vm',
                authenticate : false
            });


        //uiMaskConfigProvider.clearOnBlur(true);
       // uiMaskConfigProvider.clearOnBlurPlaceholder(true);
    }

})();