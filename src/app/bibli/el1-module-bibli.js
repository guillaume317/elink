(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        $stateProvider.state('bibli-nonLu', {
            url: '/bibli/nonLu',
            data : {
                title :"view"
            },
            views: {
                "main": {
                    controller: 'bibliController',
                    templateUrl: 'src/app/bibli/views/el1-nonLu.tpl.html',
                    resolve: {
                        allLiens : function($log, LiensService, $stateParams) {
                            return LiensService.findMyLinks(true);
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

        $stateProvider.state('bibli-lu', {
            url: '/bibli/lu',
            data : {
                    title :"view"
            },
            views: {
                "main": {
                    controller: 'bibliController',
                    templateUrl: 'src/app/bibli/views/el1-lu.tpl.html',
                    resolve: {
                        allLiens : function($log, LiensService, $stateParams) {
                            return LiensService.findMyLinks(false);
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
