angular.module('el1.model')

    .factory('EquipageModel', function () {
        // constructor
        function EquipageModel(data) {
            angular.copy(data, this); 
            this.toString = function toString() {
                return " " + this.label +  " ";
            }
        }
        return EquipageModel;
    })

    .factory('EquipagesModel', [ 'EquipageModel', function (EquipageModel) {
        // constructor
        function EquipagesModel(data) {
            this.items = new Array(data.length);
            for (var i in data) {
                this.items[i] = new EquipageModel(data[i]);
            }
        }

        return EquipagesModel;
    }]);
