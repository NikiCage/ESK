(function(){
	'use strict';

	angular.module('app.start', [])
        .config(router);

    function router($stateProvider) {
        $stateProvider.state('app.main.start_nails', {
            url: '/start_nails',
            views: {
                'content@app.main': {
                    controller: 'startCntr as vm',
                    templateUrl: './app/templates/start/nails.html'
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true
        }).state('app.main.start', {
            url: '/start',
            views: {
                'content@app.main': {
                    controller: 'startCntr as vm',
                    templateUrl: './app/templates/start/hair.html'
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true
        })
    }

})();