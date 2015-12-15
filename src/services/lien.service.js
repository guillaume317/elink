(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('LiensService', ['$q', '$http', 'LiensModel', 'LienModel', 'commonsService', 'FBURL', '$firebaseArray', '$firebaseObject', 'Env', LiensService]);

    /**
     *
     */
    function LiensService($q, $http, LiensModel, LienModel, commonsService, FBURL, $firebaseArray, $firebaseObject, Env){

        var ref = new Firebase(FBURL);

        return {

            createLinkForUser : function(lien, username) {
                var deferred = $q.defer();

                var userLinksRef;
                if (lien.private==="biblio") {
                    userLinksRef = ref.child('usersLinks').child(username).child('read');
                } else {
                    userLinksRef = ref.child('usersLinks').child(username).child('notread');
                }
                var userLinks = $firebaseArray(userLinksRef);
                userLinks.$loaded()
                    .then(function () {
                        var newLink = {};
                        newLink.createdOn = Firebase.ServerValue.TIMESTAMP;
                        newLink.title = lien.title ? lien.title : "Titre à récupérer";
                        newLink.teasing = lien.teasing ? lien.teasing : "Teasing à récupérer !";
                        newLink.url = lien.url;
                        userLinks.$add(newLink);
                        deferred.resolve(newLink);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            findNotReadLinksByUser : function(username) {
                var deferred = $q.defer();

                var userLinksNotReadRef = ref.child('usersLinks').child(username).child('notread');
                var userLinksNotRead = $firebaseArray(userLinksNotReadRef);
                userLinksNotRead.$loaded()
                    .then(function () {
                        deferred.resolve(userLinksNotRead);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            findReadLinksByUser : function(username) {
                var deferred = $q.defer();

                var userLinksReadRef = ref.child('usersLinks').child(username).child('read');
                var userLinksRead = $firebaseArray(userLinksReadRef);
                userLinksRead.$loaded()
                    .then(function () {
                        deferred.resolve(userLinksRead);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            /**
             * Recherche des liens d'un cercle appartenant à un utilisateur
             * La liste des cercles d'un utilisateur doit être connue avant
             * @param cercleName
             * @returns {*}
             */
            findLinksByCerlceName : function(cercleName) {

                var deferred = $q.defer();

                var cercleLinksRef = ref.child('cercleLinks').child(cercleName);
                var cercleLinks = $firebaseArray(cercleLinksRef);
                cercleLinks.$loaded()
                    .then(function () {
                        deferred.resolve(cercleLinks);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            },

            addLike : function(idLink) {


                var deferred = $q.defer();

                var cercleLinkLikeRef = ref.child('cercleLinksLike').child(idLink);
                var cercleLinkLike = $firebaseArray(cercleLinkLikeRef);
                cercleLinkLike.$loaded()
                    .then(function () {
                        cercleLinkLike.$value = cercleLinkLike.$value === null ? 1 : cercleLinkLike.$value + 1;
                        cercleLinkLike.$save();
                        deferred.resolve(cercleLinks);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            },

            findTopTenLinks : function() {

                /**
                 * ATTENTION
                 * If you want to use orderByValue() in a production app, you should add .value to your rules at
                 * the appropriate index. Read the documentation on the .indexOn rule for more information.
                 */
                var deferred = $q.defer();

                var topTenRef = ref.child('cercleLinksLike');

                //A noter : le tri est ascendant. On prend donc les 10 derniers
                topTenRef.orderByValue().limitToLast(10).on("value", function(topTen) {
                    //TODO
                    // jointure avec le détail de l'article
                    var topTen = [];
                    snapshot.forEach(function (data) {
                        topTen.push({id: data.key(), cpt: data.val()});
                    });
                    deferred.resolve(topTen);
                });

                return deferred.promise;
            },

            /* toutes les catgories */
            findCategories: function () {
                if ( Env.isMock() ) {

                    /**var array = ['devops', 'java', 'veille', 'divers'];
                    return array;*/
                    // features/feature-01-oauth
                    var deferred = $q.defer();

                    //TODO Once() function
                    var ref = new Firebase(Env.backendfirebase() + "categories");
                    var categories = $firebaseArray(ref);

                    categories.$loaded().then(
                        function() {
                            //obtention d'un tableau d'objet
                            // [Object
                            //      $id: "0"
                            //      $priority: null
                            //      $value: "devops"
                            //On it�re sur ce dernier pour r�cup�rer la liste
                            var array = [];
                            categories.forEach(function(obj) {
                                array.push(obj.$value);
                            })
                            deferred.resolve(array);
                        }).catch(function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

            },
            /* toutes les cercles auquels le user appaertient */
            findMyCercles: function () {
                if ( Env.isMock() ) {

                    /**
                    var array = ['CCMT', 'DevOps'];
                    return array;*/
                    // features/feature-01-oauth
                    var deferred = $q.defer();

                    var ref = new Firebase(Env.backendfirebase() + "cercles");
                    var cercles = $firebaseArray(ref);
                    cercles.$loaded().then(
                        function() {
                            //obtention d'un tableau d'objet
                            // [Object
                            //      $id: "CCMT"
                            //On it�re sur ce dernier pour r�cup�rer la liste
                            var array = [];
                            cercles.forEach(function(obj) {
                                array.push(obj.$id);
                            })
                            deferred.resolve(array);
                        }).catch(function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

            }

        };

    }

})();
