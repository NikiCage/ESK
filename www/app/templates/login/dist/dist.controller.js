(function(){
	'use strict';

	angular.module('app.login')
		.controller('distCntr', distCntr);

		function distCntr($app, $ionicLoading, $auth, $user) {
			var vm = this;

			// Method

            vm.backToPrevState = $app.backToPrev;
			vm.submit = submit;
			vm.phone = $user.phone.get();

			// Functions

			function submit() {
				if (!vm.login) return false;
				if (!vm.password) return false;

                $ionicLoading.show({
                    template: 'Авторизация'
                });

                $auth.login(vm.login, vm.password, vm.remember).then(function(response){
                    console.log('$auth.login.then');
                    $ionicLoading.hide();
                }).catch(function () {
                    console.log('$auth.login.catch');
                    $ionicLoading.hide();
                    $app.toast('LongBottom')('Неверный логин или пароль. Попробуйте еще раз');
                });
			}
		}
})();