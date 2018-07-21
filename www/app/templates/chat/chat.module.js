(function(){
	'use strict';

	angular.module('app.chat', [])
		.config(router);

		function router($stateProvider) {

			$stateProvider
				.state('app.main.chat', {
					url: '/chat/:id?data',
					views : {
						'content@app.main': {
							controller : 'chatCntr as vm',
							templateUrl: './app/templates/chat/chat.html'
						}
					},
                    roles: ['Respondents', 'Users'],
					online: true,
                    authenticate : true
				});
		}

})();