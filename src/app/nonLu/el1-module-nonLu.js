(function(module){

    'use strict';
    module.config(function ($stateProvider) {

        

        $stateProvider.state('nonLu-view', {
            url: '/nonLu/view',
            data : {
                    title :"view"
            },
            views: {
                "main": {
                    controller: 'viewController',
                    templateUrl: 'src/app/nonLu/views/el1-view.tpl.html',
                    resolve: {
                        allLiens : function($log, LiensService, $stateParams) {
                            $log.debug(LiensService.findLiensByCriterias())
                            return LiensService.findLiensByCriterias();
                        }
                    }
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('commons');
                    $translatePartialLoader.addPart('el1-view');
                    return $translate.refresh();
                }]
            }
        });


        

    });

}(angular.module('el1.nonLu', [ 'ngMaterial', 'ui.router', 'el1.services.commun', 'el1.model' ] )));
