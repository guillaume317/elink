angular.module('el1.model')

    .factory('TagModel', function () {
        // constructor
        function TagModel(data) {
            angular.copy(data, this); 
            this.toString = function toString() {
                return " " + this.label +  " ";
            }
        }
        return TagModel;
    })

    .factory('TagsModel', [ 'TagModel', function (TagModel) {
        // constructor
        function TagsModel(data) {
            this.items = new Array(data.length);
            for (var i in data) {
                this.items[i] = new TagModel(data[i]);
            }
        }

        return TagsModel;
    }]);
