app.factory('AuthService', ['$http', '$q', function($http, $q) {
  var service = {};
  var userKey = 'campus_share_user';
  var tokenKey = 'campus_share_token';

  service.login = function(email, password) {
    return $http.post('/api/auth/login', { email: email, password: password })
      .then(function(response) {
        if (response.data.token && response.data.user) {
          localStorage.setItem(tokenKey, response.data.token);
          localStorage.setItem(userKey, JSON.stringify(response.data.user));
        }
        return response.data;
      });
  };

  service.register = function(userData) {
    return $http.post('/api/auth/register', userData)
      .then(function(response) {
        if (response.data.token && response.data.user) {
          localStorage.setItem(tokenKey, response.data.token);
          localStorage.setItem(userKey, JSON.stringify(response.data.user));
        }
        return response.data;
      });
  };

  service.logout = function() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  };

  service.getCurrentUser = function() {
    var userStr = localStorage.getItem(userKey);
    return userStr ? JSON.parse(userStr) : null;
  };

  service.getToken = function() {
    return localStorage.getItem(tokenKey);
  };

  service.isLoggedIn = function() {
    return !!service.getToken();
  };

  service.updateProfile = function(profileData) {
    var token = service.getToken();
    return $http.put('/api/users/profile', profileData, {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(function(response) {
      if (response.data.user) {
        var currentUser = service.getCurrentUser() || {};
        var updated = angular.extend(currentUser, response.data.user);
        localStorage.setItem(userKey, JSON.stringify(updated));
      }
      return response.data;
    });
  };

  service.getAuthHeader = function() {
    return { 'Authorization': 'Bearer ' + service.getToken() };
  };

  return service;
}]);
