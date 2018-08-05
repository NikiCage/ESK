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

        const setVal = snapshot => {
            console.log('eventsObject once value', snapshot.val());
            eventsObject = snapshot.val();
            for(let id in eventsObject)
                eventsObject[id].id = id;
            triggerChanged();
        };

        $firebaseAuth.onAuthChange(user => {
            if (!user) return;

            const _ref = firebase.database().ref(`/users/${user.uid}/city`);
            _ref.once('value', snapshot => {
                console.log('city',snapshot.val());
                const ref = firebase.database().ref(`/events`).orderByChild('city').equalTo(+snapshot.val());
                ref.on('value', setVal);
                ref.once('value', setVal);
            });
        });

        const load = () => {
            if (eventsObject !== false)
                return Promise.resolve(eventsObject);
            if(!deferred)
                deferred = $q.defer();
            return deferred.promise;
        };

        const getEvent = (id) => {
            if(!eventsObject[id]) return null;
            eventsObject[id].id = id;
            return eventsObject[id];
        };

        const loadEvent = (id) => {
            if(!id) return Promise.resolve(null);
            if(eventsObject === false) return load().then(events => getEvent(id));
            return Promise.resolve(getEvent(id));
        };

        return { load , loadEvent };
    }

})();

