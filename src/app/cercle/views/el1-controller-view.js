(function(){

    angular
        .module('el1.cercle')
        .controller('cercleController', [
            '$log', '$scope',
            'commonsService',
            'LiensService',
            'liens',
            'allCategories',
            'allMyCercles',
            'SessionStorage',
            'USERFIREBASEPROFILEKEY',
            '$mdToast',
            CercleController
            ])
    ;

    /**
     */
    function CercleController($log, $scope, commonsService, LiensService, liens, allCategories, allMyCercles, SessionStorage, USERFIREBASEPROFILEKEY, $mdToast) {
        $scope.allLiens = liens;
        $scope.categories = allCategories;
        $scope.cercles = allMyCercles;
        $scope.filter = {"category": ""};
        $scope.isLikeDisabled = false;

        if (allMyCercles[0]) {
            $scope.selectedCercle = allMyCercles[0];
        }


        $scope.changeCercle = function (cercle) {
            $scope.selectedCercle =cercle;
            LiensService.findLinksByCerlceName(cercle.$id)
                .then(function (links) {
                    $scope.allLiens = links;
                });

        };

        $scope.showURL= function(lien) {
            window.open(lien.url, '_blank');
        }

        $scope.moveToBiblio= function(lien) {
            lien.private = "biblio";
            LiensService.createLinkForUser(lien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
            commonsService.showSuccessToast($mdToast, "Le lien a été ajouté à votre biblio");
        };

        $scope.like = function (lien) {
            //Bloque tous les liens !
            //$scope.isLikeDisabled = true;
            LiensService.addLike($scope.selectedCercle.$id, lien.$id);
            commonsService.showSuccessToast($mdToast, "'Like' pris en compte");
        };

    }
})();