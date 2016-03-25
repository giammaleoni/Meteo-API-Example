Array.prototype.max = function( array ){
    return Math.max.apply( Math, array );
};

angular.module('starter.controllers', ['chart.js'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, $http) {
  // $scope.playlists = [
  //   { title: 'Reggae', id: 1 },
  //   { title: 'Chill', id: 2 },
  //   { title: 'Dubstep', id: 3 },
  //   { title: 'Indie', id: 4 },
  //   { title: 'Rap', id: 5 },
  //   { title: 'Cowbell', id: 6 }
  // ];
  $scope.weather = [];
  $scope.data = [];

  $http({
    method: 'GET',
    url: 'http://api.openweathermap.org/data/2.5/forecast?q=Bologna,it&mode=json&appid=44db6a862fba0b067b1930da0d769e98&units=metric&lang=it'
    }).then(function successCallback(response) {
      console.log(response);
      $scope.data = response.data;
      var date,
          array = [];
      for (var i = 0; i < response.data.list.length; i++) {
        if (response.data.list[i].dt_txt.slice(0,10) !== date) {
          if (date) {
            $scope.weather.push({data: date, detail: array});
          }
          date = response.data.list[i].dt_txt.slice(0,10);
          array = [];
        }
        //console.log(response.data.list[i].dt, new Date(response.data.list[i].dt));
        array.push(response.data.list[i]);
      }

    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

    $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };


})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('BrowserCtrl', function($scope, $http, $timeout) {
  $scope.graph = {};
  // $scope.graph.data = [
  //   //Awake
  //   [16, 15, 20, 12, 16, 12, 8],
  //   //Asleep
  //   [8, 9, 4, 12, 8, 12, 14]
  // ];
  // $scope.graph.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // $scope.graph.series = ['Awake', 'Asleep'];
  var labels = [],
      temp   = [],
      rain   = [],
      temp2   = [],
      rain2   = [];

  $http({
    method: 'GET',
    url: 'http://api.openweathermap.org/data/2.5/forecast?q=Bologna,it&mode=json&appid=44db6a862fba0b067b1930da0d769e98&units=metric&lang=it'
    }).then(function successCallback(response) {
      console.log(response);
      list = response.data.list;

      for (var i = 0; i < list.length; i++) {
        labels.push(list[i].dt_txt.slice(5,16));
        temp.push(list[i].main.temp);
        rain.push(list[i].rain['3h']);
      }

    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

    $http({
      method: 'GET',
      url: 'http://api.openweathermap.org/data/2.5/forecast?q=Sevilla,es&mode=json&appid=44db6a862fba0b067b1930da0d769e98&units=metric&lang=it'
      }).then(function successCallback(response) {
        console.log(response);
        list = response.data.list;
        for (var i = 0; i < list.length; i++) {
          temp2.push(list[i].main.temp);
          rain2.push(list[i].rain ? list[i].rain['3h'] : null);
        }

      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    $scope.graph.labels = labels;
    $scope.graph.series1 = ['Temp. Bologna', 'Temp. Siviglia'];
    $scope.graph.series2 = ['Rain Bologna', 'Rain Siviglia'];
    $scope.graph.options2 = {
      scaleOverride: true,
      scaleSteps: 10,
      scaleStepWidth: 0.3,
      scaleStartValue: 0
    }
    $scope.graph.temp = [temp, temp2];
    $scope.graph.rain = [rain, rain2];

});
