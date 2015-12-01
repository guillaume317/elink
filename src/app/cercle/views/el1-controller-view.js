(function(){

    angular
        .module('el1.cercle')
        .controller('cercleController', [
            '$log', '$scope', '$state',
            'LiensService',
            'allLiens',
            CercleController
            ]);

    /**
     */
    function CercleController($log, $scope, $state, LiensService, allLiens ) {
        $scope.allLiens= allLiens;
    }

})();