app.controller('ResourceController', [
  '$scope', '$routeParams', '$location', 'ResourceService', 'ResourceFactory', 'RequestService', 'AuthService',
  function($scope, $routeParams, $location, ResourceService, ResourceFactory, RequestService, AuthService) {
    
    $scope.resources = [];
    $scope.selectedResource = null;
    $scope.isLoading = false;
    $scope.errorMessage = '';
    $scope.successMessage = '';

    // Filters
    $scope.searchQuery = $location.search().search || '';
    $scope.selectedCategory = 'All';
    $scope.selectedAvailability = 'All';

    $scope.categories = ['All', 'Academic', 'Electronics', 'Lab Equipment', 'Sports', 'Photography', 'Other'];
    $scope.availabilities = ['All', 'Available', 'Borrowed', 'Reserved', 'Maintenance'];
    $scope.conditions = ['New', 'Good', 'Fair', 'Needs Maintenance'];

    // Borrow Modal & Form Data
    $scope.showBorrowModal = false;
    $scope.borrowForm = {
      borrowDate: new Date(),
      expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      purpose: '',
      notes: '',
      agreementAccepted: false
    };

    // Add / Edit Resource Modal
    $scope.showResourceModal = false;
    $scope.isEditingResource = false;
    $scope.resourceForm = {
      id: null,
      name: '',
      category: 'Academic',
      description: '',
      condition: 'Good',
      borrowingInfo: 'Standard 7-day borrowing period.',
      location: 'Campus Main Library',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
    };

    // Fetch Resources
    $scope.loadResources = function() {
      $scope.isLoading = true;
      var params = {
        search: $scope.searchQuery,
        category: $scope.selectedCategory,
        availability: $scope.selectedAvailability
      };

      ResourceService.getResources(params)
        .then(function(data) {
          $scope.resources = data;
        })
        .catch(function(err) {
          $scope.errorMessage = 'Failed to load resources.';
        })
        .finally(function() {
          $scope.isLoading = false;
        });
    };

    // Fetch single resource detail for /resource/:id
    $scope.loadResourceDetail = function() {
      var resourceId = $routeParams.id;
      if (resourceId) {
        $scope.isLoading = true;
        // Check factory first
        var cached = ResourceFactory.getSelectedResource();
        if (cached && cached._id === resourceId) {
          $scope.selectedResource = cached;
          $scope.isLoading = false;
        } else {
          ResourceService.getResourceById(resourceId)
            .then(function(data) {
              $scope.selectedResource = data;
              ResourceFactory.setSelectedResource(data);
            })
            .catch(function(err) {
              $scope.errorMessage = 'Resource not found.';
            })
            .finally(function() {
              $scope.isLoading = false;
            });
        }
      }
    };

    $scope.viewDetails = function(resource) {
      ResourceFactory.setSelectedResource(resource);
      $location.path('/resource/' + resource._id);
    };

    // Borrow Request Modal Logic
    $scope.openBorrowModal = function() {
      $scope.showBorrowModal = true;
      $scope.errorMessage = '';
      $scope.successMessage = '';
      $scope.borrowForm.agreementAccepted = false;
    };

    $scope.closeBorrowModal = function() {
      $scope.showBorrowModal = false;
    };

    $scope.submitBorrowRequest = function() {
      if (!$scope.borrowForm.agreementAccepted) {
        $scope.errorMessage = 'You must accept the responsibility agreement before submitting.';
        return;
      }

      $scope.isLoading = true;
      var payload = {
        resourceId: $scope.selectedResource._id,
        borrowDate: $scope.borrowForm.borrowDate,
        expectedReturnDate: $scope.borrowForm.expectedReturnDate,
        purpose: $scope.borrowForm.purpose,
        notes: $scope.borrowForm.notes,
        agreementAccepted: true
      };

      RequestService.createRequest(payload)
        .then(function(res) {
          $scope.successMessage = 'Borrow request submitted successfully!';
          setTimeout(function() {
            $scope.closeBorrowModal();
            $location.path('/my-requests');
            $scope.$apply();
          }, 1200);
        })
        .catch(function(err) {
          $scope.errorMessage = err.data ? err.data.message : 'Failed to submit borrow request.';
        })
        .finally(function() {
          $scope.isLoading = false;
        });
    };

    // My Resources Logic
    $scope.openAddResourceModal = function() {
      $scope.isEditingResource = false;
      $scope.resourceForm = {
        id: null,
        name: '',
        category: 'Academic',
        description: '',
        condition: 'Good',
        borrowingInfo: 'Standard 7-day borrowing period.',
        location: 'Campus Main Library',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
      };
      $scope.showResourceModal = true;
    };

    $scope.openEditResourceModal = function(resource) {
      $scope.isEditingResource = true;
      $scope.resourceForm = {
        id: resource._id,
        name: resource.name,
        category: resource.category,
        description: resource.description,
        condition: resource.condition,
        borrowingInfo: resource.borrowingInfo,
        location: resource.location,
        imageUrl: resource.imageUrl
      };
      $scope.showResourceModal = true;
    };

    $scope.closeResourceModal = function() {
      $scope.showResourceModal = false;
    };

    $scope.saveResource = function() {
      $scope.isLoading = true;

      var fileInput = document.getElementById('resourceImageFile');
      if (fileInput && fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append('image', file);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + AuthService.getToken());
        xhr.onload = function() {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            $scope.resourceForm.imageUrl = response.imageUrl;
            fileInput.value = ''; // clear input
            performSave();
          } else {
            alert('File upload failed.');
            $scope.isLoading = false;
            $scope.$apply();
          }
        };
        xhr.onerror = function() {
          alert('File upload error.');
          $scope.isLoading = false;
          $scope.$apply();
        };
        xhr.send(formData);
      } else {
        performSave();
      }
    };

    function performSave() {
      if ($scope.isEditingResource) {
        ResourceService.updateResource($scope.resourceForm.id, $scope.resourceForm)
          .then(function() {
            $scope.closeResourceModal();
            $scope.loadResources();
          })
          .catch(function(err) {
            alert('Failed to update resource');
          })
          .finally(function() {
            $scope.isLoading = false;
          });
      } else {
        ResourceService.addResource($scope.resourceForm)
          .then(function() {
            $scope.closeResourceModal();
            $scope.loadResources();
          })
          .catch(function(err) {
            alert('Failed to add resource');
          })
          .finally(function() {
            $scope.isLoading = false;
          });
      }
    }

    $scope.deleteResource = function(id) {
      if (confirm('Are you sure you want to delete this resource?')) {
        ResourceService.deleteResource(id)
          .then(function() {
            $scope.loadResources();
          })
          .catch(function(err) {
            alert('Failed to delete resource');
          });
      }
    };

    // Route Initialization
    if ($location.path().indexOf('/resource/') === 0) {
      $scope.loadResourceDetail();
    } else {
      $scope.loadResources();
    }
  }
]);
