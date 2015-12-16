(function(){

    angular
        .module('el1.icdc')
        .controller('icdcController', [
            '$log', '$scope',
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
    function ICDCController($log, $scope, LiensService, allCategories, topTen, SessionStorage, USERFIREBASEPROFILEKEY) {
        $scope.topTen= topTen;
        $scope.categories= allCategories;
        $scope.filter= { "category" : "" };

        $scope.showURL= function(lien) {
            window.open(lien.url, '_blank');
        }

        $scope.moveToBiblio= function(lien) {
            //On duplique le lien dans biblio
            lien.private = "biblio";
            LiensService.createLinkForUser(lien, SessionStorage.get(USERFIREBASEPROFILEKEY).uid);
        };

    }

})();