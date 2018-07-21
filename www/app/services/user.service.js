(function ()
{
    'use strict';

    angular
        .module('app')
        .factory('$user', userService);

    /** @ngInject */
    function userService($q, $api, $localStorage, $app) {
        var identity = undefined,
            authenticated = false,
            token = false, phone, referral;

        function setToken(_token) {
            token = _token;
            $localStorage.token = _token;
        }
        function removeToken() {
            token = false;
            $localStorage.token = false;
        }
        function getToken() {
            if(!token) token = $localStorage.token || $localStorage.consultToken || $localStorage.tempToken || false;
            return token;
        }
        function initIdentity() {
            $localStorage.identity = identity;
            if(identity.user){
                if(identity.user.anonymous) identity.roles.push('Anonymous');
                if(identity.user.consultant) identity.roles.push('WithConsultant');
                else if(identity.roles && identity.roles.indexOf('Respondents') !== -1) identity.roles.push('WithoutConsultant');
            }
        }

        return {
            get : function() {
                return identity;
            },
            getUser : function () {
                if(identity && identity.user) return identity.user;
                return false;
            },
            getId : function () {
                if(identity && identity.user && identity.user.id) return identity.user.id;
                return false;
            },
            getStatus : function () {
                if(identity && identity.user && identity.user.status) return identity.user.status;
                return false;
            },
            getLogin : function () {
                if(identity && identity.user && identity.user.login) return identity.user.login;
                return false;
            },
            getConsultant : function () {
                if(identity && identity.user && identity.user.consultant) return identity.user.consultant;
                return false;
            },
            getConsultantId : function () {
                if(this.getConsultant()) return this.getConsultant().id;
                return false;
            },
            isIdentityResolved: function() {
                return angular.isDefined(identity);
            },
            isAuthenticated: function() {
                return authenticated;
            },
            isInRole: function(role) {
                if (!identity || !identity.roles) return false;
                return identity.roles.indexOf(role) !== -1;
            },
            isInRoles: function(roles) {
                if (!authenticated || !identity.roles) return false;

                var _arr = angular.isArray(roles) ? roles : Array.prototype.slice.call(arguments, 0);

                _arr = _arr.map(function(a, i){
                    return _arr[i];
                });

                var _flag = false;

                for (var i = 0; i < _arr.length; i++) {
                    if (this.isInRole(_arr[i])) _flag = true;
                }

                return _flag;
            },
            authenticate: function(_identity) {
                identity = _identity;
                authenticated = _identity != null;
                if(identity) initIdentity();
            },
            identity: function(force) {
                var deferred = $q.defer(), auth = this.authenticate;
                if (force === true) identity = undefined;

                if (angular.isDefined(identity)) {
                    deferred.resolve(identity);
                    return deferred.promise;
                }

                var _token = getToken();
                if(_token)
                    $app(function () {
                        if($app.connection())
                            $app.getPushToken({token: _token}).then(function (data) {
                                $api.auth.ping(data, function (response) {
                                    if (response.user) {
                                        successAuth(response);
                                    } else {
                                        errorAuth();
                                    }
                                }, function () {
                                    errorAuth();
                                });
                            });
                        else {
                            if($localStorage.identity){
                                successAuth($localStorage.identity);
                            }else{
                                $app.connection.alert();
                            }
                        }
                    });
                else
                    errorAuth();

                function successAuth(data) {
                    auth(data);
                    deferred.resolve(data);
                }
                function errorAuth() {
                    auth(null);
                    deferred.resolve(null);
                }

                return deferred.promise;
            },
            data : {
                get : function () {
                    return identity;
                },
                set : function (data) {
                    identity = data;
                    $localStorage.identity = data;
                },
                remove : function () {
                    identity = undefined;
                    $localStorage.identity = null;
                }
            },
            phone : {
                get : function () {
                    if(!phone && $localStorage.phone) phone = $localStorage.phone;
                    return phone;
                },
                set : function (data) {
                    phone = data;
                    $localStorage.phone = data;
                },
                remove : function () {
                    phone = undefined;
                    $localStorage.phone = null;
                }
            },
            referral : {
                get : function () {
                    if(!referral && $localStorage.referral) referral = $localStorage.referral;
                    return referral;
                },
                set : function (data) {
                    referral = data;
                    $localStorage.referral = data;
                },
                remove : function () {
                    referral = undefined;
                    $localStorage.referral = null;
                }
            },
            token : {
                get : getToken,
                set : setToken,
                remove : removeToken
            }
        };
    }

})();

