(function(){
	'use strict';

	angular.module('app.start')
		.controller('startCntr', startCntr);

		function startCntr( $app, $localStorage, $api, $user, $interval, $scope, $firebaseEvents) {
			var vm = this;
            console.log('startCntr');

			// Data
            vm.welcome = $user.isInRole('WithoutConsultant');
            vm.unread = 0;
            vm.current = 'hair';

            $firebaseEvents.load().then(events => vm.events = events);
            var iterator = false;

            function start() {
                if ($app.connection()) {
                    $api.chat.newMessages(function (data) {
                        if(data && !data.error) {
                            $app.setBadge(data.result);
                        }
                        iterator = $interval(function () {
                            if ($app.connection()) {
                                $api.chat.newMessages(function (data) {
                                    if (data && !data.error) {
                                        $app.setBadge(data.result);
                                    }
                                });
                            }
                        }, 7000);
                    });
                }
            }

            function stop() {
                if (iterator) $interval.cancel(iterator);
            }

            if(!$user.isInRole('WithoutConsultant')){
                if($localStorage.unread) $app.setBadge($localStorage.unread);

                start();
                $scope.$on('$destroy', stop);
                $scope.$on('appResume', start);
                $scope.$on('appPause', stop);
            }
		}

})();