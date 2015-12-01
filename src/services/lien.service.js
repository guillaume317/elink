(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('LiensService', ['$q', '$http', 'LiensModel', 'LienModel', 'EquipagesModel', 'commonsService', 'Env', LiensService]);

    /**
     *
     */
    function LiensService($q, $http, LiensModel, LienModel, EquipagesModel, commonsService, Env){

        return {
            /* Tous mes liens (read / unread) */
             findMyLinks : function(isUnread) {
               if ( Env.isMock() ) {
                   var link1 = {"id": "1", "url": "http://www.google.fr", "title" : "google", "teasing" : "le site de google"};
                   var link2 = {"id": "2", "url": "http://www.yahoo.fr", "title" : "yahoo", "teasing" : "le site de yahoo"};
                   var link3 = {"id": "3", "url": "https://material.angularjs.org/", "title" : "material", "teasing" : " material et angular"};
                   var array = [];
                   if (isUnread) {
                       array.push(link1);
                       array.push(link2);
                    } else {
                       array.push(link3);
                   }
                   return new LiensModel(array);
                }

                var url = Env.backend() + "/liens";
                return $http.get(url, {params : {expand : expand, filter : commonsService.flatModel(aLienModel), start : start, limit : limit, sortByAsc : sortByAsc} }).then(function (response) {
                    return (new LiensModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            /* Tous les liens du cercle passé en parametre */
            findTeamLinks : function(cercle) {
                if ( Env.isMock() ) {
                    var link1 = {"id": "4", "url": "http://www.google.fr", "title" : "google", "teasing" : "A LIRE !!", "sharedBy" : "Arthur", "category" : "divers" };
                    var link2 = {"id": "5", "url": "http://www.yahoo.fr" , "title" : "yahoo", "teasing" : "A LIRE !!", "sharedBy" : "Arthur", "category" : "divers"};
                    var link3 = {"id": "6", "url": "https://material.angularjs.org/" , "title" : "material", "teasing" : "A LIRE !!", "sharedBy" : "Arthur", "category" : "veille"};
                    var array = [];

                    array.push(link1);
                    array.push(link2);
                    array.push(link3);

                    return new LiensModel(array);
                }

                var url = Env.backend() + "/liens";
                return $http.get(url, {params : {expand : expand, filter : commonsService.flatModel(aLienModel), start : start, limit : limit, sortByAsc : sortByAsc} }).then(function (response) {
                    return (new LiensModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            /* marque le lien comme lu */
            markAsRead : function (aLienModel) {

            },
            /* marque le lien comme non lu */
            markAsUnread : function (aLienModel) {

            },
            /* toutes les catgories */
            findCategories: function () {
                if ( Env.isMock() ) {
                    var array = ['devops', 'java', 'veille', 'divers'];
                    return array;
                }

            },
            /* toutes les cercles auquels le user appaertient */
            findMyCercles: function () {
                if ( Env.isMock() ) {
                    var array = ['CCMT', 'DevOps'];
                    return array;
                }

            },
            createLien : function (aLienModel) {
                var url = Env.backend() + "/liens";
                return $http.put(url, aLienModel).then(function (response) {
                    //
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            },
            deleteLien : function (aLienModel) {
                var url = Env.backend() + "/liens/" + aLienModel.id;
                return $http.delete(url, {}).then(function (response) {
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            }
        };

    }

})();
