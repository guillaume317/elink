angular.module('el1.login', ['el1.services.commun', 'el1.model', , 'LocalStorageModule'])
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
            $scope.selectedIndex = 0;
            $scope.$watch('selectedIndex', function(current, old) {
                switch (current) {
                    case 0:
                        $state.go('nonLu-view');
                        break;
                    case 1:
                        $state.go('bibli-view');
                        $location.path("/nonLu/view");
                        break;
                    case 2:
                        $state.go("cercle-view");
                        break;
                }
            });

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

            $scope.logout = function() {
                AuthService.logout().then (function() {
                    $scope.authenticationError = false;
                    $rootScope.user= undefined;
                    localStorageService.set('user', undefined);
                    $location.path("/");
                }, function(erreur) {
                    console.log(erreur);
                    $scope.authenticationError = true;
                });
            }

    });