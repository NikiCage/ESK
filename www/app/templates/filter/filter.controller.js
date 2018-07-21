(function(){
	'use strict';

	angular.module('app.filter')
		.factory('$fields_filter', filterService)
		.controller('filterCntr', filterCntr);

		/** @ngInject */
		function filterService($catalog, $dictionary) {
            var filter = {}, clearFilter = [];

            // Data
            filter.result = {};
            filter.fields = [
                {
                    id : 'gender',
                    title : 'Пол',
                    dictionary : 'gender',
                    type : 'relation'
                },
                {
                    id : 'family_id',
                    title : 'Семейство',
                    dictionary : 'aroma_families',
                    type : 'multitype'
                },
                {
                    id : 'style_id',
                    title : 'Стиль',
                    dictionary : 'aroma_styles',
                    type : 'multitype'
                },
                {
                    id : 'character_id',
                    title : 'Характер',
                    dictionary : 'aroma_characters',
                    type : 'multitype'
                },
                {
                    id : 'collection_id',
                    title : 'Коллекция',
                    dictionary : 'aroma_collections',
                    type : 'multitype'
                }
            ];
            $catalog.all().then(function () {
                filter.fields.map(function (item) {
                    item.data = angular.copy($dictionary.getData(item.dictionary));
                    if(item.dictionary == 'gender'){
                        for (var i = item.data.length - 1; i >= 0; i--) {
                            var _item = item.data[i];
                            if(_item.name.toLowerCase() == 'унисекс' || _item.name.toLowerCase() == 'unisex'){
                                item.always = _item.id;
                                item.data.splice(i, 1);
                            }
                        }
                    }
                    if (item.type === 'multitype') {
                        item.select = [];
                        item.model = [];
                    }
                    return item;
                });
                clearFilter = angular.copy(filter.fields);
            });
            filter.removeTag = function (field, index) {
                field.select[index] = null;
                field.model[index] = false;
            };
            filter.reset = function () {
                filter.fields = angular.copy(clearFilter);
                filter.result = {};
            };
            filter.apply = function () {
                var arr;
                filter.result = {};
                for (var i = 0; i < filter.fields.length; i++) {
                    var field = filter.fields[i];
					if(field.select){
						if(angular.isArray(field.select)){
							arr = field.select.filter(function (a, i) {
                                return !!a;
                            }).map(function(a, i) {
                                return a.id ? a.id : a;
                            });
							if(arr.length) filter.result[field.id] = arr;
						}else{
                            arr = [field.select.id];
                            if(field.always) arr.push(field.always);
                            filter.result[field.id] = arr;
                        }
					}
                }
            };
			return filter;
		}

		function filterCntr($rootScope, $fields_filter) {

			var vm = this;

			// Data

			vm.filter = $fields_filter;

			// Method

            vm.submenu = false;
			vm.send  = send;
			vm.reset  = reset;
			vm.calcOverlayHeight  = calcOverlayHeight;

			// Functions

			function reset() {
                $fields_filter.reset();
				$rootScope.$broadcast('filterData');
			}

			function send() {
                $fields_filter.apply();
                $rootScope.$emit('hideFilter');
				$rootScope.$broadcast('filterData');
			}

			function calcOverlayHeight() {
                vm.height = document.getElementById('filter').scrollHeight;
            }
		}
})();