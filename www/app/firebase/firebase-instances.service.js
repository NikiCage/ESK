(function () {
    'use strict';

    angular
        .module('app')
        .factory('$firebaseInstances', FirebaseInstancesService);

    /** @ngInject */
    function FirebaseInstancesService($firebaseAuth, $rootScope, $q) {
        let deferred = null;
        let instancesObject = false;

        const triggerChanged = function () {
            console.log('Got new instance list', instancesObject);
            $rootScope.$broadcast("$firebaseInstances.updateList", instancesObject);
            if(deferred) deferred.resolve(instancesObject);
        };

        $firebaseAuth.onAuthChange(user => {
            if (!user) return;

            const ref = firebase.database().ref(`/users/${user.uid}/instances`).orderByChild('merchant_id');
            ref.on('value', snapshot => {
                console.log('instancesObject on value', snapshot.val());
                instancesObject = snapshot.val();
                triggerChanged();
            });
            ref.once('value', snapshot => {
                console.log('instancesObject once value', snapshot.val());
                instancesObject = snapshot.val();
                triggerChanged();
            });
        });

        const load = () => {
            if (instancesObject !== false)
                return Promise.resolve(instancesObject);
            if(!deferred)
                deferred = $q.defer();
            return deferred.promise;
        };

        return { load };
    }

})();

