(function(){

    angular
        .module('el1.gestion')
        .controller('gestionController', [
            '$log', '$scope', '$rootScope', '$state',
            'AlertService', '$translate',
            'GestionService', 'UsersManager',
            'CercleModel',
            'mesInvitations', 'personnesDuCercle', 'mesCercles',
            '$mdDialog', '$mdMedia',
            GestionController
        ])
        .controller('nouveauCercleController', [
            '$log', '$scope', '$state',
            'AlertService', '$translate',
            'GestionService',
            'CercleModel',
            '$mdDialog', '$mdMedia',
            NouveauCercleController
        ]);

    /**
     */
    function GestionController($log, $scope, $rootScope, $state, AlertService, $translate, GestionService, UsersManager, CercleModel, mesInvitations, personnesDuCercle, mesCercles, $mdDialog, $mdMedia ) {

        $scope.mesInvitations= mesInvitations;
        $scope.personnes= personnesDuCercle;
        $scope.cercles= mesCercles;

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
        //L'utilisateur connecté invite un utilisateur à rejoindre le cercle sélectionné
            UsersManager.inviter(invite, $scope.selectedCercle.$id)
                .then(function (username) {
                        $scope.invitation="";
                        $log.info($translate.instant('gestion.message.inviter'));
                })
                .catch (function (error) {
                    $log.error(error);
                })
        }

        $scope.accepterInvitation= function(invitation) {
            // Si l'utilisateur connecté accepte l'invitation
            // ==> Ajout du cercle au niveau du user.
            // ==> Ajout de l'utilisateur au niveau des membres du cercle
            // ==> Suppression de l'invitation en attente
            // ==> Recharcher la liste ?
            GestionService.accepterInvitation($rootScope.userConnected.$id, invitation.$id)
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
    function NouveauCercleController($log, $scope, $state, AlertService, $translate, GestionService, CercleModel, $mdDialog, $mdMedia) {
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
