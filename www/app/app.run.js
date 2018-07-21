(function ()
{
    'use strict';

    angular
        .module('app')
        .run(runBlock);

    /** @ngInject */
    function runBlock($auth, $rootScope, $user, $ionicLoading, $timeout, $app)
    {
        $rootScope.stateHistory = [];
        $rootScope.backToState = false;
        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if ($user.isIdentityResolved()) $auth.authorize();
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toStateParams, fromState, fromStateParams){
            $rootScope.prevState = fromState;
            //$rootScope.prevStateParams = fromStateParams;
            if(toState.name == $app.mainState())
                $rootScope.stateHistory = [];
            else if(!$rootScope.backToState){
                $rootScope.stateHistory.push({
                    state : toState.name,
                    params : toStateParams
                });
            } else $rootScope.backToState = false;
            if(toState.name.indexOf('app.main') === 0){
                $app.connection.check();
            }
        });

        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function () {
            $ionicLoading.show({
                template: 'Загрузка...'
            });
        });
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {
            $timeout(function () {
                $ionicLoading.hide();
            });
        });
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });
    }
})();