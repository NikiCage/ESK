(function () {
    'use strict';

    angular
        .module('app')
        .factory('$icons', iconsService);

    /**
     * Сервис используется для хранения загруженных пользователем иконок
     * @returns {{getData: get, set: getIcons}}
     * @constructor
     */
    function iconsService($api, $q, $localStorage) {
        if(!$localStorage.icons) $localStorage.icons = {};

        return {
            get: function(source, id) {
                return $localStorage.icons[source] && $localStorage.icons[source][id] ?  $localStorage.icons[source][id] : [];
            },
            set: function(data, source, id) {
                if (!$localStorage.icons[source]) $localStorage.icons[source] = {};
                $localStorage.icons[source][id] = data;
            },
            getIcons: function(source, id) {
                var deferred = $q.defer();
                if (!$localStorage.icons[source]) $localStorage.icons[source] = {};
                if (!$localStorage.icons[source][id]) {
                    $api.dictionary.icons({dictionary : source, id: id}).$promise.then(function (data) {
                        if(data.data){
                            $localStorage.icons[source][id] = data.data;
                            deferred.resolve(data.data);
                        }else{
                            deferred.reject();
                        }
                    }).catch(deferred.reject);
                }else
                    deferred.resolve($localStorage.icons[source][id]);
                return deferred.promise;
            }
        };
    }

})();