'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  
.filter('upcomingRides', function () {
        return function ( plannedRides, forDashboard ) {
            var arr = [];
            for ( var i = plannedRides.length; i--; ) {
            	  if(plannedRides[i].rideStatusId != 4  || forDashboard == false ) 
            	  {
            	  	arr.push( plannedRides[i] );
            	  	
            	  }
            }
            return arr;
        }
    })  
  
  
;
