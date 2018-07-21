(function ()
{
    'use strict';

    angular
        .module('app')
        .factory('$auth', AuthService);

    /** @ngInject */
    function AuthService($app, $api, $rootScope, $user, $q, $catalog, $tests, $crm) {

        function request(phone) {
            var data = { phone : phone };
            if($user.referral.get()) data.consultant_id = $user.referral.get();
            return $api.auth.codeRequest(data)
                .$promise.then(function(response){
                    return response && response.result == "success";
                });
        }

        function confirm(phone, code, name) {
            var deferred = $q.defer(),
                data = { code : code , phone : phone };
            if(name) data.name = name;
            if($user.referral.get()) data.consultant_id = $user.referral.get();
            $api.auth.code(data, function(response){
                if(response.error) return deferred.reject();

                $user.phone.set(phone);
                $user.token.set(response.access_token);
                $user.referral.remove();

                $user.identity(true).then(function(response){
                    if(response.error) return deferred.reject();
                    deferred.resolve(response);
                    $catalog.refresh();
                    $tests.refresh();
                    $crm.refresh();
                    $app.returnToState();
                });
            });
            return deferred.promise;
        }

        function consultant(userId, name) {
            var deferred = $q.defer(),
                data = { id : userId };
            if(name) data.name = name;
            $api.auth.consultant(data, function(response){
                if(response.error) return deferred.reject();
                $user.referral.remove();
                $user.identity(true).then(function(response){
                    if(response.error) return deferred.reject();
                    deferred.resolve(response);
                    $app.returnToState();
                });
            });
            return deferred.promise;
        }

        function anonymous() {
            var deferred = $q.defer();
            $api.auth.anonymous(function(response){
                if(response.error) return deferred.reject();

                //$user.phone.set(phone);
                $user.token.set(response.access_token);
                $user.identity(true).then(function(response){
                    if(response.error) return deferred.reject();
                    deferred.resolve(response);
                    $catalog.refresh();
                    $tests.refresh();
                    $crm.refresh();
                    $app.toMainState();
                });
            });
            return deferred.promise;
        }

        function login(login, password, remember) {
            var deferred = $q.defer(),
                data = { login : login, password : password };
            $api.auth
                .login(data)
                .$promise
                .then(function (response) {
                    if (response.error) return deferred.reject();

                    $user.token.set(response.access_token);
                    $user.referral.remove();
                    $user.identity(true).then(function (response) {
                        if (response.error) return deferred.reject();
                        //if(remember) $user.data.set(response);
                        $catalog.refresh();
                        $tests.refresh();
                        $crm.refresh();
                        deferred.resolve(response);
                        $app.returnToState();
                    });
                    return false;
                });
            return deferred.promise;
        }

        function logout() {
            if($app.connection()) {
                $app.getPushToken().then(function (data) {
                    $api.auth
                        .logout(data)
                        .$promise
                        .then(clearSession);
                });
            }else clearSession();
        }

        function clearSession() {
            $user.token.remove();
            $user.phone.remove();
            $user.data.remove();
            unauthorize();
        }

        function authorize(start) {
             return $user.identity()
                .then(function() {
                    console.log($rootScope.toState.name);
                    var isAuthenticated = $user.isAuthenticated();
                    if ($rootScope.toState.authenticate === false && isAuthenticated){
                        $app.toMainState();
                    }
                    if ($rootScope.toState.authenticate && $rootScope.toState.roles
                        && $rootScope.toState.roles.length > 0 && !$user.isInRoles($rootScope.toState.roles)) {
                        if (isAuthenticated) {
                            //$app.toMainState();
                        } else {
                            $rootScope.returnToState = $rootScope.toState;
                            $rootScope.returnToStateParams = $rootScope.toStateParams;
                            unauthorize();
                        }
                    }
                    if($rootScope.toState.online && !$app.connection()){
                        $rootScope.returnToState = $rootScope.toState;
                        $rootScope.returnToStateParams = $rootScope.toStateParams;
                        $app.toOfflineState();
                    }
                });
        }

        function unauthorize(){
            $user.authenticate(null);
            $app.toLoginState();
        }

        function requestUnauth() {
            if($rootScope.toState && $rootScope.toState.authenticate)
                unauthorize();
        }

        return {
            request: request,
            confirm: confirm,
            consultant: consultant,
            anonymous: anonymous,
            login: login,
            logout: logout,
            authorize: authorize,
            unauthorize: unauthorize,
            requestUnauth: requestUnauth
        };
    }

})();