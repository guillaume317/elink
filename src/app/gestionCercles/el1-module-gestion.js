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
                        personnesDuCercle : ['GestionService', 'UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function(GestionService, UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                                //Recherches des cercles sont je suis membre
                                //Pour le premier d'entre eux, je recherche les personnes de ce cercle.
                                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                                    .then (function(cerclesIndex) {
                                    console.log(cerclesIndex[0])
                                    //return [];
                                        if (cerclesIndex && cerclesIndex.length > 0) {
                                            return GestionService.findPersonnesByCercle(cerclesIndex[0]);
                                        } else {
                                            return [];
                                        }
                                });
                        }],
                        mesInvitations : ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                                //Recherche des cercles sont je ne suis pas encore membre
                              return UsersManager.findInvitationsByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                        }],
                        mesCercles : ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY) {
                                //Recherche des cercles dont je suis membre
                                return UsersManager.findCerclesByUser(SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
                        }],
                        usersEmail : ['UsersManager', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
                            function(UsersManager, SessionStorage, USERFIREBASEPROFILEKEY){
                                return UsersManager.getUsersEmail(SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                                    .then(function(users) {
                                        return users;
                                    })

                        }]
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
