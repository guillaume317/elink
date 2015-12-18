(function(){

    angular
        .module('el1.accueil')
        .controller('toolbarController', [
            '$log', '$scope', '$rootScope', '$state',
            'AuthService',
            '$mdDialog', '$mdMedia',
            ToolbarController
        ])
        .controller('nouveauLienController', [
            '$log', '$scope',
            'LiensService', 'SessionStorage', 'USERFIREBASEPROFILEKEY',
            '$mdDialog', '$mdMedia',
            NouveauLienController
        ]);

    /**
     */
    function ToolbarController($log, $scope, $rootScope, $state, AuthService, $mdDialog, $mdMedia ) {

        $scope.selectedIndex=0;

        $scope.isAdmin= true;

        $scope.$watch('selectedIndex', function(current, old) {
            switch (current) {
                case 0:
                    $state.go('bibli-nonLu');
                    break;
                case 1:
                    $state.go('bibli-lu');
                    break;
                case 2:
                    $state.go("cercle-view");
                    break;
                case 3:
                    $state.go("icdc-view");
                    break;
            }
        });

        $scope.admin = function() {
            $state.go('gestion-view');
        };

        $scope.nouveauLien = function(ev) {

            // passage en pop up

            $mdDialog.show({
                controller: NouveauLienController,
                templateUrl: 'src/app/accueil/views/el1-nouveauLien.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                },
                clickOutsideToClose:true,
                fullscreen: $mdMedia('sm') && $scope.customFullscreen
            })
                .then(function(shareLink) {
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

        $scope.logout = function() {
            AuthService.logout();
            $state.go('showLogin');
            $rootScope.userAuthenticated = false;
            //delete $rootScope[userEmail];
        };
    }

    /**
     */
    function NouveauLienController($log, $scope, LiensService, SessionStorage, USERFIREBASEPROFILEKEY, $mdDialog, $mdMedia) {
        $scope.currentLien= {"url" : "http://", private: true};
        $scope.alerts = [];

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.validate= function() {
            if ($scope.currentForm.$valid) {
                LiensService.createLinkForUser($scope.currentLien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid)
                    .then(function (newLink) {
                        $mdDialog.hide(newLink);
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
