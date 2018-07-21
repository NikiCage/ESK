(function(){
	'use strict';

	angular.module('app.selection')
		.filter('filterByPropIds', filterByPropIds)
		.controller('selectionCntr', selectionCntr);

		function filterByPropIds() {
	        return function (items, ids) {
	          	if ( items && items.length === 0 || !ids || Object.keys(ids).length === 0 ) {
	                return items;
	            }

	          	for(var field in ids){
                    var filtered = [];
                    for ( var i = 0; i < items.length; i++ ) {
                        var item = items[i];
                        var match = false;
                        for ( var j = 0; j < ids[field].length; j++ ) {
                            var id = ids[field][j];
                            if ( item[field] && item[field] == id ) {
                                match = true;
                                break;
                            }
                        }
                        if ( match ) {
                            filtered.push(item);
                        }
                    }
                    items = filtered;
				}

	            return items;
	        };
	    }

		function selectionCntr($rootScope, Objects, $app, $fields_filter, $ionicSideMenuDelegate) {

			var vm = this;

			// Data
            if($rootScope.prevState && $rootScope.prevState.name == $app.mainState())
            	$ionicSideMenuDelegate.toggleRight();

			vm.title = "Классификатор";

            vm.products = Objects;

            vm.filterSearchText = $rootScope.filterSearchText || "";
            vm.filterByArray = $fields_filter.result;

			// Method

			vm.backToPrevState = $app.toMainState;

			vm.filterSearchTextChange = function () {
                $rootScope.filterSearchText = vm.filterSearchText;
            };

			// Event

			$rootScope.$on('filterData', function(event) {
                vm.filterByArray = $fields_filter.result;
			});
		}

})();