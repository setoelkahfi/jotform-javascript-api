// Angular Module
var app = angular.module('miniCMS', ['ngRoute', 'ngResource']);

// CORS
app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://s3-ap-southeast-1.amazonaws.com/s3.sdimgs.com/**' // SD bucket
    ]);
});

// Routes
app.config(function ($routeProvider) {
   $routeProvider
   
   .when('/', {
       controller: 'mainController',
       templateUrl: 'pages/index.html'
       
   })
   
   .when('/about', {
       controller: 'aboutController',
       templateUrl: 'pages/about.html'
   });
});

// Controller
app.controller('mainController', ['$scope','$timeout', function($scope, $timeout) {
    
    $scope.title = 'Modify your form';
    $scope.processButton = 'Process';
    $scope.processing = false;
    $scope.modifySuccess = false;
    $scope.heading = 'Please be informed that the orders for the below dates are FULL. Please avoid choosing these dates:';
    $scope.days = [];
    $scope.addDay = function() {
        if ($scope.days.length > 2) {
            return;
        }
        $scope.days.push({
            placeholder: 'Add day',
            value: ''
        });
    };
    $scope.removeDay = function(index) {
        $scope.days.splice(index,1);   
    };
    $scope.modifyForm = function() {
        $scope.processButton = 'Processing...';
        $scope.processing = true;
        // Jotform
        var formID = '53562032034444',
            apiKey = 'af4e25c165bab2d5971fb01c09ec5c75',
            qids = ['67','68','69'];

        JF.initialize({ apiKey: apiKey });
        
        // Modify the title
        JF.editFormQuestion(formID, '54', { "text" : $scope.heading }, function(response){});
        
        function deletePreviousDays(callback) {
            // Delete previous days
            for (var i=0; i < qids.length; i++) {
                JF.editFormQuestion(formID, qids[i],  { "text" : " " }, function(response){
                    console.log(response);
                });
            }
            if (typeof callback == 'function') 
                callback();
        }
           
        function updateDays() {
            // Update with current arrays
            for (var i=0; i < $scope.days.length; i++) {
                JF.editFormQuestion(formID, qids[i],  { "text" : $scope.days[i].value }, function(response){
                    console.log(response);
                });
            }
        }
        
        // Let's execute
        deletePreviousDays(updateDays);
        
        $timeout(function() {
            $scope.modifySuccess = true;
            $scope.processButton = 'Process';
            $scope.processing = false;
            flashRemove();
        }, 2500);
        function flashRemove() {
            $timeout(function() {
                $scope.modifySuccess = false;
            }, 2500);
        }
    }
}]);

app.controller('aboutController', ['$scope', function($scope) {
    $scope.title = 'About this page';
    $scope.content = 'This is an about page';
}]);