(function(){
	'use strict';

	angular.module('app.event')
		.controller('eventCntr', eventCntr);

		function eventCntr( $app, Event, $firebaseMasters, $fx, $scope, $ionicModal, $ionicSlideBoxDelegate, $timeout, $localStorage, mapApiLoad, $firebaseAuth, $firebaseCities, $ionicPopup) {
			let vm = this;
            console.log('eventCntr');

            if(!Event) $app.toMainState();

            vm.event = Event;
            vm.sendRequest = sendRequest;

            const masters = Object.keys(Event.masters);

            if(masters && masters.length)
            	$firebaseMasters.loadMaster(masters[0]).then(master => vm.master = master);


            if(vm.event.photos && vm.event.photos.length){
                $scope.innergallery = vm.event.photos;
                $scope.newgallery = $fx.pair(vm.event.photos);
            }

            if(vm.event.dateStart > +new Date()) vm.allowOrder = true;

            //    ****** Code For Open Image In popup ******

            $ionicModal.fromTemplateUrl('app/templates/galleryimages.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
                $ionicSlideBoxDelegate.update();
                $scope.modal.hide();
            });

            $scope.firstslide = false;
            $scope.openModal = function(index) {
                $scope.firstslide = true;
                $scope.modal.show();
                $timeout(() => $ionicSlideBoxDelegate.slide(index), 100);
            };
            $scope.closeModal = function() {
                $scope.modal.hide();
            };

            const user = $firebaseAuth.getUser();
            $firebaseCities.load().then(function(cities) {
                vm.city = cities[user.city];
                console.log(vm.city);
            });


            if(!$localStorage.addressesCoordinates) $localStorage.addressesCoordinates = {};

            mapApiLoad( () => {
                if($localStorage.addressesCoordinates[vm.event.id]){
                    drawMap();
                }else{
                    if(vm.event.address){
                        ymaps.geocode(vm.city + ',' + vm.event.address, { results: 1 }).then(function (res) {
                            // Выбираем первый результат геокодирования.
                            const firstGeoObject = res.geoObjects.get(0);
                            // Задаем центр карты.
                            $localStorage.addressesCoordinates[vm.event.id] = firstGeoObject ? firstGeoObject.geometry.getCoordinates() : 'none';
                            drawMap();
                        }, function (err) {
                            $localStorage.addressesCoordinates[vm.event.id] = 'none';
                        });
                    }
                }
            });

            function drawMap(){
                vm.event.map = $localStorage.addressesCoordinates[vm.event.id];
                if(vm.event.map != 'none')
                    vm.event.marker = {
                        geometry:{
                            type : 'Point',
                            coordinates : vm.event.map
                        },
                        properties:{
                            iconContent : vm.event.address
                        }
                    };
                $scope.$$phase || $scope.$apply();
            }

            function sendRequest() {
                const confirmPopup = $ionicPopup.confirm({
                    title: 'Вы хотите посетить мероприятие?',
                    template: `В случае согласия, с Вами свяжется по телефону менеджер`,
                    cancelText: 'Отмена',
                    okText: 'OK'
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        const msg = `
                        Заявка на семинар
                        Пользователь с номером ${user.phoneNumber}
                        Хочет посетить семинар ${vm.event.title}
                       `;
                        $fx.mail(vm.org_email, msg);
                    }
                });
            }

		}

})();