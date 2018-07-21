(function(){
	'use strict';

	angular.module('app.catalog')
		.controller('catalogCntr', catalogCntr);

		function catalogCntr(Categories, $app, $scope, $catalog) {
			var vm = this;
			// Data
			vm.catalog = Categories;
			vm.backToPrevState = $app.toMainState;

            $catalog.catalog().then(function () {
                $scope.$watchCollection("vm.filterSearchText",function () {
					if(vm.filterSearchText){
						vm.products = $catalog.searchByCatalog(vm.filterSearchText);
					}
                });
			});
		}

})();