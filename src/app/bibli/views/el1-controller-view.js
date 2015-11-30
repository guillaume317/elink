(function(){

    angular
        .module('el1.bibli')
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