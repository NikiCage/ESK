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
                    authenticate : false
				})
				.state('app.login.consul', {
					url: '/consul',
					views : {
						'content@app': {
							controller: 'consulCntr as vm',
							templateUrl: "./app/templates/login/consul/consul.html"
						}
					},
                    roles: ['Respondents'],
                    online: true,
					authenticate : true
				})
				.state('app.login.dist', {
					url: '/dist',
					views : {
						'content@app': {
							controller: 'distCntr as vm',
							templateUrl: "./app/templates/login/dist/dist.html"
						}
					},
                    online: true
				});

		}

})();