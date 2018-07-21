(function () {
    'use strict';

    angular
        .module('app')
        .factory('$firebaseEvents', FirebaseEventsService);

    /** @ngInject */
    function FirebaseEventsService($firebaseAuth, $rootScope, $q) {
        let deferred = null;
        let eventsObject = false;

        const triggerChanged = function () {
            console.log('Got new instance list', eventsObject);
            $rootScope.$broadcast("$firebaseEvents.updateList", eventsObject);
            if(deferred) deferred.resolve(eventsObject);
        };

        $firebaseAuth.onAuthChange(user => {
            if (!user) return;

            const _ref = firebase.database().ref(`/users/${user.uid}/city`).orderByChild('merchant_id');
            _ref.once('value', snapshot => {
                console.log('city',snapshot.val());
                const ref = firebase.database().ref(`/events`).orderByChild('city').equalTo(+snapshot.val());
                ref.on('value', snapshot => {
                    console.log('eventsObject on value', snapshot.val());
                    eventsObject = snapshot.val();
                    triggerChanged();
                });
                ref.once('value', snapshot => {
                    console.log('eventsObject once value', snapshot.val());
                    eventsObject = snapshot.val();
                    triggerChanged();
                });
            });
        });

        const load = () => {
            if (eventsObject !== false)
                return Promise.resolve(eventsObject);
            if(!deferred)
                deferred = $q.defer();
            return deferred.promise;
        };

        return { load };
    }

})();

