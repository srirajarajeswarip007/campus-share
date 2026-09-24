app.controller('AuthController', ['$scope', '$rootScope', '$location', 'AuthService', function($scope, $rootScope, $location, AuthService) {
  $scope.loginData = {
    email: '',
    password: ''
  };

  $scope.registerData = {
    name: '',
    email: '',
    studentId: '',
    department: 'Computer Science',
    password: '',
    confirmPassword: ''
  };

  $scope.errorMessage = '';
  $scope.successMessage = '';
  $scope.isLoading = false;

  $scope.departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical Engineering',
    'BioTechnology',
    'Business Administration'
  ];

  $scope.login = function() {
    $scope.errorMessage = '';
    $scope.isLoading = true;

    AuthService.login($scope.loginData.email, $scope.loginData.password)
      .then(function(res) {
        $rootScope.currentUser = AuthService.getCurrentUser();
        $rootScope.isLoggedIn = true;

        if (res.user.role === 'Admin') {
          $location.path('/admin-dashboard');
        } else {
          $location.path('/dashboard');
        }
      })
      .catch(function(err) {
        $scope.errorMessage = err.data ? err.data.message : 'Login failed. Please check your credentials.';
      })
      .finally(function() {
        $scope.isLoading = false;
      });
  };

  $scope.register = function() {
    $scope.errorMessage = '';
    $scope.successMessage = '';

    if ($scope.registerData.password !== $scope.registerData.confirmPassword) {
      $scope.errorMessage = 'Passwords do not match!';
      return;
    }

    $scope.isLoading = true;

    var payload = {
      name: $scope.registerData.name,
      email: $scope.registerData.email,
      studentId: $scope.registerData.studentId,
      department: $scope.registerData.department,
      password: $scope.registerData.password
    };

    AuthService.register(payload)
      .then(function(res) {
        $scope.successMessage = 'Account created successfully! Redirecting...';
        $rootScope.currentUser = AuthService.getCurrentUser();
        $rootScope.isLoggedIn = true;

        setTimeout(function() {
          $location.path('/dashboard');
          $scope.$apply();
        }, 1200);
      })
      .catch(function(err) {
        $scope.errorMessage = err.data ? err.data.message : 'Registration failed. Please try again.';
      })
      .finally(function() {
        $scope.isLoading = false;
      });
  };
}]);
