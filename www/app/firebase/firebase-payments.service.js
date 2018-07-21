(function () {
    'use strict';

    angular
        .module('app')
        .factory('$firebasePayments', FirebasePaymentsService);

    /** @ngInject */
    function FirebasePaymentsService($firebaseAuth) {
        let changeCallbacks = [];
        let paymentsObject = {};

        const onChange = callback => {
            changeCallbacks.push(callback);
            triggerChanged(changeCallbacks);
        };
        const removeOnChange = callback => {
            console.log('removeOnChange before', changeCallbacks.length);
            changeCallbacks = changeCallbacks.filter(cb => cb !== callback);
            console.log('removeOnChange after', changeCallbacks.length);
        };

        const triggerChanged = function () {
            console.log('Got new payments list', paymentsObject);
            changeCallbacks.map(callback => callback(paymentsObject || {}));
        };

        $firebaseAuth.onAuthChange(function (user) {
            if (!user) return;
            const ref = firebase.database().ref(`/users/${user.uid}/payments`).orderByChild('merchant_id')
            ref.on('value', snapshot => {
                console.log('paymentsObject on value', snapshot.val());
                paymentsObject = snapshot.val();
                triggerChanged();
            });
            ref.once('value', snapshot => {
                console.log('paymentsObject once value', snapshot.val());
                paymentsObject = snapshot.val();
                triggerChanged();
            });
        });

        return {
            onChange: onChange,
            removeOnChange: removeOnChange
        };
    }

})();

