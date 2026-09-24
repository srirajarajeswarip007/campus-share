// Factory for shared resource state / details
app.factory('ResourceFactory', [function() {
  var selectedResource = null;

  return {
    setSelectedResource: function(resource) {
      selectedResource = resource;
    },
    getSelectedResource: function() {
      return selectedResource;
    },
    clearSelectedResource: function() {
      selectedResource = null;
    }
  };
}]);

// Service for HTTP API calls
app.service('ResourceService', ['$http', 'AuthService', function($http, AuthService) {
  this.getResources = function(params) {
    return $http.get('/api/resources', { params: params })
      .then(function(res) { return res.data; });
  };

  this.getResourceById = function(id) {
    return $http.get('/api/resources/' + id)
      .then(function(res) { return res.data; });
  };

  this.addResource = function(resourceData) {
    return $http.post('/api/resources', resourceData, { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };

  this.updateResource = function(id, resourceData) {
    return $http.put('/api/resources/' + id, resourceData, { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };

  this.deleteResource = function(id) {
    return $http.delete('/api/resources/' + id, { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };
}]);
