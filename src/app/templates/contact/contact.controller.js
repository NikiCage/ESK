(function(){
	'use strict';

	angular.module('app.contact')
		.controller('contactCntr', contactCntr);

		function contactCntr( $app, $scope , $fx, $firebaseAuth, $firebaseCities, $localStorage, mapApiLoad) {
			let vm = this;
            console.log('contactCntr');

            $scope.tab = 'form-set';

            $scope.send = () => {
                const msg = `
                Имя: ${vm.name}
                Email: ${vm.email}
                Тема: ${vm.subject}
                Сообщение: ${vm.msg}
               `;
                $fx.mail(vm.org_email, msg, 'Сообщение от пользователя с формы обратной связи').then(send => {
                    if(send) $app.toast('Сообщение отправлено!');
                    vm.name = '';
                    vm.email = '';
                    vm.subject = '';
                    vm.msg = '';
                });
            };

            const user = $firebaseAuth.getUser();
            $firebaseCities.load().then(function(cities) {
                vm.city = cities[user.city];
            });

            $firebaseAuth.getOrg().then(org => {
                console.log(org);
                vm.address = org.address;
                vm.org_email = org.email;
                if(!$localStorage.addressesCoordinates) $localStorage.addressesCoordinates = {};

                mapApiLoad( () => {
                    if($localStorage.addressesCoordinates[org.email]){
                        drawMap();
                    }else{
                        if(org.address){
                            ymaps.geocode(vm.city + ',' + org.address, { results: 1 }).then(function (res) {
                                // Выбираем первый результат геокодирования.
                                const firstGeoObject = res.geoObjects.get(0);
                                // Задаем центр карты.
                                $localStorage.addressesCoordinates[org.email] = firstGeoObject ? firstGeoObject.geometry.getCoordinates() : 'none';
                                drawMap();
                            }, function (err) {
                                $localStorage.addressesCoordinates[org.email] = 'none';
                            });
                        }
                    }
                });

                function drawMap(){
                    vm.map = $localStorage.addressesCoordinates[org.email];
                    if(vm.map != 'none')
                        vm.marker = {
                            geometry:{
                                type : 'Point',
                                coordinates : vm.map
                            },
                            properties:{
                                iconContent : vm.address
                            }
                        };
                    console.log(vm.marker);
                    $scope.$$phase || $scope.$apply();
                }
			});
		}

})();