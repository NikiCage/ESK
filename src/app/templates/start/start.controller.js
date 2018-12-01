(function(){
	'use strict';

	angular.module('app.start')
		.controller('startCntr', startCntr);

		function startCntr( $firebaseEvents) {
			var vm = this;
            console.log('startCntr');

			// Data
            vm.current = 'hair';

            $firebaseEvents.load().then(events => vm.events = events);
		}

})();