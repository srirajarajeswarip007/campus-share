app.controller('DashboardController', ['$scope', '$http', 'AuthService', function($scope, $http, AuthService) {
  $scope.stats = {
    availableResources: 0,
    myResources: 0,
    activeRequests: 0,
    unreadNotifications: 0
  };

  $scope.recentActivities = [];
  $scope.isLoading = true;

  $scope.loadDashboardData = function() {
    $scope.isLoading = true;
    $http.get('/api/stats/dashboard', { headers: AuthService.getAuthHeader() })
      .then(function(res) {
        $scope.stats = res.data;
      })
      .catch(function(err) {
        console.error('Error loading dashboard stats:', err);
      });

    $http.get('/api/requests', { headers: AuthService.getAuthHeader() })
      .then(function(res) {
        $scope.recentActivities = res.data.slice(0, 5);
      })
      .finally(function() {
        $scope.isLoading = false;
      });
  };

  $scope.loadDashboardData();
}]);
