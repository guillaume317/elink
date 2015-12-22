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
                    controller: 'cercleController',
                    templateUrl: 'src/app/cercle/views/el1-view.tpl.html',
                    resolve: {
                        liens : ['$log', '$cookieStore', 'LiensService', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function($log, $cookieStore, LiensService, UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                                if ($cookieStore.get('selectedCercle')) {
                                    var cercleName= $cookieStore.get('selectedCercle');
                                    return LiensService.findLinksByCerlceName(cercleName.$id);
                                } else {
                                    return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                                        .then(function (cercles) {
                                            if (cercles.length > 0) {
                                                return LiensService.findLinksByCerlceName(cercles[0].$id);
                                            } else {
                                                return [];
                                            }
                                        });
                                }
                        }],
                        allMyCercles :  ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
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

}(angular.module('el1.cercle', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
