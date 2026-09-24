app.service('NotificationService', ['$http', 'AuthService', function($http, AuthService) {
  this.getNotifications = function() {
    return $http.get('/api/notifications', { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };

  this.markAsRead = function(id) {
    return $http.put('/api/notifications/' + id + '/read', {}, { headers: AuthService.getAuthHeader() })
      .then(function(res) { return res.data; });
  };
}]);
