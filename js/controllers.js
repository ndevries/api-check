angular.module('app.controllers', [])

.controller('MainCtrl', function($scope, $http) {

    $scope.methods = [
        'GET',
        'POST',
        'PUT',
        'DELETE'
    ];
    $scope.selected = $scope.methods[0];
    $scope.url = 'http://localhost:8080/api/v1/';

    $scope.data = 'Response object here...'
    $scope.post = {};

    $scope.isEmpty = function(object) {
        for(var i in object) {
            return true;
        }
        return false;
    }

    $scope.update = function(method) {
        $scope.selected = method;
    }

    $scope.construct = function() {
        $scope.post[$scope.key] = $scope.value;
        $scope.key = '';
        $scope.value = '';
    }

    $scope.edit = function(key, value) {
        $scope.key = key;
        $scope.value = value;
    }

    $scope.clear = function(key) {
        delete $scope.post[key];
    }

    $scope.submit = function() {
        $http({method: $scope.selected, url: $scope.url, data: JSON.stringify($scope.post), headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).success(function(data, status) {
            $scope.data = JSON.stringify(data, undefined, 4);
            $scope.icon = 'fa-check';
            $scope.class = 'label-success';
            $scope.status = status;
            $scope.config = config;
        }).error(function(data, status) {
            $scope.data = data;
            if ($scope.data == '') {
                $scope.data = JSON.stringify('Not Found', undefined, 4);
            }
            if (status == 404 || status == 500) {
                $scope.icon = 'fa-times';
                $scope.class = 'label-danger';
            } else if (status == 403) {
                $scope.icon = 'fa-lock';
                $scope.class = 'label-danger';
            } else {
                $scope.icon = 'fa-exclamation';
                $scope.class = 'label-warning';
            }
            $scope.data = JSON.stringify(data, undefined, 4);
            $scope.status = status;
            $scope.config = config;
        });
    }

});