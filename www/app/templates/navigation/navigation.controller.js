(function(){
	'use strict';

	angular.module('app.navigation')
		.controller('navigationCntr', navigationCntr);

		function navigationCntr($app, $cordovaSocialSharing, $user, $auth, $avatar, $state) {
			var vm = this;
			// Data
			vm.showSubMenu = false;
			vm.withPhoto = $user.isInRoles('WithConsultant','Users');

			// Method
			vm.logout = $auth.logout;
			vm.share = share;
			vm.shareVia = shareVia;

			vm.fio = fio;
			vm.number = number;
			vm.consul = consul;

            vm.avatar = $app.isIOS() ? "./img/logo.png" : "./img/sidebar/logo.png";
            vm.cover = "./img/sidebar/header.png";

			function setAvatar(id){
                var avatar = $avatar(id, "background");

                if(avatar.src)
                    vm.cover = vm.avatar = avatar.src;

                if(avatar.promise)
                    avatar.promise.then(function (data) {
                        vm.cover = vm.avatar = data;
                    });
            }

            if($user.isInRole('Users')) setAvatar($user.getId());
            if($user.isInRole('WithConsultant')) setAvatar($user.getConsultantId());


			// Functions

			function fio() {
                if($user.isInRole('Users')) return $user.getUser().fname + ' ' + $user.getUser().lname + ' ';
                if($user.isInRole('WithConsultant')) return $user.getConsultant().fname + ' ' + $user.getConsultant().lname + ' ';
				return "";
            }

			function number() {
                if($user.isInRole('Users')) return $user.getUser().login;
                if($user.isInRole('WithConsultant')) return $user.getConsultant().number;
				return "";
            }

			function consul() {
			    if($user.isInRole('WithConsultant'))
                    $state.go('app.login.consul');
            }

			function share() {
                var options = {
                    message: 'Привет! Скачай мобильное приложение Armelle - твой путеводитель по миру ароматов.\n' +
                    '\n' +
                    'Пройди ароматест!  Узнай, какой аромат подходит именно тебе. ',
                    url: 'http://m.armelle.world/' + $user.getUser().login
                };
                $cordovaSocialSharing
                    .shareWithOptions(options)
                    .then(function(result) {
                        //TODO: Вставить вызов попапа об успешном шаринге
                        // Success!
                    }, function(err) {
                        // An error occured. Show a message to the user
                    });
            }

            function getMessage() {
                return 'Привет! Скачай мобильное приложение Armelle - твой путеводитель по миру ароматов.\n' +
                    '\n' + 'Пройди ароматест!  Узнай, какой аромат подходит именно тебе. '
            }

            function getLink() {
                return 'http://m.armelle.world/' + $user.getUser().login
            }

			function shareVia(messager) {
                var message = getMessage(), link = getLink();
                $cordovaSocialSharing.canShareVia(messager, message, null, null, link).then(function () {
                    $cordovaSocialSharing.shareVia(messager, message, null, null, link)
                        .then(function(result) {
                            // Success!
                        }, function(err) {});
                },function (error) {
                    $app.toast('LongBottom')('Приложение недоступно');
                });
                var options = {
                    message: getMessage(),
                    url: getLink()
                };
                $cordovaSocialSharing
                    .shareWithOptions(options)
                    .then(function(result) {
                        //TODO: Вставить вызов попапа об успешном шаринге
                        // Success!
                    }, function(err) {
                        // An error occured. Show a message to the user
                    });
            }
		}

})();
