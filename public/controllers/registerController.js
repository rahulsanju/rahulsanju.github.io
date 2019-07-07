angular.module('registerController',['registrationServices','authenticationServices'])
.controller('registerCtrl',function($http,registerFactory,$location,$timeout, $window,authenticationFactory){
    var app=this;
    app.errormessage=false;
    app.successmessage=false;
    app.loading=false;
    this.regUser=function(regData){
        app.loading=true;
        registerFactory.create(regData).then(function(data){
            if(data.data.success==true){
                app.errormessage=false;
                app.successmessage=data.data.message;
                $timeout(function(){
                    //$location.path('/login')
                    var loginData = {
                        'email' : regData.email,
                        'password': regData.password
                    };
                    authenticationFactory.login(loginData).then(function(data){
                        if(data.data.success){
                            
                            $location.path('/dashboard');
                        }
                    })
                    
                },2000);
            }
            else{
                app.errormessage=data.data.message;
                app.successmessage=false;
            }
            app.loading=false;
        });

        

        
    }
});