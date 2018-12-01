(function ()
{
    'use strict';

    angular
        .module('app')
        .directive('fxImage', fxImage)
        .directive('fxGoodsImage', fxGoodsImage)
        .directive('fxAvatar', fxAvatar);

    /** @ngInject */
    function fxImage($images)
    {
        return {
            restrict  : 'A',
            scope     : {
                id: '@fxImage',
                type: '@type',
                size: '@size'
            },
            transclude: true,
            link: function (scope, element, attrs) {
                var image = $images.get(scope.type, scope.id, scope.size);
                if(image){
                    element.attr('src', image);
                }else{
                    element.attr('src', './img/logo.png');
                    $images.getImage(scope.type, scope.id, scope.size).then(function (data) {
                        element.attr('src', data);
                    })
                }
            }
        };
    }
    /** @ngInject */
    function fxGoodsImage($images)
    {
        return {
            restrict  : 'A',
            scope     : {
                id: '@fxGoodsImage'
            },
            transclude: true,
            link: function (scope, element, attrs) {
                var image = $images.get('goods', scope.id, 'huge');
                if(image) {
                    element.attr('src', image);
                }else {
                    var smallImage = $images.get('goods', scope.id);
                    if(smallImage){
                        element.attr('src', smallImage);
                    }else{
                        element.attr('src', './img/logo.png');
                    }
                    $images.getImage('goods', scope.id, 'huge').then(function (data) {
                        element.attr('src', data);
                    })
                }
            }
        };
    }
    /** @ngInject */
    function fxAvatar($avatar, $app)
    {
        return {
            restrict  : 'A',
            scope     : {
                id: '@fxAvatar',
                size: '@size'
            },
            transclude: true,
            link: function (scope, element) {
                var avatar = $avatar(scope.id, scope.size);

                element.attr('src', avatar.src || './img/logo.png');

                if(avatar.promise)
                    avatar.promise.then(function (data) {
                        element.attr('src', data);
                    });
            }
        };
    }


})();