(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('EquipagesService', ['$q', '$http', 'EquipagesModel', 'EquipageModel', 'PersonnesModel', 'LiensModel', 'commonsService', 'Env', EquipagesService]);

    /**
     *
     */
    function EquipagesService($q, $http, EquipagesModel, EquipageModel, PersonnesModel, LiensModel, commonsService, Env){

        return {
             findEquipagesByCriterias : function(aEquipageModel, expand, start, limit, sortByAsc) {
                var url = Env.backend() + "/equipages";
                return $http.get(url, {params : {expand : expand, filter : commonsService.flatModel(aEquipageModel), start : start, limit : limit, sortByAsc : sortByAsc} }).then(function (response) {
                    return (new EquipagesModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            findEquipageById : function(id, expand) {
                if (! id)
                    throw new Error("ID can not be empty ");
                var url = Env.backend() + "/equipages/" + id;
                return $http.get(url, {params : {expand : expand} } ).then(function (response) {
                    return (new EquipageModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            findSelectablePersonne : function() {
                var url = Env.backend() + "/equipages/personnes";
                return $http.get(url).then(function (response) {
                    return (new PersonnesModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            findSelectableLien : function() {
                var url = Env.backend() + "/equipages/liens";
                return $http.get(url).then(function (response) {
                    return (new LiensModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            updateEquipage : function (aEquipageModel) {
                //if (! id)
                //    throw new Error("ID can not be empty ");
                var url = Env.backend() + "/equipages/" + aEquipageModel.ident;
                return $http.post(url, aEquipageModel).then(function (response) {
                    //
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            },
            createEquipage : function (aEquipageModel) {
                var url = Env.backend() + "/equipages";
                return $http.put(url, aEquipageModel).then(function (response) {
                    //
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            },
            deleteEquipage : function (id) {
                var url = Env.backend() + "/equipages/" + id;
                return $http.delete(url, {}).then(function (response) {
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            }
        };

    }

})();
