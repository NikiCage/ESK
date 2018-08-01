(function(){
	'use strict';

	angular.module('app.login')
		.controller('authCntr', authCntr);

		function authCntr($app, $scope, $firebaseAuth, $ionicLoading, $firebaseCities) {
			let vm = this, captcha, $confirm;
			// Data

			if(!$app.connection()){
                $app.connection.alert();
			}
			// Method
			vm.phoneFocus = phoneFocus;
			vm.checkPhone = checkPhone;
			vm.checkCode = checkCode;

			vm.request = request;
			vm.confirm = confirm;
			vm.anonimAuth = anonimAuth;

            vm.backToPrevState = $app.toMainState;
            $firebaseCities.load().then(cities => {vm.cities = cities; $scope.$$phase || $scope.$apply()});
            $scope.$on("reCAPTCHA.init", (e, _captcha) => captcha = _captcha);

			// Functions

            function phoneFocus(e) {
                setTimeout(function () {
                    e.target.setSelectionRange(1,1);
                },1);
            }
            function checkPhone() {
                if(vm.phone && (vm.phone+'').length == 11) return true;
                return false;
            }
            function checkCode() {
            	if(vm.code && (vm.code+'').length == 6) return true;
                return false;
            }

			function request() {
                $ionicLoading.show({
                    template: 'Отправка кода по смс...'
                });

                console.log('+' + vm.phone);
                $firebaseAuth.request('+' + vm.phone, captcha).then(confirmationResult => {
                    $ionicLoading.hide();
                    vm.codeShow = true;
                    $confirm = confirmationResult;
                    return null;
                }).catch(() => {
                    $ionicLoading.hide();
                    $app.toast('LongBottom')('Ошибка при отправке. Попробуйте еще раз');
                });
			}

			function anonimAuth() {
                $ionicLoading.show({
                    template: 'Подождите...'
                });

                $firebaseAuth.anonymous().then(function(response){
                    $ionicLoading.hide();
                }).catch(function () {
                    $ionicLoading.hide();
                    $app.toast('LongBottom')('Ошибка при авторизации. Попробуйте еще раз');
                });
			}

			function confirm() {
                $ionicLoading.show({
                    template: 'Проверка кода...'
                });
                $confirm.confirm(vm.code+'').then(response => {
                    console.log(response);
					$ionicLoading.hide();
                    $firebaseAuth.authorizeWithCity(vm.city);
                    $firebaseAuth.setUser(response.user)
				}).catch(() => {
                    $ionicLoading.hide();
                    $app.toast('LongBottom')('Ошибка при проверке. Попробуйте еще раз');
                });
			}

		}

})();