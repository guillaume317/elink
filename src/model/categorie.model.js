angular.module('el1.model')

    .factory('CategorieModel', function () {
        // constructor
        function CategorieModel(data) {
            angular.copy(data, this); 
            this.toString = function toString() {
                return " " + this.label +  " ";
            }
        }
        return CategorieModel;
    })

    .factory('CategoriesModel', [ 'CategorieModel', function (CategorieModel) {
        // constructor
        function CategoriesModel(data) {
            this.items = new Array(data.length);
            for (var i in data) {
                this.items[i] = new CategorieModel(data[i]);
            }
        }

        return CategoriesModel;
    }]);
