(function(){

    angular
        .module('el1.bibli')
        .controller('bibliController', [
            '$log', '$scope', '$state',
            'liensNonLus', 'liensLus', 'allMyCercles', 'allCategories',
            '$mdDialog', '$mdMedia',
            BibliController
            ])
        .controller('shareController', [
            '$log', '$scope',
            'GestionService',
            'linkToShare', 'allCategories', 'allMyCercles', 'listeLiens',
            'SessionStorage', 'USERFIREBASEPROFILEKEY',
            '$mdDialog', '$mdMedia',
            ShareController
        ]);

    /**
     */
    function BibliController($log, $scope, $state, liensNonLus, liensLus, allMyCercles, allCategories, $mdDialog, $mdMedia ) {

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

            $mdDialog.show({
                controller: ShareController,
                templateUrl: 'src/app/bibli/views/el1-share.tpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    linkToShare: lien,
                    allCategories: allCategories,
                    allMyCercles: allMyCercles,
                    listeLiens :  $scope.liens
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
    function ShareController($log, $scope, GestionService, linkToShare, allCategories, allMyCercles, listeLiens, SessionStorage, USERFIREBASEPROFILEKEY, $mdDialog, $mdMedia ) {

        $scope.categories= allCategories;
        $scope.cercles= allMyCercles;
        $scope.linkToShare = linkToShare;

        //Initialisation du lien à basculer vers un cercle donné pour une catégorie donnée
        $scope.shareLink=  {
            title: linkToShare.title,
            teasing: linkToShare.teasing,
            createdOn : linkToShare.createdOn,
            url : linkToShare.url,
            cercleName: allMyCercles[0].$id,
            category: allCategories[0]
        }

        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.validate = function(shareLink) {

            if ($scope.currentForm.$valid) {
                //Lorsque le lien est partagé :
                //   il est supprimé de read ou notRead
                //   il est déplacé vers le cercle cible (cercleLinks)
                //   il est associé à une catégorie (attribut category)
                GestionService.shareLien(shareLink, SessionStorage.get(USERFIREBASEPROFILEKEY))
                    .then(function() {
                        listeLiens.$remove(linkToShare);
                        $mdDialog.hide(shareLink);
                    })
                    .catch (function(error) {
                        $log.error(error);
                    })
            }
        };
    }

})();