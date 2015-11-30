'use strict';

angular.module('elinkApp')
    .factory('errorHandlerInterceptor', function ($q, $rootScope) {
        return {
            'responseError': function (response) {
                if (!(response.status == 401 && response.data.path.indexOf("/login") == 0 )){
	                $rootScope.$emit('httpError', response);
	            }
                return $q.reject(response);
            }
        };
    });