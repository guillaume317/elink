(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('equipe-gestion', {
            url: '/equipe/gestion',
            data : {
                title :"gestion"
            },
            views: {
                "main": {
                    controller: 'gestionController',
                    templateUrl: 'src/app/equipe/views/el1-gestion.tpl.html',
                    resolve: {
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-gestion');
                    return $translate.refresh();
                }]
            }
        });

        

    });

}(angular.module('el1.equipe', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
