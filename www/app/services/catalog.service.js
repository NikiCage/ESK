(function () {
    'use strict';

    angular
        .module('app')
        .factory('$catalog', catalogService);

    /** @ngInject */
    function catalogService($app, $q, $api, $localStorage, $ionicLoading, $currencies, $dictionary, $icons, $images, $tests) {
        var catalog = [], inited = false,
            categories = [],
            allDefer = $q.defer(), allPromise = allDefer.promise,
            categoryDefer = $q.defer(), categoryPromise = categoryDefer.promise,
            catalogDefer = $q.defer(), catalogPromise = catalogDefer.promise;

        var service = {
            init: init,
            catalog: function(){return catalogPromise},
            categories: function(){return categoryPromise},
            all: function(){return allPromise},
            findObject: findObject,
            getCategory: getCategory,
            getObjects: getObjects,
            getObjectsWithCollection: getObjectsWithCollection,
            getObject: getObject,
            searchByCatalog: searchByCatalog,
            refresh : refresh
        };

        return service;

        //////////

        function init() {
            if(inited) return false;
            $app.versions().then(function (versions) {
                if(versions.catalog !== $localStorage.catalogVersion) {
                    var promises = [];
                    $ionicLoading.show({
                        template: 'Обновление каталога...',
                        duration: 1500
                    });
                    promises.push($api.market.catalog({ mode : 'mobile' })
                        .$promise.then(function(response){
                            if (response.data && response.data.data) {
                                categories = response.data.data;
                                $localStorage.catalogCategories = categories;
                                categoryDefer.resolve(categories);
                                return categories;
                            }
                            return false;
                    }));
                    promises.push($api.market.catalogItems({ mode : 'mobile' })
                        .$promise.then(function(response){
                            if (response.data && response.data.length > 0) {
                                catalog = response.data;
                                $localStorage.catalogObjects = catalog;
                                catalogDefer.resolve(catalog);
                                return catalog;
                            }
                            return false;
                    }));
                    promises.push($api.market.catalogItems({ mode : 'mobile' })
                        .$promise.then(function(response){
                            if (response.data && response.data.length > 0) {
                                catalog = response.data;
                                $localStorage.catalogObjects = catalog;
                                catalogDefer.resolve(catalog);
                                return catalog;
                            }
                            return false;
                    }));
                    promises.push($currencies.getPromise(true));
                    promises.push($dictionary.getDictionary('gender', true));
                    promises.push($dictionary.getDictionary('aroma_families', true).then(iconsLoad('aroma_families')));
                    promises.push($dictionary.getDictionary('aroma_styles', true).then(iconsLoad('aroma_styles')));
                    promises.push($dictionary.getDictionary('aroma_characters', true).then(iconsLoad('aroma_characters')));
                    promises.push($dictionary.getDictionary('aroma_collections', true));
                    promises.push($tests.reloadSurveys());
                    $q.all(promises).then(function (results) {
                        if(results[0] && results[1]){
                            allDefer.resolve(results[1]);
                            $localStorage.catalogVersion = versions.catalog;
                            imagesLoad();
                        }
                    });
                }else{
                    loadFromCache();
                }
            }).catch(loadFromCache);
            inited = true;
        }

        function refresh() {
            inited = false;
            $localStorage.catalogVersion = null;

            allDefer = $q.defer();
            allPromise = allDefer.promise;
            categoryDefer = $q.defer();
            categoryPromise = categoryDefer.promise;
            catalogDefer = $q.defer();
            catalogPromise = catalogDefer.promise;
        }

        function iconsLoad(source){
            return function (response) {
                if(response){
                    for (var i = 0; i < response.length; i++) {
                        var item = response[i];
                        if(item.id) $icons.getIcons(source, item.id);
                    }
                }
            }
        }

        function imagesLoad(){
            var promises = [];
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i];
                if(category.items)
                    for (var j = 0; j < category.items.length; j++) {
                        var subcategory = category.items[j];
                        promises.push($images.getImage('categories', subcategory.id, null, true));
                    }
            }
            $q.all(promises).then(function () {
                for (var i = 0; i < catalog.length; i++) {
                    $images.getImage('goods', catalog[i].id, null, true)
                }
            });
        }

        function loadFromCache() {
            if($localStorage.catalogCategories){
                categories = $localStorage.catalogCategories;
                categoryDefer.resolve(categories);
            }else{
                categoryDefer.reject();
            }
            if($localStorage.catalogObjects){
                catalog = $localStorage.catalogObjects;
                catalogDefer.resolve(catalog);
            }else{
                catalogDefer.reject();
            }
            if(categories.length && catalog.length){
                allDefer.resolve(catalog);
            }else{
                allDefer.reject();
            }
        }

        function findCategory(id) {
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i];
                if(category.items)
                    for (var j = 0; j < category.items.length; j++) {
                        var subcategory = category.items[j];
                        if (parseInt(subcategory.id) === parseInt(id)) {
                            return subcategory
                        }
                    }
            }
            return false;
        }

        function findObject(id) {
            for (var i = 0; i < catalog.length; i++) {
                if (parseInt(catalog[i].id) === parseInt(id)) {
                    return catalog[i];
                }
            }
            return false;
        }

        function getCategory(id) {
            var deferred = $q.defer();
            categoryPromise.then(function () {
                deferred.resolve(findCategory(id));
            }).catch(deferred.reject);

            return deferred.promise;
        }

        function getObject(id) {
            var deferred = $q.defer();

            allPromise.then(function () {
                deferred.resolve(findObject(id));
            }).catch(deferred.reject);

            return deferred.promise;
        }

        function getObjects(id) {
            var deferred = $q.defer();

            catalogPromise.then(function () {
                deferred.resolve(catalog.filter(function(obj){
                    return obj.category_id == id;
                }));
            }).catch(deferred.reject);

            return deferred.promise;
        }

        function getObjectsWithCollection() {
            var deferred = $q.defer();

            catalogPromise.then(function () {
                deferred.resolve(catalog.filter(function(obj){
                    return !!obj.collection_id;
                }));
            }).catch(deferred.reject);

            return deferred.promise;
        }

        function _searchField(obj, field, search) {
            return obj[field] && obj[field].toLowerCase().indexOf(search.toLowerCase()) !== -1;
        }

        function searchByCatalog(search) {
            return catalog.filter(function(obj){
                return _searchField(obj, 'name', search) || _searchField(obj, 'top_notes', search) || _searchField(obj, 'heart_notes', search) || _searchField(obj, 'plume_notes', search);
            });
        }
    }
})();