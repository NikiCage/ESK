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
        .factory('$api', apiService);

    /** @ngInject */
    function apiService($resource, defaultConst)
    {
        var api = {};

        api.url = defaultConst.apiUrl;

        api.network = $resource( null, null, {
            'getConsultant' : {
                url : api.url + 'users/getConsultant',
                params : {
                    number : "@number"
                },
                method: "GET"
            }
        });

        api.notify = $resource( null, null, {
            'confirm' : {
                url : api.url + 'notify/confirm',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: "POST"
            }
        });

        api.service = $resource( null, null, {
            'versions' : {
                url : api.url + 'service/versions',
                method: "GET"
            }
        });

        api.market = $resource( null, null, {
            'catalog' : {
                url : api.url + 'market/catalog',
                token : true,
                method: "GET"
            },
            'catalogItems' : {
                url : api.url + 'market/catalogItems',
                params : {
                    id : '@id',
                    mode: 'mobile',
                    filter : '@filter'
                },
                token : true,
                method: "GET"
            },
            'getDescription' : {
                url : api.url + 'market/itemDescription',
                params : {
                    id : "@id"
                },
                method: "GET"
            },
            'buyRequest' : {
                url : api.url + 'surveys/buyRequest',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                token : true,
                method: "POST"
            }
        });

        api.auth = $resource( null, null, {
            'consultant' : {
                url : api.url + 'auth/consultant',
                params : {
                    id    : '@id'
                },
                token : true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: "POST"
            },
            'login' : {
                url : api.url + 'auth/credentials',
                params : {
                    login : '@login',
                    password : '@password'
                },
                method: "GET"
            },
            'logout' : {
                url : api.url + 'auth/logout',
                token : true,
                method: "GET"
            },
            'ping' : {
                url : api.url + 'auth/ping',
                method: "GET"
            },
            'anonymous' : {
                url : api.url + 'auth/anonymous',
                method: "GET"
            },
            'referral' : {
                url : api.url + 'auth/checkReferral',
                method: "GET"
            },
            'code' : {
                url : api.url + 'auth/code',
                params : {
                    code : "@code",
                    phone: "@phone"
                },
                token : true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: "POST"
            },
            'codeRequest' : {
                url : api.url + 'auth/codeRequest',
                params : {
                    phone : '@phone'
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: "POST"
            }
        });

        api.test = $resource( null, null, {
            'addResult' : {
                url : api.url + 'surveys/addResult',
                params : {
                    result : "@result"
                },
                token : true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: "POST"
            },
            'deleteResult' : {
                url : api.url + 'surveys/deleteResult',
                token : true,
                method: "GET"
            },
            'aromaRequest' : {
                url : api.url + 'surveys/aromaRequest',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                token : true,
                method: "POST"
            },
            'list' : {
                url : api.url + 'surveys/list',
                token : true,
                method: "GET"
            },
            'surveys' : {
                url : api.url + 'public/files/surveys.json',
                method: "GET"
            }
        });

        api.dictionary = $resource( null, null, {
            'get' : {
                url : api.url + 'dictionary/',
                params : {
                    name : "@name"
                },
                method: "GET"
            },
            'icons' : {
                url : api.url + 'dictionary/icons',
                params : {
                    dictionary : "@name",
                    id         : "@id"
                },
                method: "GET"
            }
        });

        api.crm = $resource( null, null, {
            'list' : {
                url : api.url + 'crm/list',
                token : true,
                method: "GET"
            },
            'save' : {
                url : api.url + 'crm/save',
                token : true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: "POST"
            }
        });

        api.chat = $resource( null, null, {
            'dialogs' : {
                url : api.url + 'chat/dialogs',
                token : true,
                method: "GET"
            },
            'messages' : {
                url : api.url + 'chat/messages',
                params : {
                    dialog_id : "@dialog_id"
                },
                token : true,
                method: "GET"
            },
            'newMessages' : {
                url : api.url + 'chat/newMessages',
                token : true,
                method: "GET"
            },
            'send' : {
                url : api.url + 'chat/send',
                params : {
                    dialog_id : "@dialog_id",
                    text : "@text"
                },
                token : true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: "POST"
            }
        });

        api.serverError = function () {
            console.log('error');
        };
        return api;
    }

})();
