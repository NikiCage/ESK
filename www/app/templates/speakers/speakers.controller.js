(function(){
	'use strict';

	angular.module('app.speakers')
		.controller('speakersCntr', speakersCntr);

		function speakersCntr($firebaseMasters, $fx) {
			var vm = this;

            $firebaseMasters.load().then(speakers => {
            	vm.speakers = $fx.pair(Object.values(speakers));
            });

		}

})();