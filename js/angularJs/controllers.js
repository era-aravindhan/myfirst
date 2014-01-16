'use strict';

/* Controllers */
//Login Controller
function loginController($rootScope,$scope,$location,$http,$document,dataLoader) { 
 
    var remoteUrl = "https://cogdemo-developer-edition.ap1.force.com/services/apexrest/SalesRep";
    //var remoteUrl ="http://ec2-54-225-214-92.compute-1.amazonaws.com/sForce-0.0.1-SNAPSHOT/rest/sf/sales"
    
    // get the response from remote server and add the rep names to rep list object array
    $rootScope.remoteReps={};
    $.ajax({
        type: "GET",        
        url: remoteUrl,
        dataType:'json',                                
        success : function(rep_remote_data){            
            var jsonObj = $.parseJSON(rep_remote_data);
            $rootScope.remoteReps = jsonObj.reps;     
        },
        error : function( jqXHR,textStatus,errorThrown){ }                                
                                  
    });
    //end
    
    // Pause the execution to get the response from server
    function pausecomp(millis)
    {
            var date = new Date();
            var curDate = null;
            do { curDate = new Date(); }
            while(curDate-date < millis);
    }
    pausecomp(500);
    //end                                
    //select the theme. Currently only orange theme available.So this function is not used                                
    $scope.setTheme = function(themePath) {         
	$rootScope.theme = themePath;
    }
    //end
    $scope.loginAction = function() {        
        //create all objectArrays from local json files
        dataLoader.loadFromStubbedJson();
        $location.path("/dashboard");        
    }
}
//Dashboard Controller
function  dashboardController($scope,$location,$rootScope,$filter,sharedData,Utils,JsonService_Dashboard,dataLoader,$http) {
	
	$scope.repsList = sharedData.getRepList();
	$scope.plannedRides = sharedData.getPlannedRides();
	$scope.filteredRides = $filter('upcomingRides')( $scope.plannedRides, true);
	$scope.popupRideObjsToDisplay=[];	
	
        // handlePlannedItemClick is using to check the plan ride along is scheduled one or completed one.If it is scheduled it shows one popup, otherwise it will be redirected to evaluation page 	
	$scope.handlePlannedItemClick = function(plannedRide){
		if(plannedRide.isUpComing == true){
			
			$scope.popupRideObjsToDisplay=[];
			
				var allObjs = angular.copy(sharedData.getRideObjectives());
				var tempSelectedRides =[];
				for(var i=0;i<plannedRide.objToBeEvaluatedIds.length;i++){
					for(var objIn=0;objIn<allObjs.length;objIn++){
						if(plannedRide.objToBeEvaluatedIds[i] == allObjs[objIn].id){
							tempSelectedRides.push(allObjs[objIn]);
						}
					}
				}
				
				//
				//console.log(tempSelectedRides);
				
				for(var i = 0; i < tempSelectedRides.length; i++) {
					tempSelectedRides[i].selected = true;
					if(i % 3 == 0)
						$scope.popupRideObjsToDisplay.push([]);
					$scope.popupRideObjsToDisplay[$scope.popupRideObjsToDisplay.length - 1].push(tempSelectedRides[i]);
				}
				
				//console.log($scope.popupRideObjsToDisplay);
				
			
			$scope.showPopup();
		}else{
			$rootScope.currentRide =plannedRide;
			$scope.goToEval();
		}
	};	
        //end
        // to get the rep name from the rep id.
        $scope.getColumnTextRepName = function(plannedRide){
		var repItem = Utils.getItemById(sharedData.getRepList(),plannedRide.rep_id);
                return repItem.name;
        };
        //end
        $scope.getColumnTextStatus = function(plannedRide){
    		var currStatus = Utils.getItemById(sharedData.getConstRideStatus(),plannedRide.rideStatusId);
    		return currStatus.name;
        };        
        $scope.getScheduleTextStatus = function(plannedRide){
            var scheduleStatusId;
            if(plannedRide.isUpComing == true )
                scheduleStatusId = 1;
            else if(plannedRide.isUpComing == false )
                scheduleStatusId = 2;
            else
                scheduleStatusId = 3;
    	    
            var currStatus = Utils.getItemById(sharedData.getConstScheduleStatus(),scheduleStatusId);
    	    return currStatus.name;
	};
	// this method redirects to rep module page
        $scope.toolTip = function(repItem) {
            $rootScope.selectedRepInDashboard = repItem;
            $location.path("/rep_module");
        };
        // end
        
        $scope.moreReports = function() {         
            $location.path("/reports");
        };
        $scope.goToEval = function() {
            $location.path("/evaluation");
        };
        $scope.logOut = function() {
            dataLoader.loadFromStubbedJson();
            $location.path("/login");        
        };
        //to show chart in dashboard
        JsonService_Dashboard.get(function(data) {
            $scope.basicAreaChart = data;
        });
        //end
}
//Rep module Controller
function  repModuleController($scope,$rootScope,$location,JsonService_RepModule,sharedData,Utils) {
	
        $scope.repsList = sharedData.getRepList();
        // select the rep id which stores in rootscop or take first rep as default
    	if($rootScope.selectedRepInDashboard!=null){
            $scope.selectedRep =   $rootScope.selectedRepInDashboard;
        }
	else
        {
            $scope.selectedRep = $scope.repsList[0];
	}
        
        //create the skeleton of the spider as well as of the bar charts
	$scope.mainSpider = "";
        $scope.mainSpider = sharedData.getRepModuleSpiderData().graphs[0].spider;	
        $scope.barPopupChart = "";
        $scope.barPopupChart = sharedData.getRepModuleSpiderData().graphs[0].column;
        //end
        
        // these text areas are in improvement plan. Let it be editable first and values empty
        document.getElementById("SugstActTextArea").disabled=false;
	document.getElementById("overallTextArea").disabled=false;
        $scope.SuggstAct = "";
        $scope.OverlKeyFind ="";
        $scope.showReportBtn = false;
        $scope.showSaveBtn = false;
        //this submitStatus value is for determining save&submit or view report or no button display
        $scope.submitStatus = 0;
        //end        
       
        // make empty the below variables.
    	$scope.KeyFindObjPopover = "";
        $scope.objIndex = [];
	$scope.objCii = [];
    	$scope.repLatestRide= null;
        $scope.totalCii = 0;
        
    	$scope.rep = $scope.selectedRep.name;
        
        //To fill charts we take the latest ride from all planned rides
        var plannedRidesArray = sharedData.getPlannedRides();
        //sort all the ridealongs to get the latest ride of particular rep
        var sortedPlannedRidesArray = plannedRidesArray.sort(function(a,b) { return parseInt(b.id) - parseInt(a.id) } );

        for(var i= 0;i<sortedPlannedRidesArray.length; i++)
        {
        	if( sortedPlannedRidesArray[i].rep_id == $scope.selectedRep.id)
        	 {        		
        		$scope.SuggstAct = sortedPlannedRidesArray[i].sugstActions;
        		$scope.OverlKeyFind = sortedPlannedRidesArray[i].overallKeyFind;        		
        		$scope.submitStatus = sortedPlannedRidesArray[i].rideStatusId;
        		if( sortedPlannedRidesArray[i].rideStatusId == 4) {
        			document.getElementById("SugstActTextArea").disabled=true;
				document.getElementById("overallTextArea").disabled=true;
        		}
        		$scope.repLatestRide = sortedPlannedRidesArray[i];
        		break;
        	}        	
        }
        if($scope.repLatestRide == null || $scope.repLatestRide.evaluations.length == 0) {
         	$scope.objIndex = [0,0,0,0,0,0,0,0,0,0];
         	$scope.objCii = [0,0,0,0,0,0,0,0,0,0];
         	$scope.totalCii = 0;
         	document.getElementById("SugstActTextArea").disabled=true;
		document.getElementById("overallTextArea").disabled=true;

   	}
   	else
   	{
          	var rideObjsAll = $scope.repLatestRide.evaluations[$scope.repLatestRide.evaluations.length-1].rideObjs;
          	$scope.totalCii =parseFloat( $scope.repLatestRide.evaluations[$scope.repLatestRide.evaluations.length-1].completeCii );
          	
   		for (var i = 0; i < rideObjsAll.length; i++ ) {
                    var totalRate = rideObjsAll[i].ciiIndex; 
   		    var num =  (totalRate/rideObjsAll[i].weightage)*100;
    	 	    if(num.length>6)
    	 		num = num.substring(0,5);
    	 	    $scope.objIndex.push(num); 
    	 		
    	 	    var eachCii = 0;
 		    for(var k=0;k<=i;k++)
 		    {
 		 	eachCii += parseFloat(rideObjsAll[k].ciiIndex)
 		    }
 		    $scope.objCii.push( parseFloat(eachCii) );
    	 		     
   		}  		 	
   	}
        // this function is using to show different images for submitting or viewing report
        $scope.changeImage = function() {
                            if($scope.submitStatus == 4) {
                                $scope.showReportBtn = true;
                                $scope.showSaveBtn = false;
                            }
                            else if($scope.submitStatus == 3) {
                                $scope.showSaveBtn = true;
                                $scope.showReportBtn = false;                              
                            }
                            else
                            {
                                $scope.showReportBtn = false;
                                $scope.showSaveBtn = false;                                
                            }
                           
        }
        $scope.changeImage(); 
        $scope.$$phase || $scope.$apply();
    
    // function definitions for rep module page starts here	
	$scope.getClassEpBox = function(rideObjId)
                               {
		    		    var ret = 'epEachObjDivHidden';
                                    var ids = $scope.repLatestRide.objToBeEvaluatedIds; 
         			    for(var i=0;i<ids.length;i++)
                                    {
					if(ids[i] == rideObjId)
                                        {
					    ret ='epEachObjDiv';                       
					    break;
					}
				    }
                                    return ret;
		                };    
   	//this function will be called when user click on the next button in overall key finding and suggested actions popover  	        	
        $scope.saveOKF = function()
                        {
                            if($scope.submitStatus == 3)
                            {
                                $scope.repLatestRide.sugstActions   = document.getElementById("SugstActTextArea").value;
                                $scope.repLatestRide.overallKeyFind = document.getElementById("overallTextArea").value;    	
                                $scope.repLatestRide.rideStatusId = 4;
                                var allPlannedRides = sharedData.getPlannedRides();
                                for(var i=0;i<allPlannedRides.length;i++)
                                {
                                    if($scope.repLatestRide==allPlannedRides[i])
                                    {
    					allPlannedRides[i] = angular.copy($scope.repLatestRide);                                 
                                    }
                                }    			
                                $location.path("/dashboard");
                            }
                            else if( $scope.submitStatus == 4)
                            {
				$scope.showPreview();
                            }
                        }
    	   
		
        $scope.logOut = function()
                    {
                        $location.path("/login");
                    };
        // this function is called when user click on reps            
        $scope.handleRepClick = function(item,indexVal)
                                {    	    
                                    $scope.categories = [];
                                    $scope.categWeight = [];
                                    $scope.categRate = [];
    	      	   
                                    $scope.selectedRep =item;
                                    $rootScope.selectedRepInDashboard = item;
                    
                                    $scope.SuggstAct ="";
                                    $scope.OverlKeyFind = "";
                                    $scope.KeyFindObjPopover = "";
                                    $scope.submitStatus = 0;
                                    $scope.repLatestRide = null; 
                                    $scope.objIndex= [];
                                    $scope.objCii = [];
                                    $scope.rep = item.name;
        
                                    document.getElementById("SugstActTextArea").disabled=false;
                                    document.getElementById("overallTextArea").disabled=false;

                                    for(var i= 0;i<sortedPlannedRidesArray.length; i++)
                                    {
                                            if( sortedPlannedRidesArray[i].rep_id == $scope.selectedRep.id)
                                             {        		
                                                    $scope.SuggstAct = sortedPlannedRidesArray[i].sugstActions;
                                                    $scope.OverlKeyFind = sortedPlannedRidesArray[i].overallKeyFind;
                                                    $scope.submitStatus = sortedPlannedRidesArray[i].rideStatusId;
                                                    if( sortedPlannedRidesArray[i].rideStatusId == 4) {
                                                            document.getElementById("SugstActTextArea").disabled=true;
                                                            document.getElementById("overallTextArea").disabled=true;
                                                    }
                                                    $scope.repLatestRide = sortedPlannedRidesArray[i];
                                                    break;
                                            }
                                            
                                    }
                                    if($scope.repLatestRide == null || $scope.repLatestRide.evaluations.length == 0)
                                    {
                                            $scope.objIndex = [0,0,0,0,0,0,0,0,0,0];
                                            $scope.objCii = [0,0,0,0,0,0,0,0,0,0];
                                            $scope.totalCii = 0;
                                            document.getElementById("SugstActTextArea").disabled=true;
                                            document.getElementById("overallTextArea").disabled=true;
                                    }
                                    else
                                    {   		 	
                                                var rideObjsAll = $scope.repLatestRide.evaluations[$scope.repLatestRide.evaluations.length-1].rideObjs;
                                                $scope.totalCii =parseFloat( $scope.repLatestRide.evaluations[$scope.repLatestRide.evaluations.length-1].completeCii );
                                            
                                                    for (var i = 0; i < rideObjsAll.length; i++ ) { 	
                                                    var totalRate = rideObjsAll[i].ciiIndex;     	 		
                                                    $scope.objIndex.push( totalRate );    	 		
                                                    var eachCii = 0;
                                                    for(var k=0;k<=i;k++)
                                                    {
                                                        eachCii += parseFloat(rideObjsAll[k].ciiIndex)
                                                    }
                                                    $scope.objCii.push( parseFloat(eachCii) ); 		 		
                                                                  
                                                    }
                                    }
                                    $scope.changeImage();
                                    $scope.$$phase || $scope.$apply();
   			    
                                };
        // this function is filling data in bar graph of single objective in popover.
        //Actually this function is called from directive ciiGraphPopup.
        $scope.showChartInPopover = function(categoryParam)
                                    {    	  
                                        $scope.categories = [];
                                        $scope.categWeight = [];
                                        $scope.categRate = [];
                                        $scope.KeyFindObjPopover = " ";
    		
                                        if($scope.repLatestRide == null  || $scope.repLatestRide.evaluations.length == 0)
                                        {
                                            $scope.categRate = [0,0,0,0,0];
                                            $scope.categWeight = [0,0,0,0,0];
                                            $scope.categories = ['nil','nil','nil','nil','nil'];
                                        }
                                        else
                                        {   		 	
                                            var rideObjsAll = $scope.repLatestRide.evaluations[$scope.repLatestRide.evaluations.length-1].rideObjs; //sharedData.getRideObjectives();
                                            for (var i = 0; i < rideObjsAll.length; i++ )
                                            {
                                                if( categoryParam == rideObjsAll[i].name )
                                                {
                                                    $scope.KeyFindObjPopover = rideObjsAll[i].keyFinding;
                                                    for (var j = 0; j < rideObjsAll[i].categories.length; j++ )
                                                    {
                                                        $scope.categories.push( rideObjsAll[i].categories[j].name );
                                                        $scope.categWeight.push( rideObjsAll[i].categories[j].weightage );
                                                        var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                                        $scope.categRate.push( totalRate );    		 	
                                                    }    		
                                                }       
                                            }
                                        } 
                                        $scope.$$phase || $scope.$apply();
                                    }
        
        //to show the previous cii values, we use one drop down.Currently there is no more previous cii values selction
        $scope.objectives = [   {name:'Current CII',value:"10"}   ];
        $scope.objective = $scope.objectives[0];
        $scope.clickObjItem = function(obj)
                              {
                                    var item = $scope.selectedRep.id;
                                    if(obj.value == 0)
                                    {
                                        $scope.barPopupChart = sharedData.getRepModuleSpiderData().pastGraphs[$scope.selectedRep.id-1].column;
                                        $scope.mainSpider = sharedData.getRepModuleSpiderData().pastGraphs[$scope.selectedRep.id-1].spider;
                                    }            
                                    else if(obj.value == 10)
                                    {
                                        $scope.barPopupChart = sharedData.getRepModuleSpiderData().graphs[0].column;
                                        $scope.mainSpider = sharedData.getRepModuleSpiderData().graphs[0].spider;
                         
                                    }            
                                    $scope.$$phase || $scope.$apply();            
                               };  
    
        $scope.goToPlanRidePage = function()
                         {
                             $location.path("/plan_ride");
                        };
        $scope.homeBtn = function()
                        {         
                            $location.path("/dashboard");
                        };
    
        $scope.getRepListItemClass= function(repItem)
                                    {        
                                        var ret ="";
                                        if(repItem.id == $scope.selectedRep.id)
                                        {
                                            ret ='active';
                                        }
                                        else
                                        {
                                            ret ='inactive';
                                        }
                                        return ret;
                                    };
        //to show the view report, this function is called
	$scope.showPreview = function()
                            {
 		
                                $scope.firstCategories = [];
                                $scope.firstCategWeight = [];
                                $scope.firstCategRate = [];
                                
                                $scope.secondCategories = [];
                                $scope.secondCategWeight = [];
                                $scope.secondCategRate = []; 
                                                
                                $scope.thirdCategories = [];
                                $scope.thirdCategWeight = [];
                                $scope.thirdCategRate = []; 		
                                
                                $scope.fourthCategories = [];
                                $scope.fourthCategWeight = [];
                                $scope.fourthCategRate = []; 		
                                
                                $scope.fifthCategories = [];
                                $scope.fifthCategWeight = [];
                                $scope.fifthCategRate = [];
                                
                                $scope.sixthCategories = [];
                                $scope.sixthCategWeight = [];
                                $scope.sixthCategRate = [];
                                
                                $scope.seventhCategories = [];
                                $scope.seventhCategWeight = [];
                                $scope.seventhCategRate = [];
                                
                                $scope.eighthCategories = [];
                                $scope.eighthCategWeight = [];
                                $scope.eighthCategRate = [];
                                
                                $scope.ninethCategories = [];
                                $scope.ninethCategWeight = [];
                                $scope.ninethCategRate = [];
                                
                                $scope.tenthCategories = [];
                                $scope.tenthCategWeight = [];
                                $scope.tenthCategRate = []; 		
                                
                                $scope.overlSpiderChart = sharedData.getRepModuleSpiderData().graphs[0].overAllCii;
                                
                                $scope.firstCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj1;
                                $scope.secondCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj2;
                                $scope.thirdCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj3;
                                $scope.fourthCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj4;
                                $scope.fifthCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj5;
                                $scope.sixthCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj6;
                                $scope.seventhCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj7;
                                $scope.eighthCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj8;
                                $scope.ninethCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj9;
                                $scope.tenthCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj10;
                                
                                
                                $scope.repLatestRide.evaluations[ $scope.repLatestRide.evaluations.length - 1];
                
                                var repItem = Utils.getItemById(sharedData.getRepList(),$scope.repLatestRide.rep_id); 		
                                $scope.epRepName = repItem.name;
                                
                                var currEval = $scope.repLatestRide.evaluations[ $scope.repLatestRide.evaluations.length - 1];
                                var rideObjsAll = currEval.rideObjs;
                                $scope.objCii = [];
                                $scope.eachObjIndex = []; 		
                                //to show Products means drugs 		 
                                 var RepdrugIds	 =[];
                                 var totalDrugs = angular.copy(sharedData.getDrugList());
                                 for (var i = 0; i < $scope.repLatestRide.drugIds.length; i++ ) {
                                       for (var j = 0; j < totalDrugs.length; j++ ) {
                                               if( $rootScope.currentRide.drugIds[i] == totalDrugs[j].id )
                                               {
                                                       RepdrugIds.push( totalDrugs[j].name);
                                               } 		 	
                                       } 		 	
                                } 		  
                                $scope.drugsString="";
                                for (var i = 0; i < RepdrugIds.length; i++ ) {
                                       if(i==0)
                                               $scope.drugsString += RepdrugIds[i];
                                       else
                                               $scope.drugsString += ',' + RepdrugIds[i]; 		
                                       
                                }
                                // end
                                //to show selected Objectives
                                var selectedObjs = [];
                                 for (var i = 0; i < $scope.repLatestRide.objToBeEvaluatedIds.length; i++ ) {
                                        for (var j = 0; j < rideObjsAll.length; j++ ) {
                                                if( $rootScope.currentRide.objToBeEvaluatedIds[i] == rideObjsAll[j].id )
                                                {
                                                        selectedObjs.push( rideObjsAll[j].name);
                                                } 		 	
                                        } 		 	
                                 }
                                 $scope.selectedObjString="";
                                 for (var i = 0; i < selectedObjs.length; i++ ) {
                                        if(i==0)
                                                $scope.selectedObjString += selectedObjs[i];
                                        else
                                                $scope.selectedObjString += ',' + selectedObjs[i]; 		
                                        
                                 }
                                 // end
 		 
                                for (var i = 0; i < rideObjsAll.length; i++ )
                                {
                                       $scope.eachObjIndex.push( parseFloat((rideObjsAll[i].ciiIndex/rideObjsAll[i].weightage)*100) ); 		 	
                                       var eachCii = 0;
                                       for(var k=0;k<=i;k++)
                                       {
                                               eachCii += parseFloat(rideObjsAll[k].ciiIndex)
                                       }
                                       $scope.objCii.push( parseFloat(eachCii) ); 		 	
                                } 		 
                                for (var i = 0; i < rideObjsAll.length; i++ ) {
                                    if(i==0)
                                    {
                                            $scope.obj1Index = parseFloat(rideObjsAll[i].ciiIndex)*10;
                                            
                                            $scope.obj1kf = rideObjsAll[i].keyFinding;
                                            for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                            $scope.firstCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                            $scope.firstCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                            var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                            $scope.firstCategRate.push( totalRate );
                                            }		 	 		
                                    }
                                    if(i==1)
                                    {
                                            $scope.obj2Index = parseFloat(rideObjsAll[i].ciiIndex)*20;
                                            $scope.obj2kf = rideObjsAll[i].keyFinding;
                                            for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                            $scope.secondCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                            $scope.secondCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                            var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                            $scope.secondCategRate.push( totalRate );
                                            }		 	 		
                                    }
                                    if(i==2)
                                    {
                                            $scope.obj3Index = parseFloat(rideObjsAll[i].ciiIndex)*20;
                                            $scope.obj3kf = rideObjsAll[i].keyFinding;
                                            for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                            $scope.thirdCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                            $scope.thirdCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                            var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                            $scope.thirdCategRate.push( totalRate );
                                            }		 	 		
                                    }
                                    if(i==3)
                                    {
                                            $scope.obj4Index = parseFloat(rideObjsAll[i].ciiIndex)*10;
                                            $scope.obj4kf = rideObjsAll[i].keyFinding;
                                            for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                            $scope.fourthCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                            $scope.fourthCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                            var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                            $scope.fourthCategRate.push( totalRate );
                                            }		 	 		
                                    }
                                    if(i==4)
                                    {
                                            $scope.obj5Index = parseFloat(rideObjsAll[i].ciiIndex)*5;
                                            $scope.obj5kf = rideObjsAll[i].keyFinding;
                                            for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                            $scope.fifthCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                            $scope.fifthCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                            var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                            $scope.fifthCategRate.push( totalRate );
                                            }		 	 		
                                    }
                                    if(i==5)
                                    {
                                            $scope.obj6Index = parseFloat(rideObjsAll[i].ciiIndex)*5;
                                            $scope.obj6kf = rideObjsAll[i].keyFinding;
                                            for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                            $scope.sixthCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                            $scope.sixthCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                            var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                            $scope.sixthCategRate.push( totalRate );
                                            }		 	 		
                                    }
                                    if(i==6)
                                    {
                                            $scope.obj7Index = parseFloat(rideObjsAll[i].ciiIndex)*20;
                                            $scope.obj7kf = rideObjsAll[i].keyFinding;
                                            for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                            $scope.seventhCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                            $scope.seventhCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                            var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                            $scope.seventhCategRate.push( totalRate );
                                            }		 	 		
                                    }
                                    if(i==7)
                                    {
                                            $scope.obj8Index = parseFloat(rideObjsAll[i].ciiIndex)*10;
                                            $scope.obj8kf = rideObjsAll[i].keyFinding;
                                            for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                            $scope.eighthCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                            $scope.eighthCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                            var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                            $scope.eighthCategRate.push( totalRate );
                                            }		 	 		
                                    }
                                    if(i==8)
                                    {
                                            $scope.obj9Index = parseFloat(rideObjsAll[i].ciiIndex)*10;
                                            $scope.obj9kf = rideObjsAll[i].keyFinding;
                                            for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                            $scope.ninethCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                            $scope.ninethCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                            var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                            $scope.ninethCategRate.push( totalRate );
                                            }		 	 		
                                    }
                                    if(i==9)
                                    {
                                            $scope.obj10Index = parseFloat(rideObjsAll[i].ciiIndex)*20;
                                            $scope.obj10kf = rideObjsAll[i].keyFinding;
                                            for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                            $scope.tenthCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                            $scope.tenthCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                            var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                            $scope.tenthCategRate.push( totalRate );
                                            }		 	 		
                                    }    	 		    
                                }  
   		
                                $scope.evalCii = parseFloat( currEval.completeCii );
                                $scope.totalCii = $scope.evalCii;
                                $scope.epSA = $scope.repLatestRide.sugstActions;
                                $scope.overlkf = $scope.repLatestRide.overallKeyFind;
                                $scope.submitDate = $scope.repLatestRide.submitDate;		
                                
                                $scope.$$phase || $scope.$apply();
                                $scope.showPreviewPopOver();
 	
                            }
    // end (function definitions)
}
// Reports Controller
function  reportsController($scope,$location,JsonService_Graphs, $http) {

  $scope.objectives = [
    {name:'Customer Interaction Index',value:"0"},
    {name:'Pre-call Planning',value:"1"},
    {name:'Call Opening',value:"2"},
    {name:'Agreed Action Feedback',value:"3"},
    {name:'Objection Handling',value:"4"},
    {name:'Expertise',value:"5"},
    {name:'Key Message Delivery',value:"6"},
    {name:'Listening',value:"7"},
    {name:'Call Closing',value:"8"},
    {name:'Post Call Analysis',value:"9"}
    
  ];
  $scope.objective = $scope.objectives[0];

    
    $scope.homeBtn = function() {         
        $location.path("/dashboard");
    };
     $scope.clickObjItem = function(obj) {
        JsonService_Graphs.get(function(data) {
            
                $scope.basicAreaChart = data.graphs[obj.value].column;
                $scope.basicAreaChart2 = data.graphs[obj.value].line;
                if(obj.value != 0)
                {
                     $('#multiBar').show();
                    $scope.basicAreaChart3 = data.graphs[obj.value].multiBar; 
                }
                else
                {
                    $('#multiBar').hide();
                }
                $scope.parameterName = data.graphs[obj.value].column.yAxis.title.text; 
	});
    };
    JsonService_Graphs.get(function(data) {
		//$scope.graphData = data;
                $scope.basicAreaChart = data.graphs[0].column;
                $scope.basicAreaChart2 = data.graphs[0].line;
               // $scope.basicAreaChart3 = data.graphs[0].multiBar;
                 $scope.parameterName = data.graphs[0].column.yAxis.title.text; 
    });
     
    $scope.logOut = function() {
        $location.path("/login");
    }; 
}





function planRideController($rootScope,$scope,$filter, $location, sharedData) {

	$scope.repsList = sharedData.getRepList();
        //$scope.selectedRep = $scope.repsList[0];

        if($rootScope.selectedRepInDashboard!=null){
            $scope.selectedRep =   $rootScope.selectedRepInDashboard;
        }
	else{
            $scope.selectedRep = $scope.repsList[0];
	}
	
       // $scope.planRideActiveId = $rootScope.selectedRepInDashboard;
	var rideObjsAll = angular.copy(sharedData.getRideObjectives());
	
	$scope.startTimeStr = "10:30 AM";
	$scope.endTimeStr   = "12:30 PM";
	$scope.startTime = new Date();
	$scope.endTime = new Date();

	
	$scope.rideObjsToDisplay = [];
    for (var i = 0; i < rideObjsAll.length; i++ ) {
    	rideObjsAll[i].selected = true;
        if (i % 3 == 0) $scope.rideObjsToDisplay.push([]);
        $scope.rideObjsToDisplay[$scope.rideObjsToDisplay.length-1].push(rideObjsAll[i]);
    }


	$scope.getSelectedRideObjIds = function(){
		var ids = [];
		var selectedRObjs = $filter('filter')(rideObjsAll, {selected: true});
		for(var i=0;i<selectedRObjs.length;i++){
			ids.push(selectedRObjs[i].id);
		}
		return ids;
	};

	$scope.handleDoneButtonClick = function(startTimeStr, endTimeStr,durationH){
		var selIds = $scope.getSelectedRideObjIds();
		
		var templatePlanRide = angular.copy(sharedData.getPlannedRides()[0]);
		
		templatePlanRide.rep_id = $scope.selectedRep.id;
		templatePlanRide.startTime = startTimeStr;
		templatePlanRide.endTime = endTimeStr;
		templatePlanRide.durationHours =durationH; 
		templatePlanRide.rideStatusId = 2;
		templatePlanRide.isUpComing = true;
		templatePlanRide.drugIds = [ 1, 2];
		templatePlanRide.objToBeEvaluatedIds = selIds;
		templatePlanRide.evaluations = [];
		templatePlanRide.id = sharedData.getPlannedRides().length+1;
		//sharedData.getPlannedRides().splice(0, 0,templatePlanRide); 
		sharedData.getPlannedRides().push(templatePlanRide); 
		
		//console.log(selIds);
		
	};


	$scope.handleRepClick = function(item, indexVal) {
		$scope.selectedRep = item;
	};

	$scope.backBtn = function() {
		$location.path("/rep_module");
	};
	$scope.logOut = function() {
		$location.path("/login");
	};
        
     $scope.getRepListItemClass= function(repItem) {    
       
        
    	var ret ="";
    	if(repItem.id == $scope.selectedRep.id){
    		ret ='active';
    	}
    	else{
    		ret ='inactive';
    	}
    	//alert(ret);
        return ret;
    };
    
}

function  evaluationController($rootScope,$scope,$location,$filter,$http,sharedData,Utils) {


            $scope.sliders = [];
            $scope.topOffset = 0;	
            $scope.evaluation = {};	
            $scope.tempRide 	= angular.copy($rootScope.currentRide);
            $scope.currentRep 	= Utils.getItemById(sharedData.getRepList(),$scope.tempRide.rep_id);

            var CiiArray =  new Array();
            //this will add a new evaluation to the current ride along
            function addNewEvaluation()
            {
                    $scope.evaluation =angular.copy(sharedData.getEvaluation());
                    
                    $scope.evaluation.doctors = angular.copy(sharedData.getDoctorList());
    
                    for(var c = 0; c < $scope.evaluation.doctors.length; c++) {
                            $scope.evaluation.doctors[c].selected = false;
                    }
                    $scope.evaluation.drugs = angular.copy(sharedData.getDrugList());
    
                    for(var c = 0; c < $scope.evaluation.drugs.length; c++) {
                            $scope.evaluation.drugs[c].selected = false;
                    }
                    
                    var visit={};
                    visit.time=$scope.tempRide.startTime;
                    $scope.evaluation.visits.push(visit);
                    
                    for(var c = 0; c < $scope.evaluation.visits.length; c++) {
                            $scope.evaluation.visits[c].selected = false;
                    }
                    
                    
                    var ids = $scope.tempRide.objToBeEvaluatedIds;
                    
                    for(var i=0;i<$scope.evaluation.rideObjs.length;i++){
                            
                            if(Utils.isItemExists(ids,$scope.evaluation.rideObjs[i].id)==false){
                                    var cats = $scope.evaluation.rideObjs[i].categories;
                                    for(var j=0;j<cats.length;j++){
                                            cats[j].rating = $scope.evaluation.rideObjs[i].defaultRating;
                                    }
                            }
                    }
                    
                    
                    //$scope.tempRide.evaluations.splice(0, 0,$scope.evaluation); 
                    $scope.tempRide.evaluations.push($scope.evaluation);
            };
            
            
            
            if($scope.tempRide.evaluations.length==0){
                    addNewEvaluation();
            }

            $scope.evaluation.completeCii = 0;
            $scope.evaluation = $scope.tempRide.evaluations[0];
            $scope.selectedRideObj = $scope.evaluation.rideObjs[0]; 
            $scope.headingCurrObjective = $scope.selectedRideObj.name;
            
            $scope.ObjctName = $scope.selectedRideObj.name;
            $scope.ObjctKeyFind = $scope.selectedRideObj.keyFinding;
            $scope.SugstActText = $scope.tempRide.sugstActions;
            $scope.overallText = $scope.tempRide.overallKeyFind;
            $scope.cumulativeCiiToDisplay="0.0";
            $scope.ObjTickVal = true;
            document.getElementById("keyFindBtn").style.visibility = "hidden"; 
            
            var ids = $scope.tempRide.objToBeEvaluatedIds; 
            for(var i=0;i<ids.length;i++)
            {
                if(ids[i] == $scope.selectedRideObj.id)
                {
    			$scope.ObjTickVal = false; 
    			document.getElementById("keyFindBtn").style.visibility = "visible";                    
    			break;
                }
            }

            $scope.getSelectedDoctorsCount = function(evalItem){
                    if(evalItem.doctors){
                            
                            var doctors = $filter('filter')(evalItem.doctors, {selected: true});
                            if(evalItem.isSaved == true){
                                    return $scope.getSelectedDoctors(evalItem);
                            }
                            
                            return doctors.length;
                            
                    }
                    else
                            return 0;
            };
            
            
            $scope.getClassEpBox = function(rideObjId) {
                                    var ret = 'epEachObjDivHidden';
                                            var ids = $scope.tempRide.objToBeEvaluatedIds; 
                                                                                      for(var i=0;i<ids.length;i++){
                                                            if(ids[i] == rideObjId){
                                                                    ret ='epEachObjDiv';                       
                                                                    break;
                                                            }
                                                    }
                                    //alert(ret);
                                    //console.log("************************************************"+ret);
                                    return ret;
             };
            
            
            $scope.getSelectedVisitsCount = function(evalItem){
                    if(evalItem.visits){
                            
                            var visits = $filter('filter')(evalItem.visits, {selected: true});
                            if(evalItem.isSaved == true){
                                    return $scope.getSelectedVisits(evalItem);
                            }
                            return visits.length;
                    }
                            
                    else
                            return 0;
            };
            
            $scope.getSelectedDrugsCount = function(evalItem){
                    if(evalItem.drugs){
                            var drugs = $filter('filter')(evalItem.drugs, {selected: true});
                            if(evalItem.isSaved == true){
                                    return $scope.getSelectedDrugs(evalItem);
                            }
                            return drugs.length;
                    }
                            
                    else
                            return 0;
            };
            $scope.getSelectedCIICount = function(evalItem){
                    return evalItem.completeCii;
            
            };
            $scope.getSelectedDoctors = function (evalItem) {
                    var selectedDoctors=$filter('filter')(evalItem.doctors, {selected: true});
                    var ret="";
                    for(var i=0;i<selectedDoctors.length && i<2;i++){
                            if(i!=0) ret+=", ";
                            ret+= selectedDoctors[i].name;
                    }
                    if(selectedDoctors.length>2)
                            ret+="...";
                    if(ret.length==0)
                            ret = "All";
                return ret;
            };
            $scope.getSelectedVisits = function (evalItem) {
                    var selectedVisits=$filter('filter')(evalItem.visits, {selected: true});
                    var ret="";
                    for(var i=0;i<selectedVisits.length && i<2;i++){
                            if(i!=0) ret+=", ";
                            ret+= selectedVisits[i].time;
                    }
                    if(selectedVisits.length>2)
                            ret+="...";
                    if(ret.length==0)
                            ret = "All";
                return ret;
            };
            $scope.getSelectedDrugs = function (evalItem) {
                    var selectedDrugs=$filter('filter')(evalItem.drugs, {selected: true});
                    var ret="";
                    for(var i=0;i<selectedDrugs.length && i<2;i++){
                            if(i!=0) ret+=", ";
                            ret+= selectedDrugs[i].name;
                    }
                    if(selectedDrugs.length>2)
                            ret+="...";
                    if(ret.length==0)
                            ret = "All";
                return ret;
            };
            
            
            var CurrRideObjId = 1;
            $scope.clickObjItem = function(item) {
                 $scope.sliders = [];
                   $scope.headingCurrObjective = item.name;
                   $scope.selectedRideObj = item;
                   CurrRideObjId = item.id;
                   
                   if( CurrRideObjId == 10 )
                        CurrRideObjId = 0;
                        
                   $scope.calculateCii();
                   
                            $scope.ObjTickVal = true;
                            var ids = $scope.tempRide.objToBeEvaluatedIds; 
                            for(var i=0;i<ids.length;i++){
                                if(ids[i] == item.id){
                                    $scope.ObjTickVal = false;                    
                                    break;
                                }
                            }
                   
                   $scope.ObjctName = $scope.selectedRideObj.name;
                   $scope.ObjctKeyFind = $scope.selectedRideObj.keyFinding;
                   
                    var ids = $scope.tempRide.objToBeEvaluatedIds;                  
                    document.getElementById("keyFindBtn").style.visibility = "hidden"; 
                    for(var i=0;i<ids.length;i++){
                            if(ids[i] == item.id){
                                    document.getElementById("keyFindBtn").style.visibility = "visible";                        
                                    break;
                            }
                    }
                };
            $scope.NextBtn = function() {
                  $scope.clickObjItem( $scope.evaluation.rideObjs[CurrRideObjId] );       
                };  
            $scope.addNewBar = function() {
                    if($scope.tempRide.evaluations[0].isSaved==true){
                         for(var i = 0; i < CiiArray.length; i++)
                            {
                                if(i==2)
                                {
                                    $scope.topOffset = 60;
                                    
                                }
                                else if(i>2)
                                {
                                    $scope.topOffset = $scope.topOffset + 65;                        
                                }
                            }
                            addNewEvaluation(); 
                           
                            setTimeout(function(){
                                    $scope.handleEvalItemClick($scope.tempRide.evaluations[$scope.tempRide.evaluations.length-1]);
                            },10);
                    }
            }
            $scope.calculateCii = function() {
                            //item.index
                            for(var i = 0; i < $scope.evaluation.rideObjs.length; i++) {
                                    var rObj = $scope.evaluation.rideObjs[i];
                                    var ciiVal = 0;
                                    for(var j = 0; j < rObj.categories.length; j++) {
                                            var catG = rObj.categories[j];
                                            ciiVal = ciiVal + ((catG.rating * catG.weightage) / 5);
                                    }
                                    rObj.ciiIndex = (ciiVal * rObj.weightage)/ 100;
                                    
                                    //console.log('i= '+i+' cii: '+$scope.evaluation.rideObjs[i].ciiIndex);
            
                            }
                            //console.log("ciiIndex: " + $scope.selectedRideObj.ciiIndex);
                            if($scope.selectedRideObj) {
                                    var cumCiiVal = 0;
                                    for(var j = 0; j <= $scope.selectedRideObj.index; j++) {
                                            cumCiiVal = cumCiiVal + $scope.evaluation.rideObjs[j].ciiIndex;
                                    }
                                    var strV = "" + cumCiiVal;
                                    if(strV.length > 5)
                                            strV = strV.substring(0, 5);
                                    $scope.cumulativeCiiToDisplay = strV;
                                    console.log( $scope.cumulativeCiiToDisplay );
                                    
                                    
                                    
                                    
                                    
                            // calculate all CII
                                    var allCiiTemp = 0;
                                    for(var j = 0; j < $scope.evaluation.rideObjs.length; j++) {
                                            allCiiTemp = allCiiTemp + $scope.evaluation.rideObjs[j].ciiIndex;
                                    }
                                    $scope.evaluation.completeCii = allCiiTemp;
                                    $scope.$$phase || $scope.$apply();
            
                            }
                            
                            
                            
                    };
            $scope.calculateCii();
            $scope.itemClass = function(item) {
                    
                    var ids = $scope.tempRide.objToBeEvaluatedIds;        
                    var isChoosen = false;
                    for(var i=0;i<ids.length;i++){
                            if(ids[i] == item.id){
                                    isChoosen=true;                   
                                    break;
                            }
                    }
                    if(isChoosen){
                             return item === $scope.selectedRideObj ? 'active selected' : 'inactive selected';
                    }else{
                            //alert('not found');
                             return item === $scope.selectedRideObj ? 'active' : 'inactive';
                    }
                    
                   
                };
            $scope.handleEvalItemClick = function(evalItem){
                            $scope.evaluation=evalItem;
                            $scope.clickObjItem($scope.evaluation.rideObjs[0]);
                    };
            $scope.getClassSingleTabbar= function(itemEvaluation) {
                    var ret ="";
                    if(itemEvaluation == $scope.evaluation){
                            ret ='singleTabbar active';
                    }
                    else{
                            ret ='singleTabbar';
                    }
                    //alert(ret);
                    return ret;
                };
            $scope.getClassSubmitButton = function() {
                    var ret ="";
                    if($scope.tempRide.evaluations.length>1){
                            ret ='eval_submit_button_active';
                    }
                    else{
                            ret = $scope.tempRide.evaluations[0].isSaved==true?'eval_submit_button_active' :'eval_submit_button';
                    }
                    //alert(ret);
                    return ret;
                };
            $scope.getClassAddNewButton = function(itemEvaluation) {
                    var ret ="";
                    if(itemEvaluation == $scope.tempRide.evaluations[$scope.tempRide.evaluations.length-1]){
                            ret = itemEvaluation.isSaved==true?'singleTabbar4 singleTab_add_active' :'singleTabbar4 singleTab_add';
                            
                    }
                    else{
                    ret ='singleTabbar4 singleTab_add_hidden';
                    }
                    //alert(ret);
                    return ret;
                };
            $scope.getStyleEvalItem = function () {
                    var len = 0;
                    len += $scope.tempRide.evaluations.length;
                    if(len>3) len = 3;
                            return { 
                                'max-height': (len*70) + 'px'                
                            };
                 };
            $scope.getStyleCategoriesDiv = function () {
                    var len = 0;
                    len += $scope.tempRide.evaluations.length;
                    if(len>3) len = 3;
                            return { 
                                'max-height': (422-((len-1)*70)) + 'px'                
                            };
                 };
            $scope.getStyleImanageContent = function () {
                    var len = 0;
                    len += $scope.tempRide.evaluations.length;
                    if(len>3) len = 3;
                            return { 
                                'max-height': (604-((len-1)*70)) + 'px',                
                                'min-height': (604-((len-1)*70)) + 'px'                
                            };
                 };
            $scope.getStyleEvalList = function(evalItem) {
                        if($rootScope.theme == '')
                        {
                            var ret = "1px solid #ffcf33";
                            if(($scope.tempRide.evaluations.length > 0) && (evalItem == $scope.tempRide.evaluations[0])) {
                                    ret = "3px solid #eec431";
                            }
                            return {
                                    'border-top' : ret
                            };
                        }
                        else
                        {
                            return {
                                    
                            };
                        }
                        
                    };
            $scope.getStyleImanageNavigation = function () {
                    var len = 0;
                    len += $scope.tempRide.evaluations.length;    
                    if(len>3) len = 3;
                    var pix = 604;
                    if(len==2)pix =535;
                    if(len==3)pix =465;
                            return { 
                                'max-height': (pix) + 'px',                
                                'min-height': (pix) + 'px'                
                            };
                 };
            $scope.getSelectedDoctorsAllEval = function (repObjParam) {
                
            
                var ret="";
                for(var j=0; j<$scope.tempRide.evaluations.length;j++)
                {       
                    var selectedDoctors=$filter('filter')($scope.tempRide.evaluations[j].doctors, {selected: true});
                    if(selectedDoctors.length == 0) {
                        repObjParam.EvaluatedDocIds = Array(1,2,3,4,5,6,7,8);
                        ret = "All";
                        break;
                    }
                    for(var i=0; i<selectedDoctors.length;i++)
                    {
                        var DoctrId = selectedDoctors[i].id;
                        repObjParam.EvaluatedDocIds[DoctrId - 1] = DoctrId;
                    }
                }
                if(ret != "All")
                {
                    var docObj = sharedData.getDoctorList();
                    for(var k=0;k<repObjParam.EvaluatedDocIds.length;k++){
                            if( k!=0 && repObjParam.EvaluatedDocIds[k] != 0)
                            {
                                ret+=", ";
                            }         
                            
                            if( repObjParam.EvaluatedDocIds[k] != 0)
                            {
                                
                                ret+= docObj[k].name;
                            }           
                            
                            //if(ret.length > 10)
                            //{
                            //    ret+="...";
                            //    break;
                            //}
                    }    
                }
               
                repObjParam.EvaluatedDocNames =  ret;
                
                return repObjParam;
            };
            // this function is using to save key findings of each objective
            $scope.saveObjvKeyFind = function() {
                            $scope.selectedRideObj.keyFinding = document.getElementById("ObjtKeyFindTextArea").value;	
                            $scope.$$phase || $scope.$apply();
                            $scope.hideObjvKeyPopup();	
                    } 
            $scope.homeBtn = function() {         
                    $location.path("/dashboard");
                };
            // this submit function is not using now
            $scope.submitBtn = function() {
            
                    var repObj = sharedData.getRepList();
                    var plannedRidesObj = sharedData.getPlannedRides();
                    var currRepId = $scope.tempRide.rep_id;        
                    var tempCII =  repObj[currRepId-1].cii;
                    
                    for(var i=0;i<CiiArray.length;i++)
                    {
                        //tempCII = parseFloat(tempCII).toFixed(1) + parseFloat(CiiArray[i]).toFixed(1);
                         tempCII = Number(tempCII) + Number(CiiArray[i]);
                    }
                    repObj[currRepId-1].cii = parseFloat(tempCII/(CiiArray.length+1)).toFixed(1);         
                    repObj[currRepId-1] = $scope.getSelectedDoctorsAllEval( repObj[currRepId-1] );
                   
                    sharedData.setRepList(repObj);
                    console.log("... planned ride under..");
                    console.dir( $rootScope.currentRide );
                    $rootScope.currentRide.rideStatusId = 4;   
                 
                    $location.path("/dashboard");
                };
            $scope.saveBtn = function() {  
                    
                            for(var j=0;j<$scope.tempRide.evaluations.length;j++){
                                    $scope.tempRide.evaluations[j].isSaved=true;
                            }
                            //$scope.tempRide.evaluations[0].CII=$scope.cumulativeCiiToDisplay;
                            $scope.tempRide.rideStatusId=3;
                            var allPlannedRides = sharedData.getPlannedRides();
                            for(var i=0;i<allPlannedRides.length;i++){
                                    if($rootScope.currentRide==allPlannedRides[i]){
                                            allPlannedRides[i] = angular.copy($scope.tempRide);
                                            $rootScope.currentRide = allPlannedRides[i];
                                           
                                    }
                            }
                            CiiArray[CiiArray.length] = parseFloat($scope.evaluation.completeCii).toFixed(1);
                            
                };
            $scope.cancelBtn = function() {         
                    $location.path("/dashboard");
                };
            $scope.ratingVals = [
               {value:0, colorVal:'#cc0000'},
               {value:1, colorVal:'#990000'},
               {value:2, colorVal:'#770000'},
               {value:3, colorVal:'#440000'},
               {value:4, colorVal:'#220000'},
               {value:5, colorVal:'#110000'},
              ];       
            $scope.currVal= 1;
            $scope.currVal2=1;
            $scope.logOut = function() {
                    $location.path("/login");
                };    
            // showPreview function is using to show the evaluation preview in this page
            $scope.showPreview = function() {
                            
                            $scope.firstCategories = [];
                            $scope.firstCategWeight = [];
                            $scope.firstCategRate = [];
                            
                            $scope.secondCategories = [];
                            $scope.secondCategWeight = [];
                            $scope.secondCategRate = []; 
                                            
                            $scope.thirdCategories = [];
                            $scope.thirdCategWeight = [];
                            $scope.thirdCategRate = []; 		
                            
                            $scope.fourthCategories = [];
                            $scope.fourthCategWeight = [];
                            $scope.fourthCategRate = []; 		
                            
                            $scope.fifthCategories = [];
                            $scope.fifthCategWeight = [];
                            $scope.fifthCategRate = [];
                            
                            $scope.sixthCategories = [];
                            $scope.sixthCategWeight = [];
                            $scope.sixthCategRate = [];
                            
                            $scope.seventhCategories = [];
                            $scope.seventhCategWeight = [];
                            $scope.seventhCategRate = [];
                            
                            $scope.eighthCategories = [];
                            $scope.eighthCategWeight = [];
                            $scope.eighthCategRate = [];
                            
                            $scope.ninethCategories = [];
                            $scope.ninethCategWeight = [];
                            $scope.ninethCategRate = [];
                            
                            $scope.tenthCategories = [];
                            $scope.tenthCategWeight = [];
                            $scope.tenthCategRate = []; 		
                            
                            $scope.overlSpiderChart = sharedData.getRepModuleSpiderData().graphs[0].overAllCii;
                            
                            $scope.firstCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj1;
                            $scope.secondCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj2;
                            $scope.thirdCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj3;
                            $scope.fourthCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj4;
                            $scope.fifthCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj5;
                            $scope.sixthCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj6;
                            $scope.seventhCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj7;
                            $scope.eighthCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj8;
                            $scope.ninethCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj9;
                            $scope.tenthCategoryChart = sharedData.getRepModuleSpiderData().graphs[0].obj10;
                            
                            
                            
                            var repItem = Utils.getItemById(sharedData.getRepList(),$rootScope.currentRide.rep_id); 		
                            $scope.epRepName = repItem.name;
                            
                            var currEval = $rootScope.currentRide.evaluations[ $rootScope.currentRide.evaluations.length - 1];
                            var rideObjsAll = currEval.rideObjs;
                             $scope.objCii = [];
                             $scope.eachObjIndex = [];
                             
                     //to show Products means drugs
                             
                              var RepdrugIds	 =[];
                              var totalDrugs = angular.copy(sharedData.getDrugList());
                              
                              for (var i = 0; i < $rootScope.currentRide.drugIds.length; i++ ) {
                                    for (var j = 0; j < totalDrugs.length; j++ ) {
                                            if( $rootScope.currentRide.drugIds[i] == totalDrugs[j].id )
                                            {
                                                    RepdrugIds.push( totalDrugs[j].name);
                                            } 		 	
                                    } 		 	
                             } 		  
                             $scope.drugsString="";
                             for (var i = 0; i < RepdrugIds.length; i++ ) {
                                    if(i==0)
                                            $scope.drugsString += RepdrugIds[i];
                                    else
                                            $scope.drugsString += ',' + RepdrugIds[i]; 		
                                    
                             }
                             // end
                            //to show selected Objectives
                            var selectedObjs = [];
                             for (var i = 0; i < $rootScope.currentRide.objToBeEvaluatedIds.length; i++ ) {
                                    for (var j = 0; j < rideObjsAll.length; j++ ) {
                                            if( $rootScope.currentRide.objToBeEvaluatedIds[i] == rideObjsAll[j].id )
                                            {
                                                    selectedObjs.push( rideObjsAll[j].name);
                                            } 		 	
                                    } 		 	
                             }
                             $scope.selectedObjString="";
                             for (var i = 0; i < selectedObjs.length; i++ ) {
                                    if(i==0)
                                            $scope.selectedObjString += selectedObjs[i];
                                    else
                                            $scope.selectedObjString += ',' + selectedObjs[i]; 		
                                    
                             }
                             // end
                             
                             for (var i = 0; i < rideObjsAll.length; i++ ) {
                                    $scope.eachObjIndex.push(  parseFloat((rideObjsAll[i].ciiIndex/rideObjsAll[i].weightage)*100) ); 		 	
                                    var eachCii = 0;
                                    for(var k=0;k<=i;k++)
                                    {
                                            eachCii += parseFloat(rideObjsAll[k].ciiIndex)
                                    }
                                    
                                    //$scope.objCii.push( parseFloat(eachCii) );
                                    var num = parseFloat((eachCii/rideObjsAll[i].weightage)*100);
                                    $scope.objCii.push( num.toFixed(5));
                             }
                             for (var i = 0; i < rideObjsAll.length; i++ ) {
                                            if(i==0)
                                            {
                                                    $scope.obj1Index = parseFloat(rideObjsAll[i].ciiIndex)*10;
                                                    $scope.obj1kf = rideObjsAll[i].keyFinding;
                                                    for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                                    $scope.firstCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                                    $scope.firstCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                                    var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                                    $scope.firstCategRate.push( totalRate );
                                                    }		 	 		
                                            }
                                            if(i==1)
                                            {
                                                    $scope.obj2Index = parseFloat(rideObjsAll[i].ciiIndex)*20;
                                                    $scope.obj2kf = rideObjsAll[i].keyFinding;
                                                    for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                                    $scope.secondCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                                    $scope.secondCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                                    var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                                    $scope.secondCategRate.push( totalRate );
                                                    }		 	 		
                                            }
                                            if(i==2)
                                            {
                                                    $scope.obj3Index = parseFloat(rideObjsAll[i].ciiIndex)*20;
                                                    $scope.obj3kf = rideObjsAll[i].keyFinding;
                                                    for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                                    $scope.thirdCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                                    $scope.thirdCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                                    var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                                    $scope.thirdCategRate.push( totalRate );
                                                    }		 	 		
                                            }
                                            if(i==3)
                                            {
                                                    $scope.obj4Index = parseFloat(rideObjsAll[i].ciiIndex)*10;
                                                    $scope.obj4kf = rideObjsAll[i].keyFinding;
                                                    for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                                    $scope.fourthCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                                    $scope.fourthCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                                    var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                                    $scope.fourthCategRate.push( totalRate );
                                                    }		 	 		
                                            }
                                            if(i==4)
                                            {
                                                    $scope.obj5Index = parseFloat(rideObjsAll[i].ciiIndex)*5;
                                                    $scope.obj5kf = rideObjsAll[i].keyFinding;
                                                    for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                                    $scope.fifthCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                                    $scope.fifthCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                                    var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                                    $scope.fifthCategRate.push( totalRate );
                                                    }		 	 		
                                            }
                                            if(i==5)
                                            {
                                                    $scope.obj6Index = parseFloat(rideObjsAll[i].ciiIndex)*5;
                                                    $scope.obj6kf = rideObjsAll[i].keyFinding;
                                                    for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                                    $scope.sixthCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                                    $scope.sixthCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                                    var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                                    $scope.sixthCategRate.push( totalRate );
                                                    }		 	 		
                                            }
                                            if(i==6)
                                            {
                                                    $scope.obj7Index = parseFloat(rideObjsAll[i].ciiIndex)*20;
                                                    $scope.obj7kf = rideObjsAll[i].keyFinding;
                                                    for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                                    $scope.seventhCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                                    $scope.seventhCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                                    var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                                    $scope.seventhCategRate.push( totalRate );
                                                    }		 	 		
                                            }
                                            if(i==7)
                                            {
                                                    $scope.obj8Index = parseFloat(rideObjsAll[i].ciiIndex)*10;
                                                    $scope.obj8kf = rideObjsAll[i].keyFinding;
                                                    for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                                    $scope.eighthCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                                    $scope.eighthCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                                    var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                                    $scope.eighthCategRate.push( totalRate );
                                                    }		 	 		
                                            }
                                            if(i==8)
                                            {
                                                    $scope.obj9Index = parseFloat(rideObjsAll[i].ciiIndex)*10;
                                                    $scope.obj9kf = rideObjsAll[i].keyFinding;
                                                    for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                                    $scope.ninethCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                                    $scope.ninethCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                                    var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                                    $scope.ninethCategRate.push( totalRate );
                                                    }		 	 		
                                            }
                                            if(i==9)
                                            {
                                                    $scope.obj10Index = parseFloat(rideObjsAll[i].ciiIndex)*20;
                                                    $scope.obj10kf = rideObjsAll[i].keyFinding;
                                                    for (var j = 0; j < rideObjsAll[i].categories.length; j++ ) {
                                                    $scope.tenthCategories.push( currEval.rideObjs[i].categories[j].name ); 
                                                    $scope.tenthCategWeight.push( rideObjsAll[i].categories[j].weightage );
                                                    var totalRate = ( parseInt(rideObjsAll[i].categories[j].weightage)/5 )*parseInt( rideObjsAll[i].categories[j].rating );
                                                    $scope.tenthCategRate.push( totalRate );
                                                    }		 	 		
                                            }
                                        
                                    }  
                            
                            $scope.evalCii = parseFloat( currEval.completeCii );
                            $scope.totalCii = $scope.evalCii;
                            
                            $scope.epSA = document.getElementById("SugstActTextArea").value;
                            $scope.overlkf = document.getElementById("overallTextArea").value;
                            $scope.submitDate = new Date().toDateString();
                            
                            //$scope.epSA = $rootScope.currentRide.sugstActions;
                            //$scope.overlkf = $rootScope.currentRide.overallKeyFind;
                            //$scope.submitDate = $rootScope.currentRide.submitDate;
                            
                            
                            $scope.$$phase || $scope.$apply();
                            $scope.hideOverallPopup();
                            $scope.showPreviewPopOver();
                    
                    }
            $scope.saveForLater = function() {
                            $scope.tempRide.sugstActions = document.getElementById("SugstActTextArea").value;
                            $scope.tempRide.overallKeyFind = document.getElementById("overallTextArea").value;
            
            
                            var allPlannedRides = sharedData.getPlannedRides();
                            for(var i=0;i<allPlannedRides.length;i++){
                                    if($rootScope.currentRide==allPlannedRides[i]){
                                            allPlannedRides[i] = angular.copy($scope.tempRide);
                                            $rootScope.currentRide = allPlannedRides[i];
                                           
                                    }
                            } 			
                                  
                    var repObj = sharedData.getRepList();
                    var plannedRidesObj = sharedData.getPlannedRides();
                    var currRepId = $rootScope.currentRide.rep_id //$scope.tempRide.rep_id;        
                    var tempCII =  repObj[currRepId-1].cii;
                    
                    for(var i=0;i<CiiArray.length;i++)
                    {
                       //tempCII = parseFloat(Number(tempCII)).toFixed(1) + parseFloat(Number(CiiArray[i])).toFixed(1);
                        tempCII = Number(tempCII) + Number(CiiArray[i]);
                       
                    }    	
                    repObj[currRepId-1].cii = parseFloat(tempCII/(CiiArray.length+1)).toFixed(1);         
                    repObj[currRepId-1] = $scope.getSelectedDoctorsAllEval( repObj[currRepId-1] );       
                    sharedData.setRepList(repObj);
                    $location.path("/dashboard");
                    
                    }
            // this function is using to submit all details of evaluations
            $scope.submitAll = function() {
            
                            $scope.tempRide.sugstActions = document.getElementById("SugstActTextArea").value;
                            $scope.tempRide.overallKeyFind = document.getElementById("overallTextArea").value;  
                            $scope.tempRide.submitDate =  new Date().toDateString();
                    
                    var allPlannedRides = sharedData.getPlannedRides();
                            for(var i=0;i<allPlannedRides.length;i++){
                                    if($rootScope.currentRide==allPlannedRides[i]){
                                            allPlannedRides[i] = angular.copy($scope.tempRide);
                                            $rootScope.currentRide = allPlannedRides[i];
                                           
                                    }
                            } 		
                            
                    var repObj = sharedData.getRepList();    	
                    var plannedRidesObj = sharedData.getPlannedRides();
                    var currRepId = $scope.tempRide.rep_id;        
                    var tempCII =  repObj[currRepId-1].cii;
            
                    for(var i=0;i<CiiArray.length;i++)
                    {
                        //tempCII = parseFloat(tempCII).toFixed(1) + parseFloat(CiiArray[i]).toFixed(1);
                        tempCII = Number(tempCII) + Number(CiiArray[i]);
                        
                    }
                    var ciiToSend = parseFloat(tempCII/(CiiArray.length+1)).toFixed(1);
                    var repRecordId = 0;
                    if( $rootScope.remoteReps.length > 0  )
                    {
                        repRecordId = $rootScope.remoteReps[currRepId-1].recordId;
                                         
                    }
                    else {
                        repRecordId = currRepId;
                    }
                   
                   //ajax starts from here
                    
                    var httpUrl = "https://cogdemo-developer-edition.ap1.force.com/services/apexrest/SalesRep";
                    //var httpUrl = "https://cogdemo-developer-edition.ap1.force.com/services/apexrest/SalesRep/"+repRecordId+"/"+ciiToSend;
                    //var httpUrl = "http://ec2-54-225-214-92.compute-1.amazonaws.com/sForce-0.0.1-SNAPSHOT/rest/sf/ciupdate/"+repRecordId+"/"+ciiToSend;
                    
                    //send new cii value of rep to remote server
                    
                    var dataToSend =  '{"SR_ID":"'+ repRecordId +'","CII":"'+ ciiToSend +'"}';    
                    $.ajax({
                        type: "PATCH",
                        url: httpUrl,
                        contentType : 'application/json',
                        data: dataToSend,
                        success : function(data){            
                          console.log(data);     
                        },
                        error : function( jqXHR,textStatus,errorThrown){ }                                
                                              
                    });      
               
                     
                     
                    repObj[currRepId-1].cii = parseFloat(tempCII/(CiiArray.length+1)).toFixed(1);         
                    repObj[currRepId-1] = $scope.getSelectedDoctorsAllEval( repObj[currRepId-1] );
                   
                    sharedData.setRepList(repObj);
            
                    $rootScope.currentRide.rideStatusId = 4;   
                 
                    $location.path("/dashboard");
                    
                    }  
    
}




