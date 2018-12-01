(function(){
	'use strict';

	angular.module('app.chat')
		.controller('chatCntr', chatCntr);

		function chatCntr($scope, $rootScope, $app, $stateParams, $interval, $localStorage, $api, $user, $ionicLoading, $state, $ionicScrollDelegate) {

			var vm = this;
            vm.user = false;
            $rootScope.crmUser = false;
            var iterator = false, keyboard, currentUserId = $user.getId();

            if($app.active) start();
            function start() {
                if($app.connection()){
                    vm.dialog = [];

                    $ionicLoading.show({
                        template: 'Загрузка сообщений...'
                    });

                    $api.chat.messages({dialog_id : $stateParams.id}, function (data) {
                        $ionicLoading.hide();
                        if(!data.error){
                            if(!$localStorage.chat) $localStorage.chat = [];
                            $localStorage.chat[$stateParams.id] = data;
                            $rootScope.crmUser = {
                                partner_id : data.partner_id,
                                name : data.name
                            };
                            parseMsg();
                            $api.chat.newMessages(function (data) {
                                if (data && !data.error) {
                                    $app.setBadge(data.result);
                                }
                            });
                            $ionicScrollDelegate.scrollBottom();
                            //$('.b-chat__body').scrollTop($('.b-chat__body')[0]["scrollHeight"]);
                            iterator = $interval(function () {
                                var data = {dialog_id : $stateParams.id};
                                //if(vm.dialog.length) data.last_message_id = vm.dialog[vm.dialog.length - 1].id;
                                $api.chat.messages(data, function (data) {
                                    if(!data.error){
                                        if(!$localStorage.chat) $localStorage.chat = [];
                                        $localStorage.chat[$stateParams.id] = data;
                                        parseMsg();
                                    }
                                });
                            }, 3000);
                        }
                    });
                }
                if($app.getOS() == 'ios'){
                    var old_height = window.innerHeight;
                    $scope.checkHeight = function(){
                        var new_height = window.innerHeight;
                        var keyboard_height = (old_height - new_height) ;
                        $('.bar-footer').css('bottom', keyboard_height + 'px');
                        //keyboard_height = (keyboard_height + 50) ;
                        //$('.b-chat__body').css('bottom', keyboard_height + 'px');
                        //if(old_height != new_height)
                            //$('.b-chat__body').scrollTop($('.b-chat__body')[0]["scrollHeight"] - keyboard_height);
                    };
                    /*keyboard = $interval(function () {
                        $scope.checkHeight();
                    }, 300);*/
                }
            }

            function stop() {
                if(iterator) $interval.cancel(iterator);
                //if(keyboard) $interval.cancel(keyboard);
            }

			// Method

			vm.backToPrevState = backToPrevState;
			vm.goToRef = goToRef;
			vm.send = send;

			// Functions

            function goToRef(params){
                if(params){
                    switch (params.type){
                        case "survey_result" : $state.go('app.main.history_new', { partner_id : $rootScope.crmUser.partner_id, id : params.id }); break;
                    }
                }
            }
			
			function backToPrevState() {
                stop();
				$app.backToPrev();
			}

            $scope.$on('$destroy', stop);
            $scope.$on('appResume', start);
            $scope.$on('appPause', stop);

			function send(msg) {
				vm.msg = '';
				if (!msg) return;
				vm.dialog.push({
					text    : msg,
					date    : new Date(),
					side    : 'to'
				});

				$api.chat.send({ dialog_id : $stateParams.id, text : msg},function (data) {
                    $('.b-chat__body').scrollTop($('.b-chat__body')[0]["scrollHeight"]);
                });
			}

			function parseMsg() {
				var cache = $localStorage.chat[$stateParams.id];

				vm.dialog = cache.data.map(function(a, i){
				    if(currentUserId)
					    a.side = (a.author.id == currentUserId) ? 'to' : 'from';
				    else
                        a.side = (a.author.id == 'cl_' + $user.phone.get()) ? 'to' : 'from';
					a.date = new Date(Math.abs(a.add_date) * 1000);
					return a;
				});

				vm.dialog = vm.dialog.reverse();
			}

			/*$timeout(function() {
				$('.b-chat__body').scrollTop($('.b-chat__body')[0]["scrollHeight"]);
			}, 1000);*/

		}

})();