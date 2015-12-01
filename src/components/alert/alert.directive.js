'use strict';

angular.module('elinkApp')
    .directive('cdcAlertError', function(AlertService, $rootScope, $translate) {
		return {
            restrict: 'E',

            template:
                '<div ng-repeat="alert in alerts" class="alert" ng-class="[\'alert-\' + (alert.type || \'warning\'), alert.closeable ? \'alert-dismissible\' : null]" role="alert">' +
                    '<div layout="row">' +
                        '<div>{{ alert.msg }}</div>' +
                        '<button ng-show="alert.closeable" type="button" class="close" ng-click="alert.close({$event: $event})">' +
                            '<span aria-hidden="true">&times;</span>' +
                            '<span class="sr-only">Close</span>' +
                        '</button>' +
                    '</div>' +
                '</div>',

			controller: ['$scope',
	            function($scope) {
	                $scope.alerts = AlertService.get();

					var cleanHttpErrorListener = $rootScope.$on('httpError', function (event, httpResponse) {
					    var i;
					    event.stopPropagation();
						console.log(httpResponse.status)
					    switch (httpResponse.status) {
					        // connection refused, server not reachable
					        case -1:
					            addErrorAlert("Server not reachable",'error.serverNotReachable');
					            break;
							case 0:
								addErrorAlert("Server not reachable",'error.serverNotReachable');
								break;

					        case 400:
					            if (httpResponse.data && httpResponse.data.fieldErrors) {
					                for (i = 0; i < httpResponse.data.fieldErrors.length; i++) {
					                    var fieldError = httpResponse.data.fieldErrors[i];
					                    var fieldName = fieldError.fieldname;
					                    // var fieldNameI18n = $translate.instant('webjhipsApp.' + fieldError.objectName + '.' + convertedField);
					                    addErrorAlert(fieldName + ':' + fieldError.message);
					                }
					            } else if (httpResponse.data && httpResponse.data.message) {
					              addErrorAlert(httpResponse.data.message, httpResponse.data.message, httpResponse.data);
					            } else {
					              addErrorAlert(httpResponse.data);
					            }
					            break;

					        default:
					            if (httpResponse.data && httpResponse.data.message) {
					                addErrorAlert(httpResponse.data.message);
					            } else {
					                addErrorAlert(JSON.stringify(httpResponse));
					            }
					    }
					});

					$scope.$on('$destroy', function () {
					    if(cleanHttpErrorListener !== undefined && cleanHttpErrorListener !== null){
							cleanHttpErrorListener();
						}
					});

					var addErrorAlert = function (message, key, data) {

						key = key && key != null ? key : message;
						AlertService.error(key, data);

					}

	            }
	        ]
        }
    });
