var app = angular.module("JwSwatch", []);

app.controller("HomeController", function($scope, JwInfos, $timeout){


  function initScrollbar() {
    $("#Demo").perfectScrollbar();
  }

  function loadSingles() {
    JwInfos.getSingles(function(datas){
      $scope.singles = datas;

      if(datas.length > 0){
        random();
      }

      $timeout(function(){
        initSwatch();
      }, 300);

    });
  }

  function random() {
    var length = $scope.singles.length;
    var index = Math.floor((Math.random() * length));
    var single = $scope.singles[index];

    $scope.selectSingle(single);
    $scope.play(single);
  }

  function initSwatch() {
     $scope.swatch = $("#sb-container").swatchbook({
      angleInc: 15,
      heighbor: 15,
      initclosed: false,
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
  $scope.swatch = null;

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
      $scope.media.pause();
    }

    $scope.media = new Audio(stream);
    $scope.media.play();

    $scope.media.addEventListener("ended", function(){
      $scope.media.pause();
      random();
    })

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
