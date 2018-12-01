(function(){
	'use strict';

	angular.module('app.offline')
		.controller('offlineCntr', offlineCntr);

		function offlineCntr( $app) {
			var vm = this;

			// Data
			vm.refresh = $app.returnToState;
            vm.exit = $app.exit;
            vm.toMainState = $app.toMainState;
		}
})();