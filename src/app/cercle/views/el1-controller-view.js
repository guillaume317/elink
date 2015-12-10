(function(){

    angular
        .module('el1.cercle')
        .controller('cercleController', [
            '$log', '$scope', '$rootScope',
            'LiensService',
            'liens',
            'allCategories',
            'allMyCercles',
            CercleController
            ])
    ;

    /**
     */
    function CercleController($log, $scope, $rootScope, LiensService, liens, allCategories, allMyCercles) {
        $scope.allLiens= liens;
        $scope.categories= allCategories;
        $scope.cercles= allMyCercles;
        $scope.filter= { "category" : "" };

        if (allMyCercles[0]) {
            $scope.selectedCercle = allMyCercles[0];
        }


        $scope.changeCercle= function(cercle) {
            LiensService.findLinksByCerlceName(cercle.$id)
                .then(function(links){
                    $scope.allLiens = links;
                });

        };

        $scope.moveToBiblio= function(lien) {
            //On déplace le lien dans biblio
            //puis on le supprime dans la liste des articles du cercle
            lien.private = "biblio";
            LiensService.createLinkForUser(lien, $rootScope.userConnected.$id)
                .then(function() {
                    $scope.allLiens.$remove(lien);
                })
        };

    }

})();