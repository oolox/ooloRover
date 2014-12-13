'use strict';


// Declare app level module which depends on filters, and services
angular.module('oobApp', [
  'ngRoute',
  'oobApp.filters',
  'oobApp.services',
  'oobApp.directives',
  'oobApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewDrive', {templateUrl: 'partials/viewDrive.html', controller: 'driveCtrl'});
  $routeProvider.when('/viewStatus', {templateUrl: 'partials/viewStatus.html', controller: 'statusCtrl'});
  $routeProvider.otherwise({redirectTo: '/viewDrive'});
}]);
