'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).value('version', '0.1');

angular.module('jsonService', ['ngResource']).factory('Utils', function() {
	return {
		getItemById : function(arr, id) {
			for(var i = 0; i < arr.length; i++) {
				if(arr[i].id == id) {
					return arr[i];
				}
			}
			return null;
		},
		isItemWithIdExists : function(arr, id) {
			var res = false;
			for(var i = 0; i < arr.length; i++) {
				if(arr[i].id == id) {
					res = true;
					break;
				}
			}
			return res;
		},
		isItemExists : function(arr, item) {
			var res = false;
			for(var i = 0; i < arr.length; i++) {
				if(arr[i] == item) {
					res = true;
					break;
				}
			}
			return res;
		}
	};
}).factory('JsonService_Eval', function($resource) {
    return $resource('json/evaluation.json');
}).factory('JsonService_Dashboard', function($resource) {
    return $resource('json/dashboard.json');  
}).factory('JsonService_Graphs', function($resource) {
    return $resource('json/graph.json');  
}).factory('JsonService_Reps', function($resource) {
	return $resource('json/reps.json');
}).factory('JsonService_Drugs', function($resource) {
	return $resource('json/drugs.json');
}).factory('JsonService_RepModule', function($resource) {
	return $resource('json/rep_module.json');
}).factory('JsonService_Doctors', function($resource) {
	return $resource('json/doctors.json');
}).factory('JsonService_Flsms', function($resource) {
	return $resource('json/flsms.json');
}).factory('JsonService_PlannedRides', function($resource) {
	return $resource('json/planned_ride_alongs.json');
}).factory('JsonService_PlannedRideStatus', function($resource) {
	return $resource('json/planned_ride_status.json');
}).factory('JsonService_RideObjectives', function($resource) {
	return $resource('json/ride_objectives.json');
}).service('sharedData', function() {
	var repList = {};
	var drugList = {};
	var doctorList = {};
	var flsmList = {};
	var plannedRides = {};
	var constRideStatus = {};
        var constScheduleStatus = {};
	var evaluation = {};
	var rideObjectives = {};
	
	var repModuleSpiderData={};

	return {
		getRepModuleSpiderData : function() {
			return repModuleSpiderData;
		},
		setRepModuleSpiderData : function(value) {
			repModuleSpiderData = value;
		},
		getRideObjectives : function() {
			return rideObjectives;
		},
		setRideObjectives : function(value) {
			rideObjectives = value;
		},
		getEvaluation : function() {
			return evaluation;
		},
		setEvaluation : function(value) {
			evaluation = value;
		},
		getRepList : function() {
			return repList;
		},
		setRepList : function(value) {
                    
			repList = value;
		},
		getDrugList : function() {
			return drugList;
		},
		setDrugList : function(value) {
			drugList = value;
		},
		getDoctorList : function() {
			return doctorList;
		},
		setDoctorList : function(value) {
			doctorList = value;
		},
		getFlsmList : function() {
			return flsmList;
		},
		setFlsmList : function(value) {
			flsmList = value;
		},
		getPlannedRides : function() {
			return plannedRides;
		},
		setPlannedRides : function(value) {
			plannedRides = value;
		},
		getConstRideStatus : function() {
			return constRideStatus;
		},
		setConstRideStatus : function(value) {
			constRideStatus = value;
		},
		getConstScheduleStatus : function() {
			return constScheduleStatus;
		},
		setConstScheduleStatus : function(value) {
			constScheduleStatus = value;
		}
	};
}).service('dataLoader', function(sharedData, JsonService_RepModule,JsonService_Eval,JsonService_Reps, JsonService_Drugs, JsonService_Doctors, JsonService_Flsms, JsonService_PlannedRides, JsonService_PlannedRideStatus,JsonService_RideObjectives,$rootScope) {

	return {
		loadFromStubbedJson : function() {

                    JsonService_RepModule.get(function(data) {	
                        sharedData.setRepModuleSpiderData(angular.copy(data));
                
                    });

		    JsonService_Reps.get(function(data) {                      
                        if($rootScope.remoteReps != null || $rootScope.remoteReps.length > 0)
                        {
                            for(var i=0;i<$rootScope.remoteReps.length;i++)
                            {
                                data.reps[i].name = $rootScope.remoteReps[i].Name;
                            }                                    
                        }                               
			sharedData.setRepList(angular.copy(data.reps));
		    });
		    
                    JsonService_RideObjectives.get(function(data) {
			sharedData.setRideObjectives(angular.copy(data.rideObjs));
		    });
                    
		    JsonService_Drugs.get(function(data) {
			sharedData.setDrugList(angular.copy(data.drugs));
		    });
                    
		    JsonService_Doctors.get(function(data) {
			sharedData.setDoctorList(angular.copy(data.doctors));
		    });
		    JsonService_Flsms.get(function(data) {
			sharedData.setFlsmList(angular.copy(data.flsms));
		    });
		    JsonService_PlannedRides.get(function(data) {
			sharedData.setPlannedRides(angular.copy(data.plannedRideAlongs));
		    });
		    JsonService_PlannedRideStatus.get(function(data) {
			sharedData.setConstRideStatus(angular.copy(data.rideStatuses));
                        sharedData.setConstScheduleStatus(angular.copy(data.scheduleStatuses));
		    });
		    JsonService_Eval.get(function(data) {
			data.rideObjs=angular.copy(sharedData.getRideObjectives());
			sharedData.setEvaluation(angular.copy(data));
		    });
			
		}
	};
})

;
