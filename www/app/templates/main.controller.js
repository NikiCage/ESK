(function(){

	'use strict';

 	angular.module('app')
		.controller('mainCntr', mainCntr);

		function mainCntr($app, $rootScope, $user, $catalog, $tests, $crm) {
			var vm = this;
            $catalog.init();
            $tests.init();
            $crm.init();

            $rootScope.inRole = $user.isInRole;
            $rootScope.inRoles = $user.isInRoles;
            $rootScope.connection = $app.connection;

            $rootScope.showSearchInput = showSearchInput;
            $rootScope.hideSearchInput = hideSearchInput;
            $rootScope.showToolbarNav  = showToolbarNav;


            function showSearchInput() {
                $('.hideOnSearchInput', '.b-header').toggle();
                $('.hideSearchInput', '.b-header').toggle();
                $('.b-btn__slide-input-wrap', '.b-header').toggleClass('b-btn__slide-input-wrap_long');
                $('.b-header__input-wrap', '.b-header').toggleClass('b-header__input-wrap_long');
            }

            function hideSearchInput() {
                $('.b-header__input-wrap', '.b-header').toggleClass('b-header__input-wrap_long');
                $('.b-btn__slide-input-wrap', '.b-header').toggleClass('b-btn__slide-input-wrap_long');
                $('.hideOnSearchInput', '.b-header').delay(300).toggle();
                $('.hideSearchInput', '.b-header').delay(300).toggle();
            }

            function showToolbarNav() {
                $('.b-toolbar-nav').show();
            }
		}

})();