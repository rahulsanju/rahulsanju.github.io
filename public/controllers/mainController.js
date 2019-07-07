angular.module('mainController',['authenticationServices','fileModelDirective','registrationServices'])


.controller('mainCtrl',function(authenticationFactory,$scope,$window,$location,$timeout,$rootScope,imageUpload){
	app = this;


	$rootScope.$on('$routeChangeStart',function(){
		if(authenticationFactory.isLoggedIn()){
			app.loginButton = false;
			app.logoutButton = true;
			authenticationFactory.getUser().then(function(data){
				app.user = data.data.data;
				console.log("User logged in is : "+app.user.name);
			})
	
			
		}
		else{
			app.loginButton = true;
			app.logoutButton = false;
			
		}
	});

	

	$scope.file={};
    app.errormessage=false;
	app.successmessage=false;
	app.loading=false;

	

	showModal = function(option){
		if(option == 'logout'){
			$("#myModal").modal({backdrop:'static'});
			app.modalHeader='Live-Streaming-App';
			app.modalBody='Logging out... Happy to have you on our site :) :)';
		}
		
	}
	hideModal=function(option){
		if(option == 'logout'){
			$("#myModal").modal('hide');
		}
	}

	this.profilePhotoUpload = function(){
		imageUpload.upload($scope.file, app.user.email).then(function(data) {
			$scope.file={};
			if(data.data.success){
				app.alert = "alert alert-success"
				app.message = data.data.message;
				$timeout(function(){
					$location.path('/dashboard');
				},2000);
				
				
			}else{
				app.alert = "alert alert-danger"
				app.message = data.data.message;
			}
		
		});
	}

	this.login = function(loginData){

		authenticationFactory.login(loginData).then(function(data){
			if(data.data.success){
				app.loading=false;
				app.successmessage=data.data.message;
				$timeout(function(){
					$location.path('/dashboard');
				},2000);			
								
			}
			else{
				app.loading=false;
				app.errormessage=data.data.message;
			}
		});
	}
	
	this.logout = function(){
		showModal('logout');
		authenticationFactory.logout();
		$timeout(function(){
			hideModal('logout');
		},2000);
		$window.location.reload();
	}


	
    
});