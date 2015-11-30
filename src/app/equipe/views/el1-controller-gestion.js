(function(){

    angular
        .module('el1.equipe')
        .controller('gestionController', [
            '$log', '$scope', '$state',
            'AlertService', '$translate',
            'EquipagesService',
            'EquipageModel',
            GestionController
        ]);

    /**
     */
    function GestionController($log, $scope, $state, AlertService, $translate, EquipagesService, EquipageModel ) {
        $scope.currentEquipage= new EquipageModel();
        $scope.alerts = [];

        $scope.validate= function() {
            if ($scope.currentForm.$valid) {
                EquipagesService.createEquipage($scope.currentEquipage).then(
                    function (status) {
                        $log.debug("validate return : " + status);
                        if (status == 201 )
                            AlertService.success($translate.instant('message.update'));
                        // $state.go();
                    }, function (error) {
                        //
                        $log.error(error);
                    }
                );
            }
        }

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

    }

})();
