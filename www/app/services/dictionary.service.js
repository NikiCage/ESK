(function () {
    'use strict';

    angular
        .module('app')
        .filter('dictionary', dictionaryFilter)
        .factory('$dictionary', dictionaryService);

    /** @ngInject */
    function dictionaryService($api, $q, $localStorage) {
        if(!$localStorage.dictionary) $localStorage.dictionary = {};

        function getField(source){
            return source.indexOf('statuses') !== -1 ? "codename" : "name"
        }
        return {
            getData: function(source) {
                return $localStorage.dictionary[source] ?  $localStorage.dictionary[source] : [];
            },
            setData: function(data, source) {
                $localStorage.dictionary[source] = data;
            },
            getDictionary: function(source, force) {
                var deferred = $q.defer();
                if (!$localStorage.dictionary[source] || force) {
                    $api.dictionary.get({name : source}).$promise.then(function (data) {
                        if(data.data){
                            $localStorage.dictionary[source] = data.data;
                            deferred.resolve(data.data);
                        }else{
                            deferred.reject();
                        }
                    }).catch(deferred.reject);
                }else
                    deferred.resolve($localStorage.dictionary[source]);
                return deferred.promise;
            },
            getName : function (source) {
                var dictionary = this.getData(source), field = getField(source);
                return function (id) {
                    for (var i = 0; i < dictionary.length; i++) {
                        if (id == dictionary[i]["id"])
                            return dictionary[i][field];
                    }
                    return false;
                }
            },
            getId : function (source) {
                var dictionary = this.getData(source), field = getField(source);
                return function (name) {
                    for (var i = 0; i < dictionary.length; i++) {
                        if (name == dictionary[i][field])
                            return dictionary[i].id;
                    }
                    return false;
                }
            }
        };
    }

    /** @ngInject */
    function dictionaryFilter($dictionary)
    {
        return function(input, source) {
            return $dictionary.getName(source)(input) || input;
        };
    }

})();