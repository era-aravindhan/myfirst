'use strict';

/* Directives */

angular.module('myApp.directives', []).directive('appVersion', ['version',
function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]).directive('popovrchart', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,
        
		link : function(scope, element, attrs) {
			
			var chartsDefaults = {
				title: {	text:"Comparison parameters"	},
					xAxis: {	categories:  scope.categories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.categWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.categRate
                                }
                        ]
					
			};
                
            
			//Update when charts data changes
			scope.$watch('categories', function(newval, oldval) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
				
					title: {	text:"Comparison parameters"	},
					xAxis: {	categories:  scope.categories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.categWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.categRate
                                }
                        ]
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			},true);
		}
	}

}).directive('epchartfirstcat', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,
        
		link : function(scope, element, attrs) {
			
			var chartsDefaults = {
				
					title: {	text:"PCPI:comparison parameters"	},
					xAxis: {	categories:  scope.firstCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.firstCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.firstCategRate
                                }
                        ]
					
			};
                
            
			//Update when charts data changes
			scope.$watch('firstCategories', function(newval, oldval) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
				
					title: {	text:"PCPI:comparison parameters"	},
					xAxis: {	categories:  scope.firstCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.firstCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.firstCategRate
                                }
                        ]
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			},true);
		}
	}

}).directive('epchartsecondcat', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,
        
		link : function(scope, element, attrs) {
			
			var chartsDefaults = {
				
					title: {	text:"CO:comparison parameters"	},
					xAxis: {	categories:  scope.secondCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.secondCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.secondCategRate
                                }
                        ]
					
			};
                
            
			//Update when charts data changes
			scope.$watch('secondCategories', function(newval, oldval) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
				
					title: {	text:"CO:comparison parameters"	},
					xAxis: {	categories:  scope.secondCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.secondCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.secondCategRate
                                }
                        ]
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			},true);
		}
	}

}).directive('epchartthirdcat', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,
        
		link : function(scope, element, attrs) {
			
			var chartsDefaults = {
				
					title: {	text:"AAF:comparison parameters"	},
					xAxis: {	categories:  scope.thirdCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.thirdCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.thirdCategRate
                                }
                        ]
					
			};
                
            
			//Update when charts data changes
			scope.$watch('thirdCategories', function(newval, oldval) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
				
					title: {	text:"AAF:comparison parameters"	},
					xAxis: {	categories:  scope.thirdCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.thirdCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.thirdCategRate
                                }
                        ]
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			},true);
		}
	}

}).directive('epchartfourthcat', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,
        
		link : function(scope, element, attrs) {
			
			var chartsDefaults = {
				
					title: {	text:"KMD:comparison parameters"	},
					xAxis: {	categories:  scope.fourthCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.fourthCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.fourthCategRate
                                }
                        ]
					
			};
                
            
			//Update when charts data changes
			scope.$watch('fourthCategories', function(newval, oldval) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
				
					title: {	text:"KMD:comparison parameters"	},
					xAxis: {	categories:  scope.fourthCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.fourthCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.fourthCategRate
                                }
                        ]
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			},true);
		}
	}

}).directive('epchartfifthcat', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,
        
		link : function(scope, element, attrs) {
			
			var chartsDefaults = {
				
					title: {	text:"OH:comparison parameters"	},
					xAxis: {	categories:  scope.fifthCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.fifthCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.fifthCategRate
                                }
                        ]
					
			};
                
            
			//Update when charts data changes
			scope.$watch('fifthCategories', function(newval, oldval) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
				
					title: {	text:"OH:comparison parameters"	},
					xAxis: {	categories:  scope.fifthCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.fifthCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.fifthCategRate
                                }
                        ]
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			},true);
		}
	}

}).directive('epchartsixthcat', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,
        
		link : function(scope, element, attrs) {
			
			var chartsDefaults = {
				
					title: {	text:"Expertise:comparison parameters"	},
					xAxis: {	categories:  scope.sixthCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.sixthCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.sixthCategRate
                                }
                        ]
					
			};
                
            
			//Update when charts data changes
			scope.$watch('sixthCategories', function(newval, oldval) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
				
					title: {	text:"Expertise:comparison parameters"	},
					xAxis: {	categories:  scope.sixthCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.sixthCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.sixthCategRate
                                }
                        ]
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			},true);
		}
	}

}).directive('epchartseventhcat', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,
        
		link : function(scope, element, attrs) {
			
			var chartsDefaults = {
				
					title: {	text:"Listening:comparison parameters"	},
					xAxis: {	categories:  scope.seventhCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.seventhCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.seventhCategRate
                                }
                        ]
					
			};
                
            
			//Update when charts data changes
			scope.$watch('seventhCategories', function(newval, oldval) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
				
					title: {	text:"Listening:comparison parameters"	},
					xAxis: {	categories:  scope.seventhCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.seventhCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.seventhCategRate
                                }
                        ]
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			},true);
		}
	}

}).directive('epcharteighthcat', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,
        
		link : function(scope, element, attrs) {
			
			var chartsDefaults = {
				
					title: {	text:"CC:comparison parameters"	},
					xAxis: {	categories:  scope.eighthCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.eighthCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.eighthCategRate
                                }
                        ]
					
			};
                
            
			//Update when charts data changes
			scope.$watch('eighthCategories', function(newval, oldval) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
				
					title: {	text:"CC:comparison parameters"	},
					xAxis: {	categories:  scope.eighthCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.eighthCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.eighthCategRate
                                }
                        ]
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			},true);
		}
	}

}).directive('epchartninethcat', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,
        
		link : function(scope, element, attrs) {
			
			var chartsDefaults = {
				
					title: {	text:"PCA:comparison parameters"	},
					xAxis: {	categories:  scope.ninethCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.ninethCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.ninethCategRate
                                }
                        ]
					
			};
                
            
			//Update when charts data changes
			scope.$watch('ninethCategories', function(newval, oldval) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
				
					title: {	text:"PCA:comparison parameters"	},
					xAxis: {	categories:  scope.ninethCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.ninethCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.ninethCategRate
                                }
                        ]
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			},true);
		}
	}

}).directive('epcharttenthcat', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,
        
		link : function(scope, element, attrs) {
			
			var chartsDefaults = {
				
					title: {	text:"AM:comparison parameters"	},
					xAxis: {	categories:  scope.tenthCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.tenthCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.tenthCategRate
                                }
                        ]
					
			};
                
            
			//Update when charts data changes
			scope.$watch('tenthCategories', function(newval, oldval) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
				
					title: {	text:"AM:comparison parameters"	},
					xAxis: {	categories:  scope.tenthCategories	},
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data: scope.tenthCategWeight
                                },
                                {
                                        name: "Status",
                                        data: scope.tenthCategRate
                                }
                        ]
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			},true);
		}
	}

}).directive('epciispiderchart', function() {

	return {
		
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,        
		link : function(scope, element, attrs) {
				var chartsDefaults = {	
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data:[100, 100,100, 100,100, 100,100, 100,100, 100],
										pointPlacement : "on"					
                                },
                                {
                                        name: "Index",
                                        data: scope.eachObjIndex,
										pointPlacement : "on"
					
                                }
                        ]

	
			};
			
			
			//Update when charts data changes
			scope.$watchCollection('[objCii,eachObjIndex,totalCii]',function(newval, oldval) {
	
					//if(!attrs.value)
					//return;
					
 				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data:[100, 100,100, 100,100, 100,100, 100,100, 100],
										pointPlacement : "on"					
                                },
                                {
                                        name: "Index",
                                        data: scope.eachObjIndex,
										pointPlacement : "on"
					
                                }
                        ],
                        title:{text: "Customer Interaction Index:"+scope.totalCii+" ",y:4}
						
			}; 
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
				

				var tot = 0;
				//console.log(scope.eachObjIndex);
				
				try
				  {
					var dArr = scope.eachObjIndex;
					for(var k=0;k<dArr.length;k++){
						tot+= parseInt(""+dArr[k]);
					}
					tot = tot/dArr.length;
					tot = tot.toFixed(2);
				  }
				catch(err)
				  {
				  //Handle errors here
				  }
				
				

				//console.log(tot);
				tot = scope.totalCii;
				chart.setTitle({text: "Customer Interaction Index:"+tot+" ",y:4});
			},true);
			
	
		}
	}

}).directive('repobjspider', function() {

	return {
		
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,        
		link : function(scope, element, attrs) {
				var chartsDefaults = {
					plotOptions: {
						series: {
							cursor: 'pointer',
						 	point: {
    								events: {
    									click: function() {
        									scope.showGraphPopup(this.category);
        									
    									}
    								}
								}
							}
        			},				
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data:[100, 100,100, 100,100, 100,100, 100,100, 100],
										pointPlacement : "on"					
                                },
                                {
                                        name: scope.rep,
                                        data: scope.objIndex,
										pointPlacement : "on"
					
                                }
                        ]

	
			};
			
			
			//Update when charts data changes
			scope.$watchCollection('[rep,mainSpider,objCii,objIndex,totalCii]',function(newval, oldval) {
	
					//if(!attrs.value)
					//return;
					
 				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				var chartsDefaults = {
					plotOptions: {
            							series: {
                							cursor: 'pointer',
               							 	point: {
                    								events: {
                   	    									click: function() {
                            									scope.showGraphPopup(this.category);
                            									
                        										}
                    								}
                								}
            								}
        			},				
					series:
                        [
                                {
                                        name: "Benchmark",
                                        data:[100, 100,100, 100,100, 100,100, 100,100, 100],
										pointPlacement : "on"					
                                },
                                
                                {
										name: scope.rep,
                                        data: scope.objIndex,
										pointPlacement : "on"
					
                                }
                        ],
                        title:{text: "Customer Interaction Index:"+scope.totalCii+" ",y:4}
						
			}; 
			
			//console.log(attrs.value);
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);

				var tot = 0;
				//console.log(JSON.parse(attrs.value));
				
				try
				  {
				  	var dArr = scope.objIndex;
					for(var k=0;k<dArr.length;k++){
						tot+= parseInt(""+dArr[k]);
					}
					tot = tot/dArr.length;
					tot = tot.toFixed(2);
					/*
					var jv = JSON.parse(attrs.value);
					var dArr = jv.series[1].data;
					for(var k=0;k<dArr.length;k++){
						tot+=dArr[k];
					}*/
				  }
				catch(err)
				  {
				  	
				  //Handle errors here
				  }
				

				
				//console.log(tot);
				tot = scope.totalCii;
				chart.setTitle({text: "Customer Interaction Index:"+tot+" ",y:4});
				
			},true);
			
	
		}
	}

}).directive('chart', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,

		link : function(scope, element, attrs) {
			var chartsDefaults = {
						
			};

			//Update when charts data changes
			scope.$watch(function() {
				return attrs.value;
			}, function(value) {
				if(!attrs.value)
					return;
				var deepCopy = true;
				var newSettings = {};
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			});
		}
	}

}).directive('chart2', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,

		link : function(scope, element, attrs) {
			var chartsDefaults = {
				 plotOptions: {
            							series: {
                							cursor: 'pointer',
               							 	point: {
                    								events: {
                   	    									click: function() {
                            									scope.showGraphPopup(this.category);
                            									
                        										}
                    								}
                							}
            							}
        			}

						
			};

			//Update when charts data changes
			scope.$watch(function() {
				return attrs.value;
			}, function(value) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
				
				
			});
		}
	}

}).directive('chart3', function() {
	return {
		restrict : 'E',
		template : '<div></div>',
		transclude : true,
		replace : true,

		link : function(scope, element, attrs) {
			var chartsDefaults = {
				chart : {

				}
			};

			//Update when charts data changes
			scope.$watch(function() {
				return attrs.value;
			}, function(value) {
				if(!attrs.value)
					return;
				// We need deep copy in order to NOT override original chart object.
				// This allows us to override chart data member and still the keep
				// our original renderTo will be the same
				var deepCopy = true;
				var newSettings = {};
				$.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
				var chart = new Highcharts.Chart(newSettings);
			});
		}
	}

}).directive('sliderRangeDirective', function() {
  
  function sliderColor(e, currentValue)
  {
                       
                if(currentValue == 1) {
                  $(e).find('.ui-slider-range').css('backgroundColor', '#dcff6b');
                } else if(currentValue == 2) {
                  $(e).find('.ui-slider-range').css('backgroundColor', '#c5e65c');
                } else if(currentValue == 3) {
                  $(e).find('.ui-slider-range').css('backgroundColor', '#a1bd46');
                } else if(currentValue == 4) {
                  $(e).find('.ui-slider-range').css('backgroundColor', '#9ab53f');
                } else if(currentValue == 5) {
                  $(e).find('.ui-slider-range').css('backgroundColor', '#67820e');
		}
                                
  };
  
  return  {
    		link : function($scope, elem, attrs)
                {                
                        
                        var CurrValue  = 3;
                        if( $(elem).attr("index") != 100 )
                        {
                          CurrValue = $scope.category.rating;
                        }
                         $scope.sliders.push(elem);
                       $(elem).slider({
                        value : CurrValue,
                        min : 0,
                        max : 5,
                        step : 1,
                        range:"min",
                        create: function( event, ui ) {                          
                                sliderColor(elem, CurrValue);
                        },
                        slide : function(event, ui) {
                                sliderColor(elem, ui.value);
                                if( $(elem).attr("index") == 100 )
                                {
                                  for(var i=0;i<$scope.sliders.length;i++)
                                  {
                                        $($scope.sliders[i]).slider({
                                            value :ui.value    
                                        });
                                        sliderColor($scope.sliders[i], ui.value);
                                        console.log( $scope.sliders.length );
                                         $scope.selectedRideObj.categories[i].rating = ui.value;
                                         $scope.calculateCii();
                                        
                                   }
                                  
                                }
                                else
                                {
                                  var ind =  $(this).attr('index');
                                  $scope.selectedRideObj.categories[ind].rating = ui.value;
                                  $scope.calculateCii();                                  
                                }
                                
                                
                        }
                       });                 
                }
    
  }
}).directive('sliderRangeCalendar', function() {

	return {
		link : function($scope, elem, attrs) {

			function zeroDate() {// returns a Date with time 00:00:00 and dateOfMonth=1
				var i = 0, d;
				do {
					d = new Date(1970, i++, 1);
				} while (d.getHours());// != 0
				return d;
			};

			function addMinutes(d, n) {
				try {
					d.setMinutes(d.getMinutes() + n);
				} catch(err) {
					//Handle errors here
				}
				return d;
			};

			function clearTime(d) {
				try {
					d.setHours(0);
					d.setMinutes(0);
					d.setSeconds(0);
					d.setMilliseconds(0);
				} catch(err) {
					//Handle errors here
				}
				return d;
			};
			
			

			function sliderChange(event, ui) {
				
				//console.log(ui);
				// big chunk of code here
				var currentValue = ui.value;
				var d = zeroDate();
				var minutesToAdd=480 + (currentValue * 60 / 2);
				
				d = addMinutes(d,minutesToAdd );
				var sdf = new JsSimpleDateFormat("hh:mm aa");
				var formattedString = sdf.format(d);
				//alert(formattedString);

				var thisHandle = jQuery(ui.handle);
				
				console.log(thisHandle);
				
				var currSelect = jQuery('#' + thisHandle.attr('id').split('handle_')[1]);
				
				console.log(currSelect);
				
				
				var nameKnob = currSelect.attr('name');
				if(nameKnob == 'valueA') {
					//alert('a');
					//$('#start-time').html(formattedString);
					
					
					$scope.startTimeStr=formattedString;
					$scope.$$phase || $scope.$apply();

					$scope.startTime = clearTime($scope.startTime);
					addMinutes($scope.startTime,minutesToAdd);
				} else {
					//alert('b');
					//$('#end-time').html(formattedString);
					
					$scope.endTimeStr=formattedString;
					$scope.$$phase || $scope.$apply();
					
					$scope.endTime = clearTime($scope.endTime);
					addMinutes($scope.endTime,minutesToAdd);
				}

			};

		
			var comp = $(elem).find('select').selectToUISlider({
						labels : 11,
						tooltip : false,
						sliderOptions : {
							slide : sliderChange,
							change : sliderChange,
							start : sliderChange,
							stop : sliderChange
						}
					});
		


			$scope.updateSliderValues = function() {

				//	$('.ui-slider').remove();

				var searchStr = "option[timeVal='" + $scope.startTimeStr + "']";
				//$('option:selected', $(elem).find('select')[0]).removeAttr('selected');
				//$($($(elem).find('select')[0]).find(searchStr)[0]).attr('selected',true).change();

				var val1 = $($($(elem).find('select')[0]).find(searchStr)[0]).attr('value');
				searchStr = "option[timeVal='" + $scope.endTimeStr + "']";
				var val2 = $($($(elem).find('select')[1]).find(searchStr)[0]).attr('value');

				console.log($(elem).find('select')[0]);
				console.log($(elem).find('select')[1]);

				$(elem).find('select:eq(0)').val(val1).change();
				$(elem).find('select:eq(1)').val(val2).change();

			};



			$scope.$watch(attrs.sliderRangeCalendar, function(value) {
				console.log($scope.startTimeStr);
				
				//console.log($($(elem).find('select')[0]).find('option')[0]);
				
				//$('option:selected', 'select').removeAttr('selected').next('option').attr('selected', 'selected');
				
				
				//$($(elem).find('select')[0]).find('option')[0].selected="selected";
				
				
				//$($(elem).find('select')[0]).val( theValue ).attr('selected',true);
				
				//console.log($($(elem).find('select')[0]).val( theValue ));
				
				
					
				
			});


			$('.sliderTab .slider-range .ui-slider .ui-slider-handle:first-child').css({
				opacity : 0
			});
		}
	}
}).directive('ngIscroll', function() {
	return {
		replace : false,
		restrict : 'A',
		link : function($scope, element, attr) {

			var myScroll;
			// default timeout
			var ngiScroll_timeout = 5;

			// default options
			var ngiScroll_opts = {
				nap : true,
				momentum : true,
                                hScrollbar : false,
                                topOffset: $scope.topOffset                              

			};

			// if ng-iscroll-form='true' then the additional settings will be supported
			if(attr.ngIscrollForm !== undefined && attr.ngIscrollForm == 'true') {
				ngiScroll_opts.useTransform = false;
				ngiScroll_opts.onBeforeScrollStart = function(e) {
					var target = e.target;
					while(target.nodeType != 1)
					target = target.parentNode;

					if(target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
						e.preventDefault();
				};
			}

			// iScroll initialize function
			function setScroll() {
				myScroll = new iScroll(element[0], ngiScroll_opts);
   			}

			// support for old method of setting timeout
			if(attr.ngIscroll !== "") {
				ngiScroll_timeout = attr.ngIscroll;
			}

			// new specific setting for setting timeout using: ng-iscroll-timeout='{val}'
			if(attr.ngIscrollDelay !== undefined) {
				ngiScroll_timeout = attr.ngIscrollDelay;
			}

			function refreshIScroll() {
				//console.log('in refreshIScroll');
                               myScroll.options.topOffset = $scope.topOffset;
			       myScroll.refresh();
			       setTimeout(refreshIScroll, 2000);
			}
			// watch for 'ng-iscroll' directive in html code
			$scope.$watch(attr.ngIscroll, function(value) {
				setTimeout(setScroll, 50);
				setTimeout(refreshIScroll, 2000);
			});
		}
	};
}).directive('plannedRideAlongPopup', function() {

	return {
		link : function($scope, elem, attrs) {
			//lightbox
			var lbOverlay = $(elem).find('.lb-overlay')[0];
			var lb = $(elem).find('.lb')[0];

			var wWidth = $(window).innerWidth();
			var wHeight = $(window).innerHeight();

			$(elem).css({
				width : wWidth,
				height : wHeight
			});
			$(lbOverlay).css({
				width : wWidth,
				height : wHeight
			});

			$(lb).css({
				left : (wWidth / 2) - ($(lb).width() / 2),
				top : (wHeight / 2) - ($(lb).height() / 2)
			});

			$scope.showPopup = function() {				
				
				$scope.$$phase || $scope.$apply();
				$(lbOverlay).show();
				$(lb).show();

				$(lb).unbind("click").click(function() {
					$scope.hidePopup();
				});
				$(lbOverlay).unbind("click").click(function() {
					$scope.hidePopup();
				});
			};

			$scope.hidePopup = function() {
				$(lbOverlay).hide();
				$(lb).hide();
			};
			//$scope.showPopup();
		}
	}
}).directive('submitPopup', function() {

	return {
		link : function($scope, elem, attrs) {
			//lightbox
			var lbOverlay = $(elem).find('.lb-overlay')[0];
			var lb = $(elem).find('.lb')[0];

			var wWidth = $(window).innerWidth();
			var wHeight = $(window).innerHeight();

			$(elem).css({
				width : wWidth,
				height : wHeight
			});
			$(lbOverlay).css({
				width : wWidth,
				height : wHeight
			});

			$(lb).css({
				left : (wWidth / 2) - ($(lb).width() / 2),
				top : (wHeight / 2) - ($(lb).height() / 2)
			});
			$scope.showPopup = function() {				

				$scope.$$phase || $scope.$apply();
				$(lbOverlay).show();
				$(lb).show();

				$(lb).unbind("click").click(function() {
					$scope.hidePopup();
				});
				$(lbOverlay).unbind("click").click(function() {
					$scope.hidePopup();
				});
			};

			$scope.hidePopup = function() {
				$(lbOverlay).hide();
				$(lb).hide();
			};
			//$scope.showPopup();
		}
	}
}).directive('objveKeyfindPopup', function() {

	return {
		link : function($scope, elem, attrs) {
			//lightbox
			var lbOverlay = $(elem).find('.lb-overlay-key')[0];
			var lb = $(elem).find('.lb-key')[0];

			var wWidth = $(window).innerWidth();
			var wHeight = $(window).innerHeight();
			var wLeft = '300px';
			var wTop = '150px';
		
			$(elem).css({
				width : wWidth,
				height : wHeight
			});
			$(lbOverlay).css({
				width : wWidth,
				height : wHeight
			});

			$(lb).css({
				left : wLeft,
				top : wTop
			});
			$scope.showObjvKeyPopup = function() {				

				$scope.$$phase || $scope.$apply();
				
				
				$(lbOverlay).show();
				$(lb).show();
				document.getElementById("ObjtKeyFindTextArea").value = $scope.selectedRideObj.keyFinding;
				
				$(lbOverlay).unbind("click").click(function() {
					$scope.hideObjvKeyPopup();
				});

				
			};

			$scope.hideObjvKeyPopup = function() {
				$(lbOverlay).hide();
				$(lb).hide();
			};
			//$scope.showPopup();
		}
	}
}).directive('overallPopup', function() {

	return {
		link : function($scope, elem, attrs) {
			//lightbox
			var lbOverlay = $(elem).find('.lb-overlay-overall')[0];
			var lb = $(elem).find('.lb-overall')[0];

			var wWidth = $(window).innerWidth();
			var wHeight = $(window).innerHeight();
			var wLeft = '300px';
			var wTop = '100px';
		
			$(elem).css({
				width : wWidth,
				height : wHeight
			});
			$(lbOverlay).css({
				width : wWidth,
				height : wHeight
			});

			$(lb).css({
				left : wLeft,
				top : wTop
			});
			$scope.showOverallPopup = function() {				

				$scope.$$phase || $scope.$apply();
				
				
				$(lbOverlay).show();
				$(lb).show();
				
				document.getElementById("SugstActTextArea").value = $scope.tempRide.sugstActions;
				document.getElementById("overallTextArea").value = $scope.tempRide.overallKeyFind;
				
				$(lbOverlay).unbind("click").click(function() {
					$scope.hideOverallPopup();
				});

				
			};
			$scope.hideOverallPopup = function() {
				$(lbOverlay).hide();
				$(lb).hide();
			};
			//$scope.showPopup();
		}
	}
}).directive('evaluationPreview', function() {

	return {
		link : function($scope, elem, attrs) {
			//lightbox
			var lbOverlay = $(elem).find('.lb-overlay-ep')[0];
			var lb = $(elem).find('.lb-ep')[0];

			var wWidth = $(window).innerWidth();
			var wHeight = $(window).innerHeight();
			var wLeft = '200px';
			var wTop = '120px';
		
			$(elem).css({
				width : wWidth,
				height : wHeight
			});
			$(lbOverlay).css({
				width : wWidth,
				height : wHeight
			});

			$(lb).css({
				left : wLeft,
				top : wTop
			});
			$scope.showPreviewPopOver = function() {				

				$scope.$$phase || $scope.$apply();
				
				
				$(lbOverlay).show();
				$(lb).show();
 		
				
				$(lbOverlay).unbind("click").click(function() {
					$scope.hidePreviewPopOver();
				});

				
			};

			$scope.hidePreviewPopOver = function() {
				$(lbOverlay).hide();
				$(lb).hide();
			};
			//$scope.showPopup();
		}
	}
}).directive('caledarModule', function() {

	return {
		link : function($scope, elem, attrs) {
			
			var sdf = new JsSimpleDateFormat("dd MMM hh:mm aa, yyyy");

			var sdfMin = new JsSimpleDateFormat("hh:mm aa");

			var calendar = $('#calendar').fullCalendar({
				header : {
					left : 'prev,next',
					center : 'title',
					right : 'agendaDay,agendaWeek,month'
				},
				contentHeight : 525,
				selectable : true,
				selectHelper : true,
				select : function(start, end, allDay) {
					
					
					//alert(start);
					//alert(end);
					
					if(start.getHours() == end.getHours() && start.getMinutes() == end.getMinutes()){
						start.setMinutes(8*60);
						end.setMinutes(9*60);
					}

					$scope.startTime = start;
					$scope.endTime = end;
					
					
					$scope.startTimeStr = sdfMin.format($scope.startTime);
					$scope.endTimeStr   = sdfMin.format($scope.endTime);

					$scope.$$phase || $scope.$apply();
					
/*					startTime = clearTime(startTime);
					addMinutes(startTime, 570);
					endTime = clearTime(endTime);
					addMinutes(endTime, 660);
					isAllDay = allDay;
					
*/
					
					
					$scope.updateSliderValues();

					
					
					
					$(".plan-ride-container").animate({
						left : '0%'
					});

				},
				editable : true,
				events : [],
				dayClick : function(date, allDay, jsEvent, view) {

					$('#calendar').fullCalendar('changeView', 'agendaDay').fullCalendar('gotoDate', date.getFullYear(), date.getMonth(), date.getDate());
				},
			});


				var buttonCancelRide = $(".btn-ride-cancel");
				buttonCancelRide.click(function() {
					$(".plan-ride-container").animate({
						left : '100%'
					});
				});
				var buttonDoneRide = $(".btn-ride-done");
				buttonDoneRide.click(function() {
					$(".plan-ride-container").animate({
						left : '100%'
					});
					
					//console.log(sdf.format($scope.startTime));
					//console.log(sdf.format($scope.endTime));
					
					
					var totalMins = $scope.endTime.getMinutes() - $scope.startTime.getMinutes();
					
					var totalH = (totalMins/60)+($scope.endTime.getHours() - $scope.startTime.getHours());
					$scope.handleDoneButtonClick(sdf.format($scope.startTime),sdf.format($scope.endTime),totalH.toFixed(2));
					
					calendar.fullCalendar('renderEvent', {
						title : 'Ride along with '+$scope.selectedRep.name,
						start : $scope.startTime,
						end : $scope.endTime,
						allDay : false
					}, true // make the event "stick"
					);
					calendar.fullCalendar('unselect');
				});
				
				$('.fc-button-agendaDay').click();
				$('#handle_valueB').click();
				$('#handle_valueA').click();
				





		}
	}
}).directive('ciiGraphPopup', function() {

	return {
		link : function($scope, elem, attrs) {
			//lightbox
			var lbOverlay = $(elem).find('.lb-overlay-ciiGraph')[0];
			var lb = $(elem).find('.lb-ciiGraph')[0];

			var wWidth = $(window).innerWidth();
			var wHeight = $(window).innerHeight();
			var wLeft = '150px';
			var wTop = '50px';
		
			$(elem).css({
				width : wWidth,
				height : wHeight
			});
			$(lbOverlay).css({
				width : wWidth,
				height : wHeight
			});

			$(lb).css({
				left : wLeft,
				top : wTop
			});
			$scope.showGraphPopup = function(categoryParam) {				

				$scope.$$phase || $scope.$apply();
				$scope.category = categoryParam;
				$scope.showChartInPopover(categoryParam);
    
    
				$(lbOverlay).show();
				$(lb).show();
				
				$(lbOverlay).unbind("click").click(function() {
					$scope.hideGraphPopup();
				});

				
			};

			$scope.hideGraphPopup = function() {
				$(lbOverlay).hide();
				$(lb).hide();
			};
			//$scope.showPopup();
		}
	}
});
