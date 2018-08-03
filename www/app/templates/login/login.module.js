(function(){
	'use strict';

	angular.module('app.login', [])
		.config(router);

		function router($stateProvider) {

			$stateProvider
				.state('app.login', {
					url: '/login',
					views : {
						'content': {
							controller: 'authCntr as vm',
							templateUrl: "./app/templates/login/auth/auth.html"
						}
					},
                    authenticate : false,
                    online: true
				});
		}

})();