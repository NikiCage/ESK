//FOR WORDPRESS INTEGRATION 
var Wordpress_UserName = "en.blog.wordpress.com";

//wordpress


//FOR FLICKR INTEGRATION
//var Api_Key = "477a6eb655b448de7fffcb16ae4455b2";
var Api_Key = "3e67f6179c11014cc027c6a944d7d9fb";
//var User_Key = "133690617@N02";
var User_Key = "132717193@N04";


angular.module('starter.config', [])
    .constant('WORDPRESS_API_URL', 'https://public-api.wordpress.com/rest/v1.1/')
    .constant('Wordpress_UserName', Wordpress_UserName)
    .constant('FLICKR_API_URL', 'https://api.flickr.com/services/rest/?&method=flickr.galleries.getList&api_key='+Api_Key+'&user_id='+User_Key+'&format=json&nojsoncallback=1')
    .constant('FLICKR_GALLERY_API_URL', 'https://api.flickr.com/services/rest/?&method=flickr.galleries.getPhotos&api_key='+Api_Key+'&')

;