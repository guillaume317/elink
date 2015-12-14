(function(){

    angular
        .module('el1.gestion')
        .controller('gestionController', [
            '$log', '$scope', '$q', '$timeout',
            '$translate',
            'GestionService', 'UsersManager',
            'mesInvitations', 'personnesDuCercle', 'mesCercles', 'usersEmail',
            'SessionStorage', 'USERFIREBASEPROFILEKEY',
            '$mdDialog', '$mdMedia',
            GestionController
        ])
        .controller('nouveauCercleController', [
            '$log', '$scope',
            'GestionService',
            'CercleModel',
            '$mdDialog', '$mdMedia',
            NouveauCercleController
        ]);

    /**
     */
    function GestionController($log, $scope, $q, $timeout, $translate, GestionService, UsersManager, mesInvitations, personnesDuCercle, mesCercles, usersEmail, SessionStorage, USERFIREBASEPROFILEKEY, $mdDialog, $mdMedia ) {

        $scope.mesInvitations= mesInvitations;
        $scope.personnes= personnesDuCercle;
        $scope.cercles= mesCercles;
        $scope.users = usersEmail;

        $scope.selectedItemChange = selectedItemChange;
        $scope.searchTextChange   = searchTextChange;
        $scope.querySearch   = querySearch;
        $scope.selectedItem = null;

        //Functions utilisée par le select box autocomplete
        function querySearch (query) {
            var results = query ? $scope.users.filter( createFilterFor(query) ) : $scope.users,
                deferred;
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;

        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(user) {
                return (user.email.indexOf(lowercaseQuery) === 0);
            };
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }
        function selectedItemChange(user) {
            //sélection d'un élémenta dans la liste
            $log.info('Item changed to ' + JSON.stringify(user));
            //si l'objet a été sélectionné, il n'est pas vide
            /**if (Object.keys(user).length > 0) {
                $scope.selectedUser= user;
            } else {
                $scope.selectedUser= null;
            }*/
        }

        if (mesCercles[0]) {
            $scope.selectedCercle = mesCercles[0];
        }

        $scope.nouveauCercle = function(ev) {

            $mdDialog.show({
                controller: NouveauCercleController,
                templateUrl: 'src/app/gestionCercles/views/el1-nouveauCercle.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                },
                clickOutsideToClose:true,
                fullscreen: $mdMedia('sm') && $scope.customFullscreen
            })
                .then(function(buttonNumber) {
                    // valider
                }, function() {
                    // cancel
                });

            $scope.$watch(function() {
                return $mdMedia('sm');
            }, function(sm) {
                $scope.customFullscreen = (sm === true);
            });

        };

        $scope.changeCercle= function(cercleSelected) {
            //Changement de cercle
            //==> récupération des personnes du cercle choisi
            GestionService.findPersonnesByCercle(cercleSelected)
                .then(function (personnes) {
                    $scope.selectedCercle = cercleSelected;
                    $scope.personnes = personnes;
                })
                .catch(function (error) {
                    $log.error(error);
                })
        }

        $scope.inviter= function(invite) {

            if (invite !== null) {
                //L'utilisateur connecté invite un utilisateur à rejoindre le cercle sélectionné
                UsersManager.inviter(invite.uid, $scope.selectedCercle.$id)
                    .then(function (username) {
                        $scope.selectedItem = null;
                        $scope.searchText = null;
                        $log.info($translate.instant('gestion.message.inviter'));
                    })
                    .catch(function (error) {
                    $log.error(error);
                })
            }
        }

        $scope.accepterInvitation= function(invitation) {
            // Si l'utilisateur connecté accepte l'invitation
            // ==> Ajout du cercle au niveau du user.
            // ==> Ajout de l'utilisateur au niveau des membres du cercle
            // ==> Suppression de l'invitation en attente
            // ==> Recharcher la liste ?
            GestionService.accepterInvitation(SessionStorage.get(USERFIREBASEPROFILEKEY).uid, invitation.$id)
                .then(function(cerclename) {
                    $log.info($translate.instant('gestion.message.accepterInvitation'));
                })
                .catch(function(error) {
                    $log.error(error);
                });
        }

    }

    /**
     */
    function NouveauCercleController($log, $scope, GestionService, CercleModel, $mdDialog, $mdMedia) {
        $scope.currentCercle= new CercleModel();
        $scope.alerts = [];

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.validate= function(currentCercle) {
            if ($scope.currentForm.$valid) {
                GestionService.createCercle(currentCercle).then(
                    function (cerclename) {
                        $mdDialog.hide("0");
                    }, function (error) {
                        $log.error(error);
                    }
                );

            }
        }

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

    }

})();
