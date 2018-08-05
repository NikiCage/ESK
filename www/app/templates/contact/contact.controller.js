(function(){
	'use strict';

	angular.module('app.contact')
		.controller('contactCntr', contactCntr);

		function contactCntr( $scope ) {
			var vm = this;
            console.log('contactCntr');

            $scope.tab = 'form-set';
		}

})();