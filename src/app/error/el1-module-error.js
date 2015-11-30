angular.module('el1.error', [ 'ui.router' ])
    .config(function ($stateProvider) {

        $stateProvider.state('pageErreur', {
            url: '/erreurs',
            views: {
                "main": {
                    controller: 'ErrorController',
                    templateUrl: 'src/app/error/error.tpl.html'
                }
            }
        });

    })
    .controller('ErrorController', function($rootScope, $scope, $http, $location, AuthService) {

    });