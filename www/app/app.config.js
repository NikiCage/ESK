(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', config]);
        //.config(['$stateProvider', '$urlRouterProvider', 'uiMask.ConfigProvider', '$httpProvider', config]);

    function config($stateProvider, $urlRouterProvider, $httpProvider) {

        $urlRouterProvider.when('/', '/login');
        $urlRouterProvider.otherwise('/start');
        $stateProvider
            .state('app', {
                abstract: true,
                views   : {
                    'main@' : {
                        templateUrl: './app/app.html',
                        controller : 'appCntr as vm'
                    },
                    'toolbarNav@app': {
                        templateUrl: './app/templates/toolbar/toolbarNav.html',
                        controller: 'toolbarNavCntr as vm'
                    }
                },
                resolve : {
                    Ping : function($firebaseAuth, $firebaseEvents) {
                        return $firebaseAuth.authorize();
                    }
                }
            })
            .state('app.main', {
                abstract: true,
                views: {
                    'main@': {
                        templateUrl: "./app/templates/main.html",
                        controller: 'mainCntr as vm'
                    },
                    'navigation@app.main': {
                        templateUrl: "./app/templates/navigation/navigation.html",
                        controller: 'navigationCntr as vm'
                    },
                    'toolbarNav@app.main': {
                        templateUrl: './app/templates/toolbar/toolbarNav.html',
                        controller: 'toolbarNavCntr as vm'
                    },
                    'filter@app.main': {
                        templateUrl: './app/templates/filter/filter.html',
                        controller: 'filterCntr as vm'
                    }
                },
                authenticate : false
            });

        $httpProvider.interceptors.push(function ($injector) {
            return {
                'request': function (config) {
                    if (config.token) {
                        var $user = $injector.get('$user');
                        if(config.method == 'POST'){
                            if(!config.data) config.data = {};
                            config.params = null;
                            config.data.token = $user.token.get();
                        }else{
                            if(!config.params) config.params = {};
                            config.params.token = $user.token.get();
                        }
                    }
                    return config;
                },
                'response': function (response) {
                    //TODO: Вставить обработчик редиректа
                    /*if (response && response.data.error && response.data.error == 'GENERAL.ERRORS.UNAUTHORIZED') {
                        var $state = $injector.get('$state');
                        $state.go('app.login');
                        return response;
                    } else {
                        return response;
                    }*/
                    return response;
                },
                'responseError': function(rejection) {
                    if (rejection.status === -1) {
                        var $app = $injector.get('$app');
                        if(!$app.connection()) $app.toOfflineState();
                    }
                    //if (rejection.status === 401) {}
                    //if (rejection.status === 403) {}
                    return rejection;
                }
            };
        });

        //uiMaskConfigProvider.clearOnBlur(true);
       // uiMaskConfigProvider.clearOnBlurPlaceholder(true);
    }

})();