app.service('UserService', ['$http', 'AuthService', function($http, AuthService) {
  this.getUsers = function() {
    return $http.get('/api/users', { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };

  this.addUser = function(userData) {
    return $http.post('/api/users', userData, { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };

  this.updateUser = function(id, userData) {
    return $http.put('/api/users/' + id, userData, { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };

  this.deleteUser = function(id) {
    return $http.delete('/api/users/' + id, { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };
}]);
