var app     =   angular.module('appRoute',['ngRoute']);
app.config(function($routeProvider,$locationProvider){
    $routeProvider
    .when('/',{
        templateUrl : 'views/pages/home.html',
        authenticated:false
        
    })
    .when('/register',{
        templateUrl : 'views/pages/users/register.html',
        controller  : 'registerCtrl',
        controllerAs: 'register',
        authenticated: false
    })
    .when('/login',{
        templateUrl : 'views/pages/users/login.html',
        authenticated: false,
    })

    .when('/logout',{
        templateUrl :   'views/pages/users/logout.html',
    })
    .when('/dashboard',{
        templateUrl :   'views/pages/dashboard.html',
        authenticated : true
    })
    .when('/photoUpload',{
        templateUrl :   'views/pages/users/photoUpload.html',
        
        authenticated : true
    })

    .otherwise({redirectTo:'/'});

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
})

app.run(['$rootScope','authenticationFactory','$location',function($rootScope,authenticationFactory,$location){
	$rootScope.$on('$routeChangeStart',function(event,next,current){
			if(next.$$route.authenticated==true){
				if(!authenticationFactory.isLoggedIn()){
					event.preventDefault();
					$location.path('/login')
				}
			}
			else if(next.$$route.authenticated == false){
				if(authenticationFactory.isLoggedIn()){
					event.preventDefault();
					$location.path('/dashboard');
				}
			}
	});
}]);