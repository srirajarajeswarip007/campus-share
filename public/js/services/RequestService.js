app.service('RequestService', ['$http', 'AuthService', function($http, AuthService) {
  this.getRequests = function() {
    return $http.get('/api/requests', { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };

  this.createRequest = function(requestData) {
    return $http.post('/api/requests', requestData, { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };

  this.updateRequestStatus = function(id, status) {
    return $http.put('/api/requests/' + id + '/status', { status: status }, { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };
}]);
