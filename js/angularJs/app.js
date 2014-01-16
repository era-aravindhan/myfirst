'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'jsonService']);

// configure stuff
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/evaluation', {templateUrl: 'partials/imanage_Evaluation.html', controller: evaluationController});
    $routeProvider.when('/plan_ride', {templateUrl: 'partials/plan_ridealong.html', controller: planRideController});
    $routeProvider.when('/reports', {templateUrl: 'partials/reports.html', controller: reportsController});
    $routeProvider.when('/rep_module', {templateUrl: 'partials/rep_module.html', controller: repModuleController});
    $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: dashboardController});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: loginController});
    $routeProvider.otherwise({redirectTo: '/login'});
  }]);






// run blocks
app.run(function($rootScope,$filter,sharedData) {
  // you can inject any instance here
  $rootScope.showingUpcoming=true;
  $rootScope.theme = 'orange/';
  $rootScope.currentRide = {};
  
   $rootScope.selectedRepInDashboard = null;
  
  
  var myVar=setInterval(function(){plannedRidesComingCheckerTimer()},3000);

	function plannedRidesComingCheckerTimer()
	{
		
	if(sharedData.getPlannedRides().length){
		
		var plannedRidesComing = $filter('upcomingRides')(sharedData.getPlannedRides(), false);
		
		if(plannedRidesComing.length==0) return;

                
		var sdf = new JsSimpleDateFormat("dd MMM hh:mm aa, yyyy");
		var currDate = new Date();                
	
		for(var i=0;i<plannedRidesComing.length;i++){
                  
                  var dateP = sdf.parse(plannedRidesComing[i].startTime);
                  var dateEnd = sdf.parse(plannedRidesComing[i].endTime);
                        
                                                
                        if(dateP <= currDate &&  currDate < dateEnd){                          
				plannedRidesComing[i].isUpComing = "now";
				$rootScope.$$phase || $rootScope.$apply();
                                
			}else if(currDate > dateEnd){
                          
				plannedRidesComing[i].isUpComing = false;
				$rootScope.$$phase || $rootScope.$apply();
                                
			}                         
                        else if(currDate < dateP){
                          
				plannedRidesComing[i].isUpComing = true;
				$rootScope.$$phase || $rootScope.$apply();
                                
			}

			
		}
		
		sharedData.setPlannedRides(plannedRidesComing);
	}
	}
  
});
