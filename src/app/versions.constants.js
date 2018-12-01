(function ()
{
    'use strict';

    var VERSIONS = {
        android : {
            current : 2,
            url : 'market://details?id=com.armelle.world'
        },
        ios : {
            current : 2,
            url : 'itms-apps://itunes.apple.com/us/app/armelle-online/id1360852142'
        },
        windows : {
            current : 2
        }
    };

    angular
        .module('app')
        .constant('VERSIONS', VERSIONS);
})();