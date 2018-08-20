(function ()
{
    'use strict';

    var test = false, domain = test ? 'http://api.armelle-dev.ru/' : 'https://api.armelle.world/',
        defaultConst = {
            'testMode' : test,
            'siteUrl'  : domain,
            'apiUrl'   : domain,
            'privateUrl'   : test ? 'http://lk-mobile.armelle-dev.ru' : 'https://lk-mobile.armelle.world',
            'state'   : 'main.start',
            'thumbUrl' : domain + '%type%/%mode%/%id%_%width%_%height%',
            'mailgun': {
                'token': 'YXBpOjNhYzgxZGVlNmVkMWNhOTg4YjRlZmZhNWYxYTcxMjI2LTNiMWY1OWNmLWNjZjBkYjE5',
                'domain': 'mg.foxinet.ru',
                'from': 'noreply@esk.com'
            }
        };

    angular
        .module('app')
        .constant('defaultConst', defaultConst)
        .config(['$provide', function($provide) {

    $provide.decorator('mapApiLoad', [
        '$delegate', 'yaMapSettings',
        function mapApiLoadDecorator($delegate, yaMapSettings) {
            var loaded = false;
            var callbacks = [];
            var runCallbacks = function () {
                var callback;
                while (callbacks.length) {
                    callback = callbacks.splice(0, 1);
                    callback[0]();
                }
            };
            var loadUrl = 'http://api-maps.yandex.ru/2.0/?load=package.full&lang=' +
                (yaMapSettings.lang || 'ru-RU') + '&coordorder=' + (yaMapSettings.order || 'longlat');
            var _loading = false;
            var loadScript = function (url, callback) {
                if (_loading) {
                    return;
                }
                _loading = true;
                var script = document.createElement("script");
                script.type = "text/javascript";
                if (script.readyState) { // IE
                    script.onreadystatechange = function () {
                        if (script.readyState == "loaded" || script.readyState == "complete") {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else { // Другие броузеры
                    script.onload = function () {
                        callback();
                    };
                }
                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            };

            $delegate = function (callback) {
                callbacks.push(callback);
                if (loaded) {
                    runCallbacks();
                } else if (!_loading) {
                    loadScript(loadUrl, function () {
                        ymaps.ready(function () {
                            loaded = true;
                            runCallbacks();
                        });
                    });
                }
            };
            return $delegate;
        }
    ]);
}]);

})();
