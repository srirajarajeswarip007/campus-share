app.controller('ProfileController', ['$scope', '$rootScope', '$http', 'AuthService', function($scope, $rootScope, $http, AuthService) {
  $scope.user = AuthService.getCurrentUser() || {};
  $scope.isEditing = false;
  $scope.isLoading = false;
  $scope.statusMessage = '';

  $scope.profileForm = {
    name: $scope.user.name || '',
    studentId: $scope.user.studentId || '',
    department: $scope.user.department || '',
    avatarUrl: $scope.user.avatarUrl || ''
  };

  $scope.settings = {
    emailNotifications: true,
    dueReminders: true,
    darkMode: false,
    publicVisibility: true
  };

  $scope.toggleEdit = function() {
    $scope.isEditing = !$scope.isEditing;
    if ($scope.isEditing) {
      $scope.profileForm = {
        name: $scope.user.name,
        studentId: $scope.user.studentId,
        department: $scope.user.department,
        avatarUrl: $scope.user.avatarUrl
      };
    }
  };

  $scope.saveProfile = function() {
    $scope.isLoading = true;
    $scope.statusMessage = '';

    AuthService.updateProfile($scope.profileForm)
      .then(function(res) {
        $scope.user = res.user;
        $rootScope.currentUser = res.user;
        $scope.isEditing = false;
        $scope.statusMessage = 'Profile updated successfully in MongoDB!';
      })
      .catch(function(err) {
        alert(err.data ? err.data.message : 'Profile update failed.');
      })
      .finally(function() {
        $scope.isLoading = false;
      });
  };

  $scope.saveSettings = function() {
    $scope.statusMessage = 'Settings preferences saved.';
  };
}]);
