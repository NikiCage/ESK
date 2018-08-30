(function(){
	'use strict';

	angular.module('app.speakers')
		.controller('speakersCntr', speakersCntr);

		function speakersCntr($firebaseMasters, $fx) {
			var vm = this;
            vm.current = 'hair';
            $firebaseMasters.load().then(speakers => {
            	vm.speakers = $fx.pair($fx.ids(speakers));
            });

		}

})();