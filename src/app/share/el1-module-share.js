(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('share-create', {
            url: '/share/create',
            data : {
                title :"create"
            },
            views: {
                "main": {
                    controller: 'createController',
                    templateUrl: 'src/app/share/views/el1-create.tpl.html',
                    resolve: {
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-create');
                    return $translate.refresh();
                }]
            }
        });

        

    });

}(angular.module('el1.share', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
