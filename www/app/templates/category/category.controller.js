(function(){
	'use strict';

	angular.module('app.category')
		.controller('categoryCntr', categoryCntr);

		function categoryCntr(Category, Objects, $app, $scope, $catalog) {

			var vm = this;

			// Data
		
			vm.title = Category.name;
            vm.products = Objects;
			
			// Method

			vm.backToPrevState = $app.backToPrev;

            $scope.$watchCollection("vm.filterSearchText",function () {
                if(vm.filterSearchText){
                    vm.products = $catalog.searchByCatalog(vm.filterSearchText);
                }else{
                    vm.products = Objects;
				}
            });
		}

})();