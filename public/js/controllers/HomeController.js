app.controller('HomeController', ['$scope', '$location', function($scope, $location) {
  $scope.searchQuery = '';
  $scope.isPlayingAudio = false;
  $scope.audioVolume = 0.8;

  // Audio player element reference
  var audioElem = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3');
  audioElem.loop = true;
  audioElem.volume = $scope.audioVolume;

  $scope.toggleAudio = function() {
    if ($scope.isPlayingAudio) {
      audioElem.pause();
      $scope.isPlayingAudio = false;
    } else {
      audioElem.play().then(function() {
        $scope.isPlayingAudio = true;
        $scope.$apply();
      }).catch(function(e) {
        console.log('Audio autoplay prevented or error:', e);
      });
    }
  };

  $scope.updateVolume = function() {
    audioElem.volume = $scope.audioVolume;
  };

  $scope.onSearch = function() {
    if ($scope.searchQuery) {
      $location.path('/browse').search({ search: $scope.searchQuery });
    } else {
      $location.path('/browse');
    }
  };

  $scope.$on('$destroy', function() {
    audioElem.pause();
  });
}]);
