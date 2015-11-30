'use strict';
angular.module('el1.model')

    .factory('Env', function Env() {
        var _backend, _user;

        return {
            init: function (data) {
                _backend = data.backend;
            },
            backend: function() {
                return _backend;
            },
            setUser: function(user) {
                _user= user;
            },
            getUser: function() {
                return _user;
            },
            isAuthenticated: function () {
                return _user !== null;
            },
            isMock: function() {
                return true;
            }
        };

    })

;