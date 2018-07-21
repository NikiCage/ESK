(function(){

	'use strict';

 	angular.module('app')
		.controller('indexCntr', indexCntr)
		.controller('appCntr', appCntr);

		function appCntr() {
			var vm = this;

		}

		function indexCntr($rootScope, $scope, $ionicSideMenuDelegate) {
			var vm = this;
			$scope.toggleLeft = function() {
				$ionicSideMenuDelegate.toggleLeft();
			};

			$scope.toggleRight = function() {
				$ionicSideMenuDelegate.toggleRight();
			};

			$rootScope.$on('hideFilter',function(){
				$scope.toggleRight();
			});

			$rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams){
                if($ionicSideMenuDelegate.isOpenLeft()) $ionicSideMenuDelegate.toggleLeft();
			});

		}

})();