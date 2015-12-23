(function(){

    angular
        .module('el1.cercle')
        .controller('cercleController', [
            '$log', '$scope', '$cookieStore',
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
    function CercleController($log, $scope, $cookieStore, commonsService, LiensService, liens, allCategories, allMyCercles, SessionStorage, USERFIREBASEPROFILEKEY, $mdToast) {
        $scope.allLiens = liens;
        $scope.categories = allCategories;
        $scope.cercles = allMyCercles;
        $scope.filter = {"category": ""};
        $scope.isLikeDisabled = false;

        if ($cookieStore.get('selectedCategory')) {
            $scope.filter.category= $cookieStore.get('selectedCategory');
        } else {
            $scope.filter.category = "";
        }

        if ($cookieStore.get('selectedCercle')) {
            $scope.selectedCercle= $cookieStore.get('selectedCercle');
        } else if (allMyCercles[0]) {
            $scope.selectedCercle = allMyCercles[0];
        }

        $scope.changeCategory = function (category) {
            $scope.filter.category= category;
            $cookieStore.put('selectedCategory', category);
        }

        $scope.changeCercle = function (cercle) {
            $scope.selectedCercle = cercle;
            if (cercle.$id) {
                LiensService.findLinksByCerlceName(cercle.$id)
                    .then(function (links) {
                        $scope.allLiens = links;
                    });
                $cookieStore.put('selectedCercle', cercle);
            }
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
            LiensService.addLike($scope.selectedCercle.$id, lien, liens);
            commonsService.showSuccessToast($mdToast, "'Like' pris en compte");
        };

    }
})();