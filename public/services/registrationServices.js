angular.module('registrationServices',['authenticationServices'])

.factory('registerFactory',function($http){
    regFactory = {};
    regFactory.create = function(regData){
        return $http.post('/userApis/register',regData);
    }




    return regFactory;
})

.factory('imageUpload', function($http,authenticationTokenFactory ){
    uploadImageFactory = {};

    uploadImageFactory.upload = function(file, email){

        var n = file.upload.name;
        var f = n.split('.');
        var name = email+'---photo.'+f[1];


        var fd = new FormData();
        fd.append('imguploader',file.upload,name);


        var token = authenticationTokenFactory.getToken();

        fd.append( 'token' , token);


        return $http.post('/userapis/upload',fd,{
            transformRequest : angular.identity,
            headers : { 'content-type' : undefined }
        });
    };

    return uploadImageFactory;
});
