(function(){
    'use strict';

    angular.module('el1.services.commun')
        .service('LiensService', ['$q', '$http', 'LiensModel', 'LienModel', 'EquipagesModel', 'commonsService', 'Env', LiensService]);

    /**
     *
     */
    function LiensService($q, $http, LiensModel, LienModel, EquipagesModel, commonsService, Env){

        return {
             findLiensByCriterias : function(aLienModel, expand, start, limit, sortByAsc) {
               if ( Env.isMock() ) {
                   var link1= { "url": "http://www.google.fr" };
                   var link2= { "url": "http://www.yahoo.fr" };
                   var array= [];
                   array.push(link1);
                   array.push(link2);
                   return new LiensModel(array);
                }

                var url = Env.backend() + "/liens";
                return $http.get(url, {params : {expand : expand, filter : commonsService.flatModel(aLienModel), start : start, limit : limit, sortByAsc : sortByAsc} }).then(function (response) {
                    return (new LiensModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            findLienById : function(id, expand) {
                if (! id)
                    throw new Error("ID can not be empty ");
                var url = Env.backend() + "/liens/" + id;
                return $http.get(url, {params : {expand : expand} } ).then(function (response) {
                    return (new LienModel(response.data))
                }, function (erreur) {
                    throw erreur;
                });
            },
            updateLien : function (aLienModel) {
                //if (! id)
                //    throw new Error("ID can not be empty ");
                var url = Env.backend() + "/liens/" + aLienModel.ident;
                return $http.post(url, aLienModel).then(function (response) {
                    //
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
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
            deleteLien : function (id) {
                var url = Env.backend() + "/liens/" + id;
                return $http.delete(url, {}).then(function (response) {
                    return response.status;
                }, function (erreur) {
                    throw erreur;
                });
            }
        };

    }

})();
