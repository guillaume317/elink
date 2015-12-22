(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('icdc-view', {
            url: '/icdc/view',
            data : {
                    title :"ICDC"
            },
            views: {
                "main": {
                    controller: 'icdcController',
                    templateProvider: function($templateCache){
                        return $templateCache.get('app/icdc/views/el1-view.tpl.html');
                    },
                    //templateUrl: 'src/app/icdc/views/el1-view.tpl.html',
                    resolve: {
                        allCategories : ['LiensService', function(LiensService) {
                            return LiensService.findCategories();
                        }],
                        topTen : ['LiensService', function(LiensService) {
                            return LiensService.findTopTenLinks();
                        }]
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-view');
                    return $translate.refresh();
                }],
                currentAuth: ['FBFactory', function(FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        });


        

    });

}(angular.module('el1.icdc', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
