(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('CategoriesService', ['$q', '$http', 'CategoriesModel', 'CategorieModel', 'LiensModel', 'commonsService', 'Env', CategoriesService]);

    /**
     *
     */
    function CategoriesService($q, $http, CategoriesModel, CategorieModel, LiensModel, commonsService, Env){

        return {
             findCategoriesByCriterias : function(aCategorieModel, expand, start, limit, sortByAsc) {
                var url = Env.backend() + "/categories";
                return $http.get(url, {params : {expand : expand, filter : commonsService.flatModel(aCategorieModel), start : start, limit : limit, sortByAsc : sortByAsc} }).then(function (response) {
                    return (new CategoriesModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            findCategorieById : function(id, expand) {
                if (! id)
                    throw new Error("ID can not be empty ");
                var url = Env.backend() + "/categories/" + id;
                return $http.get(url, {params : {expand : expand} } ).then(function (response) {
                    return (new CategorieModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            findSelectableLien : function() {
                var url = Env.backend() + "/categories/liens";
                return $http.get(url).then(function (response) {
                    return (new LiensModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            updateCategorie : function (aCategorieModel) {
                //if (! id)
                //    throw new Error("ID can not be empty ");
                var url = Env.backend() + "/categories/" + aCategorieModel.ident;
                return $http.post(url, aCategorieModel).then(function (response) {
                    //
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            },
            createCategorie : function (aCategorieModel) {
                var url = Env.backend() + "/categories";
                return $http.put(url, aCategorieModel).then(function (response) {
                    //
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            },
            deleteCategorie : function (id) {
                var url = Env.backend() + "/categories/" + id;
                return $http.delete(url, {}).then(function (response) {
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            }
        };

    }

})();
