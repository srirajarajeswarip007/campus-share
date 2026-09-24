app.controller('RequestController', [
  '$scope', 'RequestService', 'ComplaintService', 'AuthService',
  function($scope, RequestService, ComplaintService, AuthService) {

    $scope.requests = [];
    $scope.isLoading = false;

    // Complaint modal from request
    $scope.showComplaintModal = false;
    $scope.complaintForm = {
      title: '',
      category: 'Resource Damaged',
      description: '',
      resourceId: null,
      resourceName: ''
    };

    $scope.complaintCategories = [
      'Resource Damaged',
      'Resource Not Returned',
      'Misuse',
      'Late Return Dispute',
      'Other'
    ];

    $scope.loadRequests = function() {
      $scope.isLoading = true;
      RequestService.getRequests()
        .then(function(data) {
          $scope.requests = data;
        })
        .catch(function(err) {
          console.error('Error fetching requests:', err);
        })
        .finally(function() {
          $scope.isLoading = false;
        });
    };

    $scope.returnResource = function(request) {
      if (confirm('Confirm return of "' + request.resourceName + '"?')) {
        RequestService.updateRequestStatus(request._id, 'Returned')
          .then(function() {
            $scope.loadRequests();
          })
          .catch(function(err) {
            alert('Failed to update request status.');
          });
      }
    };

    $scope.approveRequest = function(request) {
      RequestService.updateRequestStatus(request._id, 'Approved')
        .then(function() {
          $scope.loadRequests();
        })
        .catch(function(err) {
          alert('Failed to approve request.');
        });
    };

    $scope.rejectRequest = function(request) {
      if (confirm('Are you sure you want to decline this request?')) {
        RequestService.updateRequestStatus(request._id, 'Rejected')
          .then(function() {
            $scope.loadRequests();
          })
          .catch(function(err) {
            alert('Failed to decline request.');
          });
      }
    };

    $scope.openReportModal = function(request) {
      $scope.complaintForm = {
        title: 'Issue regarding ' + request.resourceName,
        category: 'Resource Damaged',
        description: '',
        resourceId: request.resourceId,
        resourceName: request.resourceName
      };
      $scope.showComplaintModal = true;
    };

    $scope.closeReportModal = function() {
      $scope.showComplaintModal = false;
    };

    $scope.submitComplaint = function() {
      ComplaintService.submitComplaint($scope.complaintForm)
        .then(function() {
          alert('Report submitted to campus compliance board.');
          $scope.closeReportModal();
        })
        .catch(function(err) {
          alert('Failed to submit complaint.');
        });
    };

    $scope.loadRequests();
  }
]);
