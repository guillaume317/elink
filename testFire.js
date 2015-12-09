/**
 * Created by Guillemette on 03/12/2015.
 */
/**
 * Created by Guillemette on 03/12/2015.
 */
var app = angular.module("cercleApp", ["firebase"])
    .run(function ($rootScope, UsersManager) {

        //Extraction de l'utilisateur connecté
        UsersManager.getUser("Matthieu")
            .then(function(user) {
                $rootScope.userConnected = user;
            })
    });

// a factory to create a re-usable profile object
// we pass in a username and get back their synchronized data
app.factory("Cercle", ["$firebaseObject",
    function($firebaseObject) {
        return function(name) {
            // create a reference to the database node where we will store our data
            var ref = new Firebase("https://elink.firebaseio.com");
            var cercleRef = ref.child('cercles').child(name);

            // return it as a synchronized object
            return $firebaseObject(cercleRef);
        }
    }
]);

app.controller("CercleCtrl", ["$scope", "Cercle",
    function($scope, Cercle) {
        // put our profile in the scope for use in DOM
        $scope.cercle = Cercle("CCMT");

        // calling $save() on the synchronized object syncs all data back to our database
        $scope.saveCercle = function() {
            $scope.cercle.$save().then(function() {
            }).catch(function(error) {
            });
        };

    }
]);

app.controller("LinksCtrl", ["$scope", "Link",
    function($scope, Link) {
        // put our profile in the scope for use in DOM
        $scope.links = Link("CCMT");

        // calling $save() on the synchronized object syncs all data back to our database
        $scope.addLink = function() {
            $scope.links.$add($scope.alink);
        };

    }
]);

app.factory("Link", ['$firebaseArray',
    function($firebaseArray) {
        return function(cerclename) {
            // create a reference to the database node where we will store our data
            var ref = new Firebase("https://elink.firebaseio.com");
            var linksRef = ref.child('cercles').child(cerclename).child('links').orderByChild("title");

            // return it as a synchronized object
            return $firebaseArray(linksRef);
        }
    }
]);


app.factory("UsersManager", ['$firebaseObject', '$firebaseArray', '$q',
    function($firebaseObject, $firebaseArray, $q) {

        var ref = new Firebase("https://elink.firebaseio.com");

        return {

            getUser: function (username) {

                var userRef = ref.child('users').child(username);
                var user = $firebaseObject(userRef);

                return user.$loaded();
            },

            getUserFullname: function (userIndex) {

                var deferred = $q.defer();
                var userRef = ref.child('users').child(userIndex.$id).child('fullname');

                var user = $firebaseObject(userRef);

                user.$loaded()
                    .then(function () {
                        deferred.resolve(user.$value);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            /**
             *
             * @param userIndex Utiliosateur connecté
             * @param cercleName
             * @returns {*|a}
             */
            removeCercle: function (username, cercleName) {

                var deferred = $q.defer();

                var userCercleMemberRef = ref.child('users').child(username).child('cercles').child(cercleName);
                var user = $firebaseObject(userCercleMemberRef);
                //return promise
                user.$remove()
                    .then(function() {
                        deferred.resolve("OK");
                    })
                    .catch(function(error){
                        deferred.reject(error);
                    })

                return deferred.promise;
            },

            /**
             * Création association utilisateur -> cercles
             * @param userIndex Utilisateur connecté
             * @param cercleName nom du cercle à ajouter
             */
            addCercle: function (username, cercleName) {

                var deferred = $q.defer();

                var userCercleMemberRef = ref.child('users').child(username).child('cercles').child(cercleName);
                var userCercles = $firebaseObject(userCercleMemberRef);
                userCercles.$loaded()
                    .then(function () {
                        userCercles.$value=true;
                        userCercles.$save().then(function(){
                            deferred.resolve(username);
                        })
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }
        }
    }
])

app.factory("CerclesManager", ['$rootScope', '$q', '$firebaseObject', '$firebaseArray', 'UsersManager',
    function($rootScope, $q, $firebaseObject, $firebaseArray, UsersManager) {

        var ref = new Firebase("https://elink.firebaseio.com");

        function getFullnameForUsers(usersIndex) {

            var promises = [];

            angular.forEach(usersIndex,  function(userIndex, index) {
                promises.push(UsersManager.getUserFullname(userIndex));
            });

            return $q.all(promises);
        }

        function deleteCercle (cercleName) {
            var deferred = $q.defer();
            var cercleRef = ref.child('cercles').child(cercleName);
            cercle = $firebaseObject(cercleRef);
            cercle.$loaded()
                .then(function() {
                    cercle.$remove()
                        .then(function(){
                            deferred.resolve(cercleName);
                        })
                        .catch(function(error) {
                            deferred.reject(error);
                        });
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
        function deleteCercleMember (cercleName) {
            var deferred = $q.defer();
            var cercleMemberRef = ref.child('cercleMembers').child(cercleName);
            cercleMember = $firebaseObject(cercleMemberRef);
            cercleMember.$loaded()
                .then(function() {
                    deleteCercleUser(cercleName, cercleMember)
                        .then(function() {
                            cercleMember.$remove()
                                .then(function(){
                                    deferred.resolve(cercleName);
                                })
                                .catch(function(error) {
                                    deferred.reject(error);
                                });
                        })
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
        function deleteCercleLink (cercleName) {
            var deferred = $q.defer();
            var cercleLinkRef = ref.child('cercleLinks').child(cercleName);
            cercleLink = $firebaseObject(cercleLinkRef);
            cercleLink.$loaded()
                .then(function() {
                    cercleLink.$remove()
                        .then(function(){
                            deferred.resolve(cercleName);
                        })
                        .catch(function(error) {
                            deferred.reject(error);
                        });
                })
                .catch(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
        function deleteCercleUser(cercleName, usersIndex) {

            var promises=[];

            angular.forEach(usersIndex, function(value, username) {
                promises.push(UsersManager.removeCercle(username, cercleName));
            })

            return $q.all(promises);
        }

        function saveCercle (cercleName, cercleDescription, username) {

            var deferred = $q.defer();

            var cercleRef = ref.child('cercles').child(cercleName);
            var cercle = $firebaseObject(cercleRef);

            cercle.$loaded()
                .then(function () {
                    if (cercle.$value !== null) {
                        deferred.reject(new Error("le cercle existe déjà !"));
                    } else {

                        cercle.user = username;
                        cercle.created = new Date().getTime();
                        cercle.description = cercleDescription;

                        cercle.$save()
                            .then(function () {
                                deferred.resolve(cercle);
                            })
                            .catch(function (error) {
                                deferred.reject(error);
                            });
                    }
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;

        }
        function saveCercleMember (cercleName, username) {

            var deferred = $q.defer();

            var cercleMemberRef = ref.child('cercleMembers').child(cercleName).child(username);
            var cercleMember = $firebaseObject(cercleMemberRef);

            cercleMember.$loaded()
                .then(function() {

                    if (cercleMember.$value !== null) {
                        deferred.reject(new Error("le cercle existe déjà !"));
                    } else {
                        cercleMember.$value = true;
                        cercleMember.$save()
                            .then(function () {
                                deferred.resolve(cercleName);
                            })
                            .catch(function (error) {
                                deferred.reject(error);
                            });
                    }
                })
                .catch(function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;

        }

        return {

            getCercles: function() {
                var deferred = $q.defer();
                var cerclesRef = ref.child('cercles');

                cercles = $firebaseArray(cerclesRef);

                cercles.$loaded().then(
                    function() {
                        deferred.resolve(cercles);
                    }).catch(function(error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            getMembers: function(cercleName) {
                var deferred = $q.defer();
                var membersRef = ref.child('cercleMembers').child(cercleName);

                var membersIndex = $firebaseArray(membersRef);

                membersIndex.$loaded()
                    .then(function() {
                        return getFullnameForUsers(membersIndex)
                    })
                    .then(function(users) {
                        deferred.resolve(users);
                    })
                    .catch(function(error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            },

            addCercle: function(cercleName, cercleDescription) {

                //TODO Ajout catch pour traiter au niveau IHM les anos.
                return saveCercle(cercleName, cercleDescription, $rootScope.userConnected.$id)
                    .then(saveCercleMember (cercleName, $rootScope.userConnected.$id))
                    .then(UsersManager.addCercle($rootScope.userConnected.$id, cercleName));
            },

            deleteCercle : function(cercleName) {

                //TODO Ajout catch pour traiter au niveau IHM les anos.
                return deleteCercle(cercleName)
                    .then(deleteCercleMember)
                    .then(deleteCercleLink);
                //TODO suppression association user->cercle
            }
        };
    }
]);

// !!! utilisateur connecté à poser dans $rootscope ou service
app.controller("CerclesCtrl", ["$scope", "CerclesManager",
    function($scope, CerclesManager) {

        //Recherche des cercles
        CerclesManager.getCercles()
            .then(function(cercles){

                angular.forEach(cercles, function(cercle, index) {
                    var test;
                    CerclesManager.getMembers(cercle.$id)
                        .then(function(users) {
                                cercle.members=users;
                        });
                });

                $scope.cercles = cercles;
            });

        $scope.addCercle = function() {
            CerclesManager.addCercle($scope.cercle.name,$scope.cercle.description);
        }

        $scope.removeCercle = function() {
            CerclesManager.deleteCercle($scope.cercle.nameToRemove);
        }

    }
]);