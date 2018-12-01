(function () {
    'use strict';

    angular
        .module('app')
        .factory('$avatar', avatarService)
        .factory('$images', imagesService);

    /**
     * Сервис используется для хранения загруженных пользователем изображений в base64
     * @returns {{get: String, set: void, getImage: Object}}
     * @constructor
     */
    function imagesService($http, $fx, $q, $localStorage, $app) {
        var promises = {};
        if(!$localStorage.images) $localStorage.images = {};

        return {
            get: function(type, id, size) {
                var source = getSource(getImageSettings(type, id, size));
                return $localStorage.images[source] ? $localStorage.images[source] : false;
            },
            set: function(data, type, id, size) {
                var source = getSource(getImageSettings(type, id, size));
                $localStorage.images[source] = data;
            },
            getPromise: getPromise,
            getImage: getImage
        };

        function getImageSettings(type, id, size) {
            var width = 40, height = 40;
            switch (type) {
                case "categories" : {
                    width = height = 80;
                } break;
                case "goods" : {
                    width = height = size === 'huge' ? 180 : 125;
                } break;
                case "users" : {
                    switch (size) {
                        case "background" : {
                            width = 320;
                            height = 150;
                        } break;
                        case "huge" : {
                            width = height = 65;
                        } break;
                        default : {
                            width = height = 42;
                        }
                    }
                } break;
            }
            return {
                type : type,
                id : id,
                width : width,
                height : height
            }
        }

        function getSource(settings){
            return [settings.type, settings.id, settings.width, settings.height].join('.')
        }

        function getImage(type, id, size, force) {
            return getPromise(getImageSettings(type, id, size), force);
        }

        function getPromise(settings, force) {
            var source = getSource(settings);
            if(promises[source]) return promises[source];
            var deferred = $q.defer();
            promises[source] = deferred.promise;
            if (!$localStorage.images[source] || force) {
                if($app.connection())
                    $http.get($fx.parseThumb(settings.type, settings.id, settings.width, settings.height) + '.json', {ignoreErrors: true })
                        .success(function(data) {
                            if(data.image){
                                $localStorage.images[source] = data.image;
                                deferred.resolve(data.image);
                            }else{
                                deferred.reject();
                            }
                        })
                        .error(deferred.reject);
                else
                    deferred.reject();
            }else
                deferred.resolve($localStorage.images[source]);
            return deferred.promise;
        }
    }

    function avatarService($images, $app) {
        return $avatar;

        function $avatar(id, size) {
            if(!id) return {};
            //TODO: Подключить проверку по контактам
            if(id.indexOf('cl_') !== -1) return {};
            var avatar = {},
                image = $images.get('users', id, size);
            if(image){
                avatar.src = image;
            }
            if($app.connection()){
                avatar.promise = $images.getImage('users', id, size, true);
            }
            return avatar;
        }
    }

})();