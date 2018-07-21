(function(){
	'use strict';

	angular.module('app.selection', [])
		.config(router);

	    function router($stateProvider) {

	       $stateProvider
	        .state('app.main.selection', {
	        	url : '/selection?filter',
	        	views : {
	        	  'content@app.main' : {
	        	    controller : 'selectionCntr as vm',
	        	    templateUrl: './app/templates/selection/selection.html'
	        	  }
	        	},
                resolve : {
                    Objects : function ($catalog) {
                        $catalog.init();
                        return $catalog.getObjectsWithCollection();
                    }
                },
                roles: ['Respondents', 'Users'],
                authenticate : true
	        })
	        
	    }

})();