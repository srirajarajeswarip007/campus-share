app.controller('MainController', ['$scope', '$rootScope', '$location', 'AuthService', function($scope, $rootScope, $location, AuthService) {
  $scope.appName = "CampusShare";
  
  $scope.demoLogin = function(role) {
    var email = role === 'Admin' ? 'admin@campus.edu' : 'student@campus.edu';
    var pass = role === 'Admin' ? 'admin123' : 'student123';
    
    AuthService.login(email, pass).then(function(res) {
      $rootScope.currentUser = AuthService.getCurrentUser();
      $rootScope.isLoggedIn = true;
      if (res.user.role === 'Admin') {
        $location.path('/admin-dashboard');
      } else {
        $location.path('/dashboard');
      }
    }).catch(function(err) {
      alert(err.data ? err.data.message : 'Demo login failed');
    });
  };
}]);
