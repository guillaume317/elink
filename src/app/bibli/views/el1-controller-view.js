(function(){

    angular
        .module('el1.bibli')
        .controller('bibliController', [
            '$log', '$scope', '$rootScope', '$state',
            'LiensService',
            'liensNonLus', 'liensLus', 'allMyCercles', 'allCategories',
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
    function BibliController($log, $scope, $rootScope, $state, LiensService, liensNonLus, liensLus, allMyCercles, allCategories, $mdDialog, $mdMedia ) {
        $scope.customFullscreen = $mdMedia('sm');
        //liens : liens non lus ou biblio selon le cas

        if ($state.current.name === 'bibli-nonLu') {
            $scope.liens = liensNonLus;
        } else {
            $scope.liens = liensLus;
        }

        $scope.canShare= function() {
            return allMyCercles && allMyCercles[0];
        };

        $scope.deleteLink= function(lien) {
            // $scope.liens est synchronisé avec la base
            $scope.liens.$remove(lien);
        };

        $scope.moveTo = function(lien) {
            //cas des liens non lus
            if ($state.current.name === 'bibli-nonLu') {
                //Ajout dans biblio
                liensLus.$add(lien);
            } else {
                //Ajout dans non lus
                liensNonLus.$add(lien);
            }
            //Suppression du lien de la liste
            $scope.deleteLink(lien);
        };


        $scope.share= function(ev, lien) {
            $scope.categories= [];
            //$scope.categories=LiensService.findCategories();
            // features/feature-01-oauth
            /**LiensService.findCategories().then(function(categories) {
                $scope.categories=categories;
            });*/

            $mdDialog.show({
                controller: ShareController,
                templateUrl: 'src/app/bibli/views/el1-share.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    shareLink: lien,
                    allCategories: allCategories,
                    allMyCercles: allMyCercles
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

    }

    /**
     */
    function ShareController($log, $scope, $state, LienModel, LiensService, link, allCategories, allMyCercles, $mdDialog, $mdMedia ) {
        $scope.link= link;
        $scope.shareLink= new LienModel();
        $scope.shareLink.cercle= allMyCercles[0];
        $scope.shareLink.category= allCategories[0];

        $scope.categories= allCategories;
        $scope.cercles= allMyCercles;

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.validate = function(shareLink) {
            if ($scope.currentForm.$valid) {
                shareLink.url = link.url;

                LiensService.shareLien(shareLink).then(
                    function (status) {
                        $log.debug("share " + shareLink.title + " return : " + status);
                        if (status == 201)
                            AlertService.success($translate.instant('view.message.shareLink'));
                        // $state.go();

                        $mdDialog.hide(shareLink);
                    }, function (error) {
                        //
                        $log.error(error);
                    }
                );

            }
        };
    }

})();