(function(){
	'use strict';

	angular.module('app.faq')
		.controller('faqCntr', faqCntr);

		function faqCntr( $scope, $ionicScrollDelegate ) {
			var vm = this;
            console.log('faqCntr');

            $scope.showDetails = "dontshow";
            $scope.moredetails = "Read More";
            $scope.showmores = function(index) {
                console.log(index);
                var newheight = $(".animationfaq" + index).height();
                console.log(newheight);
                $(".faqhead").height(0);
                $(".faqhead" + index).height(newheight + 10);
                $ionicScrollDelegate.resize();


            };



            $scope.faq = [{
                id: 0,
                qsn: "Как оставить предзаказ?",
                ans: "Вам необходимо выбрать Спикера , тему семинара и нажать - «Жду в нашем городе». В случае проведения организатор свяжется с вами. "
            }, {
                id: 1,
                qsn: "Как оставить заявку на добавление Спикера в Приложение?",
                ans: "Чтобы мы добавили Спикера в мобильное приложение , для приглашение его в ваш город. Необходимо отправить Фамилию и имя преподавателя , организатору ( Связаться с организатором ) . "
            }, {
                id: 2,
                qsn: "Как скоро Спикер посетит наш город?",
                ans: "Это зависит от количество заявок - мониторинга. Мы обрабатываем каждый заказ. "
            }, {
                id: 3,
                qsn: "Возможно ли пригласить преподавателя с другой страны?",
                ans: "Вы можете оставить заявку , мы обязательно свяжемся со Спикерам и обсудим возможность сотрудничества."
            }, {
                id: 4,
                qsn: "Возможно ли сотрудничать с вами в качестве организатора?",
                ans: "Информация о сотрудничестве размещена на нашем сайте <a href='http://www.beauty-pb.ru/' target='_blank'>www.beauty-pb.ru</a>"
            }];
		}

})();