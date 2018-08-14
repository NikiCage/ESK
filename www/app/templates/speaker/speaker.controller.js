(function(){
	'use strict';

	angular.module('app.speaker')
		.controller('speakerCntr', speakerCntr);

		function speakerCntr($app, Speaker, $fx, $scope, $ionicModal, $ionicSlideBoxDelegate, $timeout, $ionicPopup, $firebaseRequests, $firebaseAuth, $firebaseCities) {
			let vm = this;
            console.log('speakerCntr');

			if(!Speaker) $app.toMainState();

            vm.speaker = Speaker;

            if(vm.speaker.photos && vm.speaker.photos.length){
                $scope.innergallery = vm.speaker.photos;
                $scope.newgallery = $fx.pair(vm.speaker.photos);
			}

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
            let requests = [], cities, apply = {};
            $firebaseRequests.load().then(function(data) {
                requests = data;
            });
            $firebaseCities.load().then(function(data) {
                cities = data;
            });
			
            vm.canAddRequest = canAddRequest;
            vm.addRequest = addRequest;

            function canAddRequest(id) {
            	if(apply[id]) return false;
                if (angular.isUndefined(user.city) || !user.uid) {
                    return false;
                }
                if (! requests || !requests[Speaker.id]) {
                    return true;
                }
                if (requests[Speaker.id][user.uid] && requests[Speaker.id][user.uid][id]) {
                    return false;
                } else {
                    return true;
                }
            }
            function getCityName(id) {
                if (!cities) {
                    return '';
                }
                return cities[id];
            }

            function addRequest(id) {
            	const city = getCityName(user.city);
                const confirmPopup = $ionicPopup.confirm({
                    title: 'Приглашение спикера',
                    template: `Вы уверены, что хотите пригласить спикера в город ${city}? 
                    В случае проведения мероприятия с этим спикером, организатор свяжеться с Вами по телефону`,
                    cancelText: 'Отмена',
                    okText: 'OK'
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        $firebaseRequests.addRequest(Speaker.id, id);
                        apply[id] = true;
                    }
                });

            }

            $ionicModal.fromTemplateUrl('app/templates/seminar.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.seminar_modal = modal;
                $scope.seminar_modal.show();
                $scope.seminar_modal.hide();
            });

            $scope.openSeminarModal = function(seminar) {
                $scope.seminar = seminar;
                $scope.seminar_modal.show();
            };
            $scope.closeSeminarModal = function() {
                $scope.seminar_modal.hide();
            };
		}

})();