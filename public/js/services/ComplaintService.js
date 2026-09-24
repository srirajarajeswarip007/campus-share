app.service('ComplaintService', ['$http', 'AuthService', function($http, AuthService) {
  this.getComplaints = function() {
    return $http.get('/api/complaints', { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };

  this.submitComplaint = function(complaintData) {
    return $http.post('/api/complaints', complaintData, { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };

  this.updateComplaint = function(id, updateData) {
    return $http.put('/api/complaints/' + id, updateData, { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };
}]);
