(function(){
	'use strict';

	angular.module('app.speaker', [])
        .config(router);

    function router($stateProvider) {
        $stateProvider.state('main.speaker', {
            url: '/speaker/:id',
            views: {
                'menuContent': {
                    controller: 'speakerCntr as vm',
                    templateUrl: './app/templates/speaker/speaker.html'
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true,
            resolve : {
                Speaker : function ($firebaseMasters, $stateParams) {
                    return $firebaseMasters.loadMaster($stateParams.id || false);
                }
            }
        })
    }

})();