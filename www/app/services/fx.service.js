(function ()
{
    'use strict';

    angular
        .module('app')
        .filter('ids', ids)
        .factory('$fx', fxService);

    /** @ngInject */
    function fxService($q, defaultConst, $http, $app) {
        
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
        
        function pair($root) {
            let _root = [];

            for (let i = 0; i < $root.length; i++) {
                const arrindex = Math.floor(i / 2);
                if ((_root.length - 1) != arrindex) {
                    _root[arrindex] = [];
                }
                let obj = $root[i];
                if(!angular.isObject(obj)) obj = {source : obj};
                obj.id = i;
                _root[arrindex].push(obj);
            }

            return _root;
        }

        function mail(email, text) {
            let fd = new FormData();
            fd.append('from', defaultConst.mailgun.from);
            fd.append('to', email);
            fd.append('subject', 'Заявка на проведение мероприятия');
            fd.append('text', text);

            $http.post(
                'https://cors-anywhere.herokuapp.com/https://api.mailgun.net/v3/' + defaultConst.mailgun.domain + '/messages',
                fd,
                {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Basic ' + defaultConst.mailgun.token
                    }
                }).then(function(response) {
                if (response.statusText && response.statusText === 'OK') {
                    $app.toast('Письмо отправлено');
                }
            }, function(err) {
                $app.toast('Ошибка отправки');
            });
        }

        function ids(obj) {
            for (let id in obj) {
                obj[id].id = id;
            }
            return Object.values(obj);
        }
        
        return {
            mail: mail,
            pair: pair,
            ids: ids,
            random: random,
            findIndexInArr: findIndexInArr,
            parseTemplate: parseTemplate,
            replaceTerminate: replaceTerminate,
            parseThumb: parseThumb,
            resolve: resolve,
            defer: defer
        };
    }

    function ids($fx) {
        return function(obj) {
            return $fx.ids(obj);
        };
    }

})();