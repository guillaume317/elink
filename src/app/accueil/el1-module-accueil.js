angular.module('el1.accueil', [ 'ui.router' ])
    .config(function ($stateProvider) {

        $stateProvider.state('home', {
            url: '/home',
            data:{ pageTitle: 'Home' },
            views: {
                "main": {
                    controller: 'AccueilController',
                    templateUrl: 'src/app/accueil/accueil.tpl.html'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                }]
            }
        });

    })
    .controller('AccueilController', function($rootScope, $scope, $http, $location, Env, $state, AuthService) {
        $scope.selectedIndex = 0;
        $scope.isAdmin= Env.isAdmin;
        $scope.$watch('selectedIndex', function(current, old) {
            switch (current) {
                case 0:
                    $state.go('bibli-nonLu');
                    break;
                case 1:
                    $state.go('bibli-lu');
                    break;
                case 2:
                    $state.go("cercle-view");
                    break;
            }
        });

        $scope.admin = function() {
            $state.go('equipe-gestion');
        }

        $scope.nouveauLien = function() {
            $state.go('nouveauLien-view');
        }

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
