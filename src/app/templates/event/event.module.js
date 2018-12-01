(function(){
	'use strict';

	angular.module('app.event', [])
        .config(router);

    function router($stateProvider) {
        $stateProvider.state('main.event', {
            url: '/event/:id',
            views: {
                'menuContent': {
                    controller: 'eventCntr as vm',
                    templateUrl: './app/templates/event/event.html'
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true,
            resolve : {
                Event : function ($firebaseEvents, $stateParams) {
                    return $firebaseEvents.loadEvent($stateParams.id || false);
                }
            }
        })
    }

})();