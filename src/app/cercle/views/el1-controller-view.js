(function(){

    angular
        .module('el1.cercle')
        .controller('cercleController', [
            '$log', '$scope',
            'LiensService',
            'liens',
            'allCategories',
            'allMyCercles',
            'SessionStorage',
            'USERFIREBASEPROFILEKEY',
            CercleController
            ])
    ;

    /**
     */
    function CercleController($log, $scope, LiensService, liens, allCategories, allMyCercles, SessionStorage, USERFIREBASEPROFILEKEY) {
        $scope.allLiens = liens;
        $scope.categories = allCategories;
        $scope.cercles = allMyCercles;
        $scope.filter = {"category": ""};
        $scope.isLikeDisabled = false;
        //$scope.topten = [];

        if (allMyCercles[0]) {
            $scope.selectedCercle = allMyCercles[0];
        }

        /**LiensService.findTopTenLinks()
            .then(function(topten){
                $scope.topten = topten;
            });*/


        $scope.changeCercle = function (cercle) {
            $scope.selectedCercle =cercle;
            LiensService.findLinksByCerlceName(cercle.$id)
                .then(function (links) {
                    $scope.allLiens = links;
                });

        };

        $scope.moveToBiblio = function (lien) {
            //On déplace le lien dans biblio
            //puis on le supprime dans la liste des articles du cercle
            lien.private = "biblio";
            LiensService.createLinkForUser(lien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
            //Mis en commentaire : on dublique simplement le lien !
            /**.then(function() {
                    $scope.allLiens.$remove(lien);
                })*/
        };

        $scope.like = function (lien) {
            //Bloque tous les liens !
            //$scope.isLikeDisabled = true;
            LiensService.addLike($scope.selectedCercle.$id, lien.$id);
        };

    }
})();