(function () {
    'use strict';

    angular
        .module('app')
        .factory('$firebaseRequests', FirebaseRequestsService);

    /** @ngInject */
    function FirebaseRequestsService( $rootScope, $q, $firebaseAuth) {
        let deferred = null;
        let requestsObject = false;

        $firebaseAuth.onAuthChange(user => {
            if (user) requestsObject = false;
        });

        const load = () => {
            if (requestsObject !== false)
                return Promise.resolve(requestsObject);
            if(!deferred){
                deferred = $q.defer();
                const user = $firebaseAuth.getUser();
                if(!user) deferred.resolve(null);
                else {
                    const ref = firebase.database().ref('/requests/').child(user.city);
                    ref.once('value', snapshot => {
                        deferred.resolve(snapshot.val());
                    });
                }
            }
            return deferred.promise;
        };

        const addRequest = (master) => {
            const user = $firebaseAuth.getUser();
            if(!user) return;
            try {
                firebase.database().ref('/requests/' + user.city + '/' + master + '/' + user.uid).set({date: moment().unix()});
            } catch (e) {
                return {error: e.message}
            }
        };

        return { load, addRequest };
    }

})();