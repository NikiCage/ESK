(function () {
    'use strict';

    angular
        .module('app')
        .factory('$firebaseMasters', FirebaseMastersService);

    /** @ngInject */
    function FirebaseMastersService( $rootScope, $q) {
        let deferred = null;
        let mastersObject = false;

        const triggerChanged = function () {
            console.log('Got new instance list', mastersObject);
            $rootScope.$broadcast("$firebaseMasters.updateList", mastersObject);
            if(deferred) deferred.resolve(mastersObject);
        };

        const ref = firebase.database().ref('/masters');
        ref.on('value', snapshot => {
            console.log('mastersObject on value', snapshot.val());
            mastersObject = snapshot.val();
            triggerChanged();
        });
        ref.once('value', snapshot => {
            console.log('mastersObject once value', snapshot.val());
            mastersObject = snapshot.val();
            triggerChanged();
        });

        const load = () => {
            if (mastersObject !== false)
                return Promise.resolve(mastersObject);
            if(!deferred)
                deferred = $q.defer();
            return deferred.promise;
        };

        const getMaster = (id) => {
            if(!mastersObject[id]) return null;
            mastersObject[id].id = id;
            return mastersObject[id];
        };

        const loadMaster = (id) => {
            if(!id) return Promise.resolve(null);
            if(mastersObject === false) return load().then(masters => getMaster(id));
            return Promise.resolve(getMaster(id));
        };

        return { load , loadMaster};
    }

})();

