(function(){
	'use strict';

	angular.module('app.navigation', [])
		.config(router);

    function router($stateProvider) {

        $stateProvider
            .state('app.main.profile', {
                url: '/profile',
                views : {
                    'content@app.main': {
                        controller : 'navigationCntr as vm',
                        templateUrl: './app/templates/navigation/profile.html'
                    }
                },
                roles: ['Respondents', 'Users'],
                authenticate : true
            });

    }

})();