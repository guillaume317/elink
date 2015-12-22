'use strict';

angular.module('elinkApp')
    .directive('pict', function($rootScope) {
		return {
            restrict: 'E',

            template:
				'<div flex="15"><img ng-src="{{ imgsrc }}" style="width:450%" ></div>'
			,

			controller: ['$scope', 'LiensService',
	            function($scope, LiensService) {
					LiensService.findLinkScreen($scope.lien).then(function (payload) {
						if (payload) {
							$scope.imgsrc = 'data:image/jpeg;base64,' + payload;
						} else {

							var unregister= $scope.$watch(function() {
								var anId= $scope.lien.$id;
								return $rootScope.images[anId];
							}, function() {
								var anId= $scope.lien.$id;
								var linkScreen= $rootScope.images[anId]
								if (linkScreen) {
									if (linkScreen.$value) {
										$scope.imgsrc = 'data:image/jpeg;base64,' + linkScreen.$value;
										unregister();
									}
								}
							});

						}
					}, function (error) {
						// pas grave
					});
	            }
	        ]
        }
    });
