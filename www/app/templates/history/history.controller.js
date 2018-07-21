(function(){
	'use strict';

	angular.module('app.history')
		.controller('historyCntr', historyCntr);

	function historyCntr(History, $app, $catalog, $dictionary, $tests, $user, $ionicPopup, $fx, $crm) {
		var vm = this;
        console.log(History);
		// Data
		vm.title = 'История подбора ароматов';
       	vm.crmUser = false;

       	if(!History) {
       		$app.toMainState();
       		return;
        }

		if(History.surveys){
            vm.history = History.surveys;
            if($user.getId() != History.id){
                $crm.promise().then(function() {
                    vm.crmUser = {
                    	name : $crm.findInCRM(History.id, History.phone).name,
						partner_id : History.id,
						phone : History.phone
                    };
                });
			}
		}else{
            vm.history = History;
		}

        $catalog.catalog().then(function () {
            for (var i = 0; i < vm.history.length; i++) {
                var item = vm.history[i], collections = {},
                    results = $tests.getSurveys(item.gender, item.result_id);

                if((angular.isUndefined(item.result_id) || item.result_id === null) && item.result || !results.length)
                    results = JSON.parse(item.result);

                for (var j = 0; j < results.length; j++) {
                    var obj = results[j],
                        object = $catalog.findObject(obj.id);
					if(object && object.collection_id){
                        object.number = obj.name;
                        object.color = getColor(object.gender);
                        if(!collections[object.collection_id]) collections[object.collection_id] = [];
                        collections[object.collection_id].push(object);
					}
                }
                item.collections = [];
                for (var collection_id in collections)
                    item.collections.push({
						name : $dictionary.getName('aroma_collections')(collection_id),
						goods : collections[collection_id]
					})

            }
        });


		// Method
		vm.backToPrevState = $app.backToPrev;

		vm.delete = function (row_id) {
			$ionicPopup.confirm({
                title: "Удаление элемента",
                content: "Удалить результат из истории?",
                cancelText: 'Отмена',
                okText: 'Удалить'
            }).then(function(result) {
                if(result) {
                    $tests.deleteResult(row_id);
                    var index = $fx.findIndexInArr(vm.history, row_id);
                    if(index != -1) vm.history.splice(index, 1);
                    $app.toast('LongBottom')('Результат удален');
				}
            });
        };

		// Functions
		function getColor(gender_id) {
            var gender = $dictionary.getName('gender')(gender_id);
			switch (gender) {
				case "мужской" :
					return '#81d4fa';
				case "женский" :
					return '#fa819b';
				case "унисекс" :
					return '#aed581';
				default :
					return '#ccc';
			}
		}
	}

})();