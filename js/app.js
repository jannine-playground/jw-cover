var app = angular.module("JwSwatch", []);

app.controller("HomeController", function($scope, JwInfos, $timeout){


  function initScrollbar() {
    $("#Demo").perfectScrollbar();
  }

  function loadSingles() {
    JwInfos.getSingles(function(datas){
      $scope.singles = datas;

      if(datas.length > 0){
        $scope.selectSingle($scope.singles[0]);
      }

      $timeout(function(){
        initSwatch();
      }, 300);

    });
  }

  function initSwatch() {
     $("#sb-container").swatchbook({
      angleInc: 15,
      heighbor: 15,
      initclosed: true,
      closeIdx:200
    });
  }

  function initArc() {
    var sub = $("#subtitle").arctext( {
      radius: 400
    });

    sub.show();
  }

  angular.element(document).ready(function(){
    loadSingles();
    initScrollbar();
//     initArc();
  });


  $scope.media = null;
  $scope.singles = [];
  $scope.selectedSingle = {};
  $scope.animate = false;


  $scope.selectSingle = function(single, noAnimate){
    $scope.animate = false;

    if(!noAnimate)  {
      $timeout(function(){
        $scope.animate = true;
      }, 1);
    }

    $scope.selectedSingle = single;
  };
  $scope.getSelectedSingle = function(){
    return $scope.selectedSingle;
  };


  $scope.play = function(single) {

    var stream = single.stream_url + "?client_id=" + JwInfos.clientId;

    if($scope.media != null) {

//       console.log($scope.media);
      $scope.media.pause();
    }

    $scope.media = new Audio(stream);
    $scope.media.play();

    setInterval(function(){
      $scope.currentTime =$scope.media.currentTime;
      $scope.$apply();
    }, 100);

  };

});

app.factory("JwInfos", function($http){
  var clientId = "0be8085a39603d77fbf672a62a7929ea";
  var jwTracks = "http://api.soundcloud.com/users/67393202/tracks.json?client_id=" + clientId;

  function getSingles(callback){
    var request = $http({
      url: jwTracks,
      method: "GET"
    });

    request.success(function(data, status){
      callback(data);
    });
  };

  return {
    getSingles : getSingles,
    clientId: clientId
  };

});
