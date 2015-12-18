'use strict';

angular.module('elinkApp')
    .directive('pict', function($rootScope) {
		return {
            restrict: 'E',

            template:
				'<div flex="15"><img src="{{ imgsrc }}" data-url="{{ lien.url }}" style="width:450%" ></div>'
			,

			controller: ['$scope', 'LiensService',
	            function($scope, LiensService) {
					LiensService.findLinkScreen($scope.lien).then(function (payload) {
						if (payload)
							$scope.imgsrc= 'data:image/jpeg;base64,' + payload;
					}, function (error) {
						// pas grave
					});
	            }
	        ]
        }
    });
