(function ()
{
    'use strict';

    angular
        .module('app')
        .filter('altDate', altDate)
        .filter('searchByName', searchByName)
        .filter('htmlToPlaintext', htmlToPlaintext)
        .filter('cut', cut)
        .filter('rawHtml', ['$sce', rawHtml])
        .factory('$app', appService);

    /** @ngInject */
    function appService($window, $cordovaDevice, $ionicPopup, $ionicHistory, $ionicPlatform, $ionicLoading, $rootScope, $state, defaultConst, $q, VERSIONS, $cordovaToast, $timeout, $localStorage) {
        var versions, active = true;
        $app(function () {
            if ($window.PushNotification) {
                var push = $window.PushNotification.init({
                    android: {},
                    ios: {
                        alert: "true",
                        badge: true,
                        sound: "true"
                    }
                });
                $window.PushNotification.hasPermission(function (data) {
                    if (data.isEnabled) {
                        console.log('isEnabled');
                    }
                });
                push.on('registration', function (data) {
                    console.log('registration', data.registrationId);
                    $app.token = data.registrationId;
                });
                push.on('error', function (e) {
                    console.log('error', e);
                    $app.token = null;
                });
                push.on('notification', function (data) {
                    console.log('notification');
                    console.log(data);
                    var notification = data.additionalData;
                    if (!notification.foreground && notification.type && active) {
                        switch (notification.type) {
                            case "new_message" : {
                                if (notification.dialog_id) {
                                    $state.go('app.main.chat', {id: notification.dialog_id});
                                } else if (notification.partner_id) {
                                    $state.go('app.main.messages', {id: notification.partner_id});
                                }
                            }
                                break;
                            case "new_survey" :
                            case "new_test" : {
                                if (notification.survey_id) {
                                    $state.go('app.main.history', {id: notification.survey_id});
                                }
                            }
                                break;
                        }
                    }
                    if (notification.badge) $app.setBadge(notification.badge);
                    else if (data.count) $app.setBadge(data.count);
                });
                $app.pushService = push;
            }
            if($window.cordova && $window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if($window.StatusBar) {
                StatusBar.styleDefault();
            }
            var warnedExit = false;
            this.registerBackButtonAction(function(event) {
                if ($ionicHistory.currentStateName() === $app.mainState() ||
                    ($ionicHistory.currentStateName() === 'app.login')) {
                    if (!warnedExit) {
                        event.preventDefault();
                        warnedExit = true;
                        $app.toast('LongBottom')('Нажмите назад еще раз, чтобы выйти.');
                        $timeout(function () {
                            warnedExit = false;
                        }, 3000);
                    } else {
                        $app.exit();
                    }
                } else {
                    $app.backToPrev();
                }
            }, 100);

            $ionicPlatform.on('pause',function () {
                $rootScope.$broadcast('appPause');
                active = false;
            });
            $ionicPlatform.on('resume',function () {
                $rootScope.$broadcast('appResume');
                active = true;
            });
        });
        $app.sysPopups = {};
        $app.pushService = false;
        $app.setBadge = function (number) {
            if($app.pushService) $app.pushService.setApplicationIconBadgeNumber(function(){}, function(){}, number);
            $rootScope.unread = number;
            $localStorage.unread = number;
        };
        $app.getPushToken = function (data) {
            var deferred = $q.defer();
            if(!$app.pushService)
                deferred.resolve(false);
            else if ($app.token)
                deferred.resolve($app.token);
            else
                $app.pushService.on('registration', function (data) {
                    console.log('registration', data.registrationId);
                    if(data.registrationId){
                        $app.token = data.registrationId;
                        deferred.resolve(data.registrationId);
                    }else{
                        $app.token = null;
                        deferred.resolve(false);
                    }
                });
            return deferred.promise.then(function (token) {
                if(!data) data = {};
                if(!token) return data;
                data.push_token = token;
                data.os = $app.getOS();
                data.os_version = $app.getOSVersion();
                data.version = VERSIONS[data.os].current;
                return data;
            });
        };
        $app.exit = function () {
            if(ionic && ionic.Platform)
                ionic.Platform.exitApp();
            else
                alert('Выход из приложения')
        };
        $app.mainState = function() {
            return defaultConst.state;
        };
        $app.toLoginState = function() {
            $state.go('app.login');
        };
        $app.toOfflineState = function() {
            $ionicLoading.hide();
            $state.go('app.offline');
        };
        $app.toMainState = function() {
            $rootScope.stateHistory = [];
            $state.go($app.mainState());
        };
        $app.returnToState = function() {
            if ($rootScope.returnToState) {
                $state.go($rootScope.returnToState.name, $rootScope.returnToStateParams);
            } else
                $app.toMainState();
        };
        $app.backToPrev = function() {
            if ($rootScope.prevState) {
                $rootScope.stateHistory.pop();
                if($rootScope.stateHistory.length){
                    var prevState = $rootScope.stateHistory[$rootScope.stateHistory.length - 1];
                    $rootScope.backToState = true;
                    $state.go(prevState.state, prevState.params);
                } else
                    $app.toMainState();
            } else {
                $app.toMainState();
            }
        };
        $app.active = function() {
            return active;
        };
        $app.connection = function() {
            //return false;
            return !($window.Connection && navigator.connection.type == Connection.NONE);
        };
        $app.connection.confirm = function(content) {
            return $ionicPopup.confirm({
                title: "Нет доступа к интернету",
                content: content || "Некоторые функции могут быть недоступны",
                cancelText: 'Выход',
                okText: 'Продолжить'
            }).then(function(result) {
                if(!result) $app.exit();
                return result;
            });
        };
        $app.connection.alert = function(content) {
            return $ionicPopup.alert({
                title: "Нет доступа к интернету",
                content: content || "Для продолжения работы в приложении требуется доступ в интернет",
                okText: 'Выход'
            }).then(function(result) {
                $app.exit();
                return result;
            });
        };
        $app.connection.check = function () {
            if(this()){
              this.offline = false;
            } else if(!this.offline){
              this.offline = true;
              this.confirm();
            }
        };

        $app.toast = function (mode) {
            if(!mode) mode = 'LongBottom';
            return function (text) {
                if($window.plugins && $window.plugins.toast)
                    return $cordovaToast['show' + mode](text);
            }
        };

        $app.back = $window.history.back;
        $app.getOS = getOS;
        $app.getOSVersion = getOSVersion;
        $app.isIOS = isIOS;

        return $app;

        function $app(listener) {
            $ionicPlatform.ready(listener.bind($ionicPlatform));
        }

        function getOS() {
            var os;
            try {
                os = $cordovaDevice.getPlatform().toLowerCase();
            }
            catch (e){
                os = 'browser';
            }
            return os;
        }

        function getOSVersion() {
            var os_version;
            try {
                os_version = $cordovaDevice.getVersion();
            }
            catch (e){
                os_version = '';
            }
            return os_version;
        }

        function isIOS() {
            return getOS() == 'ios';
        }
        
        function checkCurrentVersions() {
            if(versions && versions.application){
                var os = getOS();
                if(VERSIONS[os].current < versions.application.minimal){
                    $ionicPopup.confirm({
                        title: "Ваша версия приложения больше не поддерживается",
                        content: "Желаете обновить приложение до последней версии?",
                        cancelText: 'Выход',
                        okText: 'Обновить'
                    }).then(function(result) {
                        if(result)
                            goToUpdateApplication(os);
                        else
                            $app.exit();
                    });
                }
                if(VERSIONS[os].current < versions.application.recommended){
                    $ionicPopup.confirm({
                        title: "Ваша версия приложения устарела",
                        content: "Желаете обновить приложение до последней версии?",
                        cancelText: 'Продолжить',
                        okText: 'Обновить'
                    }).then(function(result) {
                        if(result)
                            goToUpdateApplication(os)
                    });
                }

            }
        }

        function goToUpdateApplication(os) {
            $window.location.href = VERSIONS[os].url;
        }
    }

    function altDate() {
        return function (value) {
            if(angular.isString(value) && value.length <= 10) value = +value * 1000;
            var diff = Date.now() - new Date(value);
            /**
             * If in a hour
             * e.g. "2 minutes ago"
             */
            if ( diff < (60 * 60 * 1000) ) {
                return moment(value).fromNow();
            }
            /*
             * If in the day
             * e.g. "11:23"
             */
            else if ( diff < (60 * 60 * 24 * 1000) ) {
                return moment(value).format('HH:mm');
            }
            /*
             * If in week
             * e.g "Tuesday"
             */
            else if ( diff < (60 * 60 * 24 * 7 * 1000) ) {
                return moment(value).format('dddd');
            }
            /*
             * If more than a week
             * e.g. 03/29/2016
             */
            else {
                return moment(value).calendar();
            }
        };
    }


    function searchByName() {
        return function(input, search) {
            if(!search) return input;
            search = search.toLowerCase();
            var output = [];
            for(var i=0; i<input.length; i++) {
                if(input[i].name.toLowerCase().indexOf(search) !== -1) {
                    output.push(input[i]);
                }
            }
            return output;
        };
    }

    function htmlToPlaintext() {
        return function(text) {
            return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    }

    function cut() {
        return function(value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    }

    function rawHtml($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    }

})();