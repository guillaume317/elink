angular.module('el1.login', ['el1.services.commun', 'el1.model', 'LocalStorageModule'])
    .config(function ($stateProvider) {

        $stateProvider.state('showLogin', {
            url: '/showLogin',
            data:{ pageTitle: 'Login' },
            views: {
                "main": {
                    controller: 'LoginCtrl',
                    templateUrl: 'src/app/login/login.tpl.html'
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
    .controller('LoginCtrl', function($state, $rootScope, $scope, $http, $location, AuthService, Env, localStorageService, $log) {

            $scope.credentials = {};

            $scope.login = function () {
                AuthService.login($scope.credentials).then (function() {
                    $scope.authenticationError = false;
                    $rootScope.user= Env.getUser();
                    localStorageService.set('user', Env.getUser());
                    $location.path("/home");
                }, function(erreur) {
                    $scope.authenticationError = true;
                });
            };

    });