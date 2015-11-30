(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('cercle-view', {
            url: '/cercle/view',
            data : {
                    title :"view"
            },
            views: {
                "main": {
                    controller: 'viewController',
                    templateUrl: 'src/app/cercle/views/el1-view.tpl.html',
                    resolve: {
                        allLiens : function($log, LiensService, $stateParams) {
                            return LiensService.findLiensByCriterias();
                        }
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-view');
                    return $translate.refresh();
                }]
            }
        });


        

    });

}(angular.module('el1.cercle', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
