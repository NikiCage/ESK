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
            if (!newUser) return handleUserChange(newUser);
            const ref = firebase.database().ref('/users').child(newUser.uid);
            ref.once('value', snapshot => {
                handleUserChange(Object.assign({}, newUser, snapshot.val()));
            });
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

        const request = (phoneNumber, applicationVerifier) => $app.getOS() === 'browser'  ?
             firebase.auth().signInWithPhoneNumber(phoneNumber, applicationVerifier).then(success) :
             new Promise(resolve => {console.log(phoneNumber); window.FirebasePlugin.verifyPhoneNumber(phoneNumber, 120, credential => resolve(credential),error => console.error(error))}).then(success);

        const confirm = (verificator, code) => {
            if($app.getOS() === 'browser')
                return verificator.confirm(code).then(response => response.user);
            else {
                const verificationId = verificator.verificationId;
                const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
                return firebase.auth().signInWithCredential(credential);
            }
        };

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
            user = false;
            $app.toLoginState();
        };

        const authorizeWithCity = cityId => authorize().then(user => {
           firebase.database().ref(`/users/${user.uid}/city`).set(cityId);
        });

        const getUser = () => user;

        const setUser = user => handleUserChange(user);

        const getOrg = () => {
            const ref = firebase.database().ref('/org/').child(user.city);
            let deferred = $q.defer();
            ref.once('value', snapshot => {
                deferred.resolve(snapshot.val());
            });
            return deferred.promise;
        };

        return {authorize, identity, onAuthChange, request, confirm, authorizeWithCity, signOut, getUser, setUser, error, getOrg};
    }

})();

