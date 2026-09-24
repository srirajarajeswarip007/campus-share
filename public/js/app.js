var app = angular.module('campusApp', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(false); // Hashbang mode for compatibility

  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthController'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'AuthController'
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController'
    })
    .when('/browse', {
      templateUrl: 'views/browse-resources.html',
      controller: 'ResourceController'
    })
    .when('/resource/:id', {
      templateUrl: 'views/resource-detail.html',
      controller: 'ResourceController'
    })
    .when('/my-resources', {
      templateUrl: 'views/my-resources.html',
      controller: 'ResourceController'
    })
    .when('/my-requests', {
      templateUrl: 'views/my-requests.html',
      controller: 'RequestController'
    })
    .when('/notifications', {
      templateUrl: 'views/notifications.html',
      controller: 'NotificationController'
    })
    .when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileController'
    })
    .when('/settings', {
      templateUrl: 'views/settings.html',
      controller: 'ProfileController'
    })
    .when('/admin-dashboard', {
      templateUrl: 'views/admin-dashboard.html',
      controller: 'AdminController'
    })
    .when('/admin/users', {
      templateUrl: 'views/admin-users.html',
      controller: 'AdminController'
    })
    .when('/admin/resources', {
      templateUrl: 'views/admin-resources.html',
      controller: 'AdminController'
    })
    .when('/admin/complaints', {
      templateUrl: 'views/admin-complaints.html',
      controller: 'ComplaintController'
    })
    .when('/admin/settings', {
      templateUrl: 'views/admin-settings.html',
      controller: 'AdminController'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

app.run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
  $rootScope.currentUser = AuthService.getCurrentUser();
  $rootScope.isLoggedIn = AuthService.isLoggedIn();

  $rootScope.logout = function() {
    AuthService.logout();
    $rootScope.currentUser = null;
    $rootScope.isLoggedIn = false;
    $location.path('/login');
  };

  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    $rootScope.currentUser = AuthService.getCurrentUser();
    $rootScope.isLoggedIn = AuthService.isLoggedIn();
    $rootScope.currentPath = $location.path();

    const publicPages = ['/', '/login', '/register'];
    const authRequired = !publicPages.includes($location.path());

    if (authRequired && !$rootScope.isLoggedIn) {
      $location.path('/login');
    }
  });
}]);
