(function () {
    'use strict';

    angular
        .module('app')
        .factory('$firebaseAuth', FirebaseAuthService);

    /** @ngInject */
    function FirebaseAuthService($rootScope, $state, $q, $filter, $app) {
        const authCallbacks = [];

        const onAuthChange = callback => {
            authCallbacks.push(callback);
        };

        let user = false, deferred = null;

        const handleUserChange = newUser => {
            console.log('onAuthStateChanged',newUser);
            user = newUser;
            authCallbacks.map(callback => callback(user));
            resolve(user);
        };

        firebase.auth().onAuthStateChanged(newUser => {
            handleUserChange(newUser);
        });

        const resolve = user => {
            if(deferred) deferred.resolve(user);
            deferred = null;
        };
        const success = result => {
            user = false;
            return result;
        };
        const error = error => {
            if(error.code) $app.toast(error.message);
            return error;
        };

        firebase.auth().useDeviceLanguage();

        const request = (phoneNumber, applicationVerifier) => firebase.auth().signInWithPhoneNumber(phoneNumber, applicationVerifier).then(success);

        const authorize = () => identity()
            .then(function(user) {
                if ($rootScope.toState.authenticate === false && user){
                    $app.toMainState();
                }
                if ($rootScope.toState.authenticate && !user){
                    $rootScope.returnToState = $rootScope.toState;
                    $rootScope.returnToStateParams = $rootScope.toStateParams;
                    $app.toLoginState();
                }
                return user;
            });


        const identity = () => {
            if (user !== false)
                return Promise.resolve(user);
            if(!deferred)
                deferred = $q.defer();
            return deferred.promise;
        };

        const signOut = () => {
            firebase.auth().signOut();
            $app.toLoginState();
        };

        const authorizeWithCity = cityId => authorize().then(user => {
           firebase.database().ref(`/users/${user.uid}/city`).set(cityId);
        });

        const getUser = () => user;

        const setUser = user => handleUserChange(user);

        return {authorize, identity, onAuthChange, request, authorizeWithCity, signOut, getUser, setUser, error};
    }

})();

