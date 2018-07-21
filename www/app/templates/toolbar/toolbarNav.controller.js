(function(){
	'use strict';

	angular.module('app.toolbarNav')
        .directive('bottomBar', bottomBar)
		.controller('toolbarNavCntr', toolbarNavCntr);

		function toolbarNavCntr($scope, $ionicPopup, $crm, $api, $app) {
			var vm = this, allows = {};

			// Data
			
			vm.click = click;
			vm.editUser = editUser;
			vm.allowEdit = allowEdit;

			// Method
			
			function click(e) {
				if ( $(e.target).hasClass('b-toolbar-nav') ) {
					$(e.target).hide();
				}
				if ( $(e.target).hasClass('b-toolbar-nav__item') ) {
					$('.b-toolbar-nav').hide();
				}
			}

			function allowEdit(partner_id) {
                return allows[partner_id] ? true : allows[partner_id] = $crm.checkContact(partner_id);
            }

            function editUser(user) {
                $crm.getContact(user.partner_id, user.name).then(function (contact) {
                    $scope.data = {};
                    $scope.data.userName = contact.name;

                    $ionicPopup.show({
                        template: '<div class="b-input-wraper b-input-wraper_small-margin">' +
                        '<input id="userName" type="text" class="b-input-wraper__input fz-17" ng-model="data.userName" ng-class="{\'md-valid\' : data.userName}">' +
                        '<label for="userName" class="b-input-wraper__label fz-17">Новое имя пользователя</label>' +
                        '<span class="b-input-wraper__line"></span></div>',
                        title: 'Редактирование контакта',
                        //subTitle: 'Please use normal things',
                        scope: $scope,
                        buttons: [
                            {
                                text: '<b>Сохранить</b>',
                                type: 'button-positive',
                                onTap: function(e) {
                                    if (!$scope.data.userName || name == $scope.data.userName) {
                                        e.preventDefault();
                                    } else {
                                        return $scope.data.userName;
                                    }
                                }
                            },
                            { text: 'Отмена' }
                        ]
                    }).then(function(res) {
                        if(res) {
                            contact.name = res;
                            $api.crm.save({item : contact},function (data) {
                                if(data.error) return false;
                                if(data.item){
                                    angular.forEach(data.item, function (value, key) {
                                        contact[key] = value;
                                    });
                                }
                                $app.toast('LongBottom')('Контакт успешно изменен');
                            });
                        }
                    });
                });

            }
			
		}

		/** @ngInject */
		function bottomBar()
		{
			return {
				replace  : true,
				restrict  : 'E',
				transclude: true,
				templateUrl : 'app/templates/toolbar/bottomBar.html',
				link: function (scope, element, attrs) {

				}
			};
		}

})();