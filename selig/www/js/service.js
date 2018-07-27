var adminurl = "http://www.wohlig.co.in";

var post = [];

var myservices = angular.module('myservices', []);

myservices.factory('MyServices', function($http, WORDPRESS_API_URL, FLICKR_API_URL, FLICKR_GALLERY_API_URL, Wordpress_UserName) {

    var returnval = {};

    returnval.getFlickrGallary = function(callback) {
        return $http.get(FLICKR_API_URL).success(callback);
    };

    returnval.getFlickrGallaryPhotos = function(id, callback) {
        return $http.get(FLICKR_GALLERY_API_URL + "gallery_id=" + id + "&format=json&nojsoncallback=1").success(callback);
    };

    returnval.getWordpressPosts = function(callback) {
        var getdata = function(data, status) {
            return $http.get(data.meta.links.posts).success(callback);
        }
        $http.get(WORDPRESS_API_URL + "sites/"+Wordpress_UserName).success(getdata);
    };
    returnval.getSiteComment = function(callback) {
        var getdata = function(data, status) {
            console.log("in services");
            console.log(data);
            return $http.get(data.meta.links.comments).success(callback);
        }
        $http.get(WORDPRESS_API_URL + "sites/"+Wordpress_UserName).success(getdata);
    };

    returnval.getWordpressPostsById = function(callback) {
        $http.get($.jStorage.get('detail')).success(callback);
    };

    returnval.getFreshlyPressed = function(callback) {
        $http.get(WORDPRESS_API_URL + "freshly-pressed/?number=20").success(callback);
    };

    returnval.postDetail = function(post) {
        $.jStorage.set("detail", post);
    };

    returnval.getPostDetail = function() {
        return $.jStorage.get("detail");
    };

    return returnval;
});