(function ()
{
    'use strict';

    angular
        .module('app')
        .filter('currencies', currenciesFilter)
        .factory('$currencies', CurrenciesService);

    /** @ngInject */
    function CurrenciesService($dictionary, $q) {
        var currencies = $dictionary.getData('currencies');

        function getPromise(force) {
            var deferred = $q.defer();

            if (force === true) currencies = [];

            if (currencies.length) {
                deferred.resolve(currencies);
                return deferred.promise;
            }

            return $dictionary.getDictionary('currencies',force).then(function (response) {
                if(response) currencies = response;
            });
        }
        return {
            list : function () {
                return currencies;
            },
            get : function (id) {
                for (var i = 0; i < currencies.length; i++)
                    if (id == currencies[i].id)
                        return currencies[i];
                return false;
            },
            getPromise : getPromise
        };
    }

    /** @ngInject */
    function currenciesFilter($currencies, $filter) {
        return function(input) {
            var currency;
            if(angular.isObject(input) && input.currency){
                currency = $currencies.get(input.currency);
                if(currency)
                    return $filter('number')(input.value, currency.fract || 0) + ' ' + currency.suffix;
            }
            currency = $currencies.get(input);
            return currency ? currency.suffix : input;
        };
    }
})();

