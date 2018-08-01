(function(){
	'use strict';

	angular.module('app.start', [])
        .config(router);

    function router($stateProvider) {
        $stateProvider.state('main.start', {
            url: '/start',
            views: {
                'menuContent': {
                    controller: 'startCntr as vm',
                    templateUrl: './app/templates/start/start.html'
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true
        })
    }

})();