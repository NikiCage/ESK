(function(){
	'use strict';

	angular.module('app.speakers')
		.controller('speakersCntr', speakersCntr);

		function speakersCntr($firebaseMasters) {
			var vm = this;

            $firebaseMasters.load().then(speakers => {
            	const $speakers = Object.values(speakers);
            	let _speakers = [];
                for (let i = 0; i < $speakers.length / 2; i++) {
                	let arr = [];
                    arr.push($speakers[i * 2]);
                    if($speakers[i * 2 + 1]) arr.push($speakers[i * 2 + 1]);
                    _speakers.push(arr);
                }
                console.log(_speakers);
            	vm.speakers = _speakers;
            });

		}

})();