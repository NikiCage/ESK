(function(){
	'use strict';

	angular.module('app.offline', [])
        .config(router);

    function router($stateProvider) {
        $stateProvider.state('app.offline', {
            url: '/offline',
            views: {
                'content@app': {
                    controller: 'offlineCntr as vm',
                    templateUrl: './app/templates/offline/offline.html'
                }
            }
        })
    }

})();