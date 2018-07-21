(function(){
	'use strict';

	angular.module('app.history', [])
		.config(router);

		function router($stateProvider) {

			$stateProvider
				.state('app.main.history', {
					url: '/history/:id',
					views : {
						'content@app.main': {
							controller : 'historyCntr as vm',
							templateUrl: './app/templates/history/history.html'
						}
					},
					resolve : {
						History : function ($tests, $stateParams) {
							$tests.init();
							return $tests.getHistory($stateParams.id || null);
						}
					},
					roles: ['Respondents', 'Users'],
					authenticate : true
				})
				.state('app.main.history_new', {
					url: '/history_new/:partner_id/:id',
					views : {
						'content@app.main': {
							controller : 'historyCntr as vm',
							templateUrl: './app/templates/history/history.html'
						}
					},
					resolve : {
						History : function ($tests, $stateParams) {
							$tests.init();
                            console.log($stateParams.partner_id);
                            console.log($stateParams.id);
							return $tests.getHistory($stateParams.partner_id, $stateParams.id);
						}
					},
					roles: ['Users'],
					authenticate : true
				});

		}

})();