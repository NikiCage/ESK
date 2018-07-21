(function(){
	'use strict';

	angular.module('app.result', [])
		.config(router);

		function router($stateProvider) {

			$stateProvider
				.state('app.main.result', {
					url: '/result',
					views : {
						'content@app.main': {
							controller : 'resultCntr as vm',
							templateUrl: './app/templates/result/result.html'
						}
					},
					resolve : {
						Tests : function ($tests) {
                            $tests.init();
							return $tests.getTests();
						}
					},
					roles: ['Users'],
					authenticate : true
				});

		}

})();