(function(){
	'use strict';

	angular.module('app.private')
		.controller('privateCntr', privateCntr);

		function privateCntr( defaultConst, $document, $user) {
			var vm = this;

            vm.token = $user.token.get();
            console.log(vm.token);
            $document.find('iframe').attr('src', defaultConst.privateUrl + '/token/' + vm.token);
        }

})();