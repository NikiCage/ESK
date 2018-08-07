(function(){

	'use strict';

 	angular.module('app')
		.controller('mainCntr', mainCntr);

		function mainCntr($app, $rootScope, $firebaseAuth, $scope, $ionicScrollDelegate) {
			let vm = this;

            vm.logout = $firebaseAuth.signOut;

            $rootScope.connection = $app.connection;

            var maindele = $ionicScrollDelegate.$getByHandle('mainScroll');

            $scope.mainscrolling = function() {
                var topscroll = maindele.getScrollPosition().top;
                var oncomblack = 300.0;
                var coloropacity = topscroll / oncomblack;
                $(".navClass ion-header-bar").css("background", "-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(1, 82, 101," + coloropacity + ")), color-stop(100%,rgba(255,255,255,0.00)))");
            };

            $scope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams) {
                    $(".navClass ion-header-bar").css("background", "-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(1, 82, 101," + 0 + ")), color-stop(100%,rgba(255,255,255,0.00)))");
                });

		}

})();