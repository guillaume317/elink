(function(){

    angular
        .module('el1.cercle')
        .controller('viewController', [
            '$log', '$scope', '$state',
            'LiensService',
            'allLiens',
            ViewController
            ]);

    /**
     */
    function ViewController($log, $scope, $state, LiensService, allLiens ) {
        $scope.allLiens= allLiens;
    }

})();