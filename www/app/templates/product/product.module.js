(function(){
	'use strict';

	angular.module('app.product', [])
		.config(router);

		function router($stateProvider) {

			$stateProvider
                .state('app.main.product', {
                    url : '/product/:id',
                    views : {
                        'content@app.main': {
                            controller : 'productCntr as vm',
                            templateUrl: './app/templates/product/product.html'
                        }
                    },
                    resolve : {
                        Object : function ($catalog, $stateParams) {
                            $catalog.init();
                            return $catalog.getObject($stateParams.id);
                        }
                    },
                    roles: ['Respondents', 'Users'],
                    authenticate : true
                });

		}

})();