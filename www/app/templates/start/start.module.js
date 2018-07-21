(function(){
	'use strict';

	angular.module('app.start', [])
        .config(router);

    function router($stateProvider) {
        $stateProvider.state('app.main.start_test', {
            url: '/start_test',
            views: {
                'content@app.main': {
                    controller: 'startCntr as vm',
                    templateUrl: './app/templates/start/test.html'
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true
        }).state('app.main.start', {
            url: '/start',
            views: {
                'content@app.main': {
                    controller: 'startCntr as vm',
                    templateUrl: './app/templates/start/catalog.html'
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true
        })
    }

})();