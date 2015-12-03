angular.module('el1.accueil', [  'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ])
    .config(function ($stateProvider) {

        $stateProvider.state('home', {
            url: '/home',
            data:{ pageTitle: 'Home' },
            views: {
                "main": {
                    controller: 'toolbarController',
                    templateUrl: 'src/app/accueil/accueil.tpl.html'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                }]
            }
        });


    });
