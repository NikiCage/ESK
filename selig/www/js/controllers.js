var abc = 0;
angular.module('starter.controllers', ['myservices'])
    .controller('AppCtrl', function($scope, $ionicScrollDelegate) {


        //****** Code For changing header color on scrolling ******

        $scope.navClass = 'bar-stable';

        var maindele = $ionicScrollDelegate.$getByHandle('mainScroll');
        abc = maindele;

        $scope.mainscrolling = function() {
            var topscroll = maindele.getScrollPosition().top;
            var oncomblack = 300.0;
            var coloropacity = topscroll / oncomblack;
            $(".navClass ion-header-bar").css("background", "-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(64, 62, 93," + coloropacity + ")), color-stop(100%,rgba(255,255,255,0.00)))");

        };



        $scope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                $(".navClass ion-header-bar").css("background", "-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(64, 62, 93," + 0 + ")), color-stop(100%,rgba(255,255,255,0.00)))");
            });

        //    ****** End ******

    })

.controller('ArticlesCtrl', function($scope, $ionicScrollDelegate, MyServices, $stateParams) {

    //    * * * * * * Code For Show More texts * * * * * *

    $scope.showDetails = "dontshow";
    $scope.moredetails = "Read More";
    $scope.showmore = function(classname) {
        var newheight = $(".moretext." + classname).height();
        console.log(newheight);
        if ($scope.showDetails == "showmore") {
            $scope.showDetails = "dontshow";
            $(".addanimation").height(0);
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
            $scope.moredetails = "Read More";
        } else {
            $scope.showDetails = "showmore";
            $(".addanimation").height(newheight);

            $scope.moredetails = "Hide";
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
        }

    };


    //    * * * * * * End * * * * * *


    //    ****** More Text Json Format data ******

    $scope.moretext = [{
        more: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam aliquet ultrices dignissim. Donec pretium et dui ut imperdiet. Aliquam et urna non neque tempor vehicula at quis justo. Ut eleifend odio justo, et finibus mi aliquet vitae. Etiam euismod dapibus arcu nec pellentesque. Suspendisse faucibus velit ornare, tincidunt massa in, ullamcorper lectus. Quisque semper venenatis nulla, at auctor libero pharetra ultrices. Duis ut enim egestas, varius lorem ac, sodales sapien."

    }];


    MyServices.getWordpressPostsById(function(data, status) {
        console.log(data);
        $scope.post = data;
    });


    //    $scope.post = MyServices.getPostDetail();
    //    console.log($scope.txts);
    //    if ($scope.post.type == 'photo') {
    //        $scope.images = $scope.post.photos.splice(1, $scope.post.photos.length - 1);
    //    }
    //    console.log($scope.post);

    //    ****** End ******

})
    .controller('HomeCtrl', function($scope, $ionicScrollDelegate, $window, MyServices, $location, $ionicLoading) {

        //****** Code For changing header color on scrolling ******




        $scope.text = [];
        $scope.photo = [];
        $scope.link = [];

        $scope.navClass = 'bar-stable';
        angular.element($window).bind(
            "scroll",
            function() {
                console.log(window.pageYOffset);
                if (window.pageYOffset > 0) {
                    $scope.navClass = 'bar-stables';
                } else {
                    $scope.navClass = 'bar-stable';
                }
                $scope.$apply();
            });

        //    ****** End ******

        //        ***** tabchange ****

        $scope.tab = 'text';
        $scope.classa = 'active';
        $scope.classb = '';
        $scope.classc = '';
        $scope.tabchange = function(tab, a) {
            //        console.log(tab);
            $scope.tab = tab;
            if (a == 1) {
                $ionicScrollDelegate.scrollTop();
                $scope.classa = "active";
                $scope.classb = '';
                $scope.classc = '';
            } else if (a == 2) {
                $ionicScrollDelegate.scrollTop();
                $scope.classa = '';
                $scope.classb = "active";
                $scope.classc = '';
            } else {
                $ionicScrollDelegate.scrollTop();
                $scope.classa = '';
                $scope.classb = '';
                $scope.classc = "active";
            }
        };


        //            ******** end *******


        $ionicLoading.show({
                        content: 'Uploading Image',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: '0'
                    });
    
        $scope.postDetail = function(post) {
            $.jStorage.set("detail", post);
            $location.url("app/articles");
        }

        MyServices.getWordpressPosts(function(data, status) {
            $ionicLoading.hide();
            
        console.log("my post");
            console.log(data);
            $scope.text = data.posts;
        });

        MyServices.getFreshlyPressed(function(data, status) {
            console.log(data);
            $scope.photo = data.posts;
        });
    
        MyServices.getSiteComment(function(data, status) {
            console.log(data);
            $scope.link = data.comments;
        });


        //    ******* End ******

    })


    .controller('HometwoCtrl', function($scope, $ionicScrollDelegate, $window, MyServices, $location, $ionicLoading) {

        //****** Code For changing header color on scrolling ******



        $scope.text = [];
        $scope.photo = [];
        $scope.link = [];

        $scope.navClass = 'bar-stable';
        angular.element($window).bind(
            "scroll",
            function() {
                console.log(window.pageYOffset);
                if (window.pageYOffset > 0) {
                    $scope.navClass = 'bar-stables';
                } else {
                    $scope.navClass = 'bar-stable';
                }
                $scope.$apply();
            });

        //    ****** End ******

        //        ***** tabchange ****

        $scope.tab = 'text';
        $scope.classa = 'active';
        $scope.classb = '';
        $scope.classc = '';
        $scope.tabchange = function(tab, a) {
            //        console.log(tab);
            $scope.tab = tab;
            if (a == 1) {
                $ionicScrollDelegate.scrollTop();
                $scope.classa = "active";
                $scope.classb = '';
                $scope.classc = '';
            } else if (a == 2) {
                $ionicScrollDelegate.scrollTop();
                $scope.classa = '';
                $scope.classb = "active";
                $scope.classc = '';
            } else {
                $ionicScrollDelegate.scrollTop();
                $scope.classa = '';
                $scope.classb = '';
                $scope.classc = "active";
            }
        };


        //            ******** end *******


        $ionicLoading.show({
                        content: 'Uploading Image',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: '0'
                    });
    
        $scope.postDetail = function(post) {
            $.jStorage.set("detail", post);
            $location.url("app/articles");
        }

        MyServices.getWordpressPosts(function(data, status) {
            $ionicLoading.hide();
            
        console.log("my post");
            console.log(data);
            $scope.text = data.posts;
        });

        MyServices.getFreshlyPressed(function(data, status) {
            console.log(data);
            $scope.photo = data.posts;
        });
    
        MyServices.getSiteComment(function(data, status) {
            console.log(data);
            $scope.link = data.comments;
        });


        //    ******* End ******

    })


.controller('UserloginCtrl', function($scope, $stateParams) {})


.controller('FaqCtrl', function($scope, $stateParams, $ionicScrollDelegate) {

    //    ****** More Text Json Format data ******

    $scope.showDetails = "dontshow";
    $scope.moredetails = "Read More";
    $scope.showmores = function(index) {
        console.log(index);
        var newheight = $(".animationfaq" + index).height();
        console.log(newheight);
        $(".faqhead").height(0);
        $(".faqhead" + index).height(newheight + 10);
        $ionicScrollDelegate.resize();


    };

    //    ****** End ******



    //    ****** FAQ Json Format data ******

    $scope.faq = [{
        id: 0,
        qsn: "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry ? ",
        ans: "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid."
    }, {
        id: 1,
        qsn: "Nulla nisi dolor, tempus non urna id, volutpat tempus massa ? ",
        ans: "Praesent aliquet orci vel varius egestas. Suspendisse commodo massa ligula, eu lobortis sem ultricies convallis."
    }, {
        id: 2,
        qsn: "Phasellus pulvinar sollicitudin nisi, at commodo augue molestie at.?  ",
        ans: "Nam tempor fringilla posuere. Donec lacinia sed odio ac interdum"
    }, {
        id: 3,
        qsn: "Nullam pharetra vehicula suscipit ? ",
        ans: "Nunc lacinia justo non libero sollicitudin imperdiet."
    }, {
        id: 4,
        qsn: "Morbi placerat lectus ac neque cursus, molestie pulvinar ipsum posuere? ",
        ans: " In vitae ultricies mi, sit amet pharetra ex. Suspendisse condimentum pulvinar erat sed venenatis."
    }];

    //    ****** End ******


})
    .controller('AboutCtrl', function($scope, $stateParams, $window, $ionicScrollDelegate) {


        //    ****** About Content Json Format data ******

        $scope.abouthead = [{
            content: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."

        }];
        $scope.content = [{
            detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a massa sit amet justo pretium condimentum. Integer sed lectus sit amet leo dictum ullamcorper nec in tellus. Quisque vitae venenatis eros, vitae venenatis eros. Maecenas nec leo non tortor dignissim fermentum sed aliquet ligula."

        }];
        $scope.moretext = [{
            more: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam aliquet ultrices dignissim. Donec pretium et dui ut imperdiet. Aliquam et urna non neque tempor vehicula at quis justo. Ut eleifend odio justo, et finibus mi aliquet vitae. Etiam euismod dapibus arcu nec pellentesque. Suspendisse faucibus velit ornare, tincidunt massa in, ullamcorper lectus. Quisque semper venenatis nulla, at auctor libero pharetra ultrices. Duis ut enim egestas, varius lorem ac, sodales sapien."

        }];

        //    ****** End ******


        //    ****** More Text Json Format data ******

        $scope.showDetails = "dontshow";
        $scope.moredetails = "Read More";
        $scope.showmore = function(classname) {
            var newheight = $(".moretext." + classname).height();
            console.log(newheight);
            console.log("show more clicked");
            if ($scope.showDetails == "showmore") {
                $scope.showDetails = "dontshow";
                $(".addanimation").height(0);
                $scope.moredetails = "Read More";
                $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
            } else {
                $scope.showDetails = "showmore";
                $(".addanimation").height(newheight);
                $scope.moredetails = "Hide";
                $ionicScrollDelegate.$getByHandle('mainScroll').resize();
                $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
            }

        };

        //***** End ******

    })
    .controller('ContactCtrl', function($scope, $stateParams) {

        //        ***** tabchange ****

        $scope.tab = 'form-set';
        $scope.classa = 'map-active';
        $scope.classb = '';

        $scope.tabchange = function(tab, a) {

            $scope.tab = tab;
            if (a == 1) {
                $scope.classa = "map-active";
                $scope.classb = '';

            } else {
                $scope.classa = '';
                $scope.classb = "map-active";

            }
        };

        //    ****** End ******

    })


.controller('SettingCtrl', function($scope, $stateParams) {})
.controller('ProfileCtrl', function($scope, $stateParams) {})


.controller('GallerycategoryCtrl', function($scope, $stateParams, $ionicModal, $ionicSlideBoxDelegate, MyServices) {

    //    ****** Gallery Images Json Format data ******
	$scope.name = $stateParams.name;

    MyServices.getFlickrGallaryPhotos($stateParams.id, function(data, status) {
        console.log(data);
        $scope.innergallery = data.photos.photo;
        $scope.newgallery = splitarray(data.photos.photo, 2);
    });

    //    ****** End *******

    //    ****** Code For Open Image In popup ******

    $ionicModal.fromTemplateUrl('templates/galleryimages.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;

        $scope.modal.show();
        console.log($ionicSlideBoxDelegate.slide(0));
        $ionicSlideBoxDelegate.update();
        $scope.modal.hide();
    });


    $scope.firstslide = false;
    $scope.openModal = function(index) {
        console.log(index);
        $scope.firstslide = true;
        $scope.modal.show();
        setTimeout(function() {
            $ionicSlideBoxDelegate.slide(index);
        }, 100);

    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    //    ****** End *******

})
    .controller('GalleryCtrl', function($scope, $stateParams, MyServices) {

        //    ****** Code For Calling Images Json Format ******


        //        $scope.gallery = [{
        //            id: 1,
        //            imagename: "People",
        //            imgpath: "img/gallery/demo500x313.png"
        //        }, {
        //            id: 2,
        //            imagename: "Travel",
        //            imgpath: "img/gallery/demo500x313.png"
        //        }, {
        //            id: 3,
        //            imagename: "Nature",
        //            imgpath: "img/gallery/demo500x313.png"
        //        }, {
        //            id: 4,
        //            imagename: "Art",
        //            imgpath: "img/gallery/demo500x313.png"
        //        }, {
        //            id: 5,
        //            imagename: "Miscellaneous",
        //            imgpath: "img/gallery/demo500x313.png"
        //        }, {
        //            id: 6,
        //            imagename: "Fashion",
        //            imgpath: "img/gallery/demo500x313.png"
        //        }, {
        //            id: 7,
        //            imagename: "Business",
        //            imgpath: "img/gallery/demo500x313.png"
        //        }];


        MyServices.getFlickrGallary(function(data, status) {
            console.log(data);
            $scope.isgallary = data;
            $scope.gallerynew = splitarray(data.galleries.gallery, 2);
            console.log($scope.gallerynew);
        });


        //     ****** End ******

        //        $scope.gallerynew = splitarray($scope.gallery, 2);

    })


.controller('UsersignupCtrl', function($scope, $stateParams) {});