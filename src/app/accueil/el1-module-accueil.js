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
    .controller('AccueilController', function($rootScope, $scope, $http, $location) {

    });
