(function(){
	'use strict';

	angular.module('app.category', [])
		.config(router);

		function router($stateProvider) {

			$stateProvider
				.state('app.main.category', {
					url: '/category/:id',
					views : {
						'content@app.main': {
							controller : 'categoryCntr as vm',
							templateUrl: './app/templates/category/category.html'
						}
					},
					resolve : {
						Category : function ($catalog, $stateParams) {
                            $catalog.init();
							return $catalog.getCategory($stateParams.id);
                        },
						Objects : function ($catalog, $stateParams) {
                            $catalog.init();
							return $catalog.getObjects($stateParams.id);
                        }
					},
                    roles: ['Respondents', 'Users'],
					authenticate : true
				});

		}

})();