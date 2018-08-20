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
        'yaMap',

        'app.start',
        'app.login',
        'app.offline',
        'app.speakers',
        'app.about',
        'app.contact',
        'app.faq',
        'app.event',
        'app.speaker'
    ]);

    Object.values = Object.values ? Object.values : function(obj) {
        var allowedTypes = ["[object String]", "[object Object]", "[object Array]", "[object Function]"];
        var objType = Object.prototype.toString.call(obj);

        if(obj === null || typeof obj === "undefined") {
            throw new TypeError("Cannot convert undefined or null to object");
        } else if(!~allowedTypes.indexOf(objType)) {
            return [];
        } else {
            // if ES6 is supported
            if (Object.keys) {
                return Object.keys(obj).map(function (key) {
                    return obj[key];
                });
            }

            var result = [];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    result.push(obj[prop]);
                }
            }

            return result;
        }
    };


})();