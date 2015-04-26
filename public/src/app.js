angular.module('ContactsApp', ['ngRoute', 'ngResource', 'ngMessages'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/contacts', {
				controller: 'ListController',
				templateUrl: 'views/list.html'
			})
			.when('/contact/new', {
				controller: 'NewController',
				templateUrl: 'views/new.html'
			})
			.when('/contact/:id', {
				controller: 'SingleController',
				templateUrl: 'views/single.html'
			});
		$locationProvider.html5Mode(true);
	});