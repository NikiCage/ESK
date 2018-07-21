(function(){
	'use strict';

	angular
		.module('app.catalog', [])
		.config(router);

    function router($stateProvider) {
        $stateProvider.state('app.main.catalog', {
            url: '/catalog',
            views: {
                'content@app.main': {
                    controller: 'catalogCntr as vm',
                    templateUrl: './app/templates/catalog/catalog.html'
                }
            },
            resolve : {
                Categories : function ($catalog) {
                    $catalog.init();
                    return $catalog.categories();
                }
            },
            roles: ['Respondents', 'Users'],
            authenticate : true
        })
	}

})();