(function () {

    'use strict';

    // Ionic Starter App

    // angular.module is a global place for creating, registering and retrieving Angular modules
    // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
    // the 2nd parameter is an array of 'requires'
    angular.module('app', [
        'ionic',
        'ui.router',
        'ionic.native',
        'ngResource',
        'ngStorage',
        'ionic-datepicker',
        'app.navigation',
        'app.start',
        'app.login',
        'app.offline',
        'app.catalog',
        'app.category',
        'app.product',
        'app.toolbarNav',
        'app.selection',
        'app.filter',
        'app.messages',
        'app.chat',
        'app.test',
        'app.result',
        'app.history',
        'app.private'
    ]);

})();