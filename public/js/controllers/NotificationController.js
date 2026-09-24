app.controller('NotificationController', ['$scope', 'NotificationService', function($scope, NotificationService) {
  $scope.notifications = [];
  $scope.isLoading = false;

  $scope.loadNotifications = function() {
    $scope.isLoading = true;
    NotificationService.getNotifications()
      .then(function(data) {
        $scope.notifications = data;
      })
      .catch(function(err) {
        console.error('Error loading notifications:', err);
      })
      .finally(function() {
        $scope.isLoading = false;
      });
  };

  $scope.markRead = function(notif) {
    NotificationService.markAsRead(notif._id)
      .then(function() {
        notif.isRead = true;
      });
  };

  $scope.loadNotifications();
}]);
