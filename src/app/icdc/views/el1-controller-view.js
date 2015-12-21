(function(){

    angular
        .module('el1.icdc')
        .controller('icdcController', [
            '$log', '$scope', '$cookieStore', '$mdToast', 'commonsService',
            'LiensService',
            'allCategories',
            'topTen',
            'SessionStorage',
            'USERFIREBASEPROFILEKEY',
            ICDCController
            ])
    ;

    /**
     */
    function ICDCController($log, $scope, $cookieStore, $mdToast, commonsService, LiensService, allCategories, topTen, SessionStorage, USERFIREBASEPROFILEKEY) {
        $scope.topTen= topTen;
        $scope.categories= allCategories;
        $scope.filter= { "category" : "" };

        if ($cookieStore.get('selectedCategory')) {
            $scope.filter.category= $cookieStore.get('selectedCategory');
        } else {
            $scope.filter.category = "";
        }

        $scope.showURL= function(lien) {
            window.open(lien.url, '_blank');
        }

        $scope.changeCategory = function (category) {
            $scope.filter.category= category;
            $cookieStore.put('selectedCategory', category);
        }

        $scope.moveToBiblio= function(lien) {
            //On duplique le lien dans biblio
            lien.private = "biblio";
            LiensService.createLinkForUser(lien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
            commonsService.showSuccessToast($mdToast, "Le lien a été ajouté à votre biblio");
        };

    }

})();