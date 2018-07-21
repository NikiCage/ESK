(function(){
	'use strict';

	angular.module('app.product')
		.controller('productCntr', productCntr);

		function productCntr(Object, $app, $icons, $ionicLoading, $api) {

			var vm = this;

			// Data

            vm.product = Object;
            vm.icons = {};
			vm.title   = vm.product.name;

			// Method
			
			vm.backToPrevState = $app.backToPrev;
			vm.getIcons = getIcons;

            vm.buyRequest = function () {
                $ionicLoading.show({
                    template: 'Отправка заявки...'
                });
                $api.market.buyRequest({good_id : vm.product.id}, function (data) {
                    $ionicLoading.hide();
                    if(!data.error){
                        $app.toast('LongBottom')('Ваш заказ успешно отправлен вашему консультанту');
                    }
                });
            };

			// Functions
            function getIcons(type, id) {
                $icons.getIcons(type,id).then(function (response) {
                    vm.icons[type] = response;
                });
            }
		}

})();