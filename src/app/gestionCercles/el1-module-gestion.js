(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('gestion-view', {
            url: '/gestion/view',
            data : {
                title :"gestion"
            },
            views: {
                "main": {
                    controller: 'gestionController',
                    templateUrl: 'src/app/gestionCercles/views/el1-gestion.tpl.html',
                    resolve: {
                        personnesDuCercle : function($log, $rootScope, GestionService, UsersManager, LiensService, $stateParams) {
                            //Recherches des cercles sont je suis membre
                            //Pour le premier d'entre eux, je recherche les personnes de ce cercle.
                            return UsersManager.findCerclesByUser($rootScope.userConnected.$id)
                                .then (function(cerclesIndex) {
                                    if (cerclesIndex && cerclesIndex.length > 0) {
                                        return GestionService.findPersonnesByCercle(cerclesIndex[0]);
                                    } else {
                                        return [];
                                    }
                            });
                            //return GestionService.findPersonnesByCercle(cercles[0]);
                        },
                        mesInvitations : function($log, $rootScope, UsersManager, GestionService, Env, $stateParams) {
                            //Recherche des cercles sont je ne suis pas encore membre
                            return UsersManager.findInvitationsByUser($rootScope.userConnected.$id);
                        },
                        mesCercles : function($log, $rootScope, UsersManager, LiensService, $stateParams) {
                            //Recherche des cercles dont je suis membre
                            return UsersManager.findCerclesByUser($rootScope.userConnected.$id);
                            //return LiensService.findMyCercles();
                        },
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-gestion');
                    return $translate.refresh();
                }],
                currentAuth: ['FBFactory', function(FBFactory) {
                    return FBFactory.auth().$requireAuth();
                }]
            }
        });

        

    });

}(angular.module('el1.gestion', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
