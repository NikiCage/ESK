(function () {
    'use strict';

    angular
        .module('app')
        .factory('$firebaseCities', FirebaseCitiesService);

    /** @ngInject */
    function FirebaseCitiesService( $rootScope, $q) {
        let deferred = null;
        let citiesObject = false;

        const triggerChanged = function () {
            console.log('Got new instance list', citiesObject);
            $rootScope.$broadcast("$firebaseCities.updateList", citiesObject);
            if(deferred) deferred.resolve(citiesObject);
        };

        const ref = firebase.database().ref('/cities');
        ref.on('value', snapshot => {
            console.log('citiesObject on value', snapshot.val());
            citiesObject = snapshot.val();
            triggerChanged();
        });
        ref.once('value', snapshot => {
            console.log('citiesObject once value', snapshot.val());
            citiesObject = snapshot.val();
            triggerChanged();
        });

        const load = () => {
            if (citiesObject !== false)
                return Promise.resolve(citiesObject);
            if(!deferred)
                deferred = $q.defer();
            return deferred.promise;
        };

        return { load };
    }

})();

