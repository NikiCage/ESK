(function(){
	'use strict';

	angular.module('app.messages', [])
		.config(router);

		function router($stateProvider) {

			$stateProvider
	        .state('app.main.messages', {
	        	url: '/messages/:partner_id',
	        	views : {
	        		'content@app.main': {
	        			controller : 'messagesCntr as vm',
	        			templateUrl: './app/templates/messages/messages.html'
	        		}
	        	},
                roles: ['Respondents', 'Users'],
                authenticate : true
	        });

		}

})();