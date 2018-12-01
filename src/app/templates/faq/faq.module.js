(function(){
	'use strict';

	angular.module('app.faq', [])
        .config(router);

    function router($stateProvider) {
        $stateProvider.state('main.faq', {
            url: '/faq',
            views: {
                'menuContent': {
                    controller: 'faqCntr as vm',
                    templateUrl: './app/templates/faq/faq.html'
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true
        })
    }

})();