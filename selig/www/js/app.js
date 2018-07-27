// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'myservices', 'jagruticontroller', 'starter.config'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
            StatusBar.overlaysWebView(true);
        }
        if (device.platform == 'iOS') {
            navigator.splashscreen.hide();
        }
        if (cordova.platformId == 'android') {
            StatusBar.backgroundColorByHexString("#641A70");
        }
    });
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    //Ionic native scrolling
    //$ionicConfigProvider.scrolling.jsScrolling(false);

    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })
        .state('user-login', {
            url: "/user-login",
            templateUrl: "templates/user-login.html",
            controller: 'UserloginCtrl'
        })
        .state('user-signup', {
            url: "/user-signup",

            templateUrl: "templates/user-signup.html",
            controller: 'UsersignupCtrl'

        })

    .state('app.home', {
        url: "/home",
        views: {
            'menuContent': {
                templateUrl: "templates/home.html",
                controller: 'HomeCtrl'
            }
        }
    })
       .state('app.hometwo', {
        url: "/hometwo",
        views: {
            'menuContent': {
                templateUrl: "templates/hometwo.html",
                controller: 'HometwoCtrl'
            }
        }
    })
        .state('app.contact', {
            url: "/contact",
            views: {
                'menuContent': {
                    templateUrl: "templates/contact.html",
                    controller: 'ContactCtrl'
                }
            }
        })
        .state('app.setting', {
            url: "/setting",
            views: {
                'menuContent': {
                    templateUrl: "templates/setting.html",
                    controller: 'SettingCtrl'
                }
            }
        })
        .state('app.profile', {
            url: "/profile",
            views: {
                'menuContent': {
                    templateUrl: "templates/profile.html",
                    controller: 'ProfileCtrl'
                }
            }
        })
        .state('app.gallery', {
            url: "/gallery",
            views: {
                'menuContent': {
                    templateUrl: "templates/gallery.html",
                    controller: 'GalleryCtrl'
                }
            }
        })
        .state('app.gallery-category', {
            url: "/gallery-category/:id/:name",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/gallery-category.html",
                    controller: 'GallerycategoryCtrl'
                }
            }
        })
        .state('app.about', {
            url: "/about",
            views: {
                'menuContent': {
                    templateUrl: "templates/about.html",
                    controller: 'AboutCtrl'
                }
            }
        })
        .state('app.faq', {
            url: "/faq",
            views: {
                'menuContent': {
                    templateUrl: "templates/faq.html",
                    controller: 'FaqCtrl'
                }
            }
        })
        .state('app.articles', {
            url: "/articles",
            views: {
                'menuContent': {
                    templateUrl: "templates/articles.html",
                    controller: 'ArticlesCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/user-login');
})

.directive('myYoutube', function($sce) {
    return {
        restrict: 'EA',
        scope: {
            code: '='
        },
        replace: true,
        template: '<iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe>',
        link: function(scope) {
            console.log('here');
            scope.$watch('code', function(newVal) {
                if (newVal) {
                    scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/NEkBgE_DSX0");
                }
            });
        }
    };
})

.filter('cut', function() {
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
})
    .filter('rawHtml', ['$sce',
        function($sce) {
            return function(val) {
                return $sce.trustAsHtml(val);
            };
        }
    ]);

function splitarray(fullarray, splitsize) {
    var newarray = [];
    var k = 0;
    for (var i = 0; i < fullarray.length; i++) {
        var arrindex = Math.floor(i / splitsize);
        console.log(arrindex);
        if ((newarray.length - 1) != arrindex) {
            newarray[arrindex] = [];
        }
        newarray[arrindex].push(fullarray[i]);
    }
    return newarray;
}