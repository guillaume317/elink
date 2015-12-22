(function(){

    angular
        .module('el1.gestion')
        .controller('gestionController', [
            '$log', '$scope', '$cookieStore', '$q', '$timeout',
            '$translate',
            'GestionService', 'UsersManager',  'commonsService',
            'mesInvitations', 'personnesDuCercle', 'mesCercles', 'usersEmail',
            'SessionStorage', 'USERFIREBASEPROFILEKEY',
            '$mdDialog', '$mdMedia', '$mdToast',
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
    function GestionController($log, $scope, $cookieStore, $q, $timeout, $translate, GestionService, UsersManager, commonsService, mesInvitations, personnesDuCercle, mesCercles, usersEmail, SessionStorage, USERFIREBASEPROFILEKEY, $mdDialog, $mdMedia, $mdToast ) {

        $scope.mesInvitations= mesInvitations;
        $scope.personnes= personnesDuCercle;
        $scope.cercles= mesCercles;
        $scope.users = usersEmail;

        $scope.selectedItemChange = selectedItemChange;
        $scope.searchTextChange   = searchTextChange;
        $scope.querySearch   = querySearch;
        $scope.selectedItem = null;
        $scope.invited = [];
        $scope.invitedDisplay = "";

        if ($cookieStore.get('selectedCercle')) {
            $scope.selectedCercle= $cookieStore.get('selectedCercle');
        } else if (mesCercles[0]) {
            $scope.selectedCercle = mesCercles[0];
        }

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
                .then(function(cercle) {
                    // valider
                    $scope.changeCercle(cercle)
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

            $cookieStore.put('selectedCercle', cercleSelected);
        }

        $scope.inviter= function(invite) {
            if (invite !== null) {
                //L'utilisateur connecté invite un utilisateur à rejoindre le cercle sélectionné
                UsersManager.inviter(invite.uid, $scope.selectedCercle.$id)
                    .then(function (username) {
                        $scope.invited.push(invite.email);
                        $scope.invitedDisplay = $scope.invited.join(', ');
                        $scope.selectedItem = null;
                        $scope.searchText = null;
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
                    commonsService.showSuccessToast($mdToast, $translate.instant('gestion.message.accepterInvitation'));
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
                    function (ref) {
                        currentCercle.$id= ref;
                        $mdDialog.hide(currentCercle);
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
