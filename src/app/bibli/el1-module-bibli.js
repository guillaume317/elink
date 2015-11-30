(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('bibli-view', {
            url: '/bibli/view',
            data : {
                    title :"view"
            },
            views: {
                "main": {
                    controller: 'viewController',
                    templateUrl: 'src/app/bibli/views/el1-view.tpl.html',
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

}(angular.module('el1.bibli', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
