angular.module('el1.login', ['el1.services.commun', 'el1.model', 'ngCookies'])
    .config(function ($stateProvider) {

        $stateProvider.state('showLogin', {
            url: '/showLogin',
            data:{ pageTitle: 'Login' },
            views: {
                "main": {
                    controller: 'LoginCtrl',
                    templateProvider: function($templateCache){
                        return $templateCache.get('app/login/login.tpl.html');
                    }
                    //templateUrl: 'src/app/login/login.tpl.html'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('login');
                    return $translate.refresh();
                }]
            }
        });


    })
    .controller('LoginCtrl', function($q, $state, $rootScope, $scope, $log, FBURL, $cookieStore, $firebaseAuth, GOOGLEAUTHSCOPE, UsersManager) {

        var ref = new Firebase(FBURL);
        var auth = $firebaseAuth(ref);

        $scope.login = function () {

            // login with Google
            /**
             {
                 "provider":"google",
                 "uid":"google:101057261296257366646",
                 "google":{
                 "id":"101057261296257366646",
                     "accessToken":"ya29.RwJdbjoUQcUYnK1Q47kfKWeQaI3PzPjJ22khRnCziNP5uo0YDR5oYSKyyuxih4xPJC0q",
                     "displayName":"Matthieu Guillemette",
                     "email":"matguillem37@gmail.com",
                     "cachedUserProfile":{
                     "id":"101057261296257366646",
                         "email":"matguillem37@gmail.com",
                         "verified_email":true,
                         "name":"Matthieu Guillemette",
                         "given_name":"Matthieu",
                         "family_name":"Guillemette",
                         "link":"https://plus.google.com/101057261296257366646",
                         "picture":"https://lh5.googleusercontent.com/-P5f4pPq_mUw/AAAAAAAAAAI/AAAAAAAAGKs/4Xo0LqHkan4/photo.jpg",
                         "locale":"fr"
                 },
                 "profileImageURL":"https://lh5.googleusercontent.com/-P5f4pPq_mUw/AAAAAAAAAAI/AAAAAAAAGKs/4Xo0LqHkan4/photo.jpg"
             },
                 "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6Imdvb2dsZToxMDEwNTcyNjEyOTYyNTczNjY2NDYiLCJwcm92aWRlciI6Imdvb2dsZSJ9LCJpYXQiOjE0NDk4MzA5NDh9.MrQcVmJ1WJ9W16J5_x3XEYUxS4KKqSVDQGgVtp7pRBg",
                 "auth":{
                 "uid":"google:101057261296257366646",
                     "provider":"google"
             },
                 "expires":1449917348
             }*/

            auth.$authWithOAuthPopup("google", {remember: "sessionOnly",scope: GOOGLEAUTHSCOPE})
                .then(function (authData) {
                    return $q.when(authData);
                })
                .then(function(authData) {
                    return UsersManager.addUser(authData);
                })
                .then(function(userConnected) {
                    return UsersManager.addUserEmail(userConnected);
                })
                .then(function(userConnected) {
                    $rootScope.userAuthenticated = true;
                    $cookieStore.put('user', userConnected);
                    $rootScope.userEmail = userConnected.email;
                    return $q.when(userConnected);
                })
                .then (function(userConnected) {
                    $state.go('bibli-nonLu');
                })
                .catch(function (error) {
                    $log.info("Authentication failed:", error);
                });
        }

    });