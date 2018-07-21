(function ()
{
    'use strict';

    angular
        .module('app')
        .factory('$fx', fxService);

    /** @ngInject */
    function fxService($q, defaultConst) {
        
        function resolve(deferred, data) {
            if(deferred.pending){
                deferred.promise.$$state.status = 0;
                deferred.promise.$$state.pending = deferred.pending;
            } else
                deferred.pending = angular.copy(deferred.promise.$$state.pending);
            deferred.resolve(data);
        }
        
        function defer() {
            return $q.defer()
        }

        function parseThumb(type ,id, width, height) {
            if(!height) height = width;
            return defaultConst.thumbUrl
                .replace('%type%',type)
                .replace('%mode%',type == 'users' ? 'avatar' : 'photo')
                .replace('%id%',id)
                .replace('%width%',width)
                .replace('%height%',height)

        }
        function replaceTerminate($num,$str,replacer){
            var $number = $num % 100,$terminate;
            if($number > 10 && $number < 15){
                $terminate  = replacer[2];
            } else {
                $number = $num % 10;
                if($number == 0) {$terminate = replacer[2];}
                if($number == 1 ) {$terminate = replacer[0];}
                if($number > 1 ) {$terminate = replacer[1];}
                if($number > 4 ) {$terminate = replacer[2];}
            }
            return $str.replace('%terminate%',$terminate);
        }

        function parseTemplate(template,params){
            var _template = template;
            for (var i in params){
                if(angular.isString(params[i]) || angular.isNumber(params[i]))
                    _template = _template.replace(new RegExp('%' + i + '%','g'),params[i]);
            }
            return _template;
        }
        
        function random() {
            return Math.random() * 100;
        }

        function findIndexInArr(arr, id){
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if(item.id == id) return i;
            }
            return -1;
        }
        
        return {
            random: random,
            findIndexInArr: findIndexInArr,
            parseTemplate: parseTemplate,
            replaceTerminate: replaceTerminate,
            parseThumb: parseThumb,
            resolve: resolve,
            defer: defer
        };
    }

})();