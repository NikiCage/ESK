(function(){
	'use strict';

	angular.module('app.about', [])
        .config(router);

    function router($stateProvider) {
        $stateProvider.state('main.about', {
            url: '/about',
            views: {
                'menuContent': {
                    controller: 'aboutCntr as vm',
                    templateUrl: './app/templates/about/about.html'
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true
        })
    }

})();