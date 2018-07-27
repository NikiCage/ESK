var user = undefined;
var socialloginurl = "http://www.wohlig.co.in/LightSaberBackend/index.php/hauth/login/";
user = $.jStorage.get('user');
angular.module('jagruticontroller', ['myservices'])

.controller('InfiniteLoadCtrl', function($scope, $ionicModal, $timeout, $interval, $location, $ionicLoading, $ionicScrollDelegate, $http) {

    //  AUTHENTICATE USER

    $scope.pageno = 1;
    $scope.products = [];
    $scope.shouldscroll = true;
    var categorysuccesspush = function(data, status) {
        console.log("category products");
        console.log(data);
        for (var i = 0; i < data.queryresult.length; i++) {
            $scope.products.push(data.queryresult[i]);
        }
        if (data.lastpage > $scope.pageno) {
            $scope.pageno = $scope.pageno + 1;
            $scope.$broadcast('scroll.infiniteScrollComplete');

        } else {
            $scope.shouldscroll = false;
        }
    }
    var oldpage = 0;
    $scope.loadMore = function() {
        console.log("ADD MORE: " + oldpage);
        if (oldpage != $scope.pageno) {
            oldpage = $scope.pageno;
            $http.get(adminurl2 + $scope.jagrutiFunction, {
                params: {
                    pageno: $scope.pageno,
                }
            }).success(categorysuccesspush);
        }

    };


    $scope.$broadcast('scroll.infiniteScrollComplete');
})

.controller('LoginJagruti', function($scope, $ionicModal, $timeout, $interval, $location, $ionicLoading, $http) {

    //  LOGOUT
    $http.post(adminurl + "logout");
    $.jStorage.flush();
    user = undefined;
    $ionicLoading.hide();

    var authenticatesuccess = function(data, status) {
        console.log(data);
        if (data != "false") {
            $.jStorage.set("user", data);
            user = data;
            $location.url("/app/home");
        } else {
            console.log("stay here");
        };
    };


    var checktwitter = function(data, status) {
        if (data != "false") {
            console.log("Facebook Login");
            $interval.cancel(stopinterval);
            ref.close();
            $http.post(adminurl + "authenticate").success(authenticatesuccess);
        } else {
            console.log("Do nothing");
        }
    };

    var callAtIntervaltwitter = function() {
        $http.post(adminurl + "authenticate").success(checktwitter);
    };


    $scope.twitterlogin = function() {
        ref = window.open(socialloginurl + 'Twitter?returnurl=http://www.wohlig.com', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function(event) {
            $http.post(adminurl + "authenticate").success(authenticatesuccess);
            $interval.cancel(stopinterval);
        });
    };
    $scope.facebooklogin = function() {
        ref = window.open(socialloginurl + 'Facebook?returnurl=http://www.wohlig.com', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function(event) {
            $http.post(adminurl + "authenticate").success(authenticatesuccess);
            $interval.cancel(stopinterval);
        });
    };

})

.controller('JagrutiForgotPassword', function($scope, $ionicModal, $stateParams, $timeout, $interval, $location, $ionicLoading, $http, $ionicPopup) {

    //  FORTGOT PASSWORD START
    var forgotSuccess = function(data, status) {
        console.log(data);
        if (data == "true") {
            $scope.msg = "Please check your email";
            var alertPopup = $ionicPopup.alert({
                title: 'My App',
                template: $scope.msg
            });
        } else {
            $scope.msg = "Can not send Email , Try again";
            var alertPopup = $ionicPopup.alert({
                title: 'My App',
                template: $scope.msg
            });
        }

    }
    $scope.forgotPassword = function(paramiters) {
        $http.get(adminurl3 + $scope.jagrutiFunction, {
            params: {
                email: paramiters.email,
                link: window.location.origin + window.location.pathname
            }
        }).success(forgotSuccess);
    }


    //  FORGOT PASSWORD END

    //  REDIRECT CHANGE PASSWORD STARTS
    var newPasswordSuccess = function(data, status) {
        if (data == '1') {
            $location.url("/login");
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'My App',
                template: "Enable to reset password."
            });
        }
    }
    $scope.newPassword = function(paramiters) {
        $http.post(adminurl3 + $scope.jagrutiFunction, {
            password: paramiters.password,
            hashcode: $stateParams.hashid
        }).success(newPasswordSuccess);
    }

    //  REDIRECT CHANGE PASSWORD ENDS

})

.controller('JagrutiContactUs', function($scope, $ionicModal, $stateParams, $timeout, $interval, $location, $ionicLoading, $http, $ionicPopup) {
    
    //  CREATE CONTACT US
    var contactUsSuccess = function(data, status){
        console.log(data);
    }
    $scope.contactUs = function(paramiters) {
        $http.post(adminurl3 + $scope.jagrutiFunction, {
            name: paramiters.name,
            contact: paramiters.contact,
            email: paramiters.email,
            country: paramiters.country,
            city: paramiters.city,
            message: paramiters.message
        }).success(contactUsSuccess);
    }

});