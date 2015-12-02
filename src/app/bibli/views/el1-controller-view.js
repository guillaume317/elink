(function(){

    angular
        .module('el1.bibli')
        .controller('bibliController', [
            '$log', '$scope', '$state',
            'LienModel',
            'LiensService',
            'allLiens',
            '$mdDialog', '$mdMedia',
            BibliController
            ])
        .controller('shareController', [
            '$log', '$scope', '$state',
            'LienModel',
            'LiensService',
            '$mdDialog', '$mdMedia',
            ShareController
        ]);

    /**
     */
    function BibliController($log, $scope, $state, LienModel, LiensService, allLiens, $mdDialog, $mdMedia ) {
        $scope.customFullscreen = $mdMedia('sm');
        $scope.allLiens= allLiens;

        $scope.delete= function(aLienModel) {
            LiensService.deleteLien(aLienModel);
        };

        $scope.unread= function(aLienModel) {
            LiensService.markAsUnread(aLienModel);
        };

        $scope.read= function(aLienModel) {
            LiensService.markAsRead(aLienModel);
        };

        $scope.share= function(ev, aLienModel) {
            $scope.categories= [];
            //$scope.categories=LiensService.findCategories();
            // features/feature-01-oauth
            LiensService.findCategories().then(function(categories) {
                $scope.categories=categories;
            });

            $mdDialog.show({
                controller: ShareController,
                templateUrl: 'src/app/bibli/views/el1-share.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $mdMedia('sm') && $scope.customFullscreen
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });

            $scope.$watch(function() {
                return $mdMedia('sm');
            }, function(sm) {
                $scope.customFullscreen = (sm === true);
            });

        };

    }

    /**
     */
    function ShareController($log, $scope, $state, LienModel, LiensService, $mdDialog, $mdMedia ) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

})();