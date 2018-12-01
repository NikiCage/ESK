(function(){
	'use strict';

	angular.module('app.about')
		.controller('aboutCntr', aboutCntr);

		function aboutCntr($scope, $ionicScrollDelegate) {
			var vm = this;
            console.log('aboutCntr');

            $scope.showDetails = "dontshow";
            $scope.moredetails = "Узнать больше";
            $scope.showmore = function(classname) {
                var newheight = $(".moretext." + classname).height();
                console.log(newheight);
                console.log("show more clicked");
                if ($scope.showDetails == "showmore") {
                    $scope.showDetails = "dontshow";
                    $(".addanimation").height(0);
                    $scope.moredetails = "Узнать больше";
                    $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
                } else {
                    $scope.showDetails = "showmore";
                    $(".addanimation").height(newheight);
                    $scope.moredetails = "Скрыть";
                    $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                    $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
                }

            };
		}

})();