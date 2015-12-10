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
                        liensNonLus : function($rootScope, LiensService) {
                            return LiensService.findNotReadLinksByUser($rootScope.userConnected.$id);
                        },
                        liensLus : function($rootScope, LiensService) {
                            return LiensService.findReadLinksByUser($rootScope.userConnected.$id);
                        },
                        allMyCercles :  function($rootScope, UsersManager) {
                            return UsersManager.findCerclesByUser($rootScope.userConnected.$id);
                        },
                        allCategories : function(LiensService) {
                            return LiensService.findCategories();
                        }
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
                        liensNonLus : function($rootScope, LiensService) {
                            return LiensService.findNotReadLinksByUser($rootScope.userConnected.$id);
                        },
                        liensLus : function($rootScope, LiensService) {
                            return LiensService.findReadLinksByUser($rootScope.userConnected.$id);
                        },
                        allMyCercles :  function($rootScope, UsersManager) {
                            return UsersManager.findCerclesByUser($rootScope.userConnected.$id);
                        },
                        allCategories : function(LiensService) {
                            return LiensService.findCategories();
                        }
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

}(angular.module('el1.bibli', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
