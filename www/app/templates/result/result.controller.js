(function(){
	'use strict';

	angular.module('app.result')
		.controller('resultCntr', resultCntr);

		function resultCntr(Tests, $app, $user) {

			var vm = this;

			// Data
			
			vm.title = "История подбора ароматов";
			vm.tests = Tests;

			vm.userId = $user.getId();

			// List

			vm.backToPrevState = $app.backToPrev;
		}

})();