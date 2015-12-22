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
                    templateProvider: function($templateCache){
                        return $templateCache.get('app/bibli/views/el1-nonLu.tpl.html');
                    },
                    //templateUrl: 'src/app/bibli/views/el1-nonLu.tpl.html',
                    resolve: {
                        liensNonLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, LiensService,  SessionStorage ,USERFIREBASEPROFILEKEY) {
                                return LiensService.findNotReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                        }],
                        liensLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, LiensService, SessionStorage ,USERFIREBASEPROFILEKEY) {
                            return LiensService.findReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                        }],
                        allMyCercles :  ['$rootScope', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, UsersManager, SessionStorage ,USERFIREBASEPROFILEKEY) {
                                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                        }],
                        allCategories : ['LiensService', function(LiensService) {
                            return LiensService.findCategories();
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

        $stateProvider.state('bibli-lu', {
            url: '/bibli/lu',
            data : {
                    title :"view"
            },
            views: {
                "main": {
                    controller: 'bibliController',
                    templateProvider: function($templateCache){
                        return $templateCache.get('app/bibli/views/el1-lu.tpl.html');
                    },
                    //templateUrl: 'src/app/bibli/views/el1-lu.tpl.html',
                    resolve: {
                        liensNonLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, LiensService,  SessionStorage ,USERFIREBASEPROFILEKEY) {
                                return LiensService.findNotReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                            }],
                        liensLus : ['$rootScope', 'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, LiensService,SessionStorage ,USERFIREBASEPROFILEKEY) {
                                return LiensService.findReadLinksByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                            }],
                        allMyCercles :  ['$rootScope', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($rootScope, UsersManager, SessionStorage ,USERFIREBASEPROFILEKEY) {
                                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                            }],
                        allCategories : ['LiensService', function(LiensService) {
                            return LiensService.findCategories();
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

}(angular.module('el1.bibli', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
