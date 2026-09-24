app.controller('ComplaintController', ['$scope', 'ComplaintService', function($scope, ComplaintService) {
  $scope.complaints = [];
  $scope.isLoading = false;
  $scope.activeFilter = 'All';

  $scope.selectedComplaint = null;
  $scope.showDetailModal = false;

  $scope.loadComplaints = function() {
    $scope.isLoading = true;
    ComplaintService.getComplaints()
      .then(function(data) {
        $scope.complaints = data;
      })
      .catch(function(err) {
        console.error('Error loading complaints:', err);
      })
      .finally(function() {
        $scope.isLoading = false;
      });
  };

  $scope.openDetailModal = function(complaint) {
    $scope.selectedComplaint = angular.copy(complaint);
    $scope.showDetailModal = true;
  };

  $scope.closeDetailModal = function() {
    $scope.showDetailModal = false;
  };

  $scope.updateComplaintStatus = function(status) {
    if (!$scope.selectedComplaint) return;
    $scope.selectedComplaint.status = status;
    ComplaintService.updateComplaint($scope.selectedComplaint._id, {
      status: status,
      actionNotes: $scope.selectedComplaint.actionNotes
    }).then(function() {
      $scope.loadComplaints();
      $scope.closeDetailModal();
    });
  };

  $scope.loadComplaints();
}]);
