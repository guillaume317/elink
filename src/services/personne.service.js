(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('PersonnesService', ['$q', '$http', 'PersonnesModel', 'PersonneModel', 'EquipagesModel', 'commonsService', 'Env', PersonnesService]);

    /**
     *
     */
    function PersonnesService($q, $http, PersonnesModel, PersonneModel, EquipagesModel, commonsService, Env){

        return {
             findPersonnesByCriterias : function(aPersonneModel, expand, start, limit, sortByAsc) {
                var url = Env.backend() + "/personnes";
                return $http.get(url, {params : {expand : expand, filter : commonsService.flatModel(aPersonneModel), start : start, limit : limit, sortByAsc : sortByAsc} }).then(function (response) {
                    return (new PersonnesModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            findPersonneById : function(id, expand) {
                if (! id)
                    throw new Error("ID can not be empty ");
                var url = Env.backend() + "/personnes/" + id;
                return $http.get(url, {params : {expand : expand} } ).then(function (response) {
                    return (new PersonneModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            findSelectableEquipage : function() {
                var url = Env.backend() + "/personnes/equipages";
                return $http.get(url).then(function (response) {
                    return (new EquipagesModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            updatePersonne : function (aPersonneModel) {
                //if (! id)
                //    throw new Error("ID can not be empty ");
                var url = Env.backend() + "/personnes/" + aPersonneModel.ident;
                return $http.post(url, aPersonneModel).then(function (response) {
                    //
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            },
            createPersonne : function (aPersonneModel) {
                var url = Env.backend() + "/personnes";
                return $http.put(url, aPersonneModel).then(function (response) {
                    //
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            },
            deletePersonne : function (id) {
                var url = Env.backend() + "/personnes/" + id;
                return $http.delete(url, {}).then(function (response) {
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            }
        };

    }

})();
