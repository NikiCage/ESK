(function(){
	'use strict';

	angular.module('app.private', [])
        .config(router);

    function router($stateProvider) {
        $stateProvider.state('app.main.private', {
            url: '/private',
            views: {
                'content@app.main': {
                    controller: 'privateCntr as vm',
                    templateUrl: './app/templates/private/private.html'
                }
            },
            roles: ['Users'],
            authenticate: true
        });
    }

})();