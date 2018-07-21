(function(){
	'use strict';

	angular.module('app.login')
		.controller('consulCntr', consulCntr);

		function consulCntr($app, $ionicLoading, $api, $auth, defaultConst, $rootScope, $state, $user) {

			var vm = this;

			if($user.isInRole('Anonymous')){
				$rootScope.returnToState = $rootScope.toState;
				$rootScope.returnToStateParams = $rootScope.toStateParams;
				$state.go('app.login');
			}
            if($user.isInRole('Users') ||
				($rootScope.prevState && $rootScope.prevState.name == 'app.login' && $rootScope.inRole('WithConsultant'))){
                $state.go('app.main.start');
            }

            // Data
			vm.anonymous = $user.isInRole('WithoutConsultant');
			vm.consultantEnable = false;

			// Method

			vm.backToPrevState = $app.backToPrev;

			vm.search  = search;
			vm.send    = send;

			// Functions

			/**
			 * Поищем консультантика
			 * @return {null}
			 */
			function search() {
				if (!vm.number) return false;

				$api.network.getConsultant({ number : vm.number }, function(response){
					if (response.user) {
						if ( response.user.fname && response.user.lname) {
							vm.consultantEnable = true;

							vm.fio    = response.user.fname + ' ' + response.user.sname + ' ' + response.user.lname;
							vm.avatar = defaultConst.apiUrl + 'users/avatar/' + response.user.id + '_320_150.jpg';
						}
						vm.userId = response.user.id;
					}
				});
			}

			function send() {
                $ionicLoading.show({
                    template: 'Назначение консультанта'
                });
                $auth.consultant(vm.userId, vm.name).then(function(response){
                    $ionicLoading.hide();
                    $state.go('app.main.profile');
				}).catch(function () {
                    $ionicLoading.hide();
                    $app.toast('LongBottom')('Ошибка при назначении консультанта. Попробуйте еще раз');
                });
			}
		}

})();