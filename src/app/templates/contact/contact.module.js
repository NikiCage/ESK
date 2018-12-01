(function(){
	'use strict';

	angular.module('app.contact', [])
        .config(router);

    function router($stateProvider) {
        $stateProvider.state('main.contact', {
            url: '/contact',
            views: {
                'menuContent': {
                    controller: 'contactCntr as vm',
                    templateUrl: './app/templates/contact/contact.html'
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true
        })
    }

})();