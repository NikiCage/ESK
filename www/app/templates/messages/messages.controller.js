(function(){
	'use strict';

	angular.module('app.messages')
		.controller('messagesCntr', messagesCntr);

		function messagesCntr($app, $scope, $interval, $api, $localStorage, $ionicLoading, $state, $stateParams, $crm) {
			var vm = this;

			// Data

			vm.title = "список сообщений";
            var iterator = false;
            if($app.active) start();

            function start() {
                if($app.connection()){
                    vm.messages = [];

                    $ionicLoading.show({
                        template: 'Загрузка диалогов...'
                    });

                    $api.chat.dialogs(function (data) {
                        $ionicLoading.hide();
                        if(!data.error){
                            console.log('first load');
                            if($localStorage.dialogs && (data.dialogs.length !== $localStorage.dialogs.length)){
                                //Update CRM on add new chat
                                console.log('crm update');
                                $crm.refresh();
                                $crm.init();
                            }
                            $localStorage.dialogs = data.dialogs;
                            var unread = 0;
                            for (var i = 0; i < $localStorage.dialogs.length; i++)
                                unread += +$localStorage.dialogs[i].unread;
                            $app.setBadge(unread);

                            if($stateParams.partner_id){
                                for (var i = 0; i < $localStorage.dialogs.length; i++) {
                                    var dialog = $localStorage.dialogs[i];
                                    if($stateParams.partner_id == dialog.partner_id) {
                                        $app.setBadge(unread - +dialog.unread);
                                        $state.go('app.main.chat',{id: dialog.id});
                                        return;
                                    }
                                }
                            }else {
                                vm.messages = $localStorage.dialogs;
                                iterator = $interval(function () {
                                    $api.chat.dialogs(function (data) {
                                        if(!data.error){
                                            console.log('iter load');
                                            console.log(data.dialogs.length);
                                            console.log($localStorage.dialogs.length);
                                            console.log(data.dialogs.length !== $localStorage.dialogs.length);
                                            if($localStorage.dialogs && (data.dialogs.length !== $localStorage.dialogs.length)){
                                                //Update CRM on add new chat
                                                console.log('crm update');
                                                $crm.refresh();
                                                $crm.init();
                                            }
                                            $localStorage.dialogs = data.dialogs;
                                            vm.messages = $localStorage.dialogs;
                                        }
                                    });
                                }, 7000);
                            }
                        }
                    });
                }
            }

            function stop() {
                if(iterator) $interval.cancel(iterator);
            }

            $scope.$on('$destroy', stop);
            $scope.$on('appResume', start);
            $scope.$on('appPause', stop);

			// Method

			vm.backToPrevState = backToPrevState;

			// Functions
			function backToPrevState() {
                if(iterator) $interval.cancel(iterator);
				$app.toMainState();
			}
		}

})();