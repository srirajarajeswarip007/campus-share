app.controller('AdminController', [
  '$scope', '$http', 'UserService', 'ResourceService', 'AuthService',
  function($scope, $http, UserService, ResourceService, AuthService) {

    $scope.stats = {};
    $scope.users = [];
    $scope.resources = [];
    $scope.isLoading = false;

    // User Modal State
    $scope.showUserModal = false;
    $scope.isEditingUser = false;
    $scope.userForm = {
      id: null,
      name: '',
      email: '',
      studentId: '',
      department: 'Computer Science',
      role: 'Student',
      password: ''
    };

    // System Settings State
    $scope.systemSettings = {
      finePerDay: 5,
      defaultBorrowDurationDays: 7,
      broadcastMessage: '',
      allowStudentUploads: true,
      requireApproval: true
    };

    // Load Admin Dashboard Data
    $scope.loadDashboard = function() {
      $scope.isLoading = true;
      $http.get('/api/stats/dashboard', { headers: AuthService.getAuthHeader() })
        .then(function(res) {
          $scope.stats = res.data;
        })
        .finally(function() {
          $scope.isLoading = false;
        });
    };

    // Manage Users Logic (UserService)
    $scope.loadUsers = function() {
      $scope.isLoading = true;
      UserService.getUsers()
        .then(function(data) {
          $scope.users = data;
        })
        .finally(function() {
          $scope.isLoading = false;
        });
    };

    $scope.openAddUserModal = function() {
      $scope.isEditingUser = false;
      $scope.userForm = {
        id: null,
        name: '',
        email: '',
        studentId: '',
        department: 'Computer Science',
        role: 'Student',
        password: ''
      };
      $scope.showUserModal = true;
    };

    $scope.openEditUserModal = function(user) {
      $scope.isEditingUser = true;
      $scope.userForm = {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        role: user.role,
        password: ''
      };
      $scope.showUserModal = true;
    };

    $scope.closeUserModal = function() {
      $scope.showUserModal = false;
    };

    $scope.saveUser = function() {
      $scope.isLoading = true;
      if ($scope.isEditingUser) {
        UserService.updateUser($scope.userForm.id, $scope.userForm)
          .then(function() {
            $scope.closeUserModal();
            $scope.loadUsers();
          })
          .catch(function(err) {
            alert(err.data ? err.data.message : 'Failed to update user.');
          })
          .finally(function() {
            $scope.isLoading = false;
          });
      } else {
        UserService.addUser($scope.userForm)
          .then(function() {
            $scope.closeUserModal();
            $scope.loadUsers();
          })
          .catch(function(err) {
            alert(err.data ? err.data.message : 'Failed to create user.');
          })
          .finally(function() {
            $scope.isLoading = false;
          });
      }
    };

    $scope.deleteUser = function(id) {
      if (confirm('Are you sure you want to delete this user?')) {
        UserService.deleteUser(id)
          .then(function() {
            $scope.loadUsers();
          });
      }
    };

    // Manage Resources Logic (ResourceService)
    $scope.loadResources = function() {
      $scope.isLoading = true;
      ResourceService.getResources({})
        .then(function(data) {
          $scope.resources = data;
        })
        .finally(function() {
          $scope.isLoading = false;
        });
    };

    // System Settings
    $scope.loadSettings = function() {
      $http.get('/api/settings')
        .then(function(res) {
          $scope.systemSettings = res.data;
        });
    };

    $scope.saveSettings = function() {
      $http.put('/api/settings', $scope.systemSettings, { headers: AuthService.getAuthHeader() })
        .then(function() {
          alert('System settings updated successfully!');
        });
    };

    $scope.loadDashboard();
    $scope.loadUsers();
    $scope.loadResources();
    $scope.loadSettings();
  }
]);
