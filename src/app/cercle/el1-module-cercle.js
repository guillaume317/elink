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
                        liens : function($log, $rootScope, LiensService, UsersManager) {
                            return UsersManager.findCerclesByUser($rootScope.userConnected.$id)
                                .then(function (cercles) {
                                    if (cercles.length > 0) {
                                        return LiensService.findLinksByCerlceName(cercles[0].$id);
                                    } else {
                                        return [];
                                    }
                                })
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
                }]
            }
        });


        

    });

}(angular.module('el1.cercle', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
