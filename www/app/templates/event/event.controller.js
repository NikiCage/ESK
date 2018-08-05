(function(){
	'use strict';

	angular.module('app.event')
		.controller('eventCntr', eventCntr);

		function eventCntr( $app, Event, $firebaseMasters) {
			let vm = this;
            console.log('eventCntr');

            if(!Event) $app.toMainState();

            vm.event = Event;

            const masters = Object.keys(Event.masters);

            if(masters && masters.length)
            	$firebaseMasters.loadMaster(masters[0]).then(master => vm.master = master);


		}

})();