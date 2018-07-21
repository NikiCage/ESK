(function () {
    'use strict';

    angular.module('app.test', [])
        .config(router);

    function router($stateProvider) {

        $stateProvider
            .state('app.main.test', {
                url: '/test',
                views: {
                    'content@app.main': {
                        controller: 'testCntr as vm',
                        templateUrl: './app/templates/test/test.html'
                    }
                },
                roles: ['Respondents', 'Users'],
                authenticate: true
            })
            .state('app.main.test.result', {
                url: '/result/:gender/:answer',
                views: {
                    'content@app.main': {
                        controller: 'testCntr as vm',
                        templateUrl: './app/templates/test/test.html'
                    }
                },
                roles: ['Respondents', 'Users'],
                authenticate: true
            });

    }

})();