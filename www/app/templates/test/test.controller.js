(function(){
	'use strict';

	angular.module('app.test')
		.controller('testCntr', testCntr);

		function testCntr($app, $state, $api, ionicDatePicker, $catalog, $ionicLoading, testConst, $stateParams, $tests, $timeout, $ionicScrollDelegate) {

			var vm = this;

			// Data
            vm.page  = 0;

			vm.products = [];
			vm.container  = [];

			// Method

			vm.phoneFocus = phoneFocus;
			vm.dateFocus = dateFocus;
			vm.backToPrevState = $app.backToPrev;

			vm.scrollTop   = scrollTop;
			vm.setTest   = setTest;
			vm.endOfTest = endOfTest;

			if($stateParams.gender && angular.isDefined($stateParams.answer)){
			    var gender = $stateParams.gender;
			    if(gender == 'm') gender = 'man';
			    else if(gender == 'f') gender = 'woman';
				vm.test = 'result';
                var arom = $tests.getSurveys(gender, $stateParams.answer).map(function (item) {
					return +item.id || null;
                });
                vm.psychotype  = testConst.psychotype[gender][$stateParams.answer];
                $catalog.catalog().then(function (catalog) {
                    vm.products = catalog.filter(function (item) {
						return arom.indexOf(+item.id) !== -1;
                    });
                });
			}

			// Functions
			function phoneFocus(e) {
				setTimeout(function () {
                    e.target.setSelectionRange(1,1);
                },1);

			}
			function dateFocus(e) {
                var options = {
                    callback: function (val) {
                        var date = new Date(val);
                        vm.birthday = Math.round(date.getTime() / 1000);
                        vm.maskDate = date.getDate() + '/' + ("0"+-~(date.getMonth())).substr(-2,2) + '/' + date.getFullYear();
                        e.target.blur();
                    },
                    to: new Date(),
                    dateFormat : 'dd/MM/yyyy',
                    inputDate: new Date(),
                    mondayFirst: true,
                    closeOnSelect: false,
                    templateType: 'modal',
                    selectMode: 'day',
                    monthsList : [
                         "январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
                    ],
                    weeksList : [
                         "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"
                    ],
                    setLabel : 'Выбрать дату',
                    closeLabel : 'Отмена'
                };
                ionicDatePicker.openDatePicker(options);
			}

			function scrollTop() {
                $ionicScrollDelegate.scrollTop();
                //$('.b-test__content').scrollTop(0);
            }

			function setTest(e) {
                $ionicLoading.show({
                    template: 'Загрузка теста'
                });
                e.target.blur();
                $timeout(function () {
                    $ionicLoading.hide();
                    $ionicScrollDelegate.scrollTop();
                    //$('.b-test__content').scrollTop(0);
                    vm.test = true;
                    vm.questions = testConst.questions[vm.selectGender];
                    vm.pages = vm.questions.length;
                }, 1000);
			}

			vm.aromaRequest = function () {
                $ionicLoading.show({
                    template: 'Отправка сообщения...'
                });
				$api.test.aromaRequest(function (data) {
                    $ionicLoading.hide();
					if(!data.error){
						$state.go('app.main.chat',{id : data.message.dialog_id})
					}
                });
            };

			function endOfTest() {
				var answers = [], answer = 0, max, i;

                for (i in vm.container) {
                	var a = +vm.container[i];
                    if(!answers[a]) answers[a] = 0;
                    answers[a]++;
                }

                max = answers[0] || 0;
				for (i = 1; i < answers.length; i++) {
					if (answers[i] && max < answers[i]) {
                        max = answers[i];
                        answer = i;
					}
				}

				var result = {
					gender   : vm.selectGender == 'woman' ? 'f' : 'm',
					fio      : vm.fio,
					birthday : vm.birthday,
					phone    : vm.phone || 0,
					result_id   : answer
				};

                $tests.addResult(result);
				$state.go('app.main.test.result', {gender : vm.selectGender, answer : answer});
			}

		}

})();