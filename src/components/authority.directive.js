'use strict';

angular.module('elinkApp')
    .directive('hasRole', ['Env', 'AuthService', function (Env, AuthService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var setVisible = function () {
                        element.removeClass('hidden');
                    },
                    setHidden = function () {
                        element.addClass('hidden');
                    },
                    defineVisibility = function (role) {
                        if (Env.getUser() && AuthService.isInRole(role)) {
                            setVisible();
                        } else
                            setHidden();
                    },
                    role = attrs.hasRole.replace(/\s+/g, '');

                scope.$watch('user', function(newValue, oldValue) {
                    if (role.length > 0) {
                        defineVisibility(role);
                    }
                });
            }
        };
    }]);
