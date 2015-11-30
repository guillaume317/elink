(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('TagsService', ['$q', '$http', 'TagsModel', 'TagModel', 'LiensModel', 'commonsService', 'Env', TagsService]);

    /**
     *
     */
    function TagsService($q, $http, TagsModel, TagModel, LiensModel, commonsService, Env){

        return {
             findTagsByCriterias : function(aTagModel, expand, start, limit, sortByAsc) {
                var url = Env.backend() + "/tags";
                return $http.get(url, {params : {expand : expand, filter : commonsService.flatModel(aTagModel), start : start, limit : limit, sortByAsc : sortByAsc} }).then(function (response) {
                    return (new TagsModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            findTagById : function(id, expand) {
                if (! id)
                    throw new Error("ID can not be empty ");
                var url = Env.backend() + "/tags/" + id;
                return $http.get(url, {params : {expand : expand} } ).then(function (response) {
                    return (new TagModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            findSelectableLien : function() {
                var url = Env.backend() + "/tags/liens";
                return $http.get(url).then(function (response) {
                    return (new LiensModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            updateTag : function (aTagModel) {
                //if (! id)
                //    throw new Error("ID can not be empty ");
                var url = Env.backend() + "/tags/" + aTagModel.ident;
                return $http.post(url, aTagModel).then(function (response) {
                    //
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            },
            createTag : function (aTagModel) {
                var url = Env.backend() + "/tags";
                return $http.put(url, aTagModel).then(function (response) {
                    //
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            },
            deleteTag : function (id) {
                var url = Env.backend() + "/tags/" + id;
                return $http.delete(url, {}).then(function (response) {
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            }
        };

    }

})();
