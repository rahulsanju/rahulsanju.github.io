angular.module('authenticationServices',[])
.factory('authenticationFactory',function($http,authenticationTokenFactory){
    var authFactory = {};

    authFactory.login = function(loginData){
        return $http.post('/userApis/authenticate',loginData).then(function(data){
            authenticationTokenFactory.setToken(data.data.token);
            return data;
        })
    }

    authFactory.isLoggedIn = function(){
        if(authenticationTokenFactory.getToken()){
            return true;
        }
        else{
            return false;
        }
    }

    authFactory.logout = function(){
        return authenticationTokenFactory.setToken();
    }


    authFactory.getUser=function(){
        var token={
            'token' : authenticationTokenFactory.getToken()
        }
		if(token){
			return $http.post('/userApis/me',token);
		}
		else{
			$q.reject({message:'User has no token'});
		}
	}

    

    return authFactory;
})

.factory('authenticationTokenFactory',function($window){
    var authTokenFactory ={};
    
    authTokenFactory.setToken = function(token){
        if(token){
            return $window.localStorage.setItem('token',token);

        }
        else{
            return $window.localStorage.removeItem('token');
        }
    }

    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    }

    return authTokenFactory;
})

