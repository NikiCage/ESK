(function(){
	'use strict';

	angular.module('app.speakers', [])
        .config(router);

    function router($stateProvider) {
        $stateProvider.state('main.speakers', {
            url: '/speakers',
            views: {
                'menuContent': {
                    controller: 'speakersCntr as vm',
                    templateUrl: './app/templates/speakers/speakers.html'
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true
        })
    }

})();