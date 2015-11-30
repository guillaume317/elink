'use strict';

angular.module('elinkApp')
    .factory('authExpiredInterceptor', function ($rootScope, $q, $injector) {
        return {
            responseError: function(response) {
                // If we have an unauthorized request we redirect to the login page
                // Don't do this check on the account API to avoid infinite loop
                if (response.status == 401 && response.data.path !== undefined && response.data.path.indexOf("login") == -1){
                    var $state = $injector.get('$state');
                    var to = $rootScope.toState;
                    var params = $rootScope.toStateParams;

                    $rootScope.authenticated = false;
                    $rootScope.returnToState = to;
                    $rootScope.returnToStateParams = params;

                    $state.go('showLogin');
                }
                return $q.reject(response);
            }
        };
    });