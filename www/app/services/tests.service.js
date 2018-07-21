(function () {
    'use strict';

    angular
        .module('app')
        .factory('$tests', testsService);

    /** @ngInject */
    function testsService($app, $q, $api, $localStorage, $user, $fx) {
        var tests = [], surveys = {}, inited = false,
            testsDefer = $q.defer(), testsPromise = testsDefer.promise;

        if(!$localStorage.offlineTest) $localStorage.offlineTest = [];
        if(!$localStorage.deleteTest) $localStorage.deleteTest = [];
        if($localStorage.surveys) surveys = $localStorage.surveys;

        var service = {
            init: init,
            tests: function(){return testsPromise},
            addResult: addResult,
            deleteResult: deleteResult,
            getTests: getTests,
            getHistory: getHistory,
            getSurveys: getSurveys,
            reloadSurveys: reloadSurveys,
            refresh: refresh
        };

        return service;

        //////////

        function init() {
            if(inited) return false;
            if($app.connection()){
                $api.test.list().$promise.then(function (response) {
                    tests = response.data;
                    $localStorage.personalTest = tests;
                    testsDefer.resolve(tests);
                    sendOfflineCache();
                }).catch(loadFromCache);
            }else{
                loadFromCache();
            }
        }

        function refresh() {
            inited = false;
            $localStorage.offlineTest = [];
            $localStorage.personalTest = [];
            testsDefer = $q.defer();
            testsPromise = testsDefer.promise;
        }

        function loadFromCache() {
            if($localStorage.personalTest){
                tests = $localStorage.personalTest;
                testsDefer.resolve(tests);
            }else{
                testsDefer.reject();
            }
        }

        function sendOfflineCache() {
            if($localStorage.offlineTest.length){
                $api.test.addResult({ result : $localStorage.offlineTest[0] }).$promise.then(function (response) {
                    if(!response.error){
                        $localStorage.offlineTest.shift();
                        sendOfflineCache();
                    }
                });
            }else sendDeleteCache();
        }

        function sendDeleteCache() {
            if($localStorage.deleteTest.length){
                $api.test.deleteResult({ result_id : $localStorage.deleteTest[0] }).$promise.then(function (response) {
                    if(!response.error){
                        $localStorage.deleteTest.shift();
                        sendDeleteCache();
                    }
                });
            }
        }

        function findInHistory(id, test_id) {
            for (var i = 0; i < tests.length; i++) {
                if (tests[i].id == id) {
                    var _tests = tests[i];
                    if(test_id){
                        _tests = angular.copy(_tests);
                        _tests.surveys = _tests.surveys.filter(function (item) {
                            return !!(item.id && item.id == test_id);
                        });
                    }
                    return _tests;
                }
            }
            return false;
        }

        function getSurveys(gender, answer) {
            if(gender == 'm') gender = 'man';
            else if(gender == 'f') gender = 'woman';
            if(surveys[gender] && surveys[gender][answer]) return surveys[gender][answer];
            return [];
        }

        function reloadSurveys() {
            var deferred = $q.defer();
            $api.test.surveys()
                .$promise.then(function(response){
                if (response) {
                    if(response.error){
                        deferred.reject();
                        return false;
                    }
                    surveys = response;
                    $localStorage.surveys = surveys;
                }
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        function getHistory(id, test_id) {
            var deferred = $q.defer();
            testsPromise.then(function () {
                if($user.isInRole('Respondents'))
                    deferred.resolve(tests);
                else if($user.isInRole('Users')){
                    var test = findInHistory(id, test_id);
                    if(test) deferred.resolve(test);
                    else {
                        var _err = function () {
                            deferred.reject();
                            $app.toOfflineState();
                        };
                        if($app.connection()){
                            $api.test.list().$promise.then(function (response) {
                                tests = response.data;
                                $localStorage.personalTest = tests;
                                deferred.resolve(findInHistory(id, test_id));
                            }).catch(_err);
                        }else _err();
                    }
                }
            }).catch(deferred.reject);

            return deferred.promise;
        }

        function getTests() {
            var deferred = $q.defer();

            if(!$user.isInRole('Users')) deferred.reject();
            else
                testsPromise.then(function () {
                    deferred.resolve(tests);
                }).catch(deferred.reject);

            return deferred.promise;
        }

        function addResult(result) {
            if($app.connection()){
                $api.test.addResult({ result : result }).$promise.then(function (response) {
                    if(!response.error){
                        addToCache(result);
                    }else {
                        addToCacheStack(result);
                    }
                }).catch(function () {
                    addToCacheStack(result);
                });
            }else{
                addToCacheStack(result);
            }
        }

        function deleteResult(result_id) {
            if($app.connection()){
                $api.test.deleteResult({ result_id : result_id }).$promise.then(function (response) {
                    if(!response.error){
                        deleteFromCache(result_id);
                    }else {
                        addToDeleteStack(result_id);
                    }
                }).catch(function () {
                    addToDeleteStack(result_id);
                });
            }else{
                addToDeleteStack(result_id);
            }
        }

        function addToCache(result){
            result.add_date = Math.round(+new Date() / 1000) + '';
            if($user.isInRole('Respondents')){
                tests.push(result);
            }else if($user.isInRole('Users')){
                if(tests[0] && tests[0].surveys)
                    tests[0].surveys.push(result);
            }
            $localStorage.personalTest = tests;
        }
        
        function deleteFromCache(result_id){
            if($user.isInRole('Respondents')){
                var index = $fx.findIndexInArr(tests, result_id);
                if(index != -1) tests.splice(index, 1);
            }else if($user.isInRole('Users')){
                if(tests[0] && tests[0].surveys){
                    var index = $fx.findIndexInArr(tests[0].surveys, result_id);
                    if(index != -1) tests[0].surveys.splice(index, 1);
                }
            }
            $localStorage.personalTest = tests;
        }

        function addToCacheStack(result){
            $localStorage.offlineTest.push(result);
            addToCache(result);
        }
        
        function addToDeleteStack(result_id){
            $localStorage.deleteTest.push(result_id);
            deleteFromCache(result_id);
        }


    }
})();
