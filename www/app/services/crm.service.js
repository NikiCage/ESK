(function () {
    'use strict';

    angular
        .module('app')
        .filter("crm", crmFilter)
        .factory('$crm', crmService);

    /** @ngInject */
    function crmService($app, $q, $api, $localStorage, $user) {
        var crm = [], inited = false, loadedFilter = false,
            crmDefer = $q.defer(), crmPromise = crmDefer.promise;

        if($localStorage.crm) crm = $localStorage.crm;
        if(!$user.isInRole('Users')) $localStorage.crm = [];

        var service = {
            init: init,
            promise: function(){return crmPromise},
            loadedFilter: loadedFilter,
            getContact: getContact,
            checkContact: checkContact,
            findInCRM: findInCRM,
            refresh: refresh
        };

        return service;

        //////////

        function init() {
            if(inited) return false;
            if($app.connection() && $user.isInRole('Users')){
                $api.crm.list().$promise.then(function (response) {
                    crm = response.data;
                    $localStorage.crm = crm;
                    crmDefer.resolve(crm);
                }).catch(loadFromCache);
            }else{
                loadFromCache();
            }
        }

        function refresh() {
            inited = false;
            crm = [];
            $localStorage.crm = [];
            crmDefer = $q.defer();
            crmPromise = crmDefer.promise;
            loadedFilter = false;
        }

        function loadFromCache() {
            if($localStorage.crm){
                crm = $localStorage.crm;
                crmDefer.resolve(crm);
            }else{
                crmDefer.reject();
            }
        }

        function findInCRM(id, name) {
            for (var i = 0; i < crm.length; i++)
                if (crm[i].respondent_id == id)
                    return crm[i];
            var item = {
                respondent_id: id,
                name: name
            };
            if(id.indexOf('cl_') !== -1) crm.push(item);
            return item;
        }

        function checkContact(id) {
            if(id)
                for (var i = 0; i < crm.length; i++)
                    if (crm[i].respondent_id == id)
                        return true;
            return false;
        }

        function getContact(id, name) {
            var deferred = $q.defer();
            crmPromise.then(function () {
                deferred.resolve(findInCRM(id, name));
            }).catch(deferred.reject);
            return deferred.promise;
        }
    }

    function crmFilter($crm) {
        var serviceInvoked = false;

        _crmFilter.$stateful = true;
        function _crmFilter(value, id) {
            if(!$crm.loadedFilter) {
                if(!serviceInvoked) {
                    serviceInvoked = true;
                    $crm.promise().then(function(result) {
                        $crm.loadedFilter = true;
                    });
                }
                return value;
            }
            else return $crm.findInCRM(id, value).name;
        }
        return _crmFilter;
    }

})();
